import { Request, Response, NextFunction } from 'express';
import { ProfileService } from './profile.service';
import { sendSuccess } from '../../utils/response';

const profileService = new ProfileService();

export class ProfileController {
  async getMe(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = req.user!.id;
      const profile = await profileService.getProfileByUserId(userId);
      return sendSuccess(res, profile, 200);
    } catch (error) {
      next(error);
    }
  }

  async updateMe(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = req.user!.id;
      const updated = await profileService.updateOwnProfile(userId, req.body);
      return sendSuccess(res, updated, 200, 'Profile updated successfully');
    } catch (error) {
      next(error);
    }
  }

  async getProfileById(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = req.params.userId as string;
      const profile = await profileService.getProfileByUserId(userId);
      return sendSuccess(res, profile, 200);
    } catch (error) {
      next(error);
    }
  }

  async updateProfileById(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = req.params.userId as string;
      const updated = await profileService.updateAdminProfile(userId, req.body);
      return sendSuccess(res, updated, 200, 'Employee profile updated successfully');
    } catch (error) {
      next(error);
    }
  }
}
