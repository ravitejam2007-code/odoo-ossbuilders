/**
 * Dayflow HRMS Frontend API Client
 * Connects frontend TanStack Query hooks to the Express / Supabase backend
 */

import type {
  Employee,
  AttendanceResponse,
  AttendanceRecord,
  LeaveRequest,
  LeaveBalance,
  PayrollResponse,
  NotificationItem,
  AuthSession,
  SignupResponse,
} from '../types/api';

const API_BASE_URL =
  (typeof import.meta !== 'undefined' && import.meta.env?.PUBLIC_API_BASE_URL) ||
  (typeof window !== 'undefined' && (window as any).API_BASE_URL) ||
  '/api/v1';

export const AUTH_STORAGE_KEY = 'dayflow_auth_session';

export function getStoredSession(): AuthSession | null {
  if (typeof window === 'undefined') return null;
  try {
    const raw = localStorage.getItem(AUTH_STORAGE_KEY);
    if (!raw) return null;
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

export function getAuthToken(): string | null {
  const session = getStoredSession();
  return session?.accessToken || null;
}

export function getRefreshToken(): string | null {
  const session = getStoredSession();
  return session?.refreshToken || null;
}

export function setAuthSession(session: AuthSession): void {
  if (typeof window === 'undefined') return;
  localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(session));
}

export function clearAuthSession(): void {
  if (typeof window === 'undefined') return;
  localStorage.removeItem(AUTH_STORAGE_KEY);
  // Also clean up any legacy keys
  localStorage.removeItem('dayflow_employee_user');
  localStorage.removeItem('dayflow_token');
  localStorage.removeItem('dayflow_user_session');
}

export class ApiError extends Error {
  code: string;
  details?: any[];
  status: number;

  constructor(message: string, code: string = 'UNKNOWN_ERROR', status: number = 500, details?: any[]) {
    super(message);
    this.name = 'ApiError';
    this.code = code;
    this.status = status;
    this.details = details;
  }
}

let isRefreshing = false;
let refreshPromise: Promise<string | null> | null = null;

async function refreshAccessToken(): Promise<string | null> {
  const rToken = getRefreshToken();
  if (!rToken) return null;

  try {
    const response = await fetch(`${API_BASE_URL}/auth/refresh`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ refreshToken: rToken }),
    });

    const json = await response.json();
    if (!response.ok || json.error) {
      clearAuthSession();
      return null;
    }

    const newAccessToken = json.data?.accessToken;
    if (newAccessToken) {
      const current = getStoredSession();
      if (current) {
        setAuthSession({ ...current, accessToken: newAccessToken });
      }
      return newAccessToken;
    }
    return null;
  } catch {
    clearAuthSession();
    return null;
  }
}

async function apiRequest<T>(endpoint: string, options: RequestInit = {}, isRetry: boolean = false): Promise<T> {
  const token = getAuthToken();
  const isFormData = typeof FormData !== 'undefined' && options.body instanceof FormData;

  const headers: Record<string, string> = {
    ...(options.headers as Record<string, string>),
  };

  if (!isFormData && !headers['Content-Type']) {
    headers['Content-Type'] = 'application/json';
  }

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers,
  });

  // Handle Token Expiry & Automatic Refresh (401)
  if (response.status === 401 && !isRetry && !endpoint.startsWith('/auth/')) {
    if (!isRefreshing) {
      isRefreshing = true;
      refreshPromise = refreshAccessToken().finally(() => {
        isRefreshing = false;
      });
    }

    const newToken = await refreshPromise;
    if (newToken) {
      return apiRequest<T>(endpoint, options, true);
    }
  }

  let json: any;
  try {
    json = await response.json();
  } catch {
    throw new ApiError(
      `API server responded with status ${response.status}`,
      'NETWORK_ERROR',
      response.status
    );
  }

  if (!response.ok || json.error) {
    const code = json.error?.code || (response.status === 401 ? 'UNAUTHORIZED' : 'API_ERROR');
    const message = json.error?.message || json.message || `Request failed with status ${response.status}`;
    throw new ApiError(message, code, response.status, json.error?.details);
  }

  return json.data !== undefined ? json.data : json;
}

