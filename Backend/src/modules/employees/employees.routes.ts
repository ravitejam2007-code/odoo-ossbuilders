import { Router } from 'express';
import { EmployeesController } from './employees.controller';
import { requireAuth, requireRole } from '../../middleware/auth';
import { validateRequest } from '../../middleware/validate';
import { ListEmployeesSchema } from './employees.schema';

const router = Router();
const employeesController = new EmployeesController();

// Admin only employee directory routes
router.get(
  '/',
  requireAuth,
  requireRole('admin', 'hr_officer'),
  validateRequest(ListEmployeesSchema),
  employeesController.listEmployees
);

router.get('/:id', requireAuth, requireRole('admin', 'hr_officer'), employeesController.getEmployeeById);

export default router;
