import React from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { AuthProvider } from '../context/AuthContext';
import { LenisProvider } from '../../shared/LenisProvider';
import { EmployeeShell } from '../components/EmployeeShell';
import { LeaveNewView } from '../views/LeaveNewView';

const queryClient = new QueryClient({
  defaultOptions: { queries: { staleTime: 1000 * 60 * 5, refetchOnWindowFocus: false } },
});

export const LeaveNewPage: React.FC = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <LenisProvider>
          <EmployeeShell currentRoute="/leave">
            <LeaveNewView />
          </EmployeeShell>
        </LenisProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
};
