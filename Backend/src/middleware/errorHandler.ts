import { Request, Response, NextFunction } from 'express';
import { AppError, sendError } from '../utils/response';
import { ErrorCodes } from '../constants/errorCodes';

export function errorHandler(
  err: any,
  _req: Request,
  res: Response,
  _next: NextFunction
) {
  console.error('[Unhandled Server Error]:', err);

  if (err instanceof AppError) {
    return sendError(res, err.statusCode, err.code, err.message, err.details);
  }

  // Generic unhandled errors
  return sendError(
    res,
    500,
    ErrorCodes.INTERNAL_SERVER_ERROR,
    process.env.NODE_ENV === 'production'
      ? 'An internal server error occurred'
      : err.message || 'Internal server error'
  );
}
