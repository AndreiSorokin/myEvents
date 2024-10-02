import express from "express";
import {
  createUser,
  deleteUser,
  getAllUsers,
  getUserById,
  updateUser,
<<<<<<< HEAD
} from "../controllers/userController";

const router = express.Router();

router.post("/users", createUser);
router.get("/users/:id", getUserById);
router.get("/users", getAllUsers);
router.put("/users/:id", updateUser);
router.delete("/users/:id", deleteUser);
=======
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
>>>>>>> bf8d1929c1fe4de8844d3656e0b7f12f3121bc7d

export default router;
