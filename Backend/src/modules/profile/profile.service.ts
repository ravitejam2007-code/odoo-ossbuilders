import { supabaseAdmin } from '../../config/supabase';
import { AppError } from '../../utils/response';
import { ErrorCodes } from '../../constants/errorCodes';
import { EmployeeProfile } from '../../types';

export class ProfileService {
  /**
   * Get employee profile with user account details
   */
  async getProfileByUserId(userId: string): Promise<EmployeeProfile> {
    const { data: profile, error: profileErr } = await supabaseAdmin
      .from('profiles')
      .select('*')
      .eq('user_id', userId)
      .single();

    const { data: user, error: userErr } = await supabaseAdmin
      .from('users')
      .select('login_id, email, role')
      .eq('id', userId)
      .single();

    if (profileErr || userErr || !profile || !user) {
      throw new AppError(404, ErrorCodes.NOT_FOUND, 'Employee profile not found');
    }

    return {
      id: profile.id,
      userId: profile.user_id,
      loginId: user.login_id,
      name: profile.name,
      email: user.email,
      phone: profile.phone || '',
      company: profile.company || 'Dayflow',
      department: profile.department || 'Engineering',
      jobTitle: profile.job_title || 'Associate',
      manager: profile.manager || 'N/A',
      avatar: profile.avatar || '',
      role: user.role,
      workStatus: profile.work_status,
      joinedYear: profile.joined_year || 2026,
      serialNo: profile.serial_no || '0001',
      about: profile.about,
      whatILoveAboutJob: profile.what_i_love_about_job,
      skills: profile.skills || [],
      certifications: profile.certifications || [],
      interests: profile.interests || [],
      dob: profile.dob,
      residingAddress: profile.residing_address,
      nationality: profile.nationality,
      gender: profile.gender,
      maritalStatus: profile.marital_status,
      bankDetails: profile.bank_details,
      salaryInfo: profile.salary_info,
    };
  }

  /**
   * Update own profile (Self-Service: Phone, Avatar, About, Skills, etc.)
   */
  async updateOwnProfile(userId: string, data: Partial<EmployeeProfile>) {
    const updateData: any = {
      updated_at: new Date().toISOString(),
    };

    if (data.phone !== undefined) updateData.phone = data.phone;
    if (data.avatar !== undefined) updateData.avatar = data.avatar;
    if (data.about !== undefined) updateData.about = data.about;
    if (data.whatILoveAboutJob !== undefined) updateData.what_i_love_about_job = data.whatILoveAboutJob;
    if (data.skills !== undefined) updateData.skills = data.skills;
    if (data.certifications !== undefined) updateData.certifications = data.certifications;
    if (data.interests !== undefined) updateData.interests = data.interests;
    if (data.dob !== undefined) updateData.dob = data.dob;
    if (data.residingAddress !== undefined) updateData.residing_address = data.residingAddress;
    if (data.nationality !== undefined) updateData.nationality = data.nationality;
    if (data.gender !== undefined) updateData.gender = data.gender;
    if (data.maritalStatus !== undefined) updateData.marital_status = data.maritalStatus;

    const { error } = await supabaseAdmin
      .from('profiles')
      .update(updateData)
      .eq('user_id', userId);

    if (error) {
      console.error('[Update Profile Error]:', error);
      throw new AppError(500, ErrorCodes.DATABASE_ERROR, 'Failed to update profile');
    }

    return this.getProfileByUserId(userId);
  }

  /**
   * Update full profile (Admin privileges)
   */
  async updateAdminProfile(userId: string, data: any) {
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

    if (Object.keys(userData).length > 1) {
      await supabaseAdmin.from('users').update(userData).eq('id', userId);
    }

    const { error } = await supabaseAdmin
      .from('profiles')
      .update(profileData)
      .eq('user_id', userId);

    if (error) {
      console.error('[Admin Profile Update Error]:', error);
      throw new AppError(500, ErrorCodes.DATABASE_ERROR, 'Failed to update employee details');
    }

    return this.getProfileByUserId(userId);
  }
}
