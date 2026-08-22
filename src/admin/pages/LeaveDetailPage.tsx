import React from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { AdminAuthProvider } from '../context/AdminAuthContext';
import { LenisProvider } from '../../shared/LenisProvider';
import { AdminShell } from '../components/AdminShell';
import { AdminLeaveDetailView } from '../views/AdminLeaveDetailView';

const queryClient = new QueryClient({
  defaultOptions: { queries: { staleTime: 1000 * 60 * 5, refetchOnWindowFocus: false } },
});

export const LeaveDetailPage: React.FC<{ id: string }> = ({ id }) => {
  return (
    <QueryClientProvider client={queryClient}>
      <AdminAuthProvider>
        <LenisProvider>
          <AdminShell
            currentRoute="/admin/leave"
            breadcrumbItems={[
              { label: 'Leave', href: '/admin/leave' },
              { label: 'Leave Decision Review' },
            ]}
          >
            <AdminLeaveDetailView id={id} />
          </AdminShell>
        </LenisProvider>
      </AdminAuthProvider>
    </QueryClientProvider>
  );
};
