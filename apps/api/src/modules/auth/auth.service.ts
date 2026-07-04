import { UserRepository } from "../users/user.repository";

import { RegisterDto } from "./auth.validation";
import { LoginDto } from "./auth.validation";

import { hashPassword } from "../../shared/utils/password";
import { comparePassword } from "../../shared/utils/password";

import {
  generateAccessToken,
  generateRefreshToken,
} from "../../shared/utils/jwt";

import { AppError } from "../../shared/errors/AppError";

export class AuthService {
  private userRepository = new UserRepository();

  // Register
  async register(data: RegisterDto) {
    const existing = await this.userRepository.findByEmail(
      data.email.toLowerCase(),
    );

    if (existing) {
      throw new Error("Email already exists");
    }

    const hashed = await hashPassword(data.password);

    const user = await this.userRepository.create({
      firstName: data.firstName.trim(),
      lastName: data.lastName.trim(),
      email: data.email.trim().toLowerCase(),
      password: hashed,
    });

    const { password, ...safeUser } = user.toObject();

    return safeUser;
  }

  // Login
  async login(data: LoginDto) {
    const user = await this.userRepository.findByEmail(
      data.email.trim().toLowerCase(),
    );

    if (!user) {
      throw new AppError(401, "Invalid email or password");
    }

    const isPasswordValid = await comparePassword(data.password, user.password);

    if (!isPasswordValid) {
      throw new AppError(401, "Invalid email or password");
    }

    await this.userRepository.updateLastLogin(user.id);

    const accessToken = generateAccessToken({
      id: user.id,
      role: user.role,
    });

    const refreshToken = generateRefreshToken({
      id: user.id,
      role: user.role,
    });

    return {
      user: {
        id: user.id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        role: user.role,
      },
      accessToken,
      refreshToken,
    };
  }

  // Me
  async me(userId: string) {
    const user = await this.userRepository.findById(userId);

    if (!user) {
      throw new AppError(404, "User not found");
    }

    return {
      id: user.id,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      role: user.role,
      isVerified: user.isVerified,
      isActive: user.isActive,
    };
  }
}
