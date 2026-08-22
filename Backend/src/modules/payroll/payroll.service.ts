import { supabaseAdmin } from '../../config/supabase';
import { AppError } from '../../utils/response';
import { ErrorCodes } from '../../constants/errorCodes';
import { SalaryInfo } from '../../types';

export class PayrollService {
  /**
   * 1. GET /api/v1/payroll/me
   * Read-only breakdown of wages, deductions, allowances, PF, and payslips
   */
  async getMyPayroll(userId: string) {
    const { data: profile, error: profileErr } = await supabaseAdmin
      .from('profiles')
      .select('salary_info, name, bank_details')
      .eq('user_id', userId)
      .single();

    if (profileErr || !profile) {
      throw new AppError(404, ErrorCodes.NOT_FOUND, 'Employee profile not found');
    }

    const { data: payslips } = await supabaseAdmin
      .from('payslips')
      .select('*')
      .eq('user_id', userId)
      .order('year', { ascending: false });

    return {
      salaryInfo: profile.salary_info || null,
      bankDetails: profile.bank_details || null,
      payslips: payslips || [],
    };
  }

  /**
   * 2. GET /api/v1/payroll (Admin)
   * Overview across all employees
   */
  async getAllPayroll() {
    const { data, error } = await supabaseAdmin
      .from('profiles')
      .select('user_id, name, company, department, job_title, salary_info, bank_details, users!inner(login_id, email, role)');

    if (error) {
      console.error('[Get All Payroll Error]:', error);
      throw new AppError(500, ErrorCodes.DATABASE_ERROR, 'Failed to fetch payroll overview');
    }

    return (data || []).map((p: any) => ({
      userId: p.user_id,
      name: p.name,
      email: p.users?.email,
      loginId: p.users?.login_id,
      role: p.users?.role,
      company: p.company,
      department: p.department,
      jobTitle: p.job_title,
      salaryInfo: p.salary_info,
      bankDetails: p.bank_details,
    }));
  }

  /**
   * 3. PATCH /api/v1/payroll/:userId (Admin)
   * Update salary structure with audit logging
   */
  async updateSalaryStructure(userId: string, adminUserId: string, data: SalaryInfo) {
    const { data: profile, error: profileErr } = await supabaseAdmin
      .from('profiles')
      .select('*')
      .eq('user_id', userId)
      .single();

    if (profileErr || !profile) {
      throw new AppError(404, ErrorCodes.NOT_FOUND, 'Employee not found');
    }

    const updatedSalaryInfo: SalaryInfo = {
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
      noOfWorkingDaysPerWeek: data.noOfWorkingDaysPerWeek || 5,
    };

    // 1. Update Profile salary_info
    const { error: updateProfErr } = await supabaseAdmin
      .from('profiles')
      .update({
        salary_info: updatedSalaryInfo,
        updated_at: new Date().toISOString(),
      })
      .eq('user_id', userId);

    if (updateProfErr) {
      throw new AppError(500, ErrorCodes.DATABASE_ERROR, 'Failed to update salary info in profile');
    }

    // 2. Audit Trail in salary_structures table
    await supabaseAdmin.from('salary_structures').upsert(
      {
        user_id: userId,
        month_wage: data.monthWage,
        yearly_wage: data.yearlyWage || data.monthWage * 12,
        basic_salary: data.basicSalary,
        house_rent_allowance: data.houseRentAllowance,
        standard_allowance: data.standardAllowance,
        performance_bonus: data.performanceBonus,
        leave_travel_allowance: data.leaveTravelAllowance,
        fixed_allowance: data.fixedAllowance,
        pf_employee: data.pfContributionEmployee,
        pf_employer: data.pfContributionEmployer,
        pf_contribution_employee: data.pfContributionEmployee,
        pf_contribution_employer: data.pfContributionEmployer,
        professional_tax: data.professionalTax,
        no_of_working_days_per_week: data.noOfWorkingDaysPerWeek || 5,
        updated_by: adminUserId,
        effective_from: new Date().toISOString().split('T')[0],
        updated_at: new Date().toISOString(),
      },
      { onConflict: 'user_id' }
    );

    // 3. In-App Notification to Employee
    await supabaseAdmin.from('notifications').insert({
      user_id: userId,
      title: 'Salary Structure Updated',
      message: `Your monthly wage has been updated to ₹${data.monthWage.toLocaleString()} by HR administration.`,
      type: 'info',
      read: false,
    });

    return updatedSalaryInfo;
  }
}
