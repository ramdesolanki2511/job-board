import { Router } from "express";

const router = Router();

router.get("/", (_, res) => {
  res.json({
    success: true,
    version: "v1"
  });
});

export default router;