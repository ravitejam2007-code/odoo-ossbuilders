import React from 'react';
import { EmployeeShell } from '../layout/EmployeeShell';
import { DashboardView } from '../views/DashboardView';

export const DashboardPage: React.FC = () => {
  return (
    <EmployeeShell currentRoute="/dashboard">
      <DashboardView />
    </EmployeeShell>
  );
};
