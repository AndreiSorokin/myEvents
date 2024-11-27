export type User = {
  id: string;
  name: string;
  email: string;
  role: "user" | "organizer" | "admin";
};

export type CreateUserRequest = {
  name: string;
  email: string;
  password: string;
  role: "user" | "organizer";
};

export type UpdateUserRequest = {
  name: string;
  email: string;
  role: "user" | "organizer";
};

export type PasswordUpdateRequest = {
  currentPassword: string;
  newPassword: string;
};

export type Organizer = {
  id: string;
  name?: string;
  email?: string;
  role?: string;
};
