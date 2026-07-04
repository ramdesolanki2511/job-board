import { Router } from "express";
import authRoutes from "../modules/auth/auth.routes";
import companyRoutes from "../modules/companies/company.routes";

const router = Router();

router.get("/", (_, res) => {
  res.json({
    success: true,
    version: "v1",
  });
});

router.use("/auth", authRoutes);

router.use("/companies", companyRoutes);

export default router;
