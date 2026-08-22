import { Router } from 'express';
import { AuthController } from './auth.controller';
import { validateRequest } from '../../middleware/validate';
import { authRateLimiter } from '../../middleware/rateLimiter';
import {
  SignupSchema,
  LoginSchema,
  VerifyEmailSchema,
  RefreshTokenSchema,
  ForgotPasswordSchema,
  ResetPasswordSchema,
} from './auth.schema';

const router = Router();
const authController = new AuthController();

// Core Phase 1 Auth Routes
router.post('/signup', authRateLimiter, validateRequest(SignupSchema), authController.signup);
router.post('/verify-email', validateRequest(VerifyEmailSchema), authController.verifyEmail);
router.post('/login', authRateLimiter, validateRequest(LoginSchema), authController.login);
router.post('/refresh', validateRequest(RefreshTokenSchema), authController.refresh);
router.post('/logout', authController.logout);
router.post('/forgot-password', authRateLimiter, validateRequest(ForgotPasswordSchema), authController.forgotPassword);
router.post('/reset-password', authRateLimiter, validateRequest(ResetPasswordSchema), authController.resetPassword);

export default router;
