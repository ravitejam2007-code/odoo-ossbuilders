import express, { Express, Request, Response } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import cookieParser from 'cookie-parser';

import { env } from './config/env';
import { errorHandler } from './middleware/errorHandler';
import { sendSuccess, sendError } from './utils/response';
import { ErrorCodes } from './constants/errorCodes';

// Import Route Modules
import authRoutes from './modules/auth/auth.routes';
import profileRoutes from './modules/profile/profile.routes';
import attendanceRoutes from './modules/attendance/attendance.routes';
import leaveRoutes from './modules/leave/leave.routes';
import payrollRoutes from './modules/payroll/payroll.routes';
import employeesRoutes from './modules/employees/employees.routes';
import notificationsRoutes from './modules/notifications/notifications.routes';
import reportsRoutes from './modules/reports/reports.routes';

const app: Express = express();

// Security & Standard Middleware
app.use(helmet());
app.use(
  cors({
    origin: (origin, callback) => {
      // Allow requests with no origin (e.g. mobile apps, curl) or allowed origins
      if (!origin || env.FRONTEND_URL.some(url => origin === url || origin.startsWith(url)) || env.NODE_ENV === 'development') {
        callback(null, true);
      } else {
        callback(new Error('Blocked by CORS policy'));
      }
    },
    credentials: true,
  })
);

app.use(morgan(env.NODE_ENV === 'production' ? 'combined' : 'dev'));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));
app.use(cookieParser());

// Base Health Check
app.get('/api/v1/health', (_req: Request, res: Response) => {
  return sendSuccess(
    res,
    {
      status: 'UP',
      timestamp: new Date().toISOString(),
      environment: env.NODE_ENV,
      version: '1.0.0',
    },
    200,
    'Dayflow HRMS API is operational'
  );
});

// Mount Versioned Routes
app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/profile', profileRoutes);
app.use('/api/v1/attendance', attendanceRoutes);
app.use('/api/v1/leave', leaveRoutes);
app.use('/api/v1/payroll', payrollRoutes);
app.use('/api/v1/employees', employeesRoutes);
app.use('/api/v1/notifications', notificationsRoutes);
app.use('/api/v1/reports', reportsRoutes);

// Catch-All 404 Route
app.use((req: Request, res: Response) => {
  return sendError(
    res,
    404,
    ErrorCodes.NOT_FOUND,
    `Route ${req.method} ${req.originalUrl} not found`
  );
});

// Central Error Handler
app.use(errorHandler);

export default app;
