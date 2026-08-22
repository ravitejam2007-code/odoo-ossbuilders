import { Router } from 'express';
import { PayrollController } from './payroll.controller';
import { requireAuth, requireRole } from '../../middleware/auth';
import { validateRequest } from '../../middleware/validate';
import { UpdateSalarySchema } from './payroll.schema';

const router = Router();
const payrollController = new PayrollController();

// Employee payroll view
router.get('/me', requireAuth, payrollController.getMyPayroll);

// Admin payroll views and updates
router.get('/', requireAuth, requireRole('admin', 'hr_officer'), payrollController.getAllPayroll);
router.patch(
  '/:userId',
  requireAuth,
  requireRole('admin', 'hr_officer'),
  validateRequest(UpdateSalarySchema),
  payrollController.updateSalary
);

export default router;
