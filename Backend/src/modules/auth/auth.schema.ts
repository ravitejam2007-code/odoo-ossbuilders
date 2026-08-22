import { z } from 'zod';

export const SignupSchema = z.object({
  body: z.object({
    companyName: z.string().min(2, 'Company name is required'),
    name: z.string().min(2, 'Full name is required'),
    email: z.string().email('Invalid email address'),
    phone: z.string().optional().default(''),
    password: z
      .string()
      .min(8, 'Password must be at least 8 characters long')
      .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
      .regex(/[a-z]/, 'Password must contain at least one lowercase letter')
      .regex(/[0-9]/, 'Password must contain at least one number'),
    role: z.enum(['employee', 'admin', 'hr_officer']).optional().default('employee'),
  }),
});

export const LoginSchema = z.object({
  body: z.object({
    loginIdOrEmail: z.string().min(1, 'Login ID or Email is required'),
    password: z.string().min(1, 'Password is required'),
  }),
});

export const VerifyEmailSchema = z.object({
  body: z.object({
    token: z.string().min(1, 'Verification token is required'),
    loginId: z.string().optional(),
  }),
});

export const RefreshTokenSchema = z.object({
  body: z.object({
    refreshToken: z.string().min(1, 'Refresh token is required'),
  }),
});
