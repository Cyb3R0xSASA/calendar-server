import { Router } from "express";
import { authValidation } from "../middlewares/validations/auth.validation.js";
import { authController } from "../controllers/auth.controller.js";
import { protectRoute } from "../middlewares/auth.middleware.js";

const router = Router();
router.post('/register', authValidation.register, authController.register);
router.post('/verify-email', authValidation.verifyEmail, authController.verifyEmail);
router.post('/send-verify-email', authValidation.sendOtp, authController.resendVerifyOtp);
router.post('/login', authValidation.login, authController.login);
router.post('/password/reset', authValidation.sendOtp, authController.forgotPassword);
router.post('/password/confirm', authValidation.resetPassword, authController.resetPassword);
router.post('/logout', authController.logout);
router.post('/refresh-token', authController.refreshToken);
router.delete('/', protectRoute, authController.deleteMe)

export default router;