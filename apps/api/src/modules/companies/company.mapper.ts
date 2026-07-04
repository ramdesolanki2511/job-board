import { CompanyDto } from "./company.dto";

export class CompanyMapper {
  static toDto(company: any): CompanyDto {
    return {
      id: company._id.toString(),
      name: company.name,
      slug: company.slug,
      website: company.website,
      careersUrl: company.careersUrl,
      logo: company.logo,
      description: company.description,
      industry: company.industry,
      size: company.size,
      headquarters: company.headquarters,
      foundedYear: company.foundedYear,
      linkedinUrl: company.linkedinUrl,
      twitterUrl: company.twitterUrl,
      isVerified: company.isVerified,
      isActive: company.isActive,
      createdAt: company.createdAt,
      updatedAt: company.updatedAt,
    };
  }
}