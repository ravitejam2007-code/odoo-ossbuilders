import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import type { Employee, AttendanceRecord, LeaveRequest, LeaveBalance, Payslip, NotificationItem } from '../types/api';
import { MOCK_COLLEAGUES, MOCK_ATTENDANCE, MOCK_LEAVE_REQUESTS, MOCK_LEAVE_BALANCE, MOCK_PAYSLIPS, MOCK_NOTIFICATIONS } from '../api/mockData';

// Simulated API delays to demonstrate genuine loading/skeleton states
const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export function useColleagues() {
  return useQuery<Employee[]>({
    queryKey: ['colleagues'],
    queryFn: async () => {
      await delay(300);
      return MOCK_COLLEAGUES;
    },
    staleTime: 1000 * 60 * 5,
  });
}

export function useAttendanceRecords(employeeId?: string, period: 'daily' | 'weekly' = 'daily') {
  return useQuery<AttendanceRecord[]>({
    queryKey: ['attendance', employeeId, period],
    queryFn: async () => {
      await delay(300);
      const stored = localStorage.getItem('dayflow_attendance_records');
      const custom: AttendanceRecord[] = stored ? JSON.parse(stored) : [];
      const combined = [...custom, ...MOCK_ATTENDANCE];

      const filtered = combined.filter((rec) => !employeeId || rec.employeeId === employeeId);

      if (period === 'daily') {
        return filtered.slice(0, 5);
      }
      return filtered;
    },
  });
}

export function useCheckInMutation(employeeId?: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async () => {
      await delay(500);
      const now = new Date();
      const timeStr = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
      const dateStr = now.toISOString().split('T')[0];
      const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
      const dayOfWeek = days[now.getDay()];

      const newRecord: AttendanceRecord = {
        id: `att-${Date.now()}`,
        employeeId: employeeId || 'emp-001',
        employeeName: 'John Doe',
        date: dateStr,
        dayOfWeek,
        checkIn: timeStr,
        checkOut: '--:--',
        workHours: '00:01',
        extraHours: '00:00',
        status: 'present',
      };

      const stored = localStorage.getItem('dayflow_attendance_records');
      const custom: AttendanceRecord[] = stored ? JSON.parse(stored) : [];
      localStorage.setItem('dayflow_attendance_records', JSON.stringify([newRecord, ...custom]));

      return { record: newRecord, timeStr };
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['attendance'] });
      queryClient.invalidateQueries({ queryKey: ['current-user'] });
    },
  });
}

export function useCheckOutMutation(employeeId?: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async () => {
      await delay(500);
      const now = new Date();
      const timeStr = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

      const stored = localStorage.getItem('dayflow_attendance_records');
      const custom: AttendanceRecord[] = stored ? JSON.parse(stored) : [];
      if (custom.length > 0) {
        custom[0].checkOut = timeStr;
        custom[0].workHours = '08:30';
        localStorage.setItem('dayflow_attendance_records', JSON.stringify(custom));
      }

      return { timeStr };
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['attendance'] });
      queryClient.invalidateQueries({ queryKey: ['current-user'] });
    },
  });
}

export function useLeaveRequests(employeeId?: string) {
  return useQuery<LeaveRequest[]>({
    queryKey: ['leave-requests', employeeId],
    queryFn: async () => {
      await delay(300);
      const stored = localStorage.getItem('dayflow_custom_leaves');
      const custom: LeaveRequest[] = stored ? JSON.parse(stored) : [];
      const combined = [...custom, ...MOCK_LEAVE_REQUESTS];
      return combined.filter((req) => !employeeId || req.employeeId === employeeId);
    },
  });
}

export function useLeaveBalance(employeeId?: string) {
  return useQuery<LeaveBalance>({
    queryKey: ['leave-balance', employeeId],
    queryFn: async () => {
      await delay(200);
      return MOCK_LEAVE_BALANCE;
    },
  });
}

export function useCreateLeaveRequest() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (newLeave: Omit<LeaveRequest, 'id' | 'createdAt' | 'status'>) => {
      await delay(400);
      const created: LeaveRequest = {
        ...newLeave,
        id: `leave-${Date.now()}`,
        status: 'pending',
        createdAt: new Date().toISOString().split('T')[0],
      };

      const stored = localStorage.getItem('dayflow_custom_leaves');
      const custom: LeaveRequest[] = stored ? JSON.parse(stored) : [];
      localStorage.setItem('dayflow_custom_leaves', JSON.stringify([created, ...custom]));

      return created;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['leave-requests'] });
      queryClient.invalidateQueries({ queryKey: ['leave-balance'] });
    },
  });
}

export function usePayslips(employeeId?: string) {
  return useQuery<Payslip[]>({
    queryKey: ['payslips', employeeId],
    queryFn: async () => {
      await delay(300);
      return MOCK_PAYSLIPS.filter((p) => !employeeId || p.employeeId === employeeId);
    },
  });
}

export function useNotifications() {
  const queryClient = useQueryClient();

  const query = useQuery<NotificationItem[]>({
    queryKey: ['notifications'],
    queryFn: async () => {
      await delay(200);
      return MOCK_NOTIFICATIONS;
    },
  });

  const markAsRead = useMutation({
    mutationFn: async (notificationId: string) => {
      await delay(100);
      return notificationId;
    },
    onSuccess: (id) => {
      queryClient.setQueryData<NotificationItem[]>(['notifications'], (old) =>
        old ? old.map((n) => (n.id === id ? { ...n, read: true } : n)) : []
      );
    },
  });

  return { ...query, markAsRead };
}
