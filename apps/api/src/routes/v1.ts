import { Request, Response, Router } from "express";
import authRoutes from "../modules/auth/auth.routes";
import companyRoutes from "../modules/companies/company.routes";
import jobRoutes from "../modules/jobs/job.routes";
import savedJobRoutes from "../modules/saved-jobs/saved-job.routes";
import subscriptionRoutes from "../modules/subscriptions/subscription.routes";
import jobAlertRoutes from "../modules/job-alerts/job-alert.routes";
import checkoutRoutes from "../modules/checkout/checkout.routes";
import companyDashboardRoutes from "../modules/company-dashboard/company-dashboard.routes";
import adminRoutes from "../modules/admin/admin.routes";

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

router.use("/subscriptions", subscriptionRoutes);

router.use("/job-alerts", jobAlertRoutes);

router.use("/checkout", checkoutRoutes);

router.use("/company-dashboard", companyDashboardRoutes);

router.use("/admin", adminRoutes);

export default router;
