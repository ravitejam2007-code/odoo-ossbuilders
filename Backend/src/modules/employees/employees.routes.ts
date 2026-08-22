import { Router } from 'express';
import { EmployeesController } from './employees.controller';
import { requireAuth, requireRole } from '../../middleware/auth';
import { validateRequest } from '../../middleware/validate';
import { ListEmployeesSchema, UpdateEmployeeAdminSchema } from './employees.schema';

const router = Router();
const employeesController = new EmployeesController();

// Admin Employee Directory Routes
router.get(
  '/',
  requireAuth,
  requireRole('admin', 'hr_officer'),
  validateRequest(ListEmployeesSchema),
  employeesController.listEmployees
);

router.get('/:id', requireAuth, requireRole('admin', 'hr_officer'), employeesController.getEmployeeById);

router.patch(
  '/:id',
  requireAuth,
  requireRole('admin', 'hr_officer'),
  validateRequest(UpdateEmployeeAdminSchema),
  employeesController.updateEmployee
);

export default router;
