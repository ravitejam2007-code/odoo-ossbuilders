import { Request, Response, NextFunction } from 'express';
import { PayrollService } from './payroll.service';
import { sendSuccess } from '../../utils/response';

const payrollService = new PayrollService();

export class PayrollController {
  async getMyPayroll(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = req.user!.id;
      const result = await payrollService.getMyPayroll(userId);
      return sendSuccess(res, result, 200);
    } catch (error) {
      next(error);
    }
  }

  async getAllPayroll(_req: Request, res: Response, next: NextFunction) {
    try {
      const result = await payrollService.getAllPayroll();
      return sendSuccess(res, result, 200);
    } catch (error) {
      next(error);
    }
  }

  async updateSalary(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = req.params.userId as string;
      const adminUserId = req.user!.id;
      const updated = await payrollService.updateSalaryStructure(userId, adminUserId, req.body);
      return sendSuccess(res, updated, 200, 'Salary structure updated successfully');
    } catch (error) {
      next(error);
    }
  }
}
