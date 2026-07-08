import SavedJobModel from "./saved-job.model";

export class SavedJobRepository {
  async create(data: { user: string; job: string; notes?: string }) {
    return SavedJobModel.create(data);
  }

  async findByUser(userId: string, page = 1, limit = 20) {
    const skip = (page - 1) * limit;

    const [items, total] = await Promise.all([
      SavedJobModel.find({ user: userId })
        .populate({ path: "job", populate: { path: "company" } })
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit),

      SavedJobModel.countDocuments({ user: userId }),
    ]);

    return { items, total };
  }

  async findOne(userId: string, jobId: string) {
    return SavedJobModel.findOne({ user: userId, job: jobId });
  }

  async remove(userId: string, jobId: string) {
    return SavedJobModel.deleteOne({ user: userId, job: jobId });
  }
}
