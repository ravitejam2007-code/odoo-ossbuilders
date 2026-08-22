import bcrypt from 'bcryptjs';
import crypto from 'crypto';
import jwt from 'jsonwebtoken';
import { supabaseAdmin } from '../../config/supabase';
import { env } from '../../config/env';
import { sendVerificationEmail, sendPasswordResetEmail } from '../../config/mailer';
import { generateEmployeeLoginId } from '../../utils/idGenerator';
import { AppError } from '../../utils/response';
import { ErrorCodes } from '../../constants/errorCodes';
import { UserRole } from '../../types';

export class AuthService {
  /**
   * 1. Register a new employee or admin
   * Computes login_id = [Company 2-chars] + [Initials 4-chars] + [Year 4-chars] + [Serial 4-chars] (e.g. OIJODO20220001)
   * Hashes password with bcrypt
   * Creates user, profile, default leave_balances, and notification rows
   * Triggers verification email via Brevo SMTP
   */
  async signup(data: {
    companyName: string;
    name: string;
    email: string;
    phone?: string;
    password: string;
    role?: UserRole;
  }) {
    const email = data.email.trim().toLowerCase();
    const role = data.role || 'employee';

    // 1. Check if email already exists
    const { data: existingUser } = await supabaseAdmin
      .from('users')
      .select('id, email')
      .eq('email', email)
      .maybeSingle();

    if (existingUser) {
      throw new AppError(400, ErrorCodes.EMAIL_ALREADY_EXISTS, 'An account with this email already exists');
    }

    // 2. Count existing users in the company/year to generate sequential serial
    const year = new Date().getFullYear();
    const { count } = await supabaseAdmin
      .from('users')
      .select('*', { count: 'exact', head: true });

    const serial = (count || 0) + 1;
    const loginId = generateEmployeeLoginId(data.companyName, data.name, year, serial);

    // 3. Hash password
    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(data.password, salt);

    // 4. Generate email verification token
    const verificationToken = crypto.randomBytes(32).toString('hex');

    // 5. Insert User
    const { data: newUser, error: userError } = await supabaseAdmin
      .from('users')
      .insert({
        login_id: loginId,
        email,
        password_hash: passwordHash,
        role,
        company_name: data.companyName,
        email_verified: false,
        verification_token: verificationToken,
      })
      .select()
      .single();

    if (userError || !newUser) {
      console.error('[Signup User Error]:', userError);
      throw new AppError(500, ErrorCodes.DATABASE_ERROR, userError?.message || 'Failed to create user record');
    }

    // 6. Insert Profile
    const { error: profileError } = await supabaseAdmin.from('profiles').insert({
      user_id: newUser.id,
      name: data.name,
      phone: data.phone || '',
      company: data.companyName,
      department: 'Engineering',
      job_title: role === 'admin' ? 'HR Administrator' : 'Associate Engineer',
      manager: 'System Admin',
      avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150',
      avatar_url: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150',
      work_status: 'present',
      date_joined: new Date().toISOString().split('T')[0],
      joined_year: year,
      serial_no: String(serial).padStart(4, '0'),
    });

    if (profileError) {
      console.error('[Signup Profile Error]:', profileError);
    }

    // 7. Initialize Leave Balances (24 paid days, 7 sick days, 0 unpaid days)
    try {
      await supabaseAdmin.from('leave_balances').insert({
        user_id: newUser.id,
        paid_days_available: 24,
        sick_days_available: 7,
        unpaid_days_taken: 0,
      });
    } catch (lbErr) {
      console.warn('[Signup Leave Balances Warn]:', lbErr);
    }

    // 8. Initialize In-App Notification
    try {
      await supabaseAdmin.from('notifications').insert({
        user_id: newUser.id,
        title: 'Welcome to Dayflow HRMS',
        message: `Your account has been registered with Login ID: ${loginId}. Please verify your email.`,
        type: 'info',
        read: false,
      });
    } catch (notifErr) {
      console.warn('[Signup Notification Warn]:', notifErr);
    }

    // 9. Dispatch Brevo Email (Non-blocking)
    sendVerificationEmail(email, data.name, loginId, verificationToken).catch((mailErr) => {
      console.error('[Brevo SMTP Error]:', mailErr);
    });

    return {
      userId: newUser.id,
      loginId,
      email,
      name: data.name,
      role,
      message: 'Account created successfully. Please check your email for the verification link.',
    };
  }

  /**
   * 2. Verify Email
   * Verifies token and activates email_verified = true
   */
  async verifyEmail(token: string, loginId?: string) {
    let query = supabaseAdmin.from('users').select('*').eq('verification_token', token);
    if (loginId) {
      query = query.eq('login_id', loginId.toUpperCase().trim());
    }

    const { data: user, error } = await query.single();

    if (error || !user) {
      throw new AppError(400, ErrorCodes.INVALID_TOKEN, 'Invalid or expired verification token');
    }

    if (user.email_verified) {
      return { message: 'Email is already verified. You can sign in directly.', loginId: user.login_id };
    }

    await supabaseAdmin
      .from('users')
      .update({
        email_verified: true,
        verification_token: null,
        updated_at: new Date().toISOString(),
      })
      .eq('id', user.id);

    return {
      message: 'Email successfully verified! You can now log into your account.',
      loginId: user.login_id,
      email: user.email,
    };
  }