export const apiClient = {
  // Auth
  auth: {
    signup: (data: {
      companyName?: string;
      name: string;
      email: string;
      phone?: string;
      password?: string;
      role?: string;
    }) => apiRequest<SignupResponse>('/auth/signup', { method: 'POST', body: JSON.stringify(data) }),

    login: (loginIdOrEmail: string, password?: string) =>
      apiRequest<AuthSession>('/auth/login', {
        method: 'POST',
        body: JSON.stringify({ loginIdOrEmail, password }),
      }),

    verifyEmail: (token: string, loginId?: string) =>
      apiRequest<{ message: string }>('/auth/verify-email', {
        method: 'POST',
        body: JSON.stringify({ token, loginId }),
      }),

    refresh: (refreshToken: string) =>
      apiRequest<{ accessToken: string }>('/auth/refresh', {
        method: 'POST',
        body: JSON.stringify({ refreshToken }),
      }),

    logout: () => apiRequest<{ message: string }>('/auth/logout', { method: 'POST' }),
  },

  // Profile
  profile: {
    getMe: () => apiRequest<Employee>('/profile/me'),
    updateMe: (fields: Partial<Employee>) =>
      apiRequest<Employee>('/profile/me', {
        method: 'PATCH',
        body: JSON.stringify(fields),
      }),
  },

  // Attendance
  attendance: {
    getMyAttendance: (month?: string) =>
      apiRequest<AttendanceResponse>(`/attendance/me${month ? `?month=${month}` : ''}`),

    checkIn: () => apiRequest<AttendanceRecord>('/attendance/check-in', { method: 'POST' }),

    checkOut: () => apiRequest<AttendanceRecord>('/attendance/check-out', { method: 'POST' }),

    getAll: (filters?: { date?: string; month?: string; department?: string }) => {
      const q = new URLSearchParams(filters as any).toString();
      return apiRequest<any>(`/attendance${q ? `?${q}` : ''}`);
    },
  },

  // Leave
  leave: {
    getMyLeave: () => apiRequest<{ requests: LeaveRequest[] }>('/leave/me'),

    getMyBalance: () => apiRequest<LeaveBalance>('/leave/me/balance'),

    apply: (data: {
      leaveType: string;
      startDate: string;
      endDate: string;
      daysCount: number;
      reason?: string;
      attachmentName?: string;
      attachmentUrl?: string;
    }) =>
      apiRequest<LeaveRequest>('/leave', {
        method: 'POST',
        body: JSON.stringify(data),
      }),

    upload: async (file: File): Promise<{ attachmentName: string; attachmentUrl: string }> => {
      const formData = new FormData();
      formData.append('attachment', file);
      return apiRequest<{ attachmentName: string; attachmentUrl: string }>('/leave/upload', {
        method: 'POST',
        body: formData,
      });
    },

    getAll: (status?: string) => apiRequest<any>(`/leave${status ? `?status=${status}` : ''}`),

    review: (id: string, decision: 'approved' | 'rejected', adminComment?: string) =>
      apiRequest<any>(`/leave/${id}/decision`, {
        method: 'PATCH',
        body: JSON.stringify({ status: decision, adminComment }),
      }),
  },

  // Payroll
  payroll: {
    getMyPayroll: () => apiRequest<PayrollResponse>('/payroll/me'),
    getAll: () => apiRequest<any>('/payroll'),
    updateSalary: (userId: string, data: any) =>
      apiRequest<any>(`/payroll/${userId}`, { method: 'PATCH', body: JSON.stringify(data) }),
  },

  // Employees (Admin)
  employees: {
    list: (filters?: { search?: string; department?: string; role?: string; page?: number; limit?: number }) => {
      const q = new URLSearchParams(filters as any).toString();
      return apiRequest<any>(`/employees${q ? `?${q}` : ''}`);
    },
    getById: (id: string) => apiRequest<any>(`/employees/${id}`),
    update: (id: string, data: any) =>
      apiRequest<any>(`/employees/${id}`, { method: 'PATCH', body: JSON.stringify(data) }),
  },

  // Notifications
  notifications: {
    getMe: () => apiRequest<NotificationItem[]>('/notifications/me'),
    markAsRead: (id: string) => apiRequest<any>(`/notifications/${id}/read`, { method: 'PATCH' }),
    markAllAsRead: () => apiRequest<any>('/notifications/read-all', { method: 'PATCH' }),
  },

  // Reports
  reports: {
    getDashboardSummary: () => apiRequest<any>('/reports/dashboard'),
    getAttendanceSummary: (month?: string) =>
      apiRequest<any>(`/reports/attendance-summary${month ? `?month=${month}` : ''}`),
    getPayrollSummary: () => apiRequest<any>('/reports/payroll-summary'),
  },
};
