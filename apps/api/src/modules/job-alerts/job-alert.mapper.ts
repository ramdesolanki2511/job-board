import { JobAlert } from "./job-alert.model";
import { JobAlertDto } from "./job-alert.dto";

export class JobAlertMapper {
  static toDto(alert: JobAlert): JobAlertDto {
    return {
      id: alert._id?.toString() || "",
      userId: alert.userId?.toString() || "",
      name: alert.name,
      search: alert.search,
      skills: alert.skills || [],
      remoteType: alert.remoteType || [],
      employmentType: alert.employmentType || [],
      experienceLevel: alert.experienceLevel || [],
      salaryMin: alert.salaryMin,
      salaryMax: alert.salaryMax,
      salaryCurrency: alert.salaryCurrency,
      locations: alert.locations || [],
      frequency: alert.frequency,
      status: alert.status,
      emailNotifications: alert.emailNotifications,
      lastSentAt: alert.lastSentAt,
      lastSentCount: alert.lastSentCount,
      createdAt: alert.createdAt,
      updatedAt: alert.updatedAt,
    };
  }

  static toListDto(alerts: JobAlert[]): JobAlertDto[] {
    return alerts.map((alert) => this.toDto(alert));
  }
}
