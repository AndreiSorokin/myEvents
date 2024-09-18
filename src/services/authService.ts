import { UserModel } from "../models/user";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { IUser } from "../interfaces/IUser";
import { BadRequestError, NotFoundError } from "../errors/ApiError";

// Authenticate user credentials and return tokens
export const authenticateUser = async (email: string, password: string) => {
  const user = await UserModel.findOne({ email });
  if (!user) {
    throw new NotFoundError("User not found");
  }
  // Debug password comparison
  console.log("Password provided:", password);
  console.log("Hashed password in DB:", user.password);

  const isValidPassword = await bcrypt.compare(password, user.password);
  console.log("Password match result:", isValidPassword);

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

// Reset user password
export const resetUserPassword = async (
  email: string,
  newPassword: string
): Promise<IUser> => {
  try {
    const user = await UserModel.findOne({ email });
    if (!user) {
      throw new NotFoundError("User not found");
    }
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    user.password = hashedPassword;
    console.log("New password hashed:", hashedPassword);
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
  resetUserPassword,
  validateRefreshToken,
};
