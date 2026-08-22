import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  MOCK_CURRENT_USER,
  MOCK_COLLEAGUES,
  MOCK_ATTENDANCE,
  MOCK_LEAVE_BALANCE,
  MOCK_LEAVE_REQUESTS,
  MOCK_NOTIFICATIONS,
  MOCK_PAYSLIPS,
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
        return data;
      } catch {
        return { ...MOCK_CURRENT_USER };
      }
    },
  });
}

export function useColleagues() {
  return useQuery<Employee[]>({
    queryKey: ['colleagues'],
    queryFn: async () => {
      try {
        const data = await apiClient.employees.list();
        return data.employees || [...MOCK_COLLEAGUES];
      } catch {
        return [...MOCK_COLLEAGUES];
      }
    },
  });
}

export function useAttendanceHistory() {
  return useQuery<AttendanceRecord[]>({
    queryKey: ['attendance-history'],
    queryFn: async () => {
      try {
        const data = await apiClient.attendance.getMyAttendance();
        return data.records || [...MOCK_ATTENDANCE];
      } catch {
        return [...MOCK_ATTENDANCE];
      }
    },
  });
}

export function useLeaveBalance() {
  return useQuery<LeaveBalance>({
    queryKey: ['leave-balance'],
    queryFn: async () => {
      try {
        const data = await apiClient.leave.getMyBalance();
        return data;
      } catch {
        return { ...MOCK_LEAVE_BALANCE };
      }
    },
  });
}

export function useLeaveRequests() {
  return useQuery<LeaveRequest[]>({
    queryKey: ['leave-requests'],
    queryFn: async () => {
      try {
        const data = await apiClient.leave.getMyLeave();
        return data.requests || [...MOCK_LEAVE_REQUESTS];
      } catch {
        return [...MOCK_LEAVE_REQUESTS];
      }
    },
  });
}

export function useSubmitLeaveRequest() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (newRequest: Omit<LeaveRequest, 'id' | 'status' | 'createdAt'>) => {
      try {
        const created = await apiClient.leave.apply(newRequest);
        return created;
      } catch {
        const created: LeaveRequest = {
          ...newRequest,
          id: `leave-${Date.now()}`,
          status: 'pending',
          createdAt: new Date().toISOString(),
        };
        MOCK_LEAVE_REQUESTS.unshift(created);
        return created;
      }
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
        return data || [...MOCK_NOTIFICATIONS];
      } catch {
        return [...MOCK_NOTIFICATIONS];
      }
    },
  });
}

export function usePayslips() {
  return useQuery<PayslipItem[]>({
    queryKey: ['payslips'],
    queryFn: async () => {
      try {
        const data = await apiClient.payroll.getMyPayroll();
        return data.payslips || [...MOCK_PAYSLIPS];
      } catch {
        return [...MOCK_PAYSLIPS];
      }
    },
  });
}
