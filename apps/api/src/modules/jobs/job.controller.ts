import { Request, Response } from "express";

import { JobService } from "./job.service";
import { CreateJobSchema } from "./job.validation";

const jobService = new JobService();

export class JobController {
  create = async (
    req: Request,
    res: Response
  ) => {
    const payload =
      CreateJobSchema.parse(req.body);

    const job =
      await jobService.create(payload);

    return res.status(201).json({
      success: true,
      message: "Job created successfully",
      data: job,
    });
  };

  findAll = async (
    req: Request,
    res: Response
  ) => {
    const jobs =
      await jobService.findAll();

    return res.json({
      success: true,
      message: "Jobs fetched successfully",
      data: jobs,
    });
  };

  findById = async (
    req: Request,
    res: Response
  ) => {
    const job =
      await jobService.findById(
        req.params.id
      );

    return res.json({
      success: true,
      message: "Job fetched successfully",
      data: job,
    });
  };
}