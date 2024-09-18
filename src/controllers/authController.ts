import { Request, Response } from "express";
import { UserModel } from "../models/user";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { IUser } from "../interfaces/IUser";

// Login Controller
export const login = async (req: Request, res: Response) => {
  const { email, password } = req.body;

  try {
    const user = await UserModel.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    // Generate JWT Token
    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET!,
      { expiresIn: process.env.JWT_EXPIRATION || "7h" }
    );

    // Generate Refresh Token (optional)
    const refreshToken = jwt.sign({ id: user._id }, process.env.JWT_SECRET!, {
      expiresIn: "7d",
    });

    res.json({
      token,
      refreshToken,
      user: { id: user._id, email: user.email, role: user.role },
    });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

// Refresh Token Controller
export const refreshToken = async (req: Request, res: Response) => {
  const { refreshToken } = req.body;

  if (!refreshToken) {
    return res.status(401).json({ message: "No refresh token provided" });
  }

  try {
    const decoded = jwt.verify(refreshToken, process.env.JWT_SECRET!) as IUser;
    const newAccessToken = jwt.sign(
      { id: decoded.id, role: decoded.role },
      process.env.JWT_SECRET!,
      { expiresIn: process.env.JWT_EXPIRATION || "7h" }
    );

    res.json({ token: newAccessToken });
  } catch (error) {
    return res
      .status(403)
      .json({ message: "Invalid or expired refresh token" });
  }
};

// Reset Password Controller
export const resetPassword = async (req: Request, res: Response) => {
  const { email, newPassword } = req.body;

  try {
    const user = await UserModel.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    user.password = hashedPassword;
    await user.save();

    res.json({ message: "Password updated successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};
