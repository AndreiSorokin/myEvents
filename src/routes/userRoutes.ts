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
router.put("/:id", authenticateToken, updateUser);
router.put("/:id/update-password", authenticateToken, updateUserPassword);

// Only admins can delete users
router.delete("/:id", authenticateToken, authorizeRoles(["admin"]), deleteUser);

export default router;
