import { supabaseAdmin } from '../../config/supabase';
import { AppError } from '../../utils/response';
import { ErrorCodes } from '../../constants/errorCodes';

export class EmployeesService {
  /**
   * 1. GET /api/v1/employees (Admin)
   * List all employees with search, department/role filtering, and pagination
   */
  async listEmployees(filters: { search?: string; department?: string; role?: string; page?: number; limit?: number }) {
    let query = supabaseAdmin
      .from('profiles')
      .select('*, users!inner(id, login_id, email, role, email_verified)', { count: 'exact' });

    if (filters.department) {
      query = query.eq('department', filters.department);
    }

    if (filters.role) {
      query = query.eq('users.role', filters.role);
    }

    if (filters.search) {
      const s = `%${filters.search}%`;
      query = query.or(`name.ilike.${s},company.ilike.${s},job_title.ilike.${s}`);
    }

    const page = filters.page || 1;
    const limit = filters.limit || 50;
    const from = (page - 1) * limit;
    const to = from + limit - 1;

    const { data, error, count } = await query.range(from, to).order('joined_year', { ascending: false });

    if (error) {
      console.error('[List Employees Error]:', error);
      throw new AppError(500, ErrorCodes.DATABASE_ERROR, 'Failed to fetch employee list');
    }

    const employees = (data || []).map((p: any) => ({
      id: p.user_id,
      loginId: p.users?.login_id,
      name: p.name,
      email: p.users?.email,
      phone: p.phone,
      company: p.company,
      department: p.department,
      jobTitle: p.job_title,
      manager: p.manager,
      avatar: p.avatar,
      role: p.users?.role,
      workStatus: p.work_status,
      joinedYear: p.joined_year,
      serialNo: p.serial_no,
      about: p.about,
      skills: p.skills,
      bankDetails: p.bank_details,
      salaryInfo: p.salary_info,
    }));

    return { employees, totalCount: count || employees.length, page, limit };
  }

  /**
   * 2. GET /api/v1/employees/:id (Admin)
   * Get single employee comprehensive detail (profile, recent attendance, leave summary)
   */
  async getEmployeeById(userId: string) {
    const { data: profile, error } = await supabaseAdmin
      .from('profiles')
      .select('*, users!inner(id, login_id, email, role, email_verified)')
      .eq('user_id', userId)
      .single();

    if (error || !profile) {
      throw new AppError(404, ErrorCodes.NOT_FOUND, 'Employee not found');
    }

    // Get attendance & leave records
    const { data: attendance } = await supabaseAdmin
      .from('attendance')
      .select('*')
      .eq('user_id', userId)
      .order('date', { ascending: false })
      .limit(30);

    const { data: leaveRequests } = await supabaseAdmin
      .from('leave_requests')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    const { data: leaveBalance } = await supabaseAdmin
      .from('leave_balances')
      .select('*')
      .eq('user_id', userId)
      .single();

    return {
      employee: {
        id: profile.user_id,
        loginId: profile.users?.login_id,
        name: profile.name,
        email: profile.users?.email,
        phone: profile.phone,
        company: profile.company,
        department: profile.department,
        jobTitle: profile.job_title,
        manager: profile.manager,
        avatar: profile.avatar,
        role: profile.users?.role,
        workStatus: profile.work_status,
        joinedYear: profile.joined_year,
        serialNo: profile.serial_no,
        about: profile.about,
        whatILoveAboutJob: profile.what_i_love_about_job,
        skills: profile.skills,
        certifications: profile.certifications,
        interests: profile.interests,
        dob: profile.dob,
        residingAddress: profile.residing_address,
        nationality: profile.nationality,
        gender: profile.gender,
        maritalStatus: profile.marital_status,
        bankDetails: profile.bank_details,
        salaryInfo: profile.salary_info,
      },
      attendance: attendance || [],
      leaveRequests: leaveRequests || [],
      leaveBalance: leaveBalance || { paid_days_available: 24, sick_days_available: 7, unpaid_days_taken: 0 },
    };
  }

  /**
   * 3. PATCH /api/v1/employees/:id (Admin)
   * Full edit including job title, department, role, salary info, work status, etc.
   */
  async updateEmployee(userId: string, data: any) {
    const profileData: any = { updated_at: new Date().toISOString() };
    const userData: any = { updated_at: new Date().toISOString() };

    if (data.name !== undefined) profileData.name = data.name;
    if (data.phone !== undefined) profileData.phone = data.phone;
    if (data.company !== undefined) profileData.company = data.company;
    if (data.department !== undefined) profileData.department = data.department;
    if (data.jobTitle !== undefined) profileData.job_title = data.jobTitle;
    if (data.manager !== undefined) profileData.manager = data.manager;
    if (data.avatar !== undefined) profileData.avatar = data.avatar;
    if (data.workStatus !== undefined) profileData.work_status = data.workStatus;
    if (data.joinedYear !== undefined) profileData.joined_year = data.joinedYear;
    if (data.about !== undefined) profileData.about = data.about;
    if (data.whatILoveAboutJob !== undefined) profileData.what_i_love_about_job = data.whatILoveAboutJob;
    if (data.skills !== undefined) profileData.skills = data.skills;
    if (data.certifications !== undefined) profileData.certifications = data.certifications;
    if (data.interests !== undefined) profileData.interests = data.interests;
    if (data.dob !== undefined) profileData.dob = data.dob;
    if (data.residingAddress !== undefined) profileData.residing_address = data.residingAddress;
    if (data.nationality !== undefined) profileData.nationality = data.nationality;
    if (data.gender !== undefined) profileData.gender = data.gender;
    if (data.maritalStatus !== undefined) profileData.marital_status = data.maritalStatus;
    if (data.bankDetails !== undefined) profileData.bank_details = data.bankDetails;
    if (data.salaryInfo !== undefined) profileData.salary_info = data.salaryInfo;

    if (data.role !== undefined) userData.role = data.role;
    if (data.email !== undefined) userData.email = data.email.toLowerCase().trim();

    if (Object.keys(userData).length > 1) {
      await supabaseAdmin.from('users').update(userData).eq('id', userId);
    }

    const { error: updateError } = await supabaseAdmin
      .from('profiles')
      .update(profileData)
      .eq('user_id', userId);

    if (updateError) {
      console.error('[Admin Employee Update Error]:', updateError);
      throw new AppError(500, ErrorCodes.DATABASE_ERROR, 'Failed to update employee details');
    }

    return this.getEmployeeById(userId);
  }
}
