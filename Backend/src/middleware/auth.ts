import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { env } from '../config/env';
import { ErrorCodes } from '../constants/errorCodes';
import { sendError } from '../utils/response';
import { AuthUser, UserRole } from '../types';

interface JwtPayload {
  id: string;
  loginId: string;
  email: string;
  role: UserRole;
  emailVerified: boolean;
}

/**
 * Require valid JWT access token
 */
export function requireAuth(req: Request, res: Response, next: NextFunction) {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return sendError(res, 401, ErrorCodes.UNAUTHORIZED, 'Authentication token missing or invalid');
    }

    const token = authHeader.split(' ')[1];
    const decoded = jwt.verify(token, env.JWT_ACCESS_SECRET) as JwtPayload;

    req.user = {
      id: decoded.id,
      loginId: decoded.loginId,
      email: decoded.email,
      role: decoded.role,
      emailVerified: decoded.emailVerified,
    };

    next();
  } catch (err: any) {
    if (err.name === 'TokenExpiredError') {
      return sendError(res, 401, ErrorCodes.TOKEN_EXPIRED, 'Authentication token has expired');
    }
    return sendError(res, 401, ErrorCodes.INVALID_TOKEN, 'Invalid authentication token');
  }
}

/**
 * Require specific role(s) (e.g., requireRole('admin', 'hr_officer'))
 */
export function requireRole(...allowedRoles: UserRole[]) {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!req.user) {
      return sendError(res, 401, ErrorCodes.UNAUTHORIZED, 'Authentication required');
    }

    if (!allowedRoles.includes(req.user.role)) {
      return sendError(
        res,
        403,
        ErrorCodes.FORBIDDEN,
        `Access forbidden: requires ${allowedRoles.join(' or ')} privileges`
      );
    }

    next();
  };
}

/**
 * Require target user ID to match authenticated user ID OR be an Admin
 */
export function requireSelfOrAdmin(paramKey = 'userId') {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!req.user) {
      return sendError(res, 401, ErrorCodes.UNAUTHORIZED, 'Authentication required');
    }

    const targetUserId = req.params[paramKey];

    if (req.user.role === 'admin' || req.user.role === 'hr_officer' || req.user.id === targetUserId) {
      return next();
    }

    return sendError(
      res,
      403,
      ErrorCodes.FORBIDDEN,
      'Access forbidden: you do not have permission to view or modify this record'
    );
  };
}
