import { AppError } from "../../shared/errors/AppError";
import { createSlug } from "../../shared/utils/slug";

import CompanyModel from "../companies/company.model";

import { JobRepository } from "./job.repository";
import { JobMapper } from "./job.mapper";
import { CreateJobDto, ImportJobDto, SearchJobDto } from "./job.validation";
import { generateJobHash } from "../../shared/utils/hash";
import { CompanyService } from "../companies/company.service";

export class JobService {
  private repository = new JobRepository();
  private companyService = new CompanyService();

  async create(data: CreateJobDto) {
    const company = await this.companyService.findOrCreate(
      data.companyName,
      data.companyWebsite,
    );

    const slug = createSlug(data.title);

    const hash = generateJobHash(data.title, company.id, data.applyUrl);

    const duplicate = await this.repository.findByHash(hash);

    if (duplicate) {
      throw new AppError(409, "Duplicate job");
    }

    const { companyName, companyWebsite, ...jobData } = data;

    const job = await this.repository.create({
      ...jobData,
      company: company.id,
      slug,
      jobHash: hash,
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

  async findBySlug(slug: string) {
    const job = await this.repository.findBySlug(slug);

    if (!job) {
      throw new AppError(404, "Job not found");
    }

    return JobMapper.toDto(job);
  }

  async featured() {
    const jobs = await this.repository.featured();

    return jobs.map(JobMapper.toDto);
  }

  async latest() {
    const jobs = await this.repository.latest();

    return jobs.map(JobMapper.toDto);
  }

  async importJobs(data: ImportJobDto) {
    let imported = 0;
    let duplicates = 0;
    let failed = 0;

    for (const item of data.jobs) {
      try {
        await this.create(item);

        imported++;
      } catch (error) {
        if (error instanceof AppError && error.statusCode === 409) {
          duplicates++;
        } else {
          failed++;
        }
      }
    }

    return {
      imported,
      duplicates,
      failed,
    };
  }
}
