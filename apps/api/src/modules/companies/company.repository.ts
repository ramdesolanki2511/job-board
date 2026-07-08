import CompanyModel from "./company.model";

import { CreateCompanyDto } from "./company.validation";

export class CompanyRepository {
  async create(data: any) {
    return CompanyModel.create(data);
  }

  async findAll() {
    return CompanyModel.find().sort({
      createdAt: -1,
    });
  }

  async findById(id: string) {
    return CompanyModel.findById(id);
  }

  async findBySlug(slug: string) {
    return CompanyModel.findOne({
      slug,
    });
  }

  async findByName(name: string) {
    return CompanyModel.findOne({
      name,
    });
  }

  async update(id: string, data: Partial<CreateCompanyDto>) {
    return CompanyModel.findByIdAndUpdate(id, data, {
      new: true,
    });
  }

  async delete(id: string) {
    return CompanyModel.findByIdAndDelete(id);
  }

  async findByWebsite(website: string) {
    return CompanyModel.findOne({
      website,
    });
  }
}