import { CompanyDashboard, ICompanyDashboard } from "./company-dashboard.model";

export class CompanyDashboardRepository {
  /**
   * Find dashboard by company ID
   */
  async findByCompanyId(companyId: string): Promise<ICompanyDashboard | null> {
    return CompanyDashboard.findOne({ companyId }).lean();
  }

  /**
   * Find dashboard by user ID
   */
  async findByUserId(userId: string): Promise<ICompanyDashboard | null> {
    return CompanyDashboard.findOne({ userId }).lean();
  }

  /**
   * Create new dashboard
   */
  async create(data: Partial<ICompanyDashboard>): Promise<ICompanyDashboard> {
    const dashboard = new CompanyDashboard(data);
    return dashboard.save();
  }

  /**
   * Update dashboard
   */
  async update(
    companyId: string,
    data: Partial<ICompanyDashboard>
  ): Promise<ICompanyDashboard | null> {
    return CompanyDashboard.findOneAndUpdate({ companyId }, data, {
      new: true,
    }).lean();
  }

  /**
   * Update total jobs posted
   */
  async updateJobsPosted(companyId: string, increment: number): Promise<void> {
    await CompanyDashboard.updateOne(
      { companyId },
      { $inc: { totalJobsPosted: increment } }
    );
  }

  /**
   * Update total applications
   */
  async updateApplications(companyId: string, increment: number): Promise<void> {
    await CompanyDashboard.updateOne(
      { companyId },
      { $inc: { totalApplications: increment } }
    );
  }

  /**
   * Update total active jobs
   */
  async updateActiveJobs(companyId: string, increment: number): Promise<void> {
    await CompanyDashboard.updateOne(
      { companyId },
      { $inc: { totalActiveJobs: increment } }
    );
  }

  /**
   * Add recent activity
   */
  async addActivity(
    companyId: string,
    activity: {
      type: string;
      description: string;
    }
  ): Promise<void> {
    await CompanyDashboard.updateOne(
      { companyId },
      {
        $push: {
          recentActivities: {
            ...activity,
            createdAt: new Date(),
          },
        },
      }
    );
  }

  /**
   * Get analytics for date range
   */
  async getAnalyticsByDateRange(
    companyId: string,
    startDate: Date,
    endDate: Date
  ): Promise<ICompanyDashboard | null> {
    return CompanyDashboard.findOne({
      companyId,
      createdAt: {
        $gte: startDate,
        $lte: endDate,
      },
    }).lean();
  }
}

export default new CompanyDashboardRepository();
