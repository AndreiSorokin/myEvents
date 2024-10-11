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
    baseUrl: import.meta.env.VITE_BASE_URL,
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
        try {
          const { data } = await queryFulfilled;
          // Save token and refreshToken to localStorage
          localStorage.setItem("token", data.token);
          localStorage.setItem("refreshToken", data.refreshToken);
        } catch (error) {
          console.error("Error logging in:", error);
        }
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
        try {
          const { data } = await queryFulfilled;
          // Update tokens in localStorage
          localStorage.setItem("token", data.token);
          localStorage.setItem("refreshToken", data.refreshToken);
        } catch (error) {
          console.error("Error refreshing token:", error);
        }
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
    // Reset Password
    resetPassword: builder.mutation<void, ResetPasswordRequest>({
      query: ({ token, newPassword }) => ({
        url: `auth/reset-password/${token}`,
        method: "POST",
        body: { newPassword },
      }),
    }),
  }),
});

// Export hooks for usage in functional components
export const {
  useLoginMutation,
  useRefreshTokenMutation,
  useRequestPasswordResetMutation,
  useResetPasswordMutation,
} = authApi;
