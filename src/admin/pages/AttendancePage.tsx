import React from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { AdminAuthProvider } from '../context/AdminAuthContext';
import { LenisProvider } from '../../shared/LenisProvider';
import { AdminShell } from '../components/AdminShell';
import { AdminAttendanceView } from '../views/AdminAttendanceView';

const queryClient = new QueryClient({
  defaultOptions: { queries: { staleTime: 1000 * 60 * 5, refetchOnWindowFocus: false } },
});

export const AttendancePage: React.FC = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <AdminAuthProvider>
        <LenisProvider>
          <AdminShell currentRoute="/admin/attendance" breadcrumbItems={[{ label: 'Attendance', href: '/admin/attendance' }]}>
            <AdminAttendanceView />
          </AdminShell>
        </LenisProvider>
      </AdminAuthProvider>
    </QueryClientProvider>
  );
};
