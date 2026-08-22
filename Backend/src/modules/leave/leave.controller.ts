import { Request, Response, NextFunction } from 'express';
import { LeaveService } from './leave.service';
import { sendSuccess, sendError } from '../../utils/response';
import { ErrorCodes } from '../../constants/errorCodes';

const leaveService = new LeaveService();

export class LeaveController {
  async applyLeave(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = req.user!.id;
      const result = await leaveService.applyLeave(userId, req.body);
      return sendSuccess(res, result, 201, 'Leave application submitted successfully');
    } catch (error) {
      next(error);
    }
  }

  async uploadAttachment(req: Request, res: Response, next: NextFunction) {
    try {
      if (!req.file) {
        return sendError(res, 400, ErrorCodes.BAD_REQUEST, 'No file uploaded');
      }

      const result = await leaveService.uploadAttachment({
        originalname: req.file.originalname,
        buffer: req.file.buffer,
        mimetype: req.file.mimetype,
      });

      return sendSuccess(res, result, 200, 'Attachment uploaded successfully');
    } catch (error) {
      next(error);
    }
  }

  async getMyLeave(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = req.user!.id;
      const requests = await leaveService.getMyLeaveRequests(userId);
      const balance = await leaveService.getLeaveBalance(userId);
      return sendSuccess(res, { requests, balance }, 200);
    } catch (error) {
      next(error);
    }
  }

  async getMyBalance(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = req.user!.id;
      const balance = await leaveService.getLeaveBalance(userId);
      return sendSuccess(res, balance, 200);
    } catch (error) {
      next(error);
    }
  }

  async getAllLeaves(req: Request, res: Response, next: NextFunction) {
    try {
      const { status } = req.query;
      const leaves = await leaveService.getAllLeaveRequests(status as string);
      return sendSuccess(res, leaves, 200);
    } catch (error) {
      next(error);
    }
  }

  async reviewLeave(req: Request, res: Response, next: NextFunction) {
    try {
      const id = req.params.id as string;
      const adminUserId = req.user!.id;
      const { status, adminComment } = req.body;
      const result = await leaveService.reviewLeave(id, adminUserId, status, adminComment);
      return sendSuccess(res, result, 200, `Leave request marked as ${status}`);
    } catch (error) {
      next(error);
    }
  }
}
