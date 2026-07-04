import { Request, Response } from "express";

import { CompanyService } from "./company.service";

import { CreateCompanySchema } from "./company.validation";

const companyService = new CompanyService();

export class CompanyController {
  create = async (
    req: Request,
    res: Response
  ) => {
    const payload =
      CreateCompanySchema.parse(req.body);

    const company =
      await companyService.create(payload);

    return res.status(201).json({
      success: true,
      message: "Company created successfully",
      data: company,
    });
  };

  findAll = async (
    req: Request,
    res: Response
  ) => {
    const companies =
      await companyService.findAll();

    return res.json({
      success: true,
      message: "Companies fetched successfully",
      data: companies,
    });
  };

  findById = async (
    req: Request,
    res: Response
  ) => {
    const company =
      await companyService.findById(
        req.params.id
      );

    return res.json({
      success: true,
      message: "Company fetched successfully",
      data: company,
    });
  };
}