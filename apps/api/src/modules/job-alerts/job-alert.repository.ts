import { JobAlertModel, JobAlert } from "./job-alert.model";
import { AlertStatus, AlertFrequency } from "../../shared/constants/job-alert.constants";

export class JobAlertRepository {
  async create(data: Partial<JobAlert>): Promise<JobAlert> {
    const alert = new JobAlertModel(data);
    return alert.save();
  }

  async findById(id: string): Promise<JobAlert | null> {
    return JobAlertModel.findById(id);
  }

  async findByUser(userId: string): Promise<JobAlert[]> {
    return JobAlertModel.find({ userId }).sort({ createdAt: -1 });
  }

  async findByUserPaginated(
    userId: string,
    page: number = 1,
    limit: number = 20
  ): Promise<{ alerts: JobAlert[]; total: number }> {
    const total = await JobAlertModel.countDocuments({ userId });
    const alerts = await JobAlertModel.find({ userId })
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit);

    return { alerts, total };
  }

  async update(id: string, data: Partial<JobAlert>): Promise<JobAlert | null> {
    return JobAlertModel.findByIdAndUpdate(id, data, {
      new: true,
      runValidators: true,
    });
  }

  async delete(id: string): Promise<boolean> {
    const result = await JobAlertModel.deleteOne({ _id: id });
    return result.deletedCount > 0;
  }

  async updateStatus(
    id: string,
    status: AlertStatus
  ): Promise<JobAlert | null> {
    return this.update(id, { status });
  }

  async getActiveAlerts(): Promise<JobAlert[]> {
    return JobAlertModel.find({ status: AlertStatus.ACTIVE });
  }

  async getAlertsByFrequency(frequency: AlertFrequency): Promise<JobAlert[]> {
    return JobAlertModel.find({
      status: AlertStatus.ACTIVE,
      frequency,
    });
  }

  async addNotifiedJob(alertId: string, jobId: string): Promise<JobAlert | null> {
    return JobAlertModel.findByIdAndUpdate(
      alertId,
      {
        $addToSet: { notifiedJobIds: jobId },
        $set: { lastSentAt: new Date() },
      },
      { new: true }
    );
  }

  async getAlertsNeedingUpdate(frequency: AlertFrequency): Promise<JobAlert[]> {
    const now = new Date();

    if (frequency === AlertFrequency.IMMEDIATE) {
      return JobAlertModel.find({
        status: AlertStatus.ACTIVE,
        frequency: AlertFrequency.IMMEDIATE,
        emailNotifications: true,
      });
    }

    if (frequency === AlertFrequency.DAILY) {
      const oneDayAgo = new Date(now.getTime() - 24 * 60 * 60 * 1000);
      return JobAlertModel.find({
        status: AlertStatus.ACTIVE,
        frequency: AlertFrequency.DAILY,
        emailNotifications: true,
        $or: [{ lastSentAt: null }, { lastSentAt: { $lte: oneDayAgo } }],
      });
    }

    if (frequency === AlertFrequency.WEEKLY) {
      const oneWeekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
      return JobAlertModel.find({
        status: AlertStatus.ACTIVE,
        frequency: AlertFrequency.WEEKLY,
        emailNotifications: true,
        $or: [{ lastSentAt: null }, { lastSentAt: { $lte: oneWeekAgo } }],
      });
    }

    return [];
  }

  async updateLastSentInfo(
    id: string,
    count: number
  ): Promise<JobAlert | null> {
    return JobAlertModel.findByIdAndUpdate(
      id,
      {
        lastSentAt: new Date(),
        lastSentCount: count,
      },
      { new: true }
    );
  }

  async countByUser(userId: string): Promise<number> {
    return JobAlertModel.countDocuments({ userId });
  }

  async deleteByUser(userId: string): Promise<number> {
    const result = await JobAlertModel.deleteMany({ userId });
    return result.deletedCount;
  }
}
