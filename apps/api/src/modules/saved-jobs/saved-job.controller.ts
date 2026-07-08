import { Response } from "express";

import { AuthRequest } from "../../middlewares/auth.middleware";
import { SavedJobService } from "./saved-job.service";

const savedJobService = new SavedJobService();

export class SavedJobController {
  saveJob = async (req: AuthRequest, res: Response) => {
    const jobId = Array.isArray(req.params.jobId) ? req.params.jobId[0] : req.params.jobId;
    const { notes } = req.body;

    const saved = await savedJobService.saveJob(req.user!.id, jobId, notes);

    return res.status(201).json({
      success: true,
      message: "Job saved successfully",
      data: saved,
    });
  };

  listJobs = async (req: AuthRequest, res: Response) => {
    const page = Number(req.query.page ?? 1);
    const limit = Number(req.query.limit ?? 20);

    const result = await savedJobService.listJobs(req.user!.id, page, limit);

    return res.json({
      success: true,
      message: "Saved jobs fetched successfully",
      data: result,
    });
  };

  removeJob = async (req: AuthRequest, res: Response) => {
    const jobId = Array.isArray(req.params.jobId) ? req.params.jobId[0] : req.params.jobId;

    const result = await savedJobService.removeJob(req.user!.id, jobId);

    return res.json({
      success: true,
      message: "Saved job removed successfully",
      data: result,
    });
  };
}
