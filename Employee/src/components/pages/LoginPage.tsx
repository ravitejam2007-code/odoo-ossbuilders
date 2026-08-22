import React from 'react';
import { AppProviders } from '../providers/AppProviders';
import { LoginView } from '../views/LoginView';

export const LoginPage: React.FC = () => {
  return (
    <AppProviders>
      <LoginView />
    </AppProviders>
  );
};
