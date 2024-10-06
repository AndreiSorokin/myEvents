import express from "express";
import {
  login,
  refreshToken,
  requestPasswordReset,
  resetPassword,
} from "../controllers/authController";

const router = express.Router();

router.post("/login", login);
router.post("/refresh-token", refreshToken);

router.post("/request-password-reset", requestPasswordReset);
router.post("/reset-password/:token", resetPassword);

export default router;
