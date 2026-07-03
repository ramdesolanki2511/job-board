import { Request, Response } from "express";

import { AuthService } from "./auth.service";
import { RegisterSchema } from "./auth.validation";
import { LoginSchema } from "./auth.validation";
import { AuthRequest } from "../../middlewares/auth.middleware";

const authService = new AuthService();

export class AuthController {
  // Register
  register = async (req: Request, res: Response) => {
    const payload = RegisterSchema.parse(req.body);

    const user = await authService.register(payload);

    res.status(201).json({
      success: true,
      message: "User registered successfully",
      data: user,
    });
  };

  // Login
  login = async (req: Request, res: Response) => {
    const payload = LoginSchema.parse(req.body);

    const result = await authService.login(payload);

    res.status(200).json({
      success: true,
      message: "Login successful",
      data: result,
    });
  };

  // Me
  me = async (req: AuthRequest, res: Response) => {
    const user = await authService.me(req.user!.id);

    res.json({
      success: true,
      message: "Profile fetched successfully",
      data: user,
    });
  };
}
