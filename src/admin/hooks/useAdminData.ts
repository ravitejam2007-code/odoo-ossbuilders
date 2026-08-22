import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  MOCK_ADMIN_EMPLOYEES,
  MOCK_ADMIN_ATTENDANCE,
  MOCK_ADMIN_LEAVE_REQUESTS,
  MOCK_ADMIN_PAYROLL,
  MOCK_ADMIN_REPORT_SUMMARY,
} from '../api/mockData';
import type {
  AdminEmployee,
  AdminAttendance,
  AdminLeaveRequest,
  AdminPayrollRecord,
  AdminReportSummary,
} from '../types/api';

// Employees Query & Mutation
export function useAdminEmployees() {
  return useQuery<AdminEmployee[]>({
    queryKey: ['admin-employees'],
    queryFn: async () => {
      await new Promise((res) => setTimeout(res, 200));
      return [...MOCK_ADMIN_EMPLOYEES];
    },
  });
}

export function useAdminEmployee(id?: string) {
  return useQuery<AdminEmployee | undefined>({
    queryKey: ['admin-employee', id],
    queryFn: async () => {
      await new Promise((res) => setTimeout(res, 150));
      return MOCK_ADMIN_EMPLOYEES.find((e) => e.id === id || e.loginId === id);
    },
    enabled: !!id,
  });
}

export function useUpdateAdminEmployee() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (updated: Partial<AdminEmployee> & { id: string }) => {
      await new Promise((res) => setTimeout(res, 300));
      const idx = MOCK_ADMIN_EMPLOYEES.findIndex((e) => e.id === updated.id);
      if (idx !== -1) {
        MOCK_ADMIN_EMPLOYEES[idx] = { ...MOCK_ADMIN_EMPLOYEES[idx], ...updated };
      }
      return MOCK_ADMIN_EMPLOYEES[idx];
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['admin-employees'] });
      if (data) {
        queryClient.invalidateQueries({ queryKey: ['admin-employee', data.id] });
      }
    },
  });
}

// Attendance Query
export function useAdminAttendance(date?: string) {
  return useQuery<AdminAttendance[]>({
    queryKey: ['admin-attendance', date || 'today'],
    queryFn: async () => {
      await new Promise((res) => setTimeout(res, 200));
      return [...MOCK_ADMIN_ATTENDANCE];
    },
  });
}

// Leave Requests Query & Decision Mutations
export function useAdminLeaveRequests() {
  return useQuery<AdminLeaveRequest[]>({
    queryKey: ['admin-leave-requests'],
    queryFn: async () => {
      await new Promise((res) => setTimeout(res, 200));
      return [...MOCK_ADMIN_LEAVE_REQUESTS];
    },
  });
}

export function useAdminLeaveRequest(id?: string) {
  return useQuery<AdminLeaveRequest | undefined>({
    queryKey: ['admin-leave-request', id],
    queryFn: async () => {
      await new Promise((res) => setTimeout(res, 150));
      return MOCK_ADMIN_LEAVE_REQUESTS.find((l) => l.id === id);
    },
    enabled: !!id,
  });
}

export function useApproveLeave() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, comment }: { id: string; comment?: string }) => {
      await new Promise((res) => setTimeout(res, 300));
      const req = MOCK_ADMIN_LEAVE_REQUESTS.find((l) => l.id === id);
      if (req) {
        req.status = 'approved';
        req.adminComment = comment || 'Approved by HR Administrator.';
      }
      return req;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['admin-leave-requests'] });
      if (data) {
        queryClient.invalidateQueries({ queryKey: ['admin-leave-request', data.id] });
      }
    },
  });
}

export function useRejectLeave() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, comment }: { id: string; comment?: string }) => {
      await new Promise((res) => setTimeout(res, 300));
      const req = MOCK_ADMIN_LEAVE_REQUESTS.find((l) => l.id === id);
      if (req) {
        req.status = 'rejected';
        req.adminComment = comment || 'Rejected by HR Administrator.';
      }
      return req;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['admin-leave-requests'] });
      if (data) {
        queryClient.invalidateQueries({ queryKey: ['admin-leave-request', data.id] });
      }
    },
  });
}

// Payroll Query & Mutation
export function useAdminPayroll() {
  return useQuery<AdminPayrollRecord[]>({
    queryKey: ['admin-payroll'],
    queryFn: async () => {
      await new Promise((res) => setTimeout(res, 200));
      return [...MOCK_ADMIN_PAYROLL];
    },
  });
}

export function useUpdatePayroll() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (updated: Partial<AdminPayrollRecord> & { id: string }) => {
      await new Promise((res) => setTimeout(res, 300));
      const idx = MOCK_ADMIN_PAYROLL.findIndex((p) => p.id === updated.id);
      if (idx !== -1) {
        MOCK_ADMIN_PAYROLL[idx] = { ...MOCK_ADMIN_PAYROLL[idx], ...updated };
      }
      return MOCK_ADMIN_PAYROLL[idx];
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-payroll'] });
    },
  });
}

// Reports Query
export function useAdminReports() {
  return useQuery<AdminReportSummary>({
    queryKey: ['admin-reports'],
    queryFn: async () => {
      await new Promise((res) => setTimeout(res, 200));
      return { ...MOCK_ADMIN_REPORT_SUMMARY };
    },
  });
}
