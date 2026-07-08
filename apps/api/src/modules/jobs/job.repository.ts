import JobModel from "./job.model";
import { CreateJobDto } from "./job.validation";

export class JobRepository {
  async create(data: CreateJobDto & { slug: string }) {
    return JobModel.create(data);
  }

  async findAll(filters: JobListDto) {
    const query: any = {
      isActive: true,
    };

    if (filters.search) {
      query.title = {
        $regex: filters.search,
        $options: "i",
      };
    }

    if (filters.company) {
      query.company = filters.company;
    }

    if (filters.remoteType) {
      query.remoteType = filters.remoteType;
    }

    if (filters.employmentType) {
      query.employmentType = filters.employmentType;
    }

    if (filters.experienceLevel) {
      query.experienceLevel = filters.experienceLevel;
    }

    if (filters.featured !== undefined) {
      query.isFeatured = filters.featured;
    }

    const sort =
      filters.sort === "oldest" ? { publishedAt: 1 } : { publishedAt: -1 };

    const skip = (filters.page - 1) * filters.limit;

    const [jobs, total] = await Promise.all([
      JobModel.find(query)
        .populate("company")
        .sort(sort)
        .skip(skip)
        .limit(filters.limit),

      JobModel.countDocuments(query),
    ]);

    return {
      jobs,
      total,
    };
  }

  async findById(id: string) {
    return JobModel.findById(id).populate("company");
  }

  async findBySlug(slug: string) {
    return JobModel.findOne({
      slug,
      isActive: true,
    }).populate("company");
  }

  async update(id: string, data: Partial<CreateJobDto>) {
    return JobModel.findByIdAndUpdate(id, data, {
      new: true,
    });
  }

  async delete(id: string) {
    return JobModel.findByIdAndDelete(id);
  }

  async search(filters: {
    search?: string;
    location?: string;
    remoteType?: string;
    employmentType?: string;
    experienceLevel?: string;
    page: number;
    limit: number;
  }) {
    const query: any = {
      isActive: true,
    };

    if (filters.search) {
      query.$or = [
        {
          title: {
            $regex: filters.search,
            $options: "i",
          },
        },
        {
          skills: {
            $in: [new RegExp(filters.search, "i")],
          },
        },
      ];
    }

    if (filters.location) {
      query.location = filters.location;
    }

    if (filters.remoteType) {
      query.remoteType = filters.remoteType;
    }

    if (filters.employmentType) {
      query.employmentType = filters.employmentType;
    }

    if (filters.experienceLevel) {
      query.experienceLevel = filters.experienceLevel;
    }

    const skip = (filters.page - 1) * filters.limit;

    const [jobs, total] = await Promise.all([
      JobModel.find(query)
        .populate("company")
        .sort({
          publishedAt: -1,
        })
        .skip(skip)
        .limit(filters.limit),

      JobModel.countDocuments(query),
    ]);

    return {
      jobs,
      total,
    };
  }

  async featured(limit = 10) {
    return JobModel.find({
      isFeatured: true,
      isActive: true,
    })
      .populate("company")
      .sort({
        publishedAt: -1,
      })
      .limit(limit);
  }

  async latest(limit = 20) {
    return JobModel.find({
      isActive: true,
    })
      .populate("company")
      .sort({
        publishedAt: -1,
      })
      .limit(limit);
  }

  async findByHash(hash: string) {
    return JobModel.findOne({
      jobHash: hash,
    });
  }

  async createMany(jobs: any[]) {
    return JobModel.insertMany(jobs, {
      ordered: false,
    });
  }
}
