import JobModel from "./job.model";
import { CreateJobDto } from "./job.validation";

export class JobRepository {
  async create(data: CreateJobDto & { slug: string }) {
    return JobModel.create(data);
  }

  async findAll() {
    return JobModel.find()
      .populate("company")
      .sort({ publishedAt: -1 });
  }

  async findById(id: string) {
    return JobModel.findById(id).populate("company");
  }

  async findBySlug(slug: string) {
    return JobModel.findOne({ slug }).populate("company");
  }

  async update(
    id: string,
    data: Partial<CreateJobDto>
  ) {
    return JobModel.findByIdAndUpdate(id, data, {
      new: true,
    });
  }

  async delete(id: string) {
    return JobModel.findByIdAndDelete(id);
  }
}