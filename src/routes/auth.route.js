import { Router } from "express";
import { authValidation } from "../middlewares/validations/auth.validation.js";
import { authController } from "../controllers/auth.controller.js";
import { protectRoute } from "../middlewares/auth.middleware.js";

const router = Router();
router.post('/register', authValidation.register, authController.register);
router.post('/verify-email', authValidation.verifyEmail, authController.verifyEmail);
router.post('/resend-otp', authValidation.sendOtp, authController.resendVerifyOtp);
router.post('/login', authValidation.login, authController.login);
router.post('/forgot-password', authValidation.sendOtp, authController.forgotPassword);
router.post('/reset-password', authValidation.resetPassword, authController.resetPassword);
router.post('/logout', protectRoute, authController.logout);
router.post('/refresh-token', authController.refreshToken);

export default router;