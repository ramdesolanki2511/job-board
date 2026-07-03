import { Request, Response } from "express";

import { AuthService } from "./auth.service";
import { RegisterSchema } from "./auth.validation";

const authService = new AuthService();

export class AuthController {
  register = async (
    req: Request,
    res: Response
  ) => {
    const payload = RegisterSchema.parse(req.body);

    const user = await authService.register(payload);

    res.status(201).json({
      success: true,
      message:"User registered successfully",
      data: user,
    });
  };
}