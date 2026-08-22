import React from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { AdminAuthProvider } from '../context/AdminAuthContext';
import { LenisProvider } from '../../shared/LenisProvider';
import { AdminShell } from '../components/AdminShell';
import { AdminReportsView } from '../views/AdminReportsView';

const queryClient = new QueryClient({
  defaultOptions: { queries: { staleTime: 1000 * 60 * 5, refetchOnWindowFocus: false } },
});

export const ReportsPage: React.FC = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <AdminAuthProvider>
        <LenisProvider>
          <AdminShell currentRoute="/admin/reports" breadcrumbItems={[{ label: 'Reports', href: '/admin/reports' }]}>
            <AdminReportsView />
          </AdminShell>
        </LenisProvider>
      </AdminAuthProvider>
    </QueryClientProvider>
  );
};
