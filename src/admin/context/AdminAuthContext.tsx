import React, { createContext, useContext, useState, useEffect } from 'react';
import type { AdminEmployee, UserRole } from '../types/api';
import { getStoredSession, clearAuthSession, getAuthToken, apiClient } from '../../employee/api/apiClient';

export interface AdminAuthContextType {
  adminUser: AdminEmployee | null;
  role: UserRole | null;
  isAuthenticated: boolean;
  isAdminOrHr: boolean;
  login: (emailOrId: string, password?: string) => Promise<void>;
  logout: () => void;
}

const AdminAuthContext = createContext<AdminAuthContextType | undefined>(undefined);

export const AdminAuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [adminUser, setAdminUser] = useState<AdminEmployee | null>(null);

  useEffect(() => {
    const session = getStoredSession();
    if (session?.user) {
      setAdminUser(session.user as unknown as AdminEmployee);
    }
  }, []);

  const login = async (emailOrId: string, password?: string) => {
    const session = await apiClient.auth.login(emailOrId, password || 'Admin@1234');
    setAdminUser(session.user as unknown as AdminEmployee);
  };

  const logout = () => {
    apiClient.auth.logout().catch(() => {});
    clearAuthSession();
    setAdminUser(null);
    if (typeof window !== 'undefined') {
      window.location.href = '/admin/login';
    }
  };

  const role = (adminUser?.role as UserRole) || null;
  const isAuthenticated = !!adminUser && !!getAuthToken();
  const isAdminOrHr = role === 'admin' || role === 'hr_officer';

  return (
    <AdminAuthContext.Provider
      value={{
        adminUser,
        role,
        isAuthenticated,
        isAdminOrHr,
        login,
        logout,
      }}
    >
      {children}
    </AdminAuthContext.Provider>
  );
};

export const useAdminAuth = () => {
  const context = useContext(AdminAuthContext);
  if (!context) {
    throw new Error('useAdminAuth must be used within an AdminAuthProvider');
  }
  return context;
};
