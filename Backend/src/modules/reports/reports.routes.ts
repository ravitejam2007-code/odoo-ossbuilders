import { Router } from 'express';
import { ReportsController } from './reports.controller';
import { requireAuth, requireRole } from '../../middleware/auth';

const router = Router();
const reportsController = new ReportsController();

router.get('/dashboard', requireAuth, requireRole('admin', 'hr_officer'), reportsController.getDashboardSummary);
router.get('/attendance-summary', requireAuth, requireRole('admin', 'hr_officer'), reportsController.getAttendanceSummary);
router.get('/payroll-summary', requireAuth, requireRole('admin', 'hr_officer'), reportsController.getPayrollSummary);

export default router;
