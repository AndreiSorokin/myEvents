import { UserModel } from "../models/user";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { IUser } from "../interfaces/IUser";
import { BadRequestError, NotFoundError } from "../errors/ApiError";
import { sendPasswordResetEmail } from "../utils/emailService";
import { OAuth2Client } from "google-auth-library";
import userService from "./userService";

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

// Authenticate user credentials and return tokens
export const authenticateUser = async (email: string, password: string) => {
  const user = await UserModel.findOne({ email });
  if (!user) {
    throw new NotFoundError("User not found");
  }

  // Check if the user has a password (i.e., not a Google login user)
  if (!user.password) {
    throw new BadRequestError(
      "This user has no password set. Please use Google login or set a password."
    );
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

// Verify Google Token and Authenticate User
export const authenticateGoogleUser = async (token: string) => {
  const ticket = await client.verifyIdToken({
    idToken: token,
    audience: process.env.GOOGLE_CLIENT_ID,
  });
  const payload = ticket.getPayload();

  if (!payload) {
    throw new Error("Unable to authenticate Google token");
  }

  // Extract the user information from Google
  const { sub: googleId, email, name, picture } = payload;

  // Check if user exists in the database, otherwise create a new one
  let user = await userService.findUserByGoogleId(googleId);
  if (!user) {
    user = await userService.createUserFromGoogle({
      googleId,
      email: email || "",
      name: name || "",
    });
  }

  // Create JWT for authenticated user
  const authToken = jwt.sign(
    { id: user.id, email: user.email },
    process.env.JWT_SECRET!,
    { expiresIn: "1h" }
  );

  return {
    token: authToken,
    user,
  };
};

export default {
  authenticateUser,
  resetUserPasswordByEmail,
  getResetToken,
  resetUserPassword,
  validateRefreshToken,
  generateResetToken,
  authenticateGoogleUser,
};
