import rateLimit from 'express-rate-limit';
import { sendError } from '../utils/response';
import { ErrorCodes } from '../constants/errorCodes';

export const authRateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 30, // Limit each IP to 30 login/signup requests per window
  standardHeaders: true,
  legacyHeaders: false,
  handler: (_req, res) => {
    return sendError(
      res,
      429,
      ErrorCodes.BAD_REQUEST,
      'Too many authentication requests from this IP, please try again after 15 minutes'
    );
  },
});
