import { Request, Response, NextFunction } from 'express';
import { AttendanceService } from './attendance.service';
import { sendSuccess } from '../../utils/response';

const attendanceService = new AttendanceService();

export class AttendanceController {
  async checkIn(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = req.user!.id;
      const result = await attendanceService.checkIn(userId);
      return sendSuccess(res, result.record, 200, result.message);
    } catch (error) {
      next(error);
    }
  }

  async checkOut(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = req.user!.id;
      const result = await attendanceService.checkOut(userId);
      return sendSuccess(res, result.record, 200, result.message);
    } catch (error) {
      next(error);
    }
  }

  async getMyAttendance(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = req.user!.id;
      const { month } = req.query;
      const result = await attendanceService.getMyAttendance(userId, month as string);
      return sendSuccess(res, result, 200);
    } catch (error) {
      next(error);
    }
  }

  async getAllAttendance(req: Request, res: Response, next: NextFunction) {
    try {
      const { date, month, department } = req.query;
      const result = await attendanceService.getAllAttendance({
        date: date as string,
        month: month as string,
        department: department as string,
      });
      return sendSuccess(res, result, 200);
    } catch (error) {
      next(error);
    }
  }

  async getEmployeeAttendanceById(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = req.params.userId as string;
      const { month } = req.query;
      const result = await attendanceService.getEmployeeAttendanceById(userId, month as string);
      return sendSuccess(res, result, 200);
    } catch (error) {
      next(error);
    }
  }
}
