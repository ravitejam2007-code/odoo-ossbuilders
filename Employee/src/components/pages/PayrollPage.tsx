import React from 'react';
import { EmployeeShell } from '../layout/EmployeeShell';
import { PayrollView } from '../views/PayrollView';

export const PayrollPage: React.FC = () => {
  return (
    <EmployeeShell currentRoute="/payroll">
      <PayrollView />
    </EmployeeShell>
  );
};
