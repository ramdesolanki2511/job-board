export interface CompanyConfig {
  companyName: string;
  companyWebsite: string;
  boardToken: string;
  ats?: "greenhouse" | "lever" | "ashby" | "workday" | "bamboohr" | "smartrecruiters" | "generic";
}

export const companies: CompanyConfig[] = [
  {
    companyName: "Stripe",
    companyWebsite: "https://stripe.com",
    boardToken: "stripe",
    ats: "greenhouse",
  },

  {
    companyName: "Vercel",
    companyWebsite: "https://vercel.com",
    boardToken: "vercel",
    ats: "greenhouse",
  },

  {
    companyName: "Postman",
    companyWebsite: "https://www.postman.com",
    boardToken: "postman",
    ats: "lever",
  },

  {
    companyName: "Docker",
    companyWebsite: "https://docker.com",
    boardToken: "docker",
    ats: "generic",
  },
];