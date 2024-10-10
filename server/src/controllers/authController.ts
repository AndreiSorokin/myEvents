import { NextFunction, Request, Response } from "express";
import authService from "../services/authService";

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

// Reset Password Controller
export const resetPassword = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { email, newPassword } = req.body;
  try {
    const user = await authService.resetUserPassword(email, newPassword);
    res.status(200).json({
      message: "Password has been reset successfully!",
      user: user.email,
    });
  } catch (error) {
    next(error);
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
