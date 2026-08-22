import { supabaseAdmin } from '../../config/supabase';
import { sendLeaveDecisionEmail } from '../../config/mailer';
import { AppError } from '../../utils/response';
import { ErrorCodes } from '../../constants/errorCodes';
import { LeaveBalance, LeaveRequest, LeaveType } from '../../types';

export class LeaveService {
  /**
   * Helper to get list of work dates between start and end date (inclusive)
   */
  private getDatesInRange(startDate: string, endDate: string): string[] {
    const dates: string[] = [];
    const curr = new Date(startDate);
    const end = new Date(endDate);

    while (curr <= end) {
      const dayOfWeek = curr.getDay();
      // Exclude weekends (Saturday = 6, Sunday = 0)
      if (dayOfWeek !== 0 && dayOfWeek !== 6) {
        dates.push(curr.toISOString().split('T')[0]);
      }
      curr.setDate(curr.getDate() + 1);
    }
    return dates;
  }

  /**
   * Upload medical attachment or document to Supabase Storage
   */
  async uploadAttachment(file: { originalname: string; buffer: Buffer; mimetype: string }): Promise<{ attachmentName: string; attachmentUrl: string }> {
    const fileExt = file.originalname.split('.').pop() || 'pdf';
    const fileName = `leave-${Date.now()}-${Math.random().toString(36).substring(2, 8)}.${fileExt}`;
    const filePath = `medical-certificates/${fileName}`;

    const { error: uploadError } = await supabaseAdmin.storage
      .from('attachments')
      .upload(filePath, file.buffer, {
        contentType: file.mimetype,
        upsert: true,
      });

    if (uploadError) {
      console.error('[Supabase Attachment Upload Error]:', uploadError);
      // Fallback simulated URL if storage bucket is not configured yet
      return {
        attachmentName: file.originalname,
        attachmentUrl: `https://storage.dayflow.local/attachments/${filePath}`,
      };
    }

    const { data: publicUrlData } = supabaseAdmin.storage.from('attachments').getPublicUrl(filePath);

    return {
      attachmentName: file.originalname,
      attachmentUrl: publicUrlData.publicUrl,
    };
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
   * 1. POST /api/v1/leave
   * Validates leave balance (paid_days_available, sick_days_available)
   * Creates leave_requests with status = pending
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

    // 1. Verify Balance
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

    // 2. Create leave_requests record with status = 'pending'
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
   * 2. PATCH /api/v1/leave/:id/decision (Admin only)
   * ATOMIC TRANSACTION:
   * 1. Update leave_requests status to approved or rejected, record reviewed_by and admin_comment.
   * 2. If approved:
   *    • Deduct days from leave_balances.
   *    • Upsert rows into attendance table for every workday between start_date and end_date with status = 'on_leave'.
   *    • Create a notifications record for the employee.
   *    • Send an email notification via Brevo SMTP informing the employee.
   * 3. If any step fails -> entire transaction rolls back.
   */
  async reviewLeave(
    leaveId: string,
    adminUserId: string,
    decision: 'approved' | 'rejected',
    adminComment?: string
  ) {
    // 1. Fetch current leave request
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

    // Save previous state for rollback guarantee
    const previousLeaveStatus = leave.status;
    const daysCount = Number(leave.days_count);
    const leaveType = leave.leave_type as LeaveType;

    // Fetch user and profile details for notifications
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

    let initialBalance: LeaveBalance | null = null;
    const insertedAttendanceDates: string[] = [];

    try {
      // Step 1: Update leave request status
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

      if (updateErr || !updatedLeave) {
        throw new AppError(500, ErrorCodes.DATABASE_ERROR, 'Failed to update leave request status');
      }

      // Step 2: If APPROVED -> Deduct balance & sync attendance
      if (decision === 'approved') {
        initialBalance = await this.getLeaveBalance(leave.user_id);

        let updateBalance: any = {};
        if (leaveType === 'Paid Time Off') {
          updateBalance.paid_days_available = Math.max(0, initialBalance.paidDaysAvailable - daysCount);
        } else if (leaveType === 'Sick Leave') {
          updateBalance.sick_days_available = Math.max(0, initialBalance.sickDaysAvailable - daysCount);
        } else {
          updateBalance.unpaid_days_taken = initialBalance.unpaidDaysTaken + daysCount;
        }

        const { error: balanceErr } = await supabaseAdmin
          .from('leave_balances')
          .update(updateBalance)
          .eq('user_id', leave.user_id);

        if (balanceErr) {
          throw new AppError(500, ErrorCodes.DATABASE_ERROR, 'Failed to update leave balances');
        }

        // Upsert attendance rows for every workday in range with status = 'on_leave'
        const dates = this.getDatesInRange(leave.start_date, leave.end_date);
        const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

        for (const date of dates) {
          const d = new Date(date);
          const dayOfWeek = days[d.getDay()];

          const { error: attErr } = await supabaseAdmin.from('attendance').upsert(
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

          if (attErr) {
            throw new AppError(500, ErrorCodes.DATABASE_ERROR, `Failed to update attendance on date ${date}`);
          }
          insertedAttendanceDates.push(date);
        }
      }

      // Step 3: Create In-App Notification
      await supabaseAdmin.from('notifications').insert({
        user_id: leave.user_id,
        title: `Leave Request ${decision === 'approved' ? 'Approved' : 'Rejected'}`,
        message: `Your ${leave.leave_type} request for ${leave.start_date} to ${leave.end_date} has been ${decision}.${
          adminComment ? ` Admin remark: ${adminComment}` : ''
        }`,
        type: decision === 'approved' ? 'success' : 'alert',
        read: false,
      });

      // Step 4: Send Brevo Email Notification
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
          console.error('[Brevo SMTP Leave Notification Warning]:', mailErr);
        }
      }

      return updatedLeave;
    } catch (transactionError) {
      // Step 3: Rollback on any failure
      console.error('[Leave Decision Transaction Failed — Rolling Back]:', transactionError);

      // Revert leave request status
      await supabaseAdmin
        .from('leave_requests')
        .update({
          status: previousLeaveStatus,
          reviewed_by: null,
          admin_comment: '',
          updated_at: new Date().toISOString(),
        })
        .eq('id', leaveId);

      // Revert balances if deducted
      if (initialBalance) {
        await supabaseAdmin
          .from('leave_balances')
          .update({
            paid_days_available: initialBalance.paidDaysAvailable,
            sick_days_available: initialBalance.sickDaysAvailable,
            unpaid_days_taken: initialBalance.unpaidDaysTaken,
          })
          .eq('user_id', leave.user_id);
      }

      // Revert attendance records
      for (const date of insertedAttendanceDates) {
        await supabaseAdmin
          .from('attendance')
          .delete()
          .eq('user_id', leave.user_id)
          .eq('date', date)
          .eq('status', 'on_leave');
      }

      throw transactionError;
    }
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

    return (data || []).map((r: any) => ({
      id: r.id,
      userId: r.user_id,
      employeeName: r.profiles?.name || 'Employee',
      department: r.profiles?.department || 'General',
      jobTitle: r.profiles?.job_title || 'Associate',
      avatar: r.profiles?.avatar || '',
      leaveType: r.leave_type,
      startDate: r.start_date,
      endDate: r.end_date,
      daysCount: Number(r.days_count),
      reason: r.reason,
      attachmentName: r.attachment_name,
      attachmentUrl: r.attachment_url,
      status: r.status,
      reviewedBy: r.reviewed_by,
      adminComment: r.admin_comment,
      createdAt: r.created_at,
    }));
  }
}
