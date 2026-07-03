
import userModel from "./user.model";
import { CreateUserDto } from "./user.types";

export class UserRepository {
  async findByEmail(email: string) {
    return userModel.findOne({
      email: email.toLowerCase(),
    });
  }

  async create(data: CreateUserDto) {
    return userModel.create(data);
  }

  async findById(id: string) {
    return userModel.findById(id);
  }
}