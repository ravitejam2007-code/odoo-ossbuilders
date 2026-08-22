import React from 'react';
import { EmployeeShell } from '../layout/EmployeeShell';
import { NotificationsView } from '../views/NotificationsView';

export const NotificationsPage: React.FC = () => {
  return (
    <EmployeeShell currentRoute="/notifications">
      <NotificationsView />
    </EmployeeShell>
  );
};
