import React from 'react';
import { useAdminAuth } from '../context/AdminAuthContext';
import { Card } from '../../shared/Card';
import { Button } from '../../shared/Button';
import { ShieldAlert, Lock, ArrowLeft } from 'lucide-react';

export interface ProtectedAdminRouteProps {
  children: React.ReactNode;
}

export const ProtectedAdminRoute: React.FC<ProtectedAdminRouteProps> = ({ children }) => {
  const { adminUser, isAuthenticated, isAdminOrHr } = useAdminAuth();

  if (!isAuthenticated) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center p-4">
        <Card className="max-w-md w-full p-8 text-center space-y-4 bg-white border-zinc-200 shadow-2xs">
          <div className="w-12 h-12 rounded-xl bg-zinc-100 border border-zinc-200 flex items-center justify-center mx-auto text-zinc-950">
            <Lock className="w-6 h-6" />
          </div>
          <h2 className="text-xl font-bold text-zinc-950 tracking-tight">Admin Authentication Required</h2>
          <p className="text-xs text-zinc-500">
            Please log in with an authorized Admin or HR Officer account to access this page.
          </p>
          <a href="/admin/login">
            <Button variant="primary" size="md" className="w-full mt-2">
              Go to Admin Login
            </Button>
          </a>
        </Card>
      </div>
    );
  }

  if (!isAdminOrHr) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center p-4">
        <Card className="max-w-md w-full p-8 text-center space-y-4 bg-rose-50/50 border-rose-200 shadow-2xs">
          <div className="w-12 h-12 rounded-xl bg-rose-100 border border-rose-200 flex items-center justify-center mx-auto text-rose-700">
            <ShieldAlert className="w-6 h-6" />
          </div>
          <h2 className="text-xl font-bold text-rose-950 tracking-tight">403 — Permission Denied</h2>
          <p className="text-xs text-rose-800">
            Your account ({adminUser?.email}) does not have administrative privileges to view this section.
          </p>
          <a href="/admin/dashboard">
            <Button variant="secondary" size="md" className="w-full mt-2">
              <ArrowLeft className="w-4 h-4 mr-2" />
              <span>Back to Dashboard</span>
            </Button>
          </a>
        </Card>
      </div>
    );
  }

  return <>{children}</>;
};
