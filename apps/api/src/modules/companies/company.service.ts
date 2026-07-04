import { AppError } from "../../shared/errors/AppError";

import { createSlug } from "../../shared/utils/slug";

import { CompanyRepository } from "./company.repository";

import { CompanyMapper } from "./company.mapper";

import { CreateCompanyDto } from "./company.validation";

export class CompanyService {
  private repository = new CompanyRepository();

  async create(data: CreateCompanyDto) {
    const slug = createSlug(data.name);

    const exists = await this.repository.findBySlug(slug);

    if (exists) {
      throw new AppError(409, "Company already exists");
    }

    const company = await this.repository.create({
      ...data,
      slug,
    });

    return CompanyMapper.toDto(company);
  }

  async findAll() {
    const companies = await this.repository.findAll();

    return companies.map((company) =>
      CompanyMapper.toDto(company)
    );
  }

  async findById(id: string) {
    const company = await this.repository.findById(id);

    if (!company) {
      throw new AppError(404, "Company not found");
    }

    return CompanyMapper.toDto(company);
  }
}