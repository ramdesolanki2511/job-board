import { Router } from "express";
import { AuthController } from "./auth.controller";
import { asyncHandler } from "../../shared/utils/async-handler";

const router = Router();

const controller = new AuthController();

router.post(
    "/register",
    asyncHandler(controller.register)
);

export default router;