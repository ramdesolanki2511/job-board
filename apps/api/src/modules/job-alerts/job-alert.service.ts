import { AppError } from "../../shared/errors/AppError";
import { JobAlertRepository } from "./job-alert.repository";
import { JobAlertMapper } from "./job-alert.mapper";
import {
  JobAlertDto,
  CreateJobAlertDto,
  UpdateJobAlertDto,
} from "./job-alert.dto";
import {
  AlertStatus,
  AlertFrequency,
} from "../../shared/constants/job-alert.constants";

export class JobAlertService {
  private repository = new JobAlertRepository();

  async createAlert(
    userId: string,
    data: CreateJobAlertDto
  ): Promise<JobAlertDto> {
    // Validate salary range
    if (
      data.salaryMin &&
      data.salaryMax &&
      data.salaryMin > data.salaryMax
    ) {
      throw new AppError(
        400,
        "Minimum salary cannot be greater than maximum salary"
      );
    }

    // Check alert limit per user (optional: implement rate limiting)
    const alertCount = await this.repository.countByUser(userId);
    if (alertCount >= 20) {
      throw new AppError(
        400,
        "You have reached the maximum number of alerts (20)"
      );
    }

    const alert = await this.repository.create({
      userId: userId as any,
      ...data,
      status: AlertStatus.ACTIVE,
    });

    return JobAlertMapper.toDto(alert);
  }

  async getAlert(id: string): Promise<JobAlertDto> {
    const alert = await this.repository.findById(id);

    if (!alert) {
      throw new AppError(404, "Job alert not found");
    }

    return JobAlertMapper.toDto(alert);
  }

  async getUserAlerts(
    userId: string,
    page: number = 1,
    limit: number = 20
  ) {
    const { alerts, total } = await this.repository.findByUserPaginated(
      userId,
      page,
      limit
    );

    return {
      alerts: JobAlertMapper.toListDto(alerts),
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  async updateAlert(
    id: string,
    data: UpdateJobAlertDto
  ): Promise<JobAlertDto> {
    const alert = await this.repository.findById(id);

    if (!alert) {
      throw new AppError(404, "Job alert not found");
    }

    // Validate salary range if both are provided
    const salaryMin = data.salaryMin ?? alert.salaryMin;
    const salaryMax = data.salaryMax ?? alert.salaryMax;

    if (salaryMin > salaryMax) {
      throw new AppError(
        400,
        "Minimum salary cannot be greater than maximum salary"
      );
    }

    const updated = await this.repository.update(id, data);

    if (!updated) {
      throw new AppError(500, "Failed to update alert");
    }

    return JobAlertMapper.toDto(updated);
  }

  async deleteAlert(id: string): Promise<boolean> {
    const alert = await this.repository.findById(id);

    if (!alert) {
      throw new AppError(404, "Job alert not found");
    }

    return this.repository.delete(id);
  }

  async pauseAlert(id: string): Promise<JobAlertDto> {
    return this.updateAlertStatus(id, AlertStatus.PAUSED);
  }

  async resumeAlert(id: string): Promise<JobAlertDto> {
    return this.updateAlertStatus(id, AlertStatus.ACTIVE);
  }

  async disableAlert(id: string): Promise<JobAlertDto> {
    return this.updateAlertStatus(id, AlertStatus.DISABLED);
  }

  private async updateAlertStatus(
    id: string,
    status: AlertStatus
  ): Promise<JobAlertDto> {
    const alert = await this.repository.findById(id);

    if (!alert) {
      throw new AppError(404, "Job alert not found");
    }

    const updated = await this.repository.updateStatus(id, status);

    if (!updated) {
      throw new AppError(500, "Failed to update alert status");
    }

    return JobAlertMapper.toDto(updated);
  }

  async getAlertsByFrequency(frequency: AlertFrequency) {
    const alerts = await this.repository.getAlertsByFrequency(frequency);
    return JobAlertMapper.toListDto(alerts);
  }

  async getAlertsNeedingUpdate(frequency: AlertFrequency) {
    const alerts = await this.repository.getAlertsNeedingUpdate(frequency);
    return JobAlertMapper.toListDto(alerts);
  }

  async markJobAsNotified(alertId: string, jobId: string): Promise<void> {
    await this.repository.addNotifiedJob(alertId, jobId);
  }

  async updateLastSentInfo(alertId: string, jobCount: number): Promise<void> {
    await this.repository.updateLastSentInfo(alertId, jobCount);
  }
}
