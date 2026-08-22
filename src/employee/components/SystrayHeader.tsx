import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { Badge } from '../../shared/Badge';
import {
  Bell,
  User,
  LogOut,
  ChevronDown,
  LayoutDashboard,
  Clock,
  Calendar,
  DollarSign,
  Menu,
  X,
} from 'lucide-react';

interface SystrayHeaderProps {
  currentRoute?: string;
}

const navItems = [
  { label: 'Dashboard',  href: '/dashboard',   icon: LayoutDashboard },
  { label: 'Attendance', href: '/attendance',  icon: Clock },
  { label: 'Time Off',   href: '/leave',       icon: Calendar },
  { label: 'Payroll',    href: '/payroll',     icon: DollarSign },
];

export const SystrayHeader: React.FC<SystrayHeaderProps> = ({ currentRoute = '/dashboard' }) => {
  const { currentUser, logout } = useAuth();
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    // DESIGN-meta: sticky white nav bar, 64px height, bottom 1px solid hairline-soft
    <header className="sticky top-0 z-40 w-full bg-[#ffffff] border-b border-[#dee3e9]">
      <div className="max-w-[1280px] mx-auto px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">

          {/* ── Left: Wordmark ─────────────────────────────────── */}
          <div className="flex items-center flex-shrink-0">
            <a
              href="/dashboard"
              className="flex items-center gap-2.5"
              aria-label="Dayflow HRMS — Employee Portal"
            >
              <img
                src="/logo.jpg"
                alt="Dayflow Logo"
                className="w-8 h-8 rounded-[8px] object-cover border border-[#dee3e9] shadow-2xs flex-shrink-0"
              />
              <span className="font-heading text-[18px] font-[600] uppercase tracking-[0.02em] text-[#0a1317] hidden sm:block">
                Dayflow
              </span>
            </a>
          </div>

          {/* ── Center: Centralized Pill-tab navigation ──────── */}
          <div className="hidden md:flex flex-1 justify-center px-4">
            <nav className="flex items-center gap-1.5" aria-label="Employee navigation">
              {navItems.map((item) => {
                const Icon = item.icon;
                const isActive =
                  currentRoute === item.href ||
                  (item.href !== '/dashboard' && currentRoute.startsWith(item.href));

                return (
                  <a
                    key={item.href}
                    href={item.href}
                    className={[
                      'inline-flex items-center gap-1.5 px-4 py-1.5',
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

          {/* ── Right: Systray ───────────────────────────────────── */}
          {currentUser ? (
            <div className="flex items-center gap-2 flex-shrink-0">
              {/* Status badge (desktop) */}
              <div className="hidden sm:block">
                <Badge status={currentUser.workStatus} showIcon />
              </div>

              {/* Notifications — circular icon button */}
              <a
                href="/notifications"
                className={[
                  'relative w-10 h-10 rounded-full',
                  'flex items-center justify-center',
                  'bg-[#ffffff] text-[#1c1e21]',
                  'border border-[#dee3e9]',
                  'hover:bg-[#f1f4f7] active:bg-[#dee3e9]',
                  'transition-colors duration-150 outline-none',
                  'focus-visible:ring-2 focus-visible:ring-[#1876f2]',
                ].join(' ')}
                aria-label="Notifications"
              >
                <Bell className="w-4 h-4" aria-hidden="true" />
                <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-[#0064e0]" />
              </a>

              {/* Profile Dropdown */}
              <div className="relative">
                <button
                  type="button"
                  onClick={() => setShowUserMenu(!showUserMenu)}
                  className={[
                    'flex items-center gap-2 h-10 px-2.5 rounded-full',
                    'bg-[#ffffff] border border-[#dee3e9]',
                    'hover:bg-[#f1f4f7] active:bg-[#dee3e9]',
                    'transition-colors duration-150 cursor-pointer outline-none',
                    'focus-visible:ring-2 focus-visible:ring-[#1876f2]',
                  ].join(' ')}
                  aria-expanded={showUserMenu}
                  aria-haspopup="menu"
                >
                  <img
                    src={currentUser.avatar || 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150'}
                    alt={currentUser.name || 'Employee'}
                    className="w-7 h-7 rounded-full object-cover border border-[#dee3e9] flex-shrink-0"
                  />
                  <span className="hidden sm:block text-[13px] font-bold leading-[1.43] tracking-[-0.14px] text-[#0a1317]">
                    {currentUser.name?.split(' ')[0] || 'Employee'}
                  </span>
                  <ChevronDown className="w-3.5 h-3.5 text-[#8595a4] hidden sm:block" aria-hidden="true" />
                </button>

                {/* Dropdown Menu */}
                {showUserMenu && (
                  <div
                    role="menu"
                    className={[
                      'absolute right-0 mt-2 w-56',
                      'bg-[#ffffff] rounded-[16px]',
                      'border border-[#dee3e9]',
                      'shadow-[rgba(20,22,26,0.3)_0px_1px_4px_0px]',
                      'py-2 z-50',
                      'overflow-hidden',
                    ].join(' ')}
                  >
                    <div className="px-4 py-3 border-b border-[#dee3e9]">
                      <p className="text-[14px] font-bold leading-[1.43] tracking-[-0.14px] text-[#0a1317]">
                        {currentUser.name}
                      </p>
                      <p className="text-[12px] font-normal leading-[1.33] text-[#5d6c7b] font-mono mt-0.5">
                        {currentUser.loginId}
                      </p>
                    </div>

                    <div className="py-1">
                      <a
                        href="/profile"
                        role="menuitem"
                        className="flex items-center gap-3 px-4 py-2.5 text-[14px] font-normal leading-[1.43] text-[#1c1e21] hover:bg-[#f1f4f7] transition-colors"
                        onClick={() => setShowUserMenu(false)}
                      >
                        <User className="w-4 h-4 text-[#5d6c7b]" aria-hidden="true" />
                        <span>My Profile</span>
                      </a>

                      <button
                        type="button"
                        role="menuitem"
                        onClick={() => { setShowUserMenu(false); logout(); }}
                        className="w-full flex items-center gap-3 px-4 py-2.5 text-[14px] font-normal leading-[1.43] text-[#e41e3f] hover:bg-[#fde8ec] transition-colors cursor-pointer"
                      >
                        <LogOut className="w-4 h-4 text-[#e41e3f]" aria-hidden="true" />
                        <span>Sign Out</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>

              {/* Mobile hamburger */}
              <button
                type="button"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className={[
                  'md:hidden w-10 h-10 rounded-full flex items-center justify-center',
                  'bg-[#ffffff] border border-[#dee3e9]',
                  'hover:bg-[#f1f4f7] transition-colors cursor-pointer',
                ].join(' ')}
                aria-expanded={mobileMenuOpen}
                aria-label={mobileMenuOpen ? 'Close menu' : 'Open menu'}
              >
                {mobileMenuOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
              </button>
            </div>
          ) : (
            <a
              href="/login"
              className="text-[14px] font-bold leading-[1.43] tracking-[-0.14px] text-[#0a1317] hover:underline"
            >
              Sign In
            </a>
          )}
        </div>
      </div>

      {/* Mobile Navigation Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-[#dee3e9] bg-[#ffffff] px-6 py-3 space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentRoute === item.href;
            return (
              <a
                key={item.href}
                href={item.href}
                className={[
                  'flex items-center gap-3 px-4 py-2.5 rounded-full',
                  'text-[14px] font-bold leading-[1.43] tracking-[-0.14px]',
                  'transition-colors duration-150',
                  isActive
                    ? 'bg-[#0a1317] text-[#ffffff]'
                    : 'text-[#1c1e21] hover:bg-[#f1f4f7]',
                ].join(' ')}
                onClick={() => setMobileMenuOpen(false)}
              >
                <Icon className="w-4 h-4" aria-hidden="true" />
                <span>{item.label}</span>
              </a>
            );
          })}
        </div>
      )}
    </header>
  );
};
