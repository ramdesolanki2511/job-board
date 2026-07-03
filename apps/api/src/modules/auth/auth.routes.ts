import { Router } from "express";
import { AuthController } from "./auth.controller";
import { asyncHandler } from "../../shared/utils/async-handler";
import { authenticate } from "../../middlewares/auth.middleware";

const router = Router();

const controller = new AuthController();

router.post("/register", asyncHandler(controller.register));
router.post("/login", asyncHandler(controller.login));
router.get("/me", authenticate, asyncHandler(controller.me));

export default router;
