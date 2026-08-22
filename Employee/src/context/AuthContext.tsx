import React, { createContext, useContext, useState, useEffect } from 'react';
import type { Employee, WorkStatus } from '../types/api';
import { INITIAL_EMPLOYEE, generateLoginId } from '../api/mockData';

interface AuthContextType {
  currentUser: Employee | null;
  isAuthenticated: boolean;
  login: (loginIdOrEmail: string, password?: string) => boolean;
  signup: (companyName: string, name: string, email: string, phone: string) => { success: boolean; loginId?: string };
  logout: () => void;
  checkIn: () => void;
  checkOut: () => void;
  checkInTime: string | null;
  updateProfile: (updatedFields: Partial<Employee>) => void;
}

const STORAGE_KEY = 'dayflow_user_session';
const CHECKIN_KEY = 'dayflow_checkin_time';

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<Employee | null>(null);
  const [checkInTime, setCheckInTime] = useState<string | null>(null);
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      const storedCheckIn = localStorage.getItem(CHECKIN_KEY);

      if (stored) {
        setCurrentUser(JSON.parse(stored));
      } else {
        // Default demo session for immediate smooth testing
        setCurrentUser(INITIAL_EMPLOYEE);
        localStorage.setItem(STORAGE_KEY, JSON.stringify(INITIAL_EMPLOYEE));
      }

      if (storedCheckIn) {
        setCheckInTime(storedCheckIn);
      }
    } catch {
      setCurrentUser(INITIAL_EMPLOYEE);
    } finally {
      setIsInitialized(true);
    }
  }, []);

  const saveUser = (user: Employee | null) => {
    setCurrentUser(user);
    if (user) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(user));
    } else {
      localStorage.removeItem(STORAGE_KEY);
    }
  };

  const login = (loginIdOrEmail: string): boolean => {
    const trimmed = loginIdOrEmail.trim().toLowerCase();
    let user = INITIAL_EMPLOYEE;
    if (trimmed.includes('@')) {
      user = { ...INITIAL_EMPLOYEE, email: trimmed };
    } else if (trimmed) {
      user = { ...INITIAL_EMPLOYEE, loginId: trimmed.toUpperCase() };
    }
    saveUser(user);
    return true;
  };

  const signup = (companyName: string, name: string, email: string, phone: string) => {
    const nameParts = name.trim().split(' ');
    const firstName = nameParts[0] || 'User';
    const lastName = nameParts.slice(1).join(' ') || 'Name';
    const year = new Date().getFullYear();
    const loginId = generateLoginId(companyName, firstName, lastName, year, Math.floor(Math.random() * 9000) + 1000);

    const newUser: Employee = {
      ...INITIAL_EMPLOYEE,
      id: `emp-${Date.now()}`,
      loginId,
      name,
      email,
      phone,
      company: companyName,
      workStatus: 'present',
    };

    saveUser(newUser);
    return { success: true, loginId };
  };

  const logout = () => {
    saveUser(null);
    localStorage.removeItem(CHECKIN_KEY);
    setCheckInTime(null);
    if (typeof window !== 'undefined') {
      window.location.href = '/login';
    }
  };

  const checkIn = () => {
    if (!currentUser) return;
    const now = new Date();
    const timeStr = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    setCheckInTime(timeStr);
    localStorage.setItem(CHECKIN_KEY, timeStr);

    const updated = { ...currentUser, workStatus: 'present' as WorkStatus };
    saveUser(updated);
  };

  const checkOut = () => {
    if (!currentUser) return;
    setCheckInTime(null);
    localStorage.removeItem(CHECKIN_KEY);

    const updated = { ...currentUser, workStatus: 'absent' as WorkStatus };
    saveUser(updated);
  };

  const updateProfile = (updatedFields: Partial<Employee>) => {
    if (!currentUser) return;
    const updated = { ...currentUser, ...updatedFields };
    saveUser(updated);
  };

  if (!isInitialized) {
    return null;
  }

  return (
    <AuthContext.Provider
      value={{
        currentUser,
        isAuthenticated: !!currentUser,
        login,
        signup,
        logout,
        checkIn,
        checkOut,
        checkInTime,
        updateProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
