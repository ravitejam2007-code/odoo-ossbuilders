import bcrypt from 'bcryptjs';
import crypto from 'crypto';
import jwt from 'jsonwebtoken';
import { supabaseAdmin } from '../../config/supabase';
import { env } from '../../config/env';
import { sendVerificationEmail } from '../../config/mailer';
import { generateEmployeeLoginId } from '../../utils/idGenerator';
import { AppError } from '../../utils/response';
import { ErrorCodes } from '../../constants/errorCodes';
import { UserRole } from '../../types';

export class AuthService {
  /**
   * Register a new employee or admin
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
      .single();

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
        email_verified: false,
        verification_token: verificationToken,
      })
      .select()
      .single();

    if (userError || !newUser) {
      console.error('[Signup User Error]:', userError);
      throw new AppError(500, ErrorCodes.DATABASE_ERROR, 'Failed to create user record');
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
      work_status: 'present',
      joined_year: year,
      serial_no: String(serial).padStart(4, '0'),
    });

    if (profileError) {
      console.error('[Signup Profile Error]:', profileError);
    }

    // 7. Initialize Leave Balances
    await supabaseAdmin.from('leave_balances').insert({
      user_id: newUser.id,
      paid_days_available: 24.0,
      sick_days_available: 7.0,
      unpaid_days_taken: 0.0,
    });

    // 8. Initialize Notification
    await supabaseAdmin.from('notifications').insert({
      user_id: newUser.id,
      title: 'Welcome to Dayflow HRMS',
      message: `Your account has been registered with Login ID: ${loginId}. Please verify your email.`,
      type: 'info',
      read: false,
    });

    // 9. Dispatch Brevo Email
    try {
      await sendVerificationEmail(email, data.name, loginId, verificationToken);
    } catch (mailErr) {
      console.error('[Brevo SMTP Error]:', mailErr);
    }

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
   * Verify Email
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
      return { message: 'Email is already verified. You can sign in directly.' };
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
    };
  }

  /**
   * Login with Email OR Login ID
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

    // Check email verification gate
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
        avatar: profile?.avatar || '',
        department: profile?.department || 'Engineering',
        jobTitle: profile?.job_title || 'Associate',
        company: profile?.company || 'Dayflow',
        workStatus: profile?.work_status || 'present',
      },
    };
  }

  /**
   * Refresh JWT Access Token
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
}
