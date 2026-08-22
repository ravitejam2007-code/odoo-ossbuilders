import React from 'react';
import { ProtectedRoute } from './ProtectedRoute';
import { SystrayHeader } from './SystrayHeader';

export interface EmployeeShellProps {
  currentRoute?: string;
  children: React.ReactNode;
}

export const EmployeeShell: React.FC<EmployeeShellProps> = ({
  currentRoute = '/dashboard',
  children,
}) => {
  return (
    <ProtectedRoute>
      {/* DESIGN-meta: canvas white bg, min full viewport height */}
      <div className="min-h-screen bg-[#ffffff] flex flex-col font-sans text-[#1c1e21]">
        <SystrayHeader currentRoute={currentRoute} />
        {/* DESIGN-meta: 1280px max-width, 32–48px horizontal gutters */}
        <main
          className="flex-1 w-full max-w-[1280px] mx-auto px-6 lg:px-8 py-8 space-y-6"
          id="main-content"
        >
          {children}
        </main>
        {/* DESIGN-meta: Clean professional employee portal footer */}
        <footer className="w-full border-t border-[#dee3e9] bg-[#ffffff] py-6 px-6 lg:px-8 mt-auto">
          <div className="max-w-[1280px] mx-auto flex flex-col sm:flex-row items-center justify-between gap-3 text-[12px] text-[#8595a4]">
            <div className="flex items-center gap-2">
              <img
                src="/logo.jpg"
                alt="Dayflow Logo"
                className="w-5 h-5 rounded-[4px] object-cover border border-[#dee3e9] shadow-2xs"
              />
              <span className="font-bold text-[#0a1317] tracking-[-0.14px]">Dayflow HRMS</span>
              <span>&bull; Employee Self-Service</span>
            </div>
            <p>&copy; 2026 Dayflow HRMS. All rights reserved.</p>
          </div>
        </footer>
      </div>
    </ProtectedRoute>
  );
};
