import { Router } from 'express';
import multer from 'multer';
import { LeaveController } from './leave.controller';
import { requireAuth, requireRole } from '../../middleware/auth';
import { validateRequest } from '../../middleware/validate';
import { ApplyLeaveSchema, ReviewLeaveSchema } from './leave.schema';

const router = Router();
const leaveController = new LeaveController();

// Configure Multer for medical attachment uploads (in memory buffer)
const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB limit
  },
});

// 1. Employee Leave Routes
router.post('/', requireAuth, validateRequest(ApplyLeaveSchema), leaveController.applyLeave);
router.post('/upload', requireAuth, upload.single('attachment'), leaveController.uploadAttachment);
router.get('/me', requireAuth, leaveController.getMyLeave);
router.get('/me/balance', requireAuth, leaveController.getMyBalance);

// 2. Admin Leave Decision & Overview Routes
router.get('/', requireAuth, requireRole('admin', 'hr_officer'), leaveController.getAllLeaves);
router.patch(
  '/:id/decision',
  requireAuth,
  requireRole('admin', 'hr_officer'),
  validateRequest(ReviewLeaveSchema),
  leaveController.reviewLeave
);

export default router;
