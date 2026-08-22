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
