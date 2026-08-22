import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  getPersistentEmployees,
  getPersistentAttendance,
  getPersistentLeaveRequests,
  savePersistentLeaveRequest,
  INITIAL_LEAVE_BALANCE,
  INITIAL_PAYSLIPS,
} from '../api/mockData';
import { apiClient } from '../api/apiClient';
import type {
  Employee,
  AttendanceRecord,
  LeaveRequest,
  LeaveBalance,
  NotificationItem,
  PayslipItem,
} from '../types/api';

export function useCurrentUser() {
  return useQuery<Employee>({
    queryKey: ['current-user'],
    queryFn: async () => {
      try {
        const data = await apiClient.profile.getMe();
        if (data) return data;
      } catch {}

      const all = getPersistentEmployees();
      const saved = typeof window !== 'undefined' ? localStorage.getItem('dayflow_employee_user') : null;
      if (saved) {
        try {
          return JSON.parse(saved);
        } catch {
          return all[0];
        }
      }
      return all[0];
    },
  });
}

export function useColleagues() {
  return useQuery<Employee[]>({
    queryKey: ['colleagues'],
    queryFn: async () => {
      try {
        const data = await apiClient.employees.list();
        if (data?.employees && data.employees.length > 0) return data.employees;
      } catch {}
      return getPersistentEmployees();
    },
  });
}

export function useAttendanceHistory() {
  return useQuery<AttendanceRecord[]>({
    queryKey: ['attendance-history'],
    queryFn: async () => {
      try {
        const data = await apiClient.attendance.getMyAttendance();
        if (data?.records && data.records.length > 0) return data.records;
      } catch {}
      return getPersistentAttendance();
    },
  });
}

export function useLeaveBalance() {
  return useQuery<LeaveBalance>({
    queryKey: ['leave-balance'],
    queryFn: async () => {
      try {
        const data = await apiClient.leave.getMyBalance();
        if (data) return data;
      } catch {}
      return { ...INITIAL_LEAVE_BALANCE };
    },
  });
}

export function useLeaveRequests() {
  return useQuery<LeaveRequest[]>({
    queryKey: ['leave-requests'],
    queryFn: async () => {
      try {
        const data = await apiClient.leave.getMyLeave();
        if (data?.requests && data.requests.length > 0) return data.requests;
      } catch {}
      return getPersistentLeaveRequests();
    },
  });
}

export function useSubmitLeaveRequest() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (newRequest: Omit<LeaveRequest, 'id' | 'status' | 'createdAt'>) => {
      try {
        const created = await apiClient.leave.apply(newRequest);
        if (created) return created;
      } catch {}

      const created: LeaveRequest = {
        ...newRequest,
        id: `leave-${Date.now()}`,
        status: 'pending',
        createdAt: new Date().toISOString(),
      };
      savePersistentLeaveRequest(created);
      return created;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['leave-requests'] });
      queryClient.invalidateQueries({ queryKey: ['leave-balance'] });
      queryClient.invalidateQueries({ queryKey: ['attendance-history'] });
    },
  });
}

export function useNotifications() {
  return useQuery<NotificationItem[]>({
    queryKey: ['notifications'],
    queryFn: async () => {
      try {
        const data = await apiClient.notifications.getMe();
        if (data && data.length > 0) return data;
      } catch {}
      if (typeof window !== 'undefined') {
        const raw = localStorage.getItem('dayflow_notifications');
        if (raw) return JSON.parse(raw);
      }
      return [];
    },
  });
}

export function usePayslips() {
  return useQuery<PayslipItem[]>({
    queryKey: ['payslips'],
    queryFn: async () => {
      try {
        const data = await apiClient.payroll.getMyPayroll();
        if (data?.payslips && data.payslips.length > 0) return data.payslips;
      } catch {}
      return [...INITIAL_PAYSLIPS];
    },
  });
}
