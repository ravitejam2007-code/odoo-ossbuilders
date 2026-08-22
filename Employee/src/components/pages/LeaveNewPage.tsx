import React from 'react';
import { EmployeeShell } from '../layout/EmployeeShell';
import { LeaveNewView } from '../views/LeaveNewView';

export const LeaveNewPage: React.FC = () => {
  return (
    <EmployeeShell currentRoute="/leave/new">
      <LeaveNewView />
    </EmployeeShell>
  );
};
