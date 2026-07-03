import { UserRepository } from "../users/user.repository";

import { RegisterDto } from "./auth.validation";

import { hashPassword } from "../../shared/utils/password";

export class AuthService {
  private userRepository = new UserRepository();

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
}
