import { Request, Response, NextFunction } from 'express';
import { NotificationsService } from './notifications.service';
import { sendSuccess } from '../../utils/response';

const notificationsService = new NotificationsService();

export class NotificationsController {
  async getMyNotifications(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = req.user!.id;
      const notifications = await notificationsService.getMyNotifications(userId);
      return sendSuccess(res, notifications, 200);
    } catch (error) {
      next(error);
    }
  }

  async markAsRead(req: Request, res: Response, next: NextFunction) {
    try {
      const id = req.params.id as string;
      const userId = req.user!.id;
      const result = await notificationsService.markAsRead(id, userId);
      return sendSuccess(res, result, 200);
    } catch (error) {
      next(error);
    }
  }

  async markAllAsRead(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = req.user!.id;
      const result = await notificationsService.markAllAsRead(userId);
      return sendSuccess(res, result, 200);
    } catch (error) {
      next(error);
    }
  }
}
