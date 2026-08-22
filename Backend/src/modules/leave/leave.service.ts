import { supabaseAdmin } from '../../config/supabase';
import { sendLeaveDecisionEmail } from '../../config/mailer';
import { AppError } from '../../utils/response';
import { ErrorCodes } from '../../constants/errorCodes';
import { LeaveBalance, LeaveRequest, LeaveType } from '../../types';

export class LeaveService {
  /**
   * Helper to get list of dates between start and end date
   */
  private getDatesInRange(startDate: string, endDate: string): string[] {
    const dates: string[] = [];
    const curr = new Date(startDate);
    const end = new Date(endDate);

    while (curr <= end) {
      // Exclude Sunday (0) or Saturday (6) if desired, but here we include standard work days
      const dayOfWeek = curr.getDay();
      if (dayOfWeek !== 0 && dayOfWeek !== 6) {
        dates.push(curr.toISOString().split('T')[0]);
      }
      curr.setDate(curr.getDate() + 1);
    }
    return dates;
  }

  /**
   * Get employee's leave balance
   */
  async getLeaveBalance(userId: string): Promise<LeaveBalance> {
    const { data, error } = await supabaseAdmin
      .from('leave_balances')
      .select('*')
      .eq('user_id', userId)
      .single();

    if (error || !data) {
      return {
        paidDaysAvailable: 24,
        sickDaysAvailable: 7,
        unpaidDaysTaken: 0,
      };
    }

    return {
      paidDaysAvailable: Number(data.paid_days_available),
      sickDaysAvailable: Number(data.sick_days_available),
      unpaidDaysTaken: Number(data.unpaid_days_taken),
    };
  }

  /**
   * Submit Leave Application
   */
  async applyLeave(
    userId: string,
    data: {
      leaveType: LeaveType;
      startDate: string;
      endDate: string;
      daysCount: number;
      reason?: string;
      attachmentName?: string;
      attachmentUrl?: string;
    }
  ) {
    if (new Date(data.startDate) > new Date(data.endDate)) {
      throw new AppError(400, ErrorCodes.INVALID_DATE_RANGE, 'End date cannot be earlier than start date');
    }

    // Verify balance
    const balance = await this.getLeaveBalance(userId);
    if (data.leaveType === 'Paid Time Off' && balance.paidDaysAvailable < data.daysCount) {
      throw new AppError(
        400,
        ErrorCodes.INSUFFICIENT_LEAVE_BALANCE,
        `Insufficient paid leave balance (${balance.paidDaysAvailable} days remaining, requested ${data.daysCount})`
      );
    } else if (data.leaveType === 'Sick Leave' && balance.sickDaysAvailable < data.daysCount) {
      throw new AppError(
        400,
        ErrorCodes.INSUFFICIENT_LEAVE_BALANCE,
        `Insufficient sick leave balance (${balance.sickDaysAvailable} days remaining, requested ${data.daysCount})`
      );
    }

    const { data: request, error } = await supabaseAdmin
      .from('leave_requests')
      .insert({
        user_id: userId,
        leave_type: data.leaveType,
        start_date: data.startDate,
        end_date: data.endDate,
        days_count: data.daysCount,
        reason: data.reason || '',
        attachment_name: data.attachmentName || '',
        attachment_url: data.attachmentUrl || '',
        status: 'pending',
      })
      .select()
      .single();

    if (error) {
      console.error('[Apply Leave Error]:', error);
      throw new AppError(500, ErrorCodes.DATABASE_ERROR, 'Failed to submit leave request');
    }

    return request;
  }

