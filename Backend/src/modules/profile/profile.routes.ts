import { Router } from 'express';
import { ProfileController } from './profile.controller';
import { requireAuth, requireRole, requireSelfOrAdmin } from '../../middleware/auth';
import { validateRequest } from '../../middleware/validate';
import { UpdateOwnProfileSchema, UpdateAdminProfileSchema } from './profile.schema';

const router = Router();
const profileController = new ProfileController();

// Employee self profile
router.get('/me', requireAuth, profileController.getMe);
router.patch('/me', requireAuth, validateRequest(UpdateOwnProfileSchema), profileController.updateMe);

// Admin view/edit employee profile
router.get('/:userId', requireAuth, requireSelfOrAdmin('userId'), profileController.getProfileById);
router.patch(
  '/:userId',
  requireAuth,
  requireRole('admin', 'hr_officer'),
  validateRequest(UpdateAdminProfileSchema),
  profileController.updateProfileById
);

export default router;
