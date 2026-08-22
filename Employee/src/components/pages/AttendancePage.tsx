import React from 'react';
import { EmployeeShell } from '../layout/EmployeeShell';
import { AttendanceView } from '../views/AttendanceView';

export const AttendancePage: React.FC = () => {
  return (
    <EmployeeShell currentRoute="/attendance">
      <AttendanceView />
    </EmployeeShell>
  );
};
