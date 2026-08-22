import { z } from 'zod';

export const CheckInSchema = z.object({
  body: z.object({
    timestamp: z.string().optional(),
  }),
});

export const CheckOutSchema = z.object({
  body: z.object({
    timestamp: z.string().optional(),
  }),
});

export const QueryAttendanceSchema = z.object({
  query: z.object({
    date: z.string().optional(),
    month: z.string().optional(),
    department: z.string().optional(),
  }),
});
