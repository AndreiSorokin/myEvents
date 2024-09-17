import express from "express";
import {
  createUser,
  deleteUser,
  getAllUsers,
  getUserById,
  updateUser,
  updateUserPassword,
} from "../controllers/userController";

const router = express.Router();

router.post("/", createUser);
router.get("/:id", getUserById);
router.get("/", getAllUsers);
router.put("/:id", updateUser);
router.put("/:id/update-password", updateUserPassword);
router.delete("/:id", deleteUser);

export default router;
