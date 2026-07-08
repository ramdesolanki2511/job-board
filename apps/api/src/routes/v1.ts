import { Request, Response, Router } from "express";
import authRoutes from "../modules/auth/auth.routes";
import companyRoutes from "../modules/companies/company.routes";
import jobRoutes from "../modules/jobs/job.routes";
import savedJobRoutes from "../modules/saved-jobs/saved-job.routes";

const router = Router();

router.get("/", (_req: Request, res: Response) => {
  res.json({
    success: true,
    version: "v1",
  });
});

router.use("/auth", authRoutes);

router.use("/companies", companyRoutes);

router.use("/jobs", jobRoutes);

router.use("/saved-jobs", savedJobRoutes);

export default router;
