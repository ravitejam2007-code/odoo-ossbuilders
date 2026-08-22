import React from 'react';
import { EmployeeShell } from '../layout/EmployeeShell';
import { ProfileView } from '../views/ProfileView';

export const ProfilePage: React.FC = () => {
  return (
    <EmployeeShell currentRoute="/profile">
      <ProfileView />
    </EmployeeShell>
  );
};
