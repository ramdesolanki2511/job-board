import { Request, Response } from "express";

import { JobService } from "./job.service";
import { CreateJobSchema, ImportJobSchema, SearchJobSchema } from "./job.validation";

const jobService = new JobService();

export class JobController {
  create = async (req: Request, res: Response) => {
    const payload = CreateJobSchema.parse(req.body);

    const job = await jobService.create(payload);

    return res.status(201).json({
      success: true,
      message: "Job created successfully",
      data: job,
    });
  };

  findAll = async (req: Request, res: Response) => {
    const jobs = await jobService.findAll();

    return res.json({
      success: true,
      message: "Jobs fetched successfully",
      data: jobs,
    });
  };

  findById = async (req: Request, res: Response) => {
    const job = await jobService.findById(req.params.id);

    return res.json({
      success: true,
      message: "Job fetched successfully",
      data: job,
    });
  };

  search = async (req: Request, res: Response) => {
    const query = SearchJobSchema.parse(req.query);

    const jobs = await jobService.search(query);

    return res.json({
      success: true,
      message: "Jobs fetched successfully",
      data: jobs,
    });
  };

  findBySlug = async (req: Request, res: Response) => {
    const job = await jobService.findBySlug(req.params.slug);

    return res.json({
      success: true,
      message: "Job fetched successfully",
      data: job,
    });
  };

  featured = async (req: Request, res: Response) => {
    const jobs = await jobService.featured();

    return res.json({
      success: true,
      message: "Featured jobs",
      data: jobs,
    });
  };

  latest = async (req: Request, res: Response) => {
    const jobs = await jobService.latest();

    return res.json({
      success: true,
      message: "Latest jobs",
      data: jobs,
    });
  };

  importJobs = async (req: Request, res: Response) => {
    const payload = ImportJobSchema.parse(req.body);

    const result = await jobService.importJobs(payload);

    return res.status(201).json({
      success: true,
      message: "Jobs imported successfully",
      data: result,
    });
  };
}
