import { Router } from 'express';
import { NotificationsController } from './notifications.controller';
import { requireAuth } from '../../middleware/auth';

const router = Router();
const notificationsController = new NotificationsController();

router.get('/me', requireAuth, notificationsController.getMyNotifications);
router.patch('/:id/read', requireAuth, notificationsController.markAsRead);
router.patch('/read-all', requireAuth, notificationsController.markAllAsRead);

export default router;
