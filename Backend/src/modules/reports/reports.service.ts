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
   * Attendance Monthly Report
   */
  async getAttendanceSummary(month?: string) {
    let query = supabaseAdmin
      .from('attendance')
      .select('*, profiles:user_id(name, department, company)');

    const { data, error } = await query;
    if (error) {
      throw new AppError(500, ErrorCodes.DATABASE_ERROR, 'Failed to generate attendance summary');
    }

    return {
      month: month || new Date().toLocaleString('default', { month: 'long', year: 'numeric' }),
      totalLogs: data?.length || 0,
      records: data || [],
    };
  }
}
