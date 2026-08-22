import { Router } from 'express';
import { LeaveController } from './leave.controller';
import { requireAuth, requireRole } from '../../middleware/auth';
import { validateRequest } from '../../middleware/validate';
import { ApplyLeaveSchema, ReviewLeaveSchema } from './leave.schema';

const router = Router();
const leaveController = new LeaveController();

// Employee Leave Routes
router.post('/', requireAuth, validateRequest(ApplyLeaveSchema), leaveController.applyLeave);
router.get('/me', requireAuth, leaveController.getMyLeave);
router.get('/me/balance', requireAuth, leaveController.getMyBalance);

// Admin Leave Routes
router.get('/', requireAuth, requireRole('admin', 'hr_officer'), leaveController.getAllLeaves);
router.patch(
  '/:id/decision',
  requireAuth,
  requireRole('admin', 'hr_officer'),
  validateRequest(ReviewLeaveSchema),
  leaveController.reviewLeave
);

export default router;
