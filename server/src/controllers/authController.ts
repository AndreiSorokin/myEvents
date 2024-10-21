import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import authService from "../services/authService";
import userService from "../services/userService";
import { BadRequestError, NotFoundError } from "../errors/ApiError";
import { IUser } from "../interfaces/IUser";

// Login Controller
export const login = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { email, password } = req.body;
  try {
    const { token, refreshToken, user } = await authService.authenticateUser(
      email,
      password
    );
    res.json({ token, refreshToken, user });
  } catch (error) {
    next(error);
  }
};

// Request for reset password
export const requestPasswordReset = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { email } = req.body;
  await authService.resetUserPasswordByEmail(email);
  try {
    res.status(200).json({ message: "Password reset link sent" });
  } catch (error) {
    next(error);
  }
};

// Get reset token from link
export const getResetToken = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { token } = req.params;
  await authService.getResetToken(token);
  try {
    res.redirect(`${process.env.CLIENT_URL}/new-password/${token}`);
  } catch (error) {
    next(error);
  }
};

// Reset Password Controller
export const resetPassword = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { token } = req.params;
  const { newPassword } = req.body;
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as IUser;
    const updatedUser = await authService.resetUserPassword(
      decoded.id,
      newPassword
    );
    res
      .status(200)
      .json({ message: "Password reset successful", user: updatedUser });
  } catch (error) {
    next(new BadRequestError("Invalid or expired token"));
  }
};

// Refresh Token Controller
export const refreshToken = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { refreshToken } = req.body;
  try {
    const newToken = await authService.validateRefreshToken(refreshToken);
    res.json({ token: newToken });
  } catch (error) {
    next(error);
  }
};
