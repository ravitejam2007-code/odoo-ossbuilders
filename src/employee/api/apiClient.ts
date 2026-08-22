/**
 * Dayflow HRMS Frontend API Client
 * Connects frontend TanStack Query hooks to the Express / Supabase backend
 */

const API_BASE_URL = typeof window !== 'undefined' && (window as any).API_BASE_URL 
  ? (window as any).API_BASE_URL 
  : 'http://localhost:4000/api/v1';

function getAuthToken(): string | null {
  if (typeof window === 'undefined') return null;
  try {
    const session = localStorage.getItem('dayflow_token') || localStorage.getItem('dayflow_user_session');
    if (session) {
      const parsed = JSON.parse(session);
      return parsed.accessToken || parsed.token || null;
    }
  } catch {
    return null;
  }
  return null;
}

async function apiRequest<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const token = getAuthToken();
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(options.headers as Record<string, string>),
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers,
  });

  const json = await response.json();

  if (!response.ok || json.error) {
    throw new Error(json.error?.message || json.message || `API Error: ${response.status}`);
  }

  return json.data !== undefined ? json.data : json;
}

export const apiClient = {
  // Auth
  auth: {
    signup: (data: any) => apiRequest<any>('/auth/signup', { method: 'POST', body: JSON.stringify(data) }),
    login: (loginIdOrEmail: string, password?: string) =>
      apiRequest<any>('/auth/login', { method: 'POST', body: JSON.stringify({ loginIdOrEmail, password }) }),
    verifyEmail: (token: string, loginId?: string) =>
      apiRequest<any>('/auth/verify-email', { method: 'POST', body: JSON.stringify({ token, loginId }) }),
    logout: () => apiRequest<any>('/auth/logout', { method: 'POST' }),
  },

  // Profile
  profile: {
    getMe: () => apiRequest<any>('/profile/me'),
    updateMe: (fields: any) => apiRequest<any>('/profile/me', { method: 'PATCH', body: JSON.stringify(fields) }),
  },

  // Attendance
  attendance: {
    getMyAttendance: (month?: string) =>
      apiRequest<any>(`/attendance/me${month ? `?month=${month}` : ''}`),
    checkIn: () => apiRequest<any>('/attendance/check-in', { method: 'POST' }),
    checkOut: () => apiRequest<any>('/attendance/check-out', { method: 'POST' }),
    getAll: (filters?: { date?: string; month?: string; department?: string }) => {
      const q = new URLSearchParams(filters as any).toString();
      return apiRequest<any>(`/attendance${q ? `?${q}` : ''}`);
    },
  },

  // Leave
  leave: {
    getMyLeave: () => apiRequest<any>('/leave/me'),
    getMyBalance: () => apiRequest<any>('/leave/me/balance'),
    apply: (data: any) => apiRequest<any>('/leave', { method: 'POST', body: JSON.stringify(data) }),
    getAll: (status?: string) => apiRequest<any>(`/leave${status ? `?status=${status}` : ''}`),
    review: (id: string, decision: 'approved' | 'rejected', adminComment?: string) =>
      apiRequest<any>(`/leave/${id}/decision`, {
        method: 'PATCH',
        body: JSON.stringify({ status: decision, adminComment }),
      }),
  },

  // Payroll
  payroll: {
    getMyPayroll: () => apiRequest<any>('/payroll/me'),
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
    getMe: () => apiRequest<any>('/notifications/me'),
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
