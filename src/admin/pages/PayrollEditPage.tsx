import React from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { AdminAuthProvider } from '../context/AdminAuthContext';
import { LenisProvider } from '../../shared/LenisProvider';
import { AdminShell } from '../components/AdminShell';
import { AdminPayrollEditView } from '../views/AdminPayrollEditView';

const queryClient = new QueryClient({
  defaultOptions: { queries: { staleTime: 1000 * 60 * 5, refetchOnWindowFocus: false } },
});

export const PayrollEditPage: React.FC<{ id: string }> = ({ id }) => {
  return (
    <QueryClientProvider client={queryClient}>
      <AdminAuthProvider>
        <LenisProvider>
          <AdminShell
            currentRoute="/admin/payroll"
            breadcrumbItems={[
              { label: 'Payroll', href: '/admin/payroll' },
              { label: 'Configure Wage Structure' },
            ]}
          >
            <AdminPayrollEditView id={id} />
          </AdminShell>
        </LenisProvider>
      </AdminAuthProvider>
    </QueryClientProvider>
  );
};
