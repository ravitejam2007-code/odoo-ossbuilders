import { Request, Response, NextFunction } from 'express';
import { AuthService } from './auth.service';
import { sendSuccess } from '../../utils/response';

const authService = new AuthService();

export class AuthController {
  async signup(req: Request, res: Response, next: NextFunction) {
    try {
      const result = await authService.signup(req.body);
      return sendSuccess(res, result, 201, 'Signup successful');
    } catch (error) {
      next(error);
    }
  }

  async verifyEmail(req: Request, res: Response, next: NextFunction) {
    try {
      const { token, loginId } = req.body;
      const result = await authService.verifyEmail(token, loginId);
      return sendSuccess(res, result, 200);
    } catch (error) {
      next(error);
    }
  }

  async login(req: Request, res: Response, next: NextFunction) {
    try {
      const { loginIdOrEmail, password } = req.body;
      const result = await authService.login(loginIdOrEmail, password);
      return sendSuccess(res, result, 200, 'Login successful');
    } catch (error) {
      next(error);
    }
  }

  async refresh(req: Request, res: Response, next: NextFunction) {
    try {
      const { refreshToken } = req.body;
      const result = await authService.refreshToken(refreshToken);
      return sendSuccess(res, result, 200);
    } catch (error) {
      next(error);
    }
  }

  async logout(_req: Request, res: Response) {
    return sendSuccess(res, { message: 'Logged out successfully' }, 200);
  }
}
