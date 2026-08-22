import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiClient, getStoredSession, setAuthSession } from '../api/apiClient';
import type {
  Employee,
  AttendanceResponse,
  AttendanceRecord,
  LeaveRequest,
  LeaveBalance,
  NotificationItem,
  PayslipItem,
  PayrollResponse,
} from '../types/api';

export function useCurrentUser() {
  return useQuery<Employee>({
    queryKey: ['current-user'],
    queryFn: () => apiClient.profile.getMe(),
  });
}

export function useColleagues() {
  return useQuery<Employee[]>({
    queryKey: ['colleagues'],
    queryFn: async () => {
      try {
        const data = await apiClient.employees.list();
        return data?.employees || [];
      } catch {
        // Normal employees do not have access to full admin directory
        return [];
      }
    },
  });
}

export function useAttendanceHistory(month?: string) {
  return useQuery<AttendanceResponse>({
    queryKey: ['attendance-history', month || 'current'],
    queryFn: () => apiClient.attendance.getMyAttendance(month),
  });
}

export function useCheckInMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async () => {
      const res = await apiClient.attendance.checkIn();
      return res;
    },
    onSuccess: (res) => {
      // Optimistically update current-user workStatus
      queryClient.setQueryData(['current-user'], (old: Employee | undefined) => {
        if (!old) return old;
        const updated = { ...old, workStatus: 'present' as const };
        const session = getStoredSession();
        if (session) {
          setAuthSession({ ...session, user: updated });
        }
        return updated;
      });

      // Optimistically update attendance summary
      queryClient.setQueryData(['attendance-history', 'current'], (old: AttendanceResponse | undefined) => {
        if (!old) return old;
        return {
          ...old,
          summary: {
            ...old.summary,
            status: 'present' as const,
            checkInTime: res.checkIn || old.summary.checkInTime || '09:00 AM',
          },
        };
      });

      queryClient.invalidateQueries({ queryKey: ['attendance-history'] });
      queryClient.invalidateQueries({ queryKey: ['current-user'] });
      queryClient.invalidateQueries({ queryKey: ['profile'] });
    },
  });
}

export function useCheckOutMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async () => {
      const res = await apiClient.attendance.checkOut();
      return res;
    },
    onSuccess: () => {
      // Optimistically update current-user workStatus
      queryClient.setQueryData(['current-user'], (old: Employee | undefined) => {
        if (!old) return old;
        const updated = { ...old, workStatus: 'absent' as const };
        const session = getStoredSession();
        if (session) {
          setAuthSession({ ...session, user: updated });
        }
        return updated;
      });

      // Optimistically update attendance summary
      queryClient.setQueryData(['attendance-history', 'current'], (old: AttendanceResponse | undefined) => {
        if (!old) return old;
        return {
          ...old,
          summary: {
            ...old.summary,
            status: 'absent' as const,
          },
        };
      });

      queryClient.invalidateQueries({ queryKey: ['attendance-history'] });
      queryClient.invalidateQueries({ queryKey: ['current-user'] });
      queryClient.invalidateQueries({ queryKey: ['profile'] });
    },
  });
}

export function useLeaveBalance() {
  return useQuery<LeaveBalance>({
    queryKey: ['leave-balance'],
    queryFn: () => apiClient.leave.getMyBalance(),
  });
}

export function useLeaveRequests() {
  return useQuery<LeaveRequest[]>({
    queryKey: ['leave-requests'],
    queryFn: async () => {
      const data = await apiClient.leave.getMyLeave();
      return data?.requests || [];
    },
  });
}

export function useSubmitLeaveRequest() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (newRequest: {
      leaveType: string;
      startDate: string;
      endDate: string;
      daysCount: number;
      reason?: string;
      attachmentName?: string;
      attachmentUrl?: string;
    }) => apiClient.leave.apply(newRequest),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['leave-requests'] });
      queryClient.invalidateQueries({ queryKey: ['leave-balance'] });
      queryClient.invalidateQueries({ queryKey: ['attendance-history'] });
      queryClient.invalidateQueries({ queryKey: ['current-user'] });
    },
  });
}

export function useUploadLeaveAttachment() {
  return useMutation({
    mutationFn: (file: File) => apiClient.leave.upload(file),
  });
}

export function useUpdateProfileMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (fields: Partial<Employee>) => apiClient.profile.updateMe(fields),
    onSuccess: (updated) => {
      queryClient.setQueryData(['current-user'], updated);
      queryClient.invalidateQueries({ queryKey: ['current-user'] });
      queryClient.invalidateQueries({ queryKey: ['profile'] });
    },
  });
}

export function usePayroll() {
  return useQuery<PayrollResponse>({
    queryKey: ['payroll'],
    queryFn: () => apiClient.payroll.getMyPayroll(),
  });
}

export function usePayslips() {
  return useQuery<PayslipItem[]>({
    queryKey: ['payslips'],
    queryFn: async () => {
      const data = await apiClient.payroll.getMyPayroll();
      return data?.payslips || [];
    },
  });
}

export function useNotifications() {
  return useQuery<NotificationItem[]>({
    queryKey: ['notifications'],
    queryFn: async () => {
      const data = await apiClient.notifications.getMe();
      return Array.isArray(data) ? data : [];
    },
  });
}

export function useMarkNotificationRead() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => apiClient.notifications.markAsRead(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notifications'] });
    },
  });
}

export function useMarkAllNotificationsRead() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: () => apiClient.notifications.markAllAsRead(),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notifications'] });
    },
  });
}
