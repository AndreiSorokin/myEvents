import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import {
  AuthResponse,
  LoginRequest,
  PasswordResetRequest,
  ResetPasswordRequest,
} from "../misc/auth";

export const authApi = createApi({
  reducerPath: "authApi",
  baseQuery: fetchBaseQuery({
    baseUrl: import.meta.env.VITE_BASE_URL || "http://localhost:3003/api/v1",
    prepareHeaders: (headers) => {
      const token = localStorage.getItem("token");
      if (token) {
        headers.set("Authorization", `Bearer ${token}`);
      }
      return headers;
    },
  }),
  endpoints: (builder) => ({
    // Login
    login: builder.mutation<AuthResponse, LoginRequest>({
      query: ({ email, password }) => ({
        url: "auth/login",
        method: "POST",
        body: { email, password },
      }),
      async onQueryStarted(_, { queryFulfilled }) {
        const { data } = await queryFulfilled;
        // Save token and refreshToken to localStorage
        localStorage.setItem("token", data.token);
        localStorage.setItem("refreshToken", data.refreshToken);
      },
    }),
    // Refresh token
    refreshToken: builder.mutation<AuthResponse, void>({
      query: () => ({
        url: "auth/refresh-token",
        method: "POST",
        body: { refreshToken: localStorage.getItem("refreshToken") },
      }),
      async onQueryStarted(_, { queryFulfilled }) {
        const { data } = await queryFulfilled;
        // Update tokens in localStorage
        localStorage.setItem("token", data.token);
        localStorage.setItem("refreshToken", data.refreshToken);
      },
    }),
    // Request Password Reset
    requestPasswordReset: builder.mutation<void, PasswordResetRequest>({
      query: ({ email }) => ({
        url: "auth/request-password-reset",
        method: "POST",
        body: { email },
      }),
    }),
    // Get reset token
    getResetToken: builder.query<void, string>({
      query: (token) => `auth/reset-password/${token}`,
    }),
    // Reset Password
    resetPassword: builder.mutation<void, ResetPasswordRequest>({
      query: ({ token, newPassword }) => ({
        url: `auth/reset-password/${token}`,
        method: "POST",
        body: { newPassword },
      }),
    }),
    // Logout
    logout: builder.mutation<void, void>({
      queryFn: () => {
        // Clear tokens from localStorage
        localStorage.removeItem("token");
        localStorage.removeItem("refreshToken");
        return { data: undefined };
      },
    }),
  }),
});

// Export hooks for usage in functional components
export const {
  useLoginMutation,
  useRefreshTokenMutation,
  useRequestPasswordResetMutation,
  useResetPasswordMutation,
  useLogoutMutation,
} = authApi;
