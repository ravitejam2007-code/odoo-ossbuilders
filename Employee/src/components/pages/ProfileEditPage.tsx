import React from 'react';
import { EmployeeShell } from '../layout/EmployeeShell';
import { ProfileEditView } from '../views/ProfileEditView';

export const ProfileEditPage: React.FC = () => {
  return (
    <EmployeeShell currentRoute="/profile/edit">
      <ProfileEditView />
    </EmployeeShell>
  );
};
