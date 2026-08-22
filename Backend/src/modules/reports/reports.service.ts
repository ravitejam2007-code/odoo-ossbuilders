import { supabaseAdmin } from '../../config/supabase';
import { AppError } from '../../utils/response';
import { ErrorCodes } from '../../constants/errorCodes';

export class ReportsService {
  /**
   * Summary overview for Admin analytics dashboard
   */
  async getDashboardSummary() {
    const { count: totalEmployees } = await supabaseAdmin
      .from('users')
      .select('*', { count: 'exact', head: true })
      .eq('role', 'employee');

    const { count: pendingLeaves } = await supabaseAdmin
      .from('leave_requests')
      .select('*', { count: 'exact', head: true })
      .eq('status', 'pending');

    const todayStr = new Date().toISOString().split('T')[0];
    const { count: presentToday } = await supabaseAdmin
      .from('attendance')
      .select('*', { count: 'exact', head: true })
      .eq('date', todayStr)
      .eq('status', 'present');

    const { count: onLeaveToday } = await supabaseAdmin
      .from('attendance')
      .select('*', { count: 'exact', head: true })
      .eq('date', todayStr)
      .eq('status', 'on_leave');

    return {
      totalEmployees: totalEmployees || 0,
      presentToday: presentToday || 0,
      onLeaveToday: onLeaveToday || 0,
      pendingLeaveApprovals: pendingLeaves || 0,
      systemStatus: 'Operational',
    };
  }

  /**
   * 1. GET /api/v1/reports/attendance-summary (Admin)
   */
  async getAttendanceSummary(month?: string) {
    let query = supabaseAdmin
      .from('attendance')
      .select('*, users!attendance_user_id_fkey(login_id, email, profiles!profiles_user_id_fkey(name, department, company))');

    if (month) {
      query = query.gte('date', `${month}-01`).lte('date', `${month}-31`);
    }

    const { data, error } = await query;
    if (error) {
      throw new AppError(500, ErrorCodes.DATABASE_ERROR, 'Failed to generate attendance summary');
    }

    let countPresent = 0;
    let countHalfDay = 0;
    let countLeave = 0;

    for (const r of data || []) {
      if (r.status === 'present') countPresent++;
      else if (r.status === 'half_day') countHalfDay++;
      else if (r.status === 'on_leave') countLeave++;
    }

    return {
      month: month || new Date().toLocaleString('default', { month: 'long', year: 'numeric' }),
      totalLogs: data?.length || 0,
      countPresent,
      countHalfDay,
      countLeave,
      records: data || [],
    };
  }

  /**
   * 2. GET /api/v1/reports/payroll-summary (Admin)
   */
  async getPayrollSummary() {
    const { data: profiles, error } = await supabaseAdmin
      .from('profiles')
      .select('department, salary_info');

    if (error) {
      throw new AppError(500, ErrorCodes.DATABASE_ERROR, 'Failed to generate payroll summary');
    }

    let totalMonthlyWage = 0;
    let totalYearlyWage = 0;
    let totalBasicSalary = 0;
    let totalPF = 0;
    const departmentBreakdown: Record<string, { count: number; totalMonthWage: number }> = {};

    for (const p of profiles || []) {
      const s = p.salary_info || {};
      const mW = Number(s.monthWage || 0);
      const yW = Number(s.yearlyWage || mW * 12);
      const bS = Number(s.basicSalary || 0);
      const pf = Number(s.pfContributionEmployee || 0) + Number(s.pfContributionEmployer || 0);

      totalMonthlyWage += mW;
      totalYearlyWage += yW;
      totalBasicSalary += bS;
      totalPF += pf;

      const dept = p.department || 'General';
      if (!departmentBreakdown[dept]) {
        departmentBreakdown[dept] = { count: 0, totalMonthWage: 0 };
      }
      departmentBreakdown[dept].count += 1;
      departmentBreakdown[dept].totalMonthWage += mW;
    }

    const employeeCount = profiles?.length || 1;
    const averageMonthlyWage = Math.round(totalMonthlyWage / employeeCount);

    return {
      employeeCount: profiles?.length || 0,
      totalMonthlyWage,
      totalYearlyWage,
      totalBasicSalary,
      totalPF,
      averageMonthlyWage,
      departmentBreakdown,
    };
  }
}
