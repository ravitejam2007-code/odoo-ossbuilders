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
      await new Promise((res) => setTimeout(res, 150));
      return { ...MOCK_CURRENT_USER };
    },
  });
}

export function useColleagues() {
  return useQuery<Employee[]>({
    queryKey: ['colleagues'],
    queryFn: async () => {
      await new Promise((res) => setTimeout(res, 200));
      return [...MOCK_COLLEAGUES];
    },
  });
}

export function useAttendanceHistory() {
  return useQuery<AttendanceRecord[]>({
    queryKey: ['attendance-history'],
    queryFn: async () => {
      await new Promise((res) => setTimeout(res, 200));
      return [...MOCK_ATTENDANCE];
    },
  });
}

export function useLeaveBalance() {
  return useQuery<LeaveBalance>({
    queryKey: ['leave-balance'],
    queryFn: async () => {
      await new Promise((res) => setTimeout(res, 150));
      return { ...MOCK_LEAVE_BALANCE };
    },
  });
}

export function useLeaveRequests() {
  return useQuery<LeaveRequest[]>({
    queryKey: ['leave-requests'],
    queryFn: async () => {
      await new Promise((res) => setTimeout(res, 200));
      return [...MOCK_LEAVE_REQUESTS];
    },
  });
}

export function useSubmitLeaveRequest() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (newRequest: Omit<LeaveRequest, 'id' | 'status' | 'createdAt'>) => {
      await new Promise((res) => setTimeout(res, 300));
      const created: LeaveRequest = {
        ...newRequest,
        id: `leave-${Date.now()}`,
        status: 'pending',
        createdAt: new Date().toISOString(),
      };
      MOCK_LEAVE_REQUESTS.unshift(created);
      return created;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['leave-requests'] });
    },
  });
}

export function useNotifications() {
  return useQuery<NotificationItem[]>({
    queryKey: ['notifications'],
    queryFn: async () => {
      await new Promise((res) => setTimeout(res, 150));
      return [...MOCK_NOTIFICATIONS];
    },
  });
}

export function usePayslips() {
  return useQuery<PayslipItem[]>({
    queryKey: ['payslips'],
    queryFn: async () => {
      await new Promise((res) => setTimeout(res, 200));
      return [...MOCK_PAYSLIPS];
    },
  });
}
