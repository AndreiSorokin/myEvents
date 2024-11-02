import { User } from "./user";

export type AuthResponse = {
  token: string;
  refreshToken: string;
  user: User;
};

export type LoginRequest = {
  email: string;
  password: string;
};

export type PasswordResetRequest = {
  email: string;
};

export type ResetPasswordRequest = {
  token: string | undefined;
  newPassword: string;
};