  /**
   * Admin Decision (Approval / Rejection) with Leave -> Attendance Sync
   */
  async reviewLeave(
    leaveId: string,
    adminUserId: string,
    decision: 'approved' | 'rejected',
    adminComment?: string
  ) {
    // 1. Fetch leave request
    const { data: leave, error: leaveErr } = await supabaseAdmin
      .from('leave_requests')
      .select('*')
      .eq('id', leaveId)
      .single();

    if (leaveErr || !leave) {
      throw new AppError(404, ErrorCodes.NOT_FOUND, 'Leave request not found');
    }

    if (leave.status !== 'pending') {
      throw new AppError(
        400,
        ErrorCodes.LEAVE_ALREADY_REVIEWED,
        `This leave request is already marked as ${leave.status}`
      );
    }

    // 2. Fetch Employee Profile & User info
    const { data: profile } = await supabaseAdmin
      .from('profiles')
      .select('name, user_id')
      .eq('user_id', leave.user_id)
      .single();

    const { data: user } = await supabaseAdmin
      .from('users')
      .select('email')
      .eq('id', leave.user_id)
      .single();

    const daysCount = Number(leave.days_count);
    const leaveType = leave.leave_type as LeaveType;

    // 3. If APPROVED: Deduct quota and sync attendance
    if (decision === 'approved') {
      const balance = await this.getLeaveBalance(leave.user_id);

      let updateBalance: any = {};
      if (leaveType === 'Paid Time Off') {
        updateBalance.paid_days_available = Math.max(0, balance.paidDaysAvailable - daysCount);
      } else if (leaveType === 'Sick Leave') {
        updateBalance.sick_days_available = Math.max(0, balance.sickDaysAvailable - daysCount);
      } else {
        updateBalance.unpaid_days_taken = balance.unpaidDaysTaken + daysCount;
      }

      await supabaseAdmin
        .from('leave_balances')
        .update(updateBalance)
        .eq('user_id', leave.user_id);

      // Populate attendance records for the dates
      const dates = this.getDatesInRange(leave.start_date, leave.end_date);
      const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

      for (const date of dates) {
        const d = new Date(date);
        const dayOfWeek = days[d.getDay()];

        await supabaseAdmin.from('attendance').upsert(
          {
            user_id: leave.user_id,
            date,
            day_of_week: dayOfWeek,
            check_in: null,
            check_out: null,
            work_hours: '0h 0m',
            extra_hours: '0h 0m',
            status: 'on_leave',
            updated_at: new Date().toISOString(),
          },
          { onConflict: 'user_id,date' }
        );
      }
    }

    // 4. Update Leave Request Status
    const { data: updatedLeave, error: updateErr } = await supabaseAdmin
      .from('leave_requests')
      .update({
        status: decision,
        reviewed_by: adminUserId,
        admin_comment: adminComment || '',
        updated_at: new Date().toISOString(),
      })
      .eq('id', leaveId)
      .select()
      .single();

    if (updateErr) {
      throw new AppError(500, ErrorCodes.DATABASE_ERROR, 'Failed to update leave request status');
    }

    // 5. In-App Notification
    await supabaseAdmin.from('notifications').insert({
      user_id: leave.user_id,
      title: `Leave Request ${decision === 'approved' ? 'Approved' : 'Rejected'}`,
      message: `Your ${leave.leave_type} request for ${leave.start_date} to ${leave.end_date} was ${decision}.${
        adminComment ? ` Remark: ${adminComment}` : ''
      }`,
      type: decision === 'approved' ? 'success' : 'alert',
      read: false,
    });

    // 6. Send Brevo Transactional Email
    if (user?.email) {
      try {
        await sendLeaveDecisionEmail(
          user.email,
          profile?.name || 'Employee',
          leave.leave_type,
          decision,
          leave.start_date,
          leave.end_date,
          adminComment
        );
      } catch (mailErr) {
        console.error('[Brevo SMTP Leave Notification Error]:', mailErr);
      }
    }

    return updatedLeave;
  }

  /**
   * Get employee's own requests
   */
  async getMyLeaveRequests(userId: string): Promise<LeaveRequest[]> {
    const { data, error } = await supabaseAdmin
      .from('leave_requests')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (error) throw new AppError(500, ErrorCodes.DATABASE_ERROR, 'Failed to load leave requests');

    return (data || []).map((r) => ({
      id: r.id,
      userId: r.user_id,
      leaveType: r.leave_type,
      startDate: r.start_date,
      endDate: r.end_date,
      daysCount: Number(r.days_count),
      status: r.status,
      attachmentName: r.attachment_name,
      attachmentUrl: r.attachment_url,
      reason: r.reason,
      reviewedBy: r.reviewed_by,
      adminComment: r.admin_comment,
      createdAt: r.created_at,
    }));
  }

  /**
   * Admin: Get all leave requests with employee details
   */
  async getAllLeaveRequests(statusFilter?: string) {
    let query = supabaseAdmin
      .from('leave_requests')
      .select('*, profiles:user_id(name, company, department, avatar, job_title)')
      .order('created_at', { ascending: false });

    if (statusFilter) {
      query = query.eq('status', statusFilter);
    }

    const { data, error } = await query;
    if (error) {
      throw new AppError(500, ErrorCodes.DATABASE_ERROR, 'Failed to retrieve leave requests');
    }

    return data;
  }
}
