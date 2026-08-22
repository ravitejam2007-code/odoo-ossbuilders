import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import type { Employee, AttendanceRecord, AuthSession, SignupResponse, WorkStatus } from '../types/api';
import { apiClient, getStoredSession, setAuthSession, clearAuthSession, getAuthToken } from '../api/apiClient';

export interface AuthContextType {
  currentUser: Employee | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  checkInTime: string | null;
  login: (loginIdOrEmail: string, password?: string) => Promise<AuthSession>;
  signup: (data: {
    companyName?: string;
    name: string;
    email: string;
    phone?: string;
    password?: string;
    role?: string;
  }) => Promise<SignupResponse>;
  logout: () => Promise<void>;
  checkIn: () => Promise<AttendanceRecord>;
  checkOut: () => Promise<AttendanceRecord>;
  updateCurrentUserProfile: (updated: Partial<Employee>) => Promise<Employee>;
  refreshCurrentUser: () => Promise<Employee | null>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<Employee | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [checkInTime, setCheckInTime] = useState<string | null>(null);

  const refreshCurrentUser = useCallback(async (): Promise<Employee | null> => {
    const token = getAuthToken();
    if (!token) {
      setCurrentUser(null);
      setIsLoading(false);
      return null;
    }

    try {
      const profile = await apiClient.profile.getMe();
      if (profile) {
        setCurrentUser(profile);
        const session = getStoredSession();
        if (session) {
          setAuthSession({ ...session, user: profile });
        }
        return profile;
      }
    } catch {
      // If fetching fails with 401 / unauth, clear session
      const session = getStoredSession();
      if (session?.user) {
        setCurrentUser(session.user);
      } else {
        clearAuthSession();
        setCurrentUser(null);
      }
    } finally {
      setIsLoading(false);
    }
    return null;
  }, []);

  useEffect(() => {
    // 1. Initial hydration from stored session
    const session = getStoredSession();
    if (session?.user) {
      setCurrentUser(session.user);
    }

    // 2. Fetch live profile from backend
    refreshCurrentUser();
  }, [refreshCurrentUser]);

  const login = async (loginIdOrEmail: string, password?: string): Promise<AuthSession> => {
    setIsLoading(true);
    try {
      const session = await apiClient.auth.login(loginIdOrEmail, password);
      setAuthSession(session);
      
      // Load latest detailed profile immediately
      try {
        const fullProfile = await apiClient.profile.getMe();
        const updatedSession = { ...session, user: fullProfile };
        setAuthSession(updatedSession);
        setCurrentUser(fullProfile);
      } catch {
        setCurrentUser(session.user);
      }

      return session;
    } finally {
      setIsLoading(false);
    }
  };

  const signup = async (data: {
    companyName?: string;
    name: string;
    email: string;
    phone?: string;
    password?: string;
    role?: string;
  }): Promise<SignupResponse> => {
    setIsLoading(true);
    try {
      const response = await apiClient.auth.signup({
        companyName: data.companyName || 'Dayflow Inc',
        name: data.name,
        email: data.email,
        phone: data.phone || '+91 98765 43210',
        password: data.password || 'Password@1234',
        role: data.role || 'employee',
      });
      return response;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async (): Promise<void> => {
    try {
      await apiClient.auth.logout();
    } catch {
      // Proceed with local cleanup even if network request fails
    } finally {
      clearAuthSession();
      setCurrentUser(null);
      setCheckInTime(null);
      if (typeof window !== 'undefined') {
        window.location.href = '/login';
      }
    }
  };

  const checkIn = async (): Promise<AttendanceRecord> => {
    const record = await apiClient.attendance.checkIn();
    if (record.checkIn) {
      setCheckInTime(record.checkIn);
    }
    if (currentUser) {
      setCurrentUser({ ...currentUser, workStatus: 'present' as WorkStatus });
    }
    await refreshCurrentUser();
    return record;
  };

  const checkOut = async (): Promise<AttendanceRecord> => {
    const record = await apiClient.attendance.checkOut();
    setCheckInTime(null);
    if (currentUser) {
      setCurrentUser({ ...currentUser, workStatus: 'absent' as WorkStatus });
    }
    await refreshCurrentUser();
    return record;
  };

  const updateCurrentUserProfile = async (updated: Partial<Employee>): Promise<Employee> => {
    const saved = await apiClient.profile.updateMe(updated);
    setCurrentUser(saved);
    const session = getStoredSession();
    if (session) {
      setAuthSession({ ...session, user: saved });
    }
    return saved;
  };

  return (
    <AuthContext.Provider
      value={{
        currentUser,
        isAuthenticated: !!currentUser && !!getAuthToken(),
        isLoading,
        checkInTime,
        login,
        signup,
        logout,
        checkIn,
        checkOut,
        updateCurrentUserProfile,
        refreshCurrentUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
