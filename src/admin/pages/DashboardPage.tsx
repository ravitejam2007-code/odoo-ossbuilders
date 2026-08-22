import React from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { AdminAuthProvider } from '../context/AdminAuthContext';
import { LenisProvider } from '../../shared/LenisProvider';
import { AdminShell } from '../components/AdminShell';
import { AdminDashboardView } from '../views/AdminDashboardView';

const queryClient = new QueryClient({
  defaultOptions: { queries: { staleTime: 1000 * 60 * 5, refetchOnWindowFocus: false } },
});

export const DashboardPage: React.FC = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <AdminAuthProvider>
        <LenisProvider>
          <AdminShell currentRoute="/admin/dashboard" breadcrumbItems={[{ label: 'Admin Dashboard' }]}>
            <AdminDashboardView />
          </AdminShell>
        </LenisProvider>
      </AdminAuthProvider>
    </QueryClientProvider>
  );
};
