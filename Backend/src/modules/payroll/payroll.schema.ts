import { z } from 'zod';

export const UpdateSalarySchema = z.object({
  params: z.object({
    userId: z.string().uuid('Invalid user ID format'),
  }),
  body: z.object({
    monthWage: z.number().nonnegative(),
    yearlyWage: z.number().nonnegative(),
    basicSalary: z.number().nonnegative(),
    houseRentAllowance: z.number().nonnegative().optional().default(0),
    standardAllowance: z.number().nonnegative().optional().default(0),
    performanceBonus: z.number().nonnegative().optional().default(0),
    leaveTravelAllowance: z.number().nonnegative().optional().default(0),
    fixedAllowance: z.number().nonnegative().optional().default(0),
    pfContributionEmployee: z.number().nonnegative().optional().default(0),
    pfContributionEmployer: z.number().nonnegative().optional().default(0),
    professionalTax: z.number().nonnegative().optional().default(0),
    noOfWorkingDaysPerWeek: z.number().int().min(1).max(7).optional().default(5),
  }),
});
