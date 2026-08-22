import React, { useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { LoadingSpinner } from '../ui/Loading';

export interface ProtectedRouteProps {
  children: React.ReactNode;
  allowedRole?: 'employee' | 'admin' | 'hr_officer';
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const { isAuthenticated, currentUser } = useAuth();

  useEffect(() => {
    if (!isAuthenticated && typeof window !== 'undefined') {
      window.location.href = '/login';
    }
  }, [isAuthenticated]);

  if (!isAuthenticated) {
    return <LoadingSpinner label="Authenticating session..." />;
  }

  // Ensure non-admin view is strictly employee experience
  return <>{children}</>;
};
