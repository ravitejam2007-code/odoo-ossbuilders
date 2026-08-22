import { Response } from 'express';
import { ErrorCode, ErrorCodes } from '../constants/errorCodes';

export class AppError extends Error {
  public statusCode: number;
  public code: ErrorCode;
  public details?: any;

  constructor(statusCode: number, code: ErrorCode, message: string, details?: any) {
    super(message);
    this.statusCode = statusCode;
    this.code = code;
    this.details = details;
    Object.setPrototypeOf(this, new.target.prototype);
  }
}

/**
 * Standardized Success Response Helper
 */
export function sendSuccess<T>(res: Response, data: T, statusCode = 200, message?: string) {
  return res.status(statusCode).json({
    success: true,
    data,
    ...(message ? { message } : {}),
  });
}

/**
 * Standardized Error Envelope Response Helper
 * Matches TRD format: { "error": { "code": string, "message": string, "details": any } }
 */
export function sendError(
  res: Response,
  statusCode = 500,
  code: ErrorCode = ErrorCodes.INTERNAL_SERVER_ERROR,
  message = 'An unexpected error occurred',
  details?: any
) {
  return res.status(statusCode).json({
    error: {
      code,
      message,
      ...(details ? { details } : {}),
    },
  });
}
