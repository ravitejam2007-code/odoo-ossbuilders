import React from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { AuthProvider } from '../context/AuthContext';
import { LenisProvider } from '../../shared/LenisProvider';
import { EmployeeShell } from '../components/EmployeeShell';
import { DashboardView } from '../views/DashboardView';

const queryClient = new QueryClient({
  defaultOptions: { queries: { staleTime: 1000 * 60 * 5, refetchOnWindowFocus: false } },
});

export const DashboardPage: React.FC = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <LenisProvider>
          <EmployeeShell currentRoute="/dashboard">
            <DashboardView />
          </EmployeeShell>
        </LenisProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
};
