import { UserModel } from "../models/user";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { IUser } from "../interfaces/IUser";
import { BadRequestError, NotFoundError } from "../errors/ApiError";
import { sendPasswordResetEmail } from "../utils/emailService";

// Authenticate user credentials and return tokens
export const authenticateUser = async (email: string, password: string) => {
  const user = await UserModel.findOne({ email });
  if (!user) {
    throw new NotFoundError("User not found");
  }

  const isValidPassword =
    (await bcrypt.compare(password, user.password)) ||
    password === user.password;
  if (!isValidPassword) {
    throw new BadRequestError("Invalid email or password");
  }

  const token = jwt.sign(
    { id: user._id, role: user.role },
    process.env.JWT_SECRET!,
    {
      expiresIn: process.env.JWT_EXPIRATION || "7h",
    }
  );

  const refreshToken = jwt.sign({ id: user._id }, process.env.JWT_SECRET!, {
    expiresIn: "7d",
  });

  return {
    token,
    refreshToken,
    user: { id: user._id, email: user.email, role: user.role },
  };
};

// Generate Password Reset Token (Valid for 1 hour)
export const generateResetToken = (userId: string): string => {
  return jwt.sign({ id: userId }, process.env.JWT_SECRET!, { expiresIn: "1h" });
};

// Reset user password by email
export const resetUserPasswordByEmail = async (email: string) => {
  const user = await UserModel.findOne({ email });
  if (!user) {
    throw new NotFoundError("User not found");
  }
  const resetToken = generateResetToken(user.id);
  user.resetToken = resetToken;
  user.resetTokenExpiration = Date.now() + 3600000; // 1 hour from now
  await sendPasswordResetEmail(email, resetToken);
  await user.save();
  return resetToken;
};

// Get reset token
export const getResetToken = async (token: string) => {
  // Find the user with the resetToken and check the token expiration time
  const user = await UserModel.findOne({
    resetToken: token,
    resetTokenExpiration: { $gt: Date.now() },
  });
  // If no user is found or the token doesn't match, throw an error
  if (!user || user.resetToken !== token) {
    throw new NotFoundError("Invalid or expired reset token");
  }
  return user.resetToken;
};

// Reset user password by user ID
export const resetUserPassword = async (
  id: string,
  newPassword: string
): Promise<IUser> => {
  try {
    const user = await UserModel.findById(id);
    if (!user) {
      throw new NotFoundError("User not found");
    }

    // Hash the new password and update it
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    user.password = hashedPassword;
    user.resetToken = undefined;
    user.resetTokenExpiration = undefined;

    return await user.save();
  } catch (error) {
    throw error;
  }
};

// Validate refresh token
export const validateRefreshToken = async (refreshToken: string) => {
  const decoded = jwt.verify(refreshToken, process.env.JWT_SECRET!) as IUser;

  const newAccessToken = jwt.sign(
    { id: decoded.id, role: decoded.role },
    process.env.JWT_SECRET!,
    { expiresIn: process.env.JWT_EXPIRATION || "7h" }
  );

  return { token: newAccessToken };
};

export default {
  authenticateUser,
  resetUserPasswordByEmail,
  getResetToken,
  resetUserPassword,
  validateRefreshToken,
  generateResetToken,
};
