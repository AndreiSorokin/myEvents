import express from "express";
import {
  createUser,
  deleteUser,
  getAllUsers,
  getUserById,
  updateUser,
  updateUserPassword,
} from "../controllers/userController";
import { authenticateToken } from "../middleware/tokenMiddleware";
import { authorizeRoles } from "../middleware/authMiddleware";

const router = express.Router();

// Public route - Create a new user
router.post("/", createUser);
// Protected routes - Users must be authenticated to access these
router.get("/:id", authenticateToken, getUserById);
router.get("/", authenticateToken, getAllUsers);

// Protected and Role-based route - Users with certain roles can update/delete
router.put("/:id", authenticateToken, updateUser); // Update user
router.put("/:id/update-password", authenticateToken, updateUserPassword); // Update password

// For example, only admins can delete users
router.delete("/:id", authenticateToken, authorizeRoles(["admin"]), deleteUser);

export default router;
