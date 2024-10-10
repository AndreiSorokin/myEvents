import express from "express";
import {
  login,
  refreshToken,
  resetPassword,
} from "../controllers/authController";

const router = express.Router();

router.post("/login", login);
router.post("/refresh-token", refreshToken);
router.post("/reset-password", resetPassword);

export default router;
