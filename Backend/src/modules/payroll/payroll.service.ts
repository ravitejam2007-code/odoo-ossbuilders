import { supabaseAdmin } from '../../config/supabase';
import { AppError } from '../../utils/response';
import { ErrorCodes } from '../../constants/errorCodes';
import { SalaryInfo } from '../../types';

export class PayrollService {
  /**
   * Get employee's own payroll & payslip history
   */
  async getMyPayroll(userId: string) {
    const { data: profile } = await supabaseAdmin
      .from('profiles')
      .select('salary_info, name, bank_details')
      .eq('user_id', userId)
      .single();

    const { data: payslips } = await supabaseAdmin
      .from('payslips')
      .select('*')
      .eq('user_id', userId)
      .order('year', { ascending: false });

    return {
      salaryInfo: profile?.salary_info || null,
      bankDetails: profile?.bank_details || null,
      payslips: payslips || [],
    };
  }

  /**
   * Admin: List all payroll structures
   */
  async getAllPayroll() {
    const { data, error } = await supabaseAdmin
      .from('profiles')
      .select('user_id, name, company, department, job_title, salary_info, bank_details, users!inner(login_id, email, role)');

    if (error) {
      throw new AppError(500, ErrorCodes.DATABASE_ERROR, 'Failed to fetch payroll overview');
    }

    return data;
  }

  /**
   * Admin: Update Employee Salary Structure
   */
  async updateSalaryStructure(userId: string, _adminUserId: string, data: SalaryInfo) {
    const { data: profile, error: profileErr } = await supabaseAdmin
      .from('profiles')
      .select('*')
      .eq('user_id', userId)
      .single();

    if (profileErr || !profile) {
      throw new AppError(404, ErrorCodes.NOT_FOUND, 'Employee not found');
    }

    const updatedSalaryInfo = {
      monthWage: data.monthWage,
      yearlyWage: data.yearlyWage || data.monthWage * 12,
      basicSalary: data.basicSalary,
      houseRentAllowance: data.houseRentAllowance,
      standardAllowance: data.standardAllowance,
      performanceBonus: data.performanceBonus,
      leaveTravelAllowance: data.leaveTravelAllowance,
      fixedAllowance: data.fixedAllowance,
      pfContributionEmployee: data.pfContributionEmployee,
      pfContributionEmployer: data.pfContributionEmployer,
      professionalTax: data.professionalTax,
      noOfWorkingDaysPerWeek: data.noOfWorkingDaysPerWeek,
    };

    const { data: updated, error } = await supabaseAdmin
      .from('profiles')
      .update({
        salary_info: updatedSalaryInfo,
        updated_at: new Date().toISOString(),
      })
      .eq('user_id', userId)
      .select()
      .single();

    if (error) {
      throw new AppError(500, ErrorCodes.DATABASE_ERROR, 'Failed to update salary info');
    }

    // In-app notification to employee
    await supabaseAdmin.from('notifications').insert({
      user_id: userId,
      title: 'Salary Structure Updated',
      message: `Your monthly wage has been updated to ₹${data.monthWage.toLocaleString()} by HR administration.`,
      type: 'info',
      read: false,
    });

    return updated.salary_info;
  }
}
