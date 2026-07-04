import { JobDto } from "./job.dto";

export class JobMapper {
  static toDto(job: any): JobDto {
    return {
      id: job._id.toString(),
      title: job.title,
      slug: job.slug,
      company: job.company.toString(),
      shortDescription: job.shortDescription,
      description: job.description,
      location: job.location,
      remoteType: job.remoteType,
      employmentType: job.employmentType,
      experienceLevel: job.experienceLevel,
      salaryMin: job.salaryMin,
      salaryMax: job.salaryMax,
      salaryCurrency: job.salaryCurrency,
      skills: job.skills,
      applyUrl: job.applyUrl,
      source: job.source,
      sourceJobId: job.sourceJobId,
      isFeatured: job.isFeatured,
      isActive: job.isActive,
      publishedAt: job.publishedAt,
      expiresAt: job.expiresAt,
      createdAt: job.createdAt,
      updatedAt: job.updatedAt,
    };
  }
}