  /**
   * 3. Login with Email OR Login ID
   * Validates credentials & email_verified = true check
   * Returns session JWT and user profile
   */
  async login(loginIdOrEmail: string, password: string) {
    const identifier = loginIdOrEmail.trim();

    // Query user by email or login_id
    const isEmail = identifier.includes('@');
    const query = supabaseAdmin.from('users').select('*');

    const { data: user, error } = isEmail
      ? await query.eq('email', identifier.toLowerCase()).single()
      : await query.eq('login_id', identifier.toUpperCase()).single();

    if (error || !user) {
      throw new AppError(401, ErrorCodes.INVALID_CREDENTIALS, 'Invalid Login ID/Email or password');
    }

    // Verify password
    const isPasswordValid = await bcrypt.compare(password, user.password_hash);
    if (!isPasswordValid) {
      throw new AppError(401, ErrorCodes.INVALID_CREDENTIALS, 'Invalid Login ID/Email or password');
    }

    // Check email verification gate in production (or if email_verified is required)
    if (!user.email_verified && env.NODE_ENV === 'production') {
      throw new AppError(
        403,
        ErrorCodes.EMAIL_NOT_VERIFIED,
        'Your email address is not verified. Please check your inbox for the verification link.'
      );
    }

    // Fetch user profile
    const { data: profile } = await supabaseAdmin
      .from('profiles')
      .select('*')
      .eq('user_id', user.id)
      .single();

    // Generate JWT access & refresh tokens
    const payload = {
      id: user.id,
      loginId: user.login_id,
      email: user.email,
      role: user.role as UserRole,
      emailVerified: user.email_verified,
    };

    const accessToken = jwt.sign(payload, env.JWT_ACCESS_SECRET, {
      expiresIn: env.JWT_ACCESS_EXPIRES_IN as any,
    });

    const refreshToken = jwt.sign(payload, env.JWT_REFRESH_SECRET, {
      expiresIn: env.JWT_REFRESH_EXPIRES_IN as any,
    });

    return {
      accessToken,
      refreshToken,
      user: {
        id: user.id,
        loginId: user.login_id,
        email: user.email,
        role: user.role,
        name: profile?.name || 'Employee',
        avatar: profile?.avatar || profile?.avatar_url || '',
        department: profile?.department || 'Engineering',
        jobTitle: profile?.job_title || 'Associate',
        company: profile?.company || 'Dayflow',
        workStatus: profile?.work_status || 'present',
      },
    };
  }

  /**
   * 4. Refresh JWT Access Token
   */
  async refreshToken(token: string) {
    try {
      const decoded = jwt.verify(token, env.JWT_REFRESH_SECRET) as any;
      const { data: user } = await supabaseAdmin.from('users').select('*').eq('id', decoded.id).single();

      if (!user) {
        throw new AppError(401, ErrorCodes.UNAUTHORIZED, 'User no longer exists');
      }

      const payload = {
        id: user.id,
        loginId: user.login_id,
        email: user.email,
        role: user.role as UserRole,
        emailVerified: user.email_verified,
      };

      const newAccessToken = jwt.sign(payload, env.JWT_ACCESS_SECRET, {
        expiresIn: env.JWT_ACCESS_EXPIRES_IN as any,
      });

      return { accessToken: newAccessToken };
    } catch {
      throw new AppError(401, ErrorCodes.INVALID_TOKEN, 'Invalid or expired refresh token');
    }
  }

  /**
   * 5. Forgot Password Request
   * Triggers Password Reset Email via Brevo SMTP
   */
  async forgotPassword(loginIdOrEmail: string) {
    const identifier = loginIdOrEmail.trim();
    const isEmail = identifier.includes('@');
    const query = supabaseAdmin.from('users').select('*');

    const { data: user } = isEmail
      ? await query.eq('email', identifier.toLowerCase()).single()
      : await query.eq('login_id', identifier.toUpperCase()).single();

    if (!user) {
      // Return success message to prevent user enumeration
      return { message: 'If an account exists with this email or Login ID, a password reset link has been sent.' };
    }

    const { data: profile } = await supabaseAdmin.from('profiles').select('name').eq('user_id', user.id).single();

    const resetToken = crypto.randomBytes(32).toString('hex');
    const expiresAt = new Date(Date.now() + 60 * 60 * 1000).toISOString(); // 1 hour

    await supabaseAdmin
      .from('users')
      .update({
        reset_token: resetToken,
        reset_token_expires: expiresAt,
        updated_at: new Date().toISOString(),
      })
      .eq('id', user.id);

    try {
      await sendPasswordResetEmail(user.email, profile?.name || 'Employee', resetToken);
    } catch (mailErr) {
      console.error('[Brevo SMTP Reset Error]:', mailErr);
    }

    return { message: 'Password reset link sent to your registered email address.' };
  }

  /**
   * 6. Reset Password with Token
   */
  async resetPassword(token: string, newPassword: string) {
    const { data: user, error } = await supabaseAdmin
      .from('users')
      .select('*')
      .eq('reset_token', token)
      .single();

    if (error || !user) {
      throw new AppError(400, ErrorCodes.INVALID_TOKEN, 'Invalid or expired password reset token');
    }

    if (user.reset_token_expires && new Date(user.reset_token_expires) < new Date()) {
      throw new AppError(400, ErrorCodes.TOKEN_EXPIRED, 'Password reset token has expired. Please request a new one.');
    }

    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(newPassword, salt);

    await supabaseAdmin
      .from('users')
      .update({
        password_hash: passwordHash,
        reset_token: null,
        reset_token_expires: null,
        updated_at: new Date().toISOString(),
      })
      .eq('id', user.id);

    return { message: 'Password reset successful! You can now log into Dayflow with your new password.' };
  }
}
