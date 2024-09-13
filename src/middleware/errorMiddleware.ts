import { Request, Response, NextFunction } from "express";
import { ApiError } from "../errors/ApiError";

export const errorHandler = (
  err: ApiError,
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  if (err instanceof ApiError) {
    res.status(err.status).json({ status: err.status, message: err.message });
  } else {
    res.status(500).json({ status: 500, message: "Internal Server Error" });
  }
};
