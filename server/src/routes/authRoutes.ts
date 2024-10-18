import express from "express";
import {
  getResetToken,
  login,
  refreshToken,
  requestPasswordReset,
  resetPassword,
} from "../controllers/authController";

const router = express.Router();

router.post("/login", login);
router.post("/refresh-token", refreshToken);

// Reset password procedure
router.post("/request-password-reset", requestPasswordReset);
router.get("/reset-password/:token", getResetToken);
router.post("/reset-password/:token", resetPassword);

export default router;
