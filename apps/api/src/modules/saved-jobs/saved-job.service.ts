import { AppError } from "../../shared/errors/AppError";
import { SavedJobMapper } from "./saved-job.mapper";
import { SavedJobRepository } from "./saved-job.repository";

export class SavedJobService {
  private repository = new SavedJobRepository();

  async saveJob(userId: string, jobId: string, notes?: string) {
    const existing = await this.repository.findOne(userId, jobId);

    if (existing) {
      throw new AppError(409, "Job already saved");
    }

    const saved = await this.repository.create({ user: userId, job: jobId, notes });

    return SavedJobMapper.toDto(saved);
  }

  async listJobs(userId: string, page = 1, limit = 20) {
    const result = await this.repository.findByUser(userId, page, limit);

    return {
      items: result.items.map(SavedJobMapper.toDto),
      total: result.total,
      page,
      limit,
      totalPages: Math.ceil(result.total / limit),
    };
  }

  async removeJob(userId: string, jobId: string) {
    const deleted = await this.repository.remove(userId, jobId);

    if (deleted.deletedCount === 0) {
      throw new AppError(404, "Saved job not found");
    }

    return { success: true };
  }
}
