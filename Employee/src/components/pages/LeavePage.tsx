import React from 'react';
import { EmployeeShell } from '../layout/EmployeeShell';
import { LeaveView } from '../views/LeaveView';

export const LeavePage: React.FC = () => {
  return (
    <EmployeeShell currentRoute="/leave">
      <LeaveView />
    </EmployeeShell>
  );
};
