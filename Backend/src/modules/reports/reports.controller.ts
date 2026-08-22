import { Request, Response, NextFunction } from 'express';
import { ReportsService } from './reports.service';
import { sendSuccess } from '../../utils/response';

const reportsService = new ReportsService();

export class ReportsController {
  async getDashboardSummary(_req: Request, res: Response, next: NextFunction) {
    try {
      const summary = await reportsService.getDashboardSummary();
      return sendSuccess(res, summary, 200);
    } catch (error) {
      next(error);
    }
  }

  async getAttendanceSummary(req: Request, res: Response, next: NextFunction) {
    try {
      const { month } = req.query;
      const result = await reportsService.getAttendanceSummary(month as string);
      return sendSuccess(res, result, 200);
    } catch (error) {
      next(error);
    }
  }
}
