import { z } from 'zod';

export const ListEmployeesSchema = z.object({
  query: z.object({
    search: z.string().optional(),
    department: z.string().optional(),
    role: z.string().optional(),
    page: z.string().optional().default('1'),
    limit: z.string().optional().default('50'),
  }),
});

export const UpdateEmployeeAdminSchema = z.object({
  params: z.object({
    id: z.string().uuid('Invalid employee ID format'),
  }),
  body: z.object({
    name: z.string().optional(),
    email: z.string().email().optional(),
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
