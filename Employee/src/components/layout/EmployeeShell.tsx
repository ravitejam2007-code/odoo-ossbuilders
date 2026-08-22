import React from 'react';
import { AppProviders } from '../providers/AppProviders';
import { ProtectedRoute } from '../auth/ProtectedRoute';
import { SystrayHeader } from './SystrayHeader';

export interface EmployeeShellProps {
  currentRoute: string;
  children: React.ReactNode;
  requireAuth?: boolean;
}

export const EmployeeShellContent: React.FC<{ currentRoute: string; children: React.ReactNode; requireAuth?: boolean }> = ({
  currentRoute,
  children,
  requireAuth = true,
}) => {
  const content = (
    <div className="min-h-screen flex flex-col bg-[#f8fafc]">
      <SystrayHeader currentRoute={currentRoute} />
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">{children}</main>
      <footer className="py-6 border-t border-meta-hairline-soft/60 bg-white text-center text-xs text-meta-stone">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-2">
          <p>&copy; {new Date().getFullYear()} Dayflow HRMS — Employee Experience Foundation</p>
          <div className="flex space-x-4">
            <a href="/profile" className="hover:underline">Profile</a>
            <a href="/leave" className="hover:underline">Time Off</a>
            <a href="/attendance" className="hover:underline">Attendance</a>
          </div>
        </div>
      </footer>
    </div>
  );

  return requireAuth ? <ProtectedRoute>{content}</ProtectedRoute> : content;
};

export const EmployeeShell: React.FC<EmployeeShellProps> = (props) => {
  return (
    <AppProviders>
      <EmployeeShellContent {...props} />
    </AppProviders>
  );
};
