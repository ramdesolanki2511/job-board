import { AppError } from "../../shared/errors/AppError";
import { createSlug } from "../../shared/utils/slug";

import CompanyModel from "../companies/company.model";

import { JobRepository } from "./job.repository";
import { JobMapper } from "./job.mapper";
import { CreateJobDto, SearchJobDto } from "./job.validation";

export class JobService {
  private repository = new JobRepository();

  async create(data: CreateJobDto) {
    const company = await CompanyModel.findById(data.company);

    if (!company) {
      throw new AppError(404, "Company not found");
    }

    const slug = createSlug(data.title);

    const exists = await this.repository.findBySlug(slug);

    if (exists) {
      throw new AppError(409, "Job already exists");
    }

    const job = await this.repository.create({
      ...data,
      slug,
    });

    return JobMapper.toDto(job);
  }

  async findAll() {
    const jobs = await this.repository.findAll();

    return jobs.map(JobMapper.toDto);
  }

  async findById(id: string) {
    const job = await this.repository.findById(id);

    if (!job) {
      throw new AppError(404, "Job not found");
    }

    return JobMapper.toDto(job);
  }

  async search(data: SearchJobDto) {
    const result = await this.repository.search(data);

    return {
      jobs: result.jobs.map(JobMapper.toDto),

      total: result.total,

      page: data.page,

      limit: data.limit,

      totalPages: Math.ceil(result.total / data.limit),
    };
  }
}
