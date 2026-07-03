import { Router } from "express";
import authRoutes from "../modules/auth/auth.routes";

const router = Router();

router.get("/", (_, res) => {
  res.json({
    success: true,
    version: "v1"
  });
});

router.use("/auth", authRoutes);

export default router;