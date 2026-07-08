import { SavedJobDto } from "./saved-job.dto";
import { SavedJob } from "./saved-job.model";

export class SavedJobMapper {
  static toDto(savedJob: SavedJob): SavedJobDto {
    return {
      id: savedJob._id.toString(),
      user: savedJob.user.toString(),
      job: savedJob.job.toString(),
      notes: savedJob.notes ?? "",
      createdAt: savedJob.createdAt,
      updatedAt: savedJob.updatedAt,
    };
  }
}
