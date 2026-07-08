import companyDashboardRepository from "./company-dashboard.repository";
import { ICompanyDashboard } from "./company-dashboard.model";
import { AppError } from "../../shared/errors/app.error";

export class CompanyDashboardService {
  /**
   * Get dashboard by company ID
   */
  async getDashboardByCompanyId(companyId: string): Promise<ICompanyDashboard> {
    const dashboard =
      await companyDashboardRepository.findByCompanyId(companyId);

    if (!dashboard) {
      throw new AppError("Dashboard not found", 404);
    }

    return dashboard;
  }

  /**
   * Get dashboard by user ID
   */
  async getDashboardByUserId(userId: string): Promise<ICompanyDashboard> {
    const dashboard = await companyDashboardRepository.findByUserId(userId);

    if (!dashboard) {
      throw new AppError("Dashboard not found", 404);
    }

    return dashboard;
  }

  /**
   * Initialize dashboard for new company
   */
  async initializeDashboard(
    companyId: string,
    userId: string
  ): Promise<ICompanyDashboard> {
    const existingDashboard =
      await companyDashboardRepository.findByCompanyId(companyId);

    if (existingDashboard) {
      throw new AppError("Dashboard already exists for this company", 409);
    }

    const dashboard = await companyDashboardRepository.create({
      companyId,
      userId,
      totalJobsPosted: 0,
      totalApplications: 0,
      totalActiveJobs: 0,
      totalClosedJobs: 0,
      recentActivities: [],
    });

    return dashboard;
  }

  /**
   * Record job posted
   */
  async recordJobPosted(companyId: string, jobTitle: string): Promise<void> {
    await companyDashboardRepository.updateJobsPosted(companyId, 1);
    await companyDashboardRepository.updateActiveJobs(companyId, 1);
    await companyDashboardRepository.addActivity(companyId, {
      type: "job_posted",
      description: `New job posted: ${jobTitle}`,
    });
  }

  /**
   * Record application received
   */
  async recordApplicationReceived(
    companyId: string,
    applicantName: string,
    jobTitle: string
  ): Promise<void> {
    await companyDashboardRepository.updateApplications(companyId, 1);
    await companyDashboardRepository.addActivity(companyId, {
      type: "application_received",
      description: `Application from ${applicantName} for ${jobTitle}`,
    });
  }

  /**
   * Record candidate saved
   */
  async recordCandidateSaved(
    companyId: string,
    candidateName: string
  ): Promise<void> {
    await companyDashboardRepository.update(companyId, {
      $inc: { totalSavedApplications: 1 },
    } as any);
    await companyDashboardRepository.addActivity(companyId, {
      type: "candidate_saved",
      description: `Candidate ${candidateName} saved`,
    });
  }

  /**
   * Record job closed
   */
  async recordJobClosed(
    companyId: string,
    jobTitle: string
  ): Promise<void> {
    await companyDashboardRepository.updateActiveJobs(companyId, -1);
    await companyDashboardRepository.update(companyId, {
      $inc: { totalClosedJobs: 1 },
    } as any);
    await companyDashboardRepository.addActivity(companyId, {
      type: "job_closed",
      description: `Job closed: ${jobTitle}`,
    });
  }

  /**
   * Get analytics summary
   */
  async getAnalyticsSummary(
    companyId: string
  ): Promise<{
    totalJobs: number;
    activeJobs: number;
    closedJobs: number;
    totalApplications: number;
    savedCandidates: number;
    rejectedApplications: number;
    conversionRate: number;
    recentActivity: any[];
  }> {
    const dashboard = await this.getDashboardByCompanyId(companyId);

    const conversionRate =
      dashboard.totalApplications > 0
        ? (dashboard.totalSavedApplications / dashboard.totalApplications) * 100
        : 0;

    return {
      totalJobs: dashboard.totalJobsPosted,
      activeJobs: dashboard.totalActiveJobs,
      closedJobs: dashboard.totalClosedJobs,
      totalApplications: dashboard.totalApplications,
      savedCandidates: dashboard.totalSavedApplications,
      rejectedApplications: dashboard.totalRejectedApplications,
      conversionRate: Math.round(conversionRate * 100) / 100,
      recentActivity: dashboard.recentActivities.slice(0, 10),
    };
  }
}

export default new CompanyDashboardService();
