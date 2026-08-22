import { z } from 'zod';

export const ApplyLeaveSchema = z.object({
  body: z.object({
    leaveType: z.enum(['Paid Time Off', 'Sick Leave', 'Unpaid Leaves']),
    startDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Start date must be YYYY-MM-DD'),
    endDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'End date must be YYYY-MM-DD'),
    daysCount: z.number().positive('Days count must be greater than 0'),
    reason: z.string().optional().default(''),
    attachmentName: z.string().optional(),
    attachmentUrl: z.string().optional(),
  }),
});

export const ReviewLeaveSchema = z.object({
  params: z.object({
    id: z.string().uuid('Invalid leave request ID format'),
  }),
  body: z.object({
    status: z.enum(['approved', 'rejected']),
    adminComment: z.string().optional().default(''),
  }),
});
