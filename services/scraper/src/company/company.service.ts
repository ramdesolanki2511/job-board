import { CompanyConfig } from "../config/companies";

export class CompanyService {
  getCompany(boardToken: string): CompanyConfig | null {
    const companies: CompanyConfig[] = [
      {
        boardToken: "stripe",
        companyName: "Stripe",
        companyWebsite: "https://stripe.com",
      },
      {
        boardToken: "postman",
        companyName: "Postman",
        companyWebsite: "https://www.postman.com",
      },
      {
        boardToken: "vercel",
        companyName: "Vercel",
        companyWebsite: "https://vercel.com",
      },
    ];

    return (
      companies.find(
        (company) => company.boardToken === boardToken
      ) ?? null
    );
  }
}