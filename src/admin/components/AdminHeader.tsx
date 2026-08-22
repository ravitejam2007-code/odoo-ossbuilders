import React, { useState } from 'react';
import { useAdminAuth } from '../context/AdminAuthContext';
import {
  LayoutDashboard, Users, Clock, Calendar,
  DollarSign, BarChart2, LogOut, Menu, X, ChevronDown
} from 'lucide-react';

const navItems = [
  { label: 'Dashboard',  href: '/admin/dashboard',   icon: LayoutDashboard },
  { label: 'Employees',  href: '/admin/employees',   icon: Users },
  { label: 'Attendance', href: '/admin/attendance',  icon: Clock },
  { label: 'Leave',      href: '/admin/leave',       icon: Calendar },
  { label: 'Payroll',    href: '/admin/payroll',     icon: DollarSign },
  { label: 'Reports',    href: '/admin/reports',     icon: BarChart2 },
];

interface AdminHeaderProps {
  currentRoute?: string;
}

export const AdminHeader: React.FC<AdminHeaderProps> = ({ currentRoute = '/admin/dashboard' }) => {
  const { adminUser, logout } = useAdminAuth();
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    // DESIGN-meta: sticky white nav bar, 64px height, bottom 1px solid hairline-soft
    <header className="sticky top-0 z-40 w-full bg-[#ffffff] border-b border-[#dee3e9]">
      <div className="max-w-[1280px] mx-auto px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">

          {/* Left: Brand Wordmark */}
          <div className="flex items-center flex-shrink-0">
            <a href="/admin/dashboard" className="flex items-center gap-2.5" aria-label="Dayflow Admin Portal">
              <img
                src="/logo.jpg"
                alt="Dayflow Logo"
                className="w-8 h-8 rounded-[8px] object-cover border border-[#dee3e9] shadow-2xs flex-shrink-0"
              />
              <div className="hidden sm:block">
                <span className="font-heading text-[18px] font-[600] uppercase tracking-[0.02em] text-[#0a1317]">Dayflow</span>
                <span className="text-[11px] font-bold uppercase tracking-[0.08em] text-[#8595a4] ml-2">Admin</span>
              </div>
            </a>
          </div>

          {/* Center: Centralized Pill-tab navigation */}
          <div className="hidden lg:flex flex-1 justify-center px-4">
            <nav className="flex items-center gap-1.5" aria-label="Admin navigation">
              {navItems.map((item) => {
                const Icon = item.icon;
                const isActive =
                  currentRoute === item.href ||
                  (item.href === '/admin/dashboard' && currentRoute === '/admin') ||
                  (item.href !== '/admin/dashboard' && item.href !== '/admin' && currentRoute.startsWith(item.href));

                return (
                  <a
                    key={item.href}
                    href={item.href}
                    className={[
                      'inline-flex items-center gap-1.5 px-3.5 py-1.5',
                      'rounded-full text-[13px] font-bold leading-[1.43] tracking-[-0.14px]',
                      'transition-colors duration-150 outline-none',
                      'focus-visible:ring-2 focus-visible:ring-[#1876f2]',
                      isActive
                        ? 'bg-[#0a1317] text-[#ffffff]'
                        : 'bg-[#ffffff] text-[#1c1e21] border border-[#ced0d4] hover:bg-[#f1f4f7]',
                    ].join(' ')}
                    aria-current={isActive ? 'page' : undefined}
                  >
                    <Icon className="w-3.5 h-3.5" aria-hidden="true" />
                    <span>{item.label}</span>
                  </a>
                );
              })}
            </nav>
          </div>

          {/* Right: user menu */}
          <div className="flex items-center gap-2 flex-shrink-0">
            {adminUser && (
              <div className="relative">
                <button
                  type="button"
                  onClick={() => setShowUserMenu(!showUserMenu)}
                  className={[
                    'flex items-center gap-2 h-10 px-3 rounded-full',
                    'bg-[#ffffff] border border-[#dee3e9]',
                    'hover:bg-[#f1f4f7] transition-colors cursor-pointer outline-none',
                    'focus-visible:ring-2 focus-visible:ring-[#1876f2]',
                  ].join(' ')}
                  aria-expanded={showUserMenu}
                  aria-haspopup="menu"
                >
                  <div className="w-6 h-6 rounded-full bg-[#0a1317] flex items-center justify-center flex-shrink-0">
                    <span className="text-white text-[10px] font-bold">
                      {adminUser.name?.charAt(0) || 'A'}
                    </span>
                  </div>
                  <span className="hidden sm:block text-[13px] font-bold text-[#0a1317] leading-[1.43] tracking-[-0.14px]">
                    {adminUser.name?.split(' ')[0] || 'Admin'}
                  </span>
                  <ChevronDown className="w-3 h-3 text-[#8595a4] hidden sm:block" />
                </button>

                {showUserMenu && (
                  <div className="absolute right-0 mt-2 w-52 bg-[#ffffff] rounded-[16px] border border-[#dee3e9] shadow-[rgba(20,22,26,0.3)_0px_1px_4px_0px] py-2 z-50 overflow-hidden">
                    <div className="px-4 py-3 border-b border-[#dee3e9]">
                      <p className="text-[14px] font-bold text-[#0a1317] tracking-[-0.14px]">{adminUser.name}</p>
                      <p className="text-[12px] font-normal text-[#8595a4] mt-0.5">{adminUser.role || 'HR Administrator'}</p>
                    </div>
                    <div className="py-1">
                      <button
                        type="button"
                        role="menuitem"
                        onClick={() => { setShowUserMenu(false); logout(); }}
                        className="w-full flex items-center gap-3 px-4 py-2.5 text-[14px] font-normal text-[#e41e3f] hover:bg-[#fde8ec] transition-colors cursor-pointer"
                      >
                        <LogOut className="w-4 h-4" />
                        <span>Sign Out</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Mobile menu toggle */}
            <button
              type="button"
              onClick={() => setMobileOpen(!mobileOpen)}
              className="lg:hidden w-10 h-10 rounded-full flex items-center justify-center border border-[#dee3e9] bg-white hover:bg-[#f1f4f7] transition-colors"
              aria-label={mobileOpen ? 'Close menu' : 'Open menu'}
            >
              {mobileOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Nav Drawer */}
      {mobileOpen && (
        <div className="lg:hidden border-t border-[#dee3e9] bg-white px-6 py-3 space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentRoute === item.href;
            return (
              <a
                key={item.href}
                href={item.href}
                className={[
                  'flex items-center gap-3 px-4 py-2.5 rounded-full',
                  'text-[14px] font-bold tracking-[-0.14px]',
                  'transition-colors duration-150',
                  isActive ? 'bg-[#0a1317] text-white' : 'text-[#1c1e21] hover:bg-[#f1f4f7]',
                ].join(' ')}
                onClick={() => setMobileOpen(false)}
              >
                <Icon className="w-4 h-4" />
                <span>{item.label}</span>
              </a>
            );
          })}
        </div>
      )}
    </header>
  );
};
