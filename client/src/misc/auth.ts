export type AuthResponse = {
  token: string;
  refreshToken: string;
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
