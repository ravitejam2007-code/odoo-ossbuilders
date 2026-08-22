import { supabaseAdmin } from '../../config/supabase';
import { AppError } from '../../utils/response';
import { ErrorCodes } from '../../constants/errorCodes';
import { AttendanceRecord, AttendanceSummary, WorkStatus } from '../../types';

export class AttendanceService {
  private getTodayDateInfo(): { dateStr: string; dayOfWeek: string; time12: string; time24: string } {
    const now = new Date();
    const dateStr = now.toISOString().split('T')[0];
    const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    const dayOfWeek = days[now.getDay()];

    const time12 = now.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true,
    });

    const hours24 = String(now.getHours()).padStart(2, '0');
    const minutes24 = String(now.getMinutes()).padStart(2, '0');
    const seconds24 = String(now.getSeconds()).padStart(2, '0');
    const time24 = `${hours24}:${minutes24}:${seconds24}`;

    return { dateStr, dayOfWeek, time12, time24 };
  }

  /**
   * Helper to calculate accurate work and extra hours
   */
  public calculateWorkHours(checkInStr: string, checkOutStr: string): { workHours: string; extraHours: string } {
    try {
      const parseMinutes = (str: string): number => {
        const parts = str.trim().split(' ');
        const [hStr, mStr] = parts[0].split(':');
        let hours = parseInt(hStr, 10);
        const minutes = parseInt(mStr || '0', 10);
        const modifier = parts[1]?.toUpperCase();

        if (modifier === 'PM' && hours < 12) hours += 12;
        if (modifier === 'AM' && hours === 12) hours = 0;
        return hours * 60 + minutes;
      };

      const inMins = parseMinutes(checkInStr);
      const outMins = parseMinutes(checkOutStr);
      let diff = outMins - inMins;
      if (diff < 0) diff += 24 * 60; // Handle midnight crossover

      const workH = Math.floor(diff / 60);
      const workM = diff % 60;
      const workHours = `${workH}h ${String(workM).padStart(2, '0')}m`;

      const standardMinutes = 8 * 60; // 8 hours standard
      const extraMins = Math.max(0, diff - standardMinutes);
      const extraH = Math.floor(extraMins / 60);
      const extraM = extraMins % 60;
      const extraHours = `${extraH}h ${String(extraM).padStart(2, '0')}m`;

      return { workHours, extraHours };
    } catch {
      return { workHours: '8h 00m', extraHours: '0h 00m' };
    }
  }

  /**
   * 1. POST /api/v1/attendance/check-in
   * Sets check_in_time = now(), status = present
   */
  async checkIn(userId: string): Promise<{ record: AttendanceRecord; message: string }> {
    const { dateStr, dayOfWeek, time12, time24 } = this.getTodayDateInfo();

    // Check if user already has a record today
    const { data: existing } = await supabaseAdmin
      .from('attendance')
      .select('*')
      .eq('user_id', userId)
      .eq('date', dateStr)
      .single();

    let record: any;
    if (existing) {
      // If already checked in and hasn't checked out yet, return existing record
      if (existing.check_in && !existing.check_out) {
        await supabaseAdmin
          .from('profiles')
          .update({ work_status: 'present', updated_at: new Date().toISOString() })
          .eq('user_id', userId);

        return {
          record: {
            id: existing.id,
            userId: existing.user_id,
            date: existing.date,
            dayOfWeek: existing.day_of_week,
            checkIn: existing.check_in,
            checkOut: existing.check_out,
            workHours: existing.work_hours || '0h 0m',
            extraHours: existing.extra_hours || '0h 0m',
            status: 'present',
          },
          message: `Already active session from ${existing.check_in}`,
        };
      }

      // If re-checking in after checking out, start new/updated session
      const { data, error } = await supabaseAdmin
        .from('attendance')
        .update({
          check_in: time12,
          check_in_time: time24,
          check_out: null,
          check_out_time: null,
          status: 'present',
          updated_at: new Date().toISOString(),
        })
        .eq('id', existing.id)
        .select()
        .single();

      if (error) throw new AppError(500, ErrorCodes.DATABASE_ERROR, 'Failed to record check-in');
      record = data;
    } else {
      const { data, error } = await supabaseAdmin
        .from('attendance')
        .insert({
          user_id: userId,
          date: dateStr,
          day_of_week: dayOfWeek,
          check_in: time12,
          check_in_time: time24,
          status: 'present',
        })
        .select()
        .single();

      if (error) throw new AppError(500, ErrorCodes.DATABASE_ERROR, 'Failed to record check-in');
      record = data;
    }

    // Update profile work_status = present
    await supabaseAdmin
      .from('profiles')
      .update({ work_status: 'present', updated_at: new Date().toISOString() })
      .eq('user_id', userId);

    return {
      record: {
        id: record.id,
        userId: record.user_id,
        date: record.date,
        dayOfWeek: record.day_of_week,
        checkIn: record.check_in,
        checkOut: record.check_out,
        workHours: record.work_hours || '0h 0m',
        extraHours: record.extra_hours || '0h 0m',
        status: record.status,
      },
      message: `Checked in successfully at ${time12}`,
    };
  }

  /**
   * 2. POST /api/v1/attendance/check-out
   * Sets check_out_time = now(), computes work_hours & extra_hours
   */
  async checkOut(userId: string): Promise<{ record: AttendanceRecord; message: string }> {
    const { dateStr, dayOfWeek, time12, time24 } = this.getTodayDateInfo();

    const { data: existing } = await supabaseAdmin
      .from('attendance')
      .select('*')
      .eq('user_id', userId)
      .eq('date', dateStr)
      .single();

    const checkInVal = existing?.check_in || '09:00 AM';
    const { workHours, extraHours } = this.calculateWorkHours(checkInVal, time12);

    let updated: any;
    if (existing) {
      const { data, error: updateErr } = await supabaseAdmin
        .from('attendance')
        .update({
          check_in: checkInVal,
          check_out: time12,
          check_out_time: time24,
          work_hours: workHours,
          extra_hours: extraHours,
          status: 'present',
          updated_at: new Date().toISOString(),
        })
        .eq('id', existing.id)
        .select()
        .single();

      if (updateErr) {
        throw new AppError(500, ErrorCodes.DATABASE_ERROR, 'Failed to record check-out');
      }
      updated = data;
    } else {
      const { data, error: insertErr } = await supabaseAdmin
        .from('attendance')
        .insert({
          user_id: userId,
          date: dateStr,
          day_of_week: dayOfWeek,
          check_in: checkInVal,
          check_in_time: '09:00:00',
          check_out: time12,
          check_out_time: time24,
          work_hours: workHours,
          extra_hours: extraHours,
          status: 'present',
        })
        .select()
        .single();

      if (insertErr) {
        throw new AppError(500, ErrorCodes.DATABASE_ERROR, 'Failed to record check-out');
      }
      updated = data;
    }

    // Update profile work_status = absent
    await supabaseAdmin
      .from('profiles')
      .update({ work_status: 'absent', updated_at: new Date().toISOString() })
      .eq('user_id', userId);

    return {
      record: {
        id: updated.id,
        userId: updated.user_id,
        date: updated.date,
        dayOfWeek: updated.day_of_week,
        checkIn: updated.check_in,
        checkOut: updated.check_out,
        workHours: updated.work_hours,
        extraHours: updated.extra_hours,
        status: updated.status,
      },
      message: `Checked out successfully at ${time12} (Work time: ${workHours})`,
    };
  }

  /**
   * 3. GET /api/v1/attendance/me
   * Returns monthly/weekly records and summary (countPresent, countHalfDay, countLeave, totalWorkHours)
   */
  async getMyAttendance(userId: string, month?: string): Promise<{ records: AttendanceRecord[]; summary: AttendanceSummary }> {
    let query = supabaseAdmin
      .from('attendance')
      .select('*')
      .eq('user_id', userId)
      .order('date', { ascending: false });

    if (month) {
      // Filter by YYYY-MM prefix e.g. "2026-08"
      query = query.gte('date', `${month}-01`).lte('date', `${month}-31`);
    }

    const { data: records, error } = await query;

    if (error) {
      throw new AppError(500, ErrorCodes.DATABASE_ERROR, 'Failed to retrieve attendance logs');
    }

    const { data: profile } = await supabaseAdmin
      .from('profiles')
      .select('work_status')
      .eq('user_id', userId)
      .single();

    const { dateStr } = this.getTodayDateInfo();
    const todayRecord = records?.find((r) => r.date === dateStr);

    let countPresent = 0;
    let countHalfDay = 0;
    let countLeave = 0;
    let totalMinutes = 0;

    const formattedRecords: AttendanceRecord[] = (records || []).map((r) => {
      if (r.status === 'present') {
        countPresent++;
        totalMinutes += 8 * 60; // standard 8h base
      } else if (r.status === 'half_day') {
        countHalfDay++;
        totalMinutes += 4 * 60;
      } else if (r.status === 'on_leave') {
        countLeave++;
      }

      return {
        id: r.id,
        userId: r.user_id,
        date: r.date,
        dayOfWeek: r.day_of_week,
        checkIn: r.check_in,
        checkOut: r.check_out,
        workHours: r.work_hours || '0h 0m',
        extraHours: r.extra_hours || '0h 0m',
        status: r.status,
      };
    });

    const totalH = Math.floor(totalMinutes / 60);
    const totalM = totalMinutes % 60;

    const summary: AttendanceSummary = {
      status: (profile?.work_status as WorkStatus) || 'present',
      checkInTime: todayRecord?.check_in || null,
      countPresent,
      countHalfDay,
      countLeave,
      totalWorkHours: `${totalH}h ${String(totalM).padStart(2, '0')}m`,
    };

    return {
      records: formattedRecords,
      summary,
    };
  }

  /**
   * 4. GET /api/v1/attendance (Admin)
   * Query all employee records with date/month and department filters
   */
  async getAllAttendance(filters: { date?: string; month?: string; department?: string }) {
    let query = supabaseAdmin
      .from('attendance')
      .select('*, profiles!inner(name, company, department, avatar, job_title, user_id)')
      .order('date', { ascending: false });

    if (filters.date) {
      query = query.eq('date', filters.date);
    } else if (filters.month) {
      query = query.gte('date', `${filters.month}-01`).lte('date', `${filters.month}-31`);
    }

    if (filters.department) {
      query = query.eq('profiles.department', filters.department);
    }

    const { data, error } = await query;
    if (error) {
      console.error('[Admin Attendance Query Error]:', error);
      throw new AppError(500, ErrorCodes.DATABASE_ERROR, 'Failed to query attendance records');
    }

    return (data || []).map((r: any) => ({
      id: r.id,
      userId: r.user_id,
      employeeName: r.profiles?.name || 'Employee',
      department: r.profiles?.department || 'General',
      jobTitle: r.profiles?.job_title || 'Associate',
      avatar: r.profiles?.avatar || '',
      date: r.date,
      dayOfWeek: r.day_of_week,
      checkIn: r.check_in,
      checkOut: r.check_out,
      workHours: r.work_hours || '0h 0m',
      extraHours: r.extra_hours || '0h 0m',
      status: r.status,
    }));
  }

  /**
   * 5. GET /api/v1/attendance/:userId (Admin)
   * Specific employee history & stats
   */
  async getEmployeeAttendanceById(userId: string, month?: string) {
    return this.getMyAttendance(userId, month);
  }
}
