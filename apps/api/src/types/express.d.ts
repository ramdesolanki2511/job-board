declare module "express-serve-static-core" {
  interface Request {
    user?: {
      id: string;
      role: string;
    };
    body: any;
    params: Record<string, any>;
    query: Record<string, any>;
    headers: Record<string, any>;
  }

  interface Response {
    status(code: number): Response;
    json(body?: any): Response;
  }
}
