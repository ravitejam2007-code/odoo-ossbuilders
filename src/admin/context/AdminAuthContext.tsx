import React, { createContext, useContext, useState, useEffect } from 'react';
import type { AdminEmployee, UserRole } from '../types/api';

export interface AdminAuthContextType {
  adminUser: AdminEmployee | null;
  role: UserRole | null;
  isAuthenticated: boolean;
  isAdminOrHr: boolean;
  login: (emailOrId: string) => void;
  logout: () => void;
}

const AdminAuthContext = createContext<AdminAuthContextType | undefined>(undefined);

export const DEFAULT_ADMIN_USER: AdminEmployee = {
  id: 'emp-101',
  loginId: 'OIJODO20220001',
  name: 'Sarah Jenkins',
  email: 'sarah.jenkins@odoo.com',
  phone: '+91 98765 43210',
  company: 'Odoo India',
  department: 'Human Resources',
  jobTitle: 'HR Director / Admin',
  manager: 'Executive Board',
  avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150',
  role: 'admin',
  workStatus: 'present',
  joinedYear: 2020,
  serialNo: '0001',
};

export const AdminAuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [adminUser, setAdminUser] = useState<AdminEmployee | null>(DEFAULT_ADMIN_USER);

  useEffect(() => {
    const saved = localStorage.getItem('dayflow_admin_user');
    if (saved) {
      try {
        setAdminUser(JSON.parse(saved));
      } catch (e) {
        console.error('Failed to parse admin user session');
      }
    }
  }, []);

  const login = (emailOrId: string) => {
    const user = { ...DEFAULT_ADMIN_USER, email: emailOrId };
    setAdminUser(user);
    localStorage.setItem('dayflow_admin_user', JSON.stringify(user));
  };

  const logout = () => {
    setAdminUser(null);
    localStorage.removeItem('dayflow_admin_user');
  };

  const role = adminUser?.role || null;
  const isAuthenticated = !!adminUser;
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
