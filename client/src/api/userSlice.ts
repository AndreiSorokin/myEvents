import {
  CreateUserRequest,
  PasswordUpdateRequest,
  UpdateUserRequest,
  User,
} from "@/misc/user";
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const userApi = createApi({
  reducerPath: "userApi",
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
    // Fetch a user by ID
    getUserById: builder.query<User, string>({
      query: (id) => `users/${id}`,
    }),
    // Fetch all users (admin access)
    getAllUsers: builder.query<User[], void>({
      query: () => "users",
    }),
    // Create a new user
    createUser: builder.mutation<User, CreateUserRequest>({
      query: (newUser) => ({
        url: "users",
        method: "POST",
        body: newUser,
      }),
    }),
    // Update a user by ID
    updateUser: builder.mutation<User, { id: string; user: UpdateUserRequest }>(
      {
        query: ({ id, user }) => ({
          url: `users/${id}`,
          method: "PUT",
          body: user,
        }),
      }
    ),
    // Update user password by ID
    updateUserPassword: builder.mutation<
      User,
      { id: string; passwordData: PasswordUpdateRequest }
    >({
      query: ({ id, passwordData }) => ({
        url: `users/${id}/update-password`,
        method: "PUT",
        body: passwordData,
      }),
    }),
    // Delete a user by ID (admin access)
    deleteUser: builder.mutation<void, string>({
      query: (id) => ({
        url: `users/${id}`,
        method: "DELETE",
      }),
    }),
  }),
});

// Export hooks for usage in functional components
export const {
  useGetUserByIdQuery,
  useGetAllUsersQuery,
  useCreateUserMutation,
  useUpdateUserMutation,
  useUpdateUserPasswordMutation,
  useDeleteUserMutation,
} = userApi;
