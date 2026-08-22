import { Router } from 'express';
import { AuthController } from './auth.controller';
import { validateRequest } from '../../middleware/validate';
import { authRateLimiter } from '../../middleware/rateLimiter';
import { SignupSchema, LoginSchema, VerifyEmailSchema, RefreshTokenSchema } from './auth.schema';

const router = Router();
const authController = new AuthController();

router.post('/signup', authRateLimiter, validateRequest(SignupSchema), authController.signup);
router.post('/verify-email', validateRequest(VerifyEmailSchema), authController.verifyEmail);
router.post('/login', authRateLimiter, validateRequest(LoginSchema), authController.login);
router.post('/refresh', validateRequest(RefreshTokenSchema), authController.refresh);
router.post('/logout', authController.logout);

export default router;
