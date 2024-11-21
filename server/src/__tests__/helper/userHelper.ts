import { UserRole } from "../../enums/UserRole";
import { IUser } from "../../interfaces/IUser";

// Helper data for tests
export const userData = {
  name: "John Doe",
  email: "john@example.com",
  password: "Password123!",
  role: UserRole.User,
} as IUser;
