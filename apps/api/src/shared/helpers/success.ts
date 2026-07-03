import { Response } from "express";
import { ApiResponse } from "../responses/api-response";

export function successResponse<T>(
  res: Response,
  message: string,
  data?: T,
  status = 200
) {
  return res.status(status).json(
    new ApiResponse(true, message, data)
  );
}