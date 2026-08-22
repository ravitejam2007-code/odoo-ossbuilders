import { z } from 'zod';

export const UpdateOwnProfileSchema = z.object({
  body: z.object({
    phone: z.string().optional(),
    avatar: z.string().optional(),
    about: z.string().optional(),
    whatILoveAboutJob: z.string().optional(),
    skills: z.array(z.string()).optional(),
    certifications: z.array(z.string()).optional(),
    interests: z.array(z.string()).optional(),
    dob: z.string().optional(),
    residingAddress: z.string().optional(),
    nationality: z.string().optional(),
    gender: z.string().optional(),
    maritalStatus: z.string().optional(),
  }),
});

export const UpdateAdminProfileSchema = z.object({
  params: z.object({
    userId: z.string().uuid('Invalid user ID format'),
  }),
  body: z.object({
    name: z.string().optional(),
    phone: z.string().optional(),
    company: z.string().optional(),
    department: z.string().optional(),
    jobTitle: z.string().optional(),
    manager: z.string().optional(),
    avatar: z.string().optional(),
    role: z.enum(['employee', 'admin', 'hr_officer']).optional(),
    workStatus: z.enum(['present', 'absent', 'half_day', 'on_leave']).optional(),
    joinedYear: z.number().optional(),
    about: z.string().optional(),
    whatILoveAboutJob: z.string().optional(),
    skills: z.array(z.string()).optional(),
    certifications: z.array(z.string()).optional(),
    interests: z.array(z.string()).optional(),
    dob: z.string().optional(),
    residingAddress: z.string().optional(),
    nationality: z.string().optional(),
    gender: z.string().optional(),
    maritalStatus: z.string().optional(),
    bankDetails: z.record(z.any()).optional(),
    salaryInfo: z.record(z.any()).optional(),
  }),
});
