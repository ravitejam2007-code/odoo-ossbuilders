import React from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { AdminAuthProvider } from '../context/AdminAuthContext';
import { AdminLoginView } from '../views/AdminLoginView';

const queryClient = new QueryClient({
  defaultOptions: { queries: { staleTime: 1000 * 60 * 5, refetchOnWindowFocus: false } },
});

export const LoginPage: React.FC = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <AdminAuthProvider>
        <AdminLoginView />
      </AdminAuthProvider>
    </QueryClientProvider>
  );
};
