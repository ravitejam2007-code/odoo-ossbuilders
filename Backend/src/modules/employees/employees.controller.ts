import { Request, Response, NextFunction } from 'express';
import { EmployeesService } from './employees.service';
import { sendSuccess } from '../../utils/response';

const employeesService = new EmployeesService();

export class EmployeesController {
  async listEmployees(req: Request, res: Response, next: NextFunction) {
    try {
      const { search, department, role, page, limit } = req.query;
      const result = await employeesService.listEmployees({
        search: search as string,
        department: department as string,
        role: role as string,
        page: page ? parseInt(page as string, 10) : 1,
        limit: limit ? parseInt(limit as string, 10) : 50,
      });
      return sendSuccess(res, result, 200);
    } catch (error) {
      next(error);
    }
  }

  async getEmployeeById(req: Request, res: Response, next: NextFunction) {
    try {
      const id = req.params.id as string;
      const result = await employeesService.getEmployeeById(id);
      return sendSuccess(res, result, 200);
    } catch (error) {
      next(error);
    }
  }

  async updateEmployee(req: Request, res: Response, next: NextFunction) {
    try {
      const id = req.params.id as string;
      const result = await employeesService.updateEmployee(id, req.body);
      return sendSuccess(res, result, 200, 'Employee updated successfully');
    } catch (error) {
      next(error);
    }
  }
}
