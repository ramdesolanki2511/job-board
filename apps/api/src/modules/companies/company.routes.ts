import { Router } from "express";

import { CompanyController } from "./company.controller";

import { asyncHandler } from "../../shared/utils/async-handler";

import { authenticate } from "../../middlewares/auth.middleware";

const router = Router();

const controller = new CompanyController();

router.post("/", authenticate, asyncHandler(controller.create));

router.get("/", authenticate, asyncHandler(controller.findAll));

router.get("/:id", authenticate, asyncHandler(controller.findById));

export default router;
