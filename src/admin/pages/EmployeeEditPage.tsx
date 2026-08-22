import React from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { AdminAuthProvider } from '../context/AdminAuthContext';
import { LenisProvider } from '../../shared/LenisProvider';
import { AdminShell } from '../components/AdminShell';
import { AdminEmployeeEditView } from '../views/AdminEmployeeEditView';

const queryClient = new QueryClient({
  defaultOptions: { queries: { staleTime: 1000 * 60 * 5, refetchOnWindowFocus: false } },
});

export const EmployeeEditPage: React.FC<{ id: string }> = ({ id }) => {
  return (
    <QueryClientProvider client={queryClient}>
      <AdminAuthProvider>
        <LenisProvider>
          <AdminShell
            currentRoute="/admin/employees"
            breadcrumbItems={[
              { label: 'Employees', href: '/admin/employees' },
              { label: 'Employee Record', href: `/admin/employees/${id}` },
              { label: 'Edit Record' },
            ]}
          >
            <AdminEmployeeEditView id={id} />
          </AdminShell>
        </LenisProvider>
      </AdminAuthProvider>
    </QueryClientProvider>
  );
};
