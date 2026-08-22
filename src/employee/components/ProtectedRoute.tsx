import React from 'react';
import { useAuth } from '../context/AuthContext';
import { Card } from '../../shared/Card';
import { Button } from '../../shared/Button';
import { Lock } from 'lucide-react';

export interface ProtectedRouteProps {
  children: React.ReactNode;
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const { isAuthenticated } = useAuth();

  if (!isAuthenticated) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center p-4">
        <Card className="max-w-md w-full p-8 text-center space-y-4 bg-white border-zinc-200 shadow-2xs">
          <div className="w-12 h-12 rounded-xl bg-zinc-100 border border-zinc-200 flex items-center justify-center mx-auto text-zinc-950">
            <Lock className="w-6 h-6" />
          </div>
          <h2 className="text-xl font-bold text-zinc-950 tracking-tight">Authentication Required</h2>
          <p className="text-xs text-zinc-500">
            Please log in with your employee credentials to access your portal.
          </p>
          <a href="/login">
            <Button variant="primary" size="md" className="w-full mt-2">
              Go to Employee Sign In
            </Button>
          </a>
        </Card>
      </div>
    );
  }

  return <>{children}</>;
};
