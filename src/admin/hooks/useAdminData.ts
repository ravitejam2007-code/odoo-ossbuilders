import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '../../employee/api/apiClient';
import type {
  AdminEmployee,
  AdminAttendance,
  AdminLeaveRequest,
  AdminPayrollRecord,
  AdminReportSummary,
} from '../types/api';

// Employees Query & Mutation
export function useAdminEmployees(filters?: { search?: string; department?: string; role?: string }) {
  return useQuery<AdminEmployee[]>({
    queryKey: ['admin-employees', filters],
    queryFn: async () => {
      const res = await apiClient.employees.list(filters);
      return res?.employees || [];
    },
  });
}

export function useAdminEmployee(id?: string) {
  return useQuery<AdminEmployee | undefined>({
    queryKey: ['admin-employee', id],
    queryFn: async () => {
      if (!id) return undefined;
      const res = await apiClient.employees.getById(id);
      return res?.employee || res;
    },
    enabled: !!id,
  });
}

export function useCreateAdminEmployee() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: {
      companyName?: string;
      name: string;
      email: string;
      phone?: string;
      password?: string;
      role?: string;
      department?: string;
      jobTitle?: string;
      wage?: number;
    }) => {
      // 1. Sign up the user account
      const signupRes = await apiClient.auth.signup({
        companyName: data.companyName || 'Odoo India',
        name: data.name,
        email: data.email,
        phone: data.phone,
        password: data.password || 'Welcome@2026',
        role: data.role || 'employee',
      });

      // 2. If additional details like job title / department / salary were provided, update the profile
      if (signupRes?.userId && (data.department || data.jobTitle || data.wage)) {
        try {
          const wage = data.wage || 50000;
          await apiClient.employees.update(signupRes.userId, {
            department: data.department,
            jobTitle: data.jobTitle,
            salaryInfo: {
              monthWage: wage,
              yearlyWage: wage * 12,
              basicSalary: wage * 0.5,
              houseRentAllowance: wage * 0.25,
              standardAllowance: 5000,
              performanceBonus: 5000,
              leaveTravelAllowance: 2500,
              fixedAllowance: 0,
              pfContributionEmployee: wage * 0.06,
              pfContributionEmployer: wage * 0.06,
              professionalTax: 200,
              noOfWorkingDaysPerWeek: 5,
              breakTimeHours: 1,
            },
          });
        } catch (updateErr) {
          console.warn('[Create Admin Employee Profile Update Warn]:', updateErr);
        }
      }

      return signupRes;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-employees'] });
      queryClient.invalidateQueries({ queryKey: ['admin-reports'] });
      queryClient.invalidateQueries({ queryKey: ['colleagues'] });
    },
  });
}

export function useUpdateAdminEmployee() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, ...data }: Partial<AdminEmployee> & { id: string }) => {
      const res = await apiClient.employees.update(id, data);
      return res?.employee || res;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['admin-employees'] });
      queryClient.invalidateQueries({ queryKey: ['admin-payroll'] });
      queryClient.invalidateQueries({ queryKey: ['admin-reports'] });
      if (data?.id) {
        queryClient.invalidateQueries({ queryKey: ['admin-employee', data.id] });
      }
    },
  });
}

// Attendance Query
export function useAdminAttendance(filters?: { date?: string; month?: string; department?: string }) {
  return useQuery<AdminAttendance[]>({
    queryKey: ['admin-attendance', filters],
    queryFn: async () => {
      const res = await apiClient.attendance.getAll(filters);
      return Array.isArray(res?.records) ? res.records : Array.isArray(res) ? res : [];
    },
  });
}

// Leave Requests Query & Decision Mutations
export function useAdminLeaveRequests(status?: string) {
  return useQuery<AdminLeaveRequest[]>({
    queryKey: ['admin-leave-requests', status],
    queryFn: async () => {
      const res = await apiClient.leave.getAll(status);
      return Array.isArray(res?.requests) ? res.requests : Array.isArray(res) ? res : [];
    },
  });
}

export function useAdminLeaveRequest(id?: string) {
  return useQuery<AdminLeaveRequest | undefined>({
    queryKey: ['admin-leave-request', id],
    queryFn: async () => {
      if (!id) return undefined;
      const all = await apiClient.leave.getAll();
      const list = Array.isArray(all?.requests) ? all.requests : Array.isArray(all) ? all : [];
      return list.find((l: any) => l.id === id);
    },
    enabled: !!id,
  });
}

export function useApproveLeave() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, comment }: { id: string; comment?: string }) => {
      return apiClient.leave.review(id, 'approved', comment);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-leave-requests'] });
      queryClient.invalidateQueries({ queryKey: ['admin-reports'] });
    },
  });
}

export function useRejectLeave() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, comment }: { id: string; comment?: string }) => {
      return apiClient.leave.review(id, 'rejected', comment);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-leave-requests'] });
      queryClient.invalidateQueries({ queryKey: ['admin-reports'] });
    },
  });
}

// Payroll Query & Mutation
export function useAdminPayroll() {
  return useQuery<AdminPayrollRecord[]>({
    queryKey: ['admin-payroll'],
    queryFn: async () => {
      const res = await apiClient.payroll.getAll();
      return Array.isArray(res?.payroll) ? res.payroll : Array.isArray(res) ? res : [];
    },
  });
}

export function useUpdatePayroll() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, ...data }: Partial<AdminPayrollRecord> & { id: string }) => {
      return apiClient.payroll.updateSalary(id, data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-payroll'] });
      queryClient.invalidateQueries({ queryKey: ['admin-reports'] });
    },
  });
}

// Reports Query
export function useAdminReports(month?: string) {
  return useQuery<AdminReportSummary>({
    queryKey: ['admin-reports', month],
    queryFn: async () => {
      const [dash, att, pay] = await Promise.allSettled([
        apiClient.reports.getDashboardSummary(),
        apiClient.reports.getAttendanceSummary(month),
        apiClient.reports.getPayrollSummary(),
      ]);

      const dashData = dash.status === 'fulfilled' ? dash.value : {};
      const attData = att.status === 'fulfilled' ? att.value : {};
      const payData = pay.status === 'fulfilled' ? pay.value : {};

      return {
        totalEmployees: dashData?.totalEmployees ?? 0,
        presentToday: dashData?.presentToday ?? 0,
        onLeaveToday: dashData?.onLeaveToday ?? 0,
        absentToday: dashData?.absentToday ?? 0,
        pendingLeaveRequests: dashData?.pendingLeaveApprovals ?? 0,
        monthlyPayrollBudget: payData?.totalMonthlyWage ?? 0,
        departmentCounts: payData?.departmentBreakdown || {},
        avgAttendanceRate: attData?.avgAttendanceRate ?? 95,
        totalPayrollMonthly: payData?.totalMonthlyWage ?? 0,
        avgSalary: payData?.averageMonthlySalary ?? 0,
        departmentBreakdown: payData?.departmentBreakdown || {},
      };
    },
  });
}
