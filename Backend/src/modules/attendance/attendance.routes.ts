import { Router } from 'express';
import { AttendanceController } from './attendance.controller';
import { requireAuth, requireRole } from '../../middleware/auth';
import { validateRequest } from '../../middleware/validate';
import { CheckInSchema, CheckOutSchema, QueryAttendanceSchema } from './attendance.schema';

const router = Router();
const attendanceController = new AttendanceController();

// 1. Employee Attendance Routes
router.post('/check-in', requireAuth, validateRequest(CheckInSchema), attendanceController.checkIn);
router.post('/check-out', requireAuth, validateRequest(CheckOutSchema), attendanceController.checkOut);
router.get('/me', requireAuth, attendanceController.getMyAttendance);

// 2. Admin Attendance Routes
router.get(
  '/',
  requireAuth,
  requireRole('admin', 'hr_officer'),
  validateRequest(QueryAttendanceSchema),
  attendanceController.getAllAttendance
);

router.get(
  '/:userId',
  requireAuth,
  requireRole('admin', 'hr_officer'),
  attendanceController.getEmployeeAttendanceById
);

export default router;
