import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  getAdminEmployees,
  INITIAL_ADMIN_EMPLOYEES,
  INITIAL_ADMIN_ATTENDANCE,
  INITIAL_ADMIN_LEAVE_REQUESTS,
  INITIAL_ADMIN_PAYROLL,
  INITIAL_ADMIN_REPORT_SUMMARY,
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
      return getAdminEmployees();
    },
  });
}

export function useAdminEmployee(id?: string) {
  return useQuery<AdminEmployee | undefined>({
    queryKey: ['admin-employee', id],
    queryFn: async () => {
      const list = getAdminEmployees();
      return list.find((e) => e.id === id || e.loginId === id);
    },
    enabled: !!id,
  });
}

export function useUpdateAdminEmployee() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (updated: Partial<AdminEmployee> & { id: string }) => {
      const all = getAdminEmployees();
      const idx = all.findIndex((e) => e.id === updated.id);
      if (idx !== -1) {
        all[idx] = { ...all[idx], ...updated };
        if (typeof window !== 'undefined') {
          localStorage.setItem('dayflow_registered_employees', JSON.stringify(all));
        }
        return all[idx];
      }
      return updated as AdminEmployee;
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
      return [...INITIAL_ADMIN_ATTENDANCE];
    },
  });
}

// Leave Requests Query & Decision Mutations
export function useAdminLeaveRequests() {
  return useQuery<AdminLeaveRequest[]>({
    queryKey: ['admin-leave-requests'],
    queryFn: async () => {
      if (typeof window !== 'undefined') {
        const raw = localStorage.getItem('dayflow_leave_requests');
        if (raw) {
          try {
            const employeeRequests = JSON.parse(raw);
            return employeeRequests.map((r: any) => ({
              id: r.id,
              employeeId: 'emp-current',
              employeeName: 'Employee',
              department: 'Engineering',
              leaveType: r.leaveType,
              startDate: r.startDate,
              endDate: r.endDate,
              daysCount: r.daysCount || 1,
              status: r.status,
              reason: r.reason,
              submittedAt: r.createdAt || new Date().toISOString(),
            }));
          } catch {}
        }
      }
      return [...INITIAL_ADMIN_LEAVE_REQUESTS];
    },
  });
}

export function useAdminLeaveRequest(id?: string) {
  return useQuery<AdminLeaveRequest | undefined>({
    queryKey: ['admin-leave-request', id],
    queryFn: async () => {
      return INITIAL_ADMIN_LEAVE_REQUESTS.find((l) => l.id === id);
    },
    enabled: !!id,
  });
}

export function useApproveLeave() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, comment }: { id: string; comment?: string }) => {
      const req = INITIAL_ADMIN_LEAVE_REQUESTS.find((l) => l.id === id);
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
      const req = INITIAL_ADMIN_LEAVE_REQUESTS.find((l) => l.id === id);
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
      return [...INITIAL_ADMIN_PAYROLL];
    },
  });
}

export function useUpdatePayroll() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (updated: Partial<AdminPayrollRecord> & { id: string }) => {
      const idx = INITIAL_ADMIN_PAYROLL.findIndex((p) => p.id === updated.id);
      if (idx !== -1) {
        INITIAL_ADMIN_PAYROLL[idx] = { ...INITIAL_ADMIN_PAYROLL[idx], ...updated };
      }
      return INITIAL_ADMIN_PAYROLL[idx];
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
      return { ...INITIAL_ADMIN_REPORT_SUMMARY };
    },
  });
}
