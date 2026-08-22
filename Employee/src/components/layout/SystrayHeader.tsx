import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useNotifications } from '../../hooks/useEmployeeData';
import { Button } from '../ui/Button';
import { Modal } from '../ui/Modal';
import { Badge } from '../ui/Badge';
import {
  Users,
  Calendar,
  Clock,
  Briefcase,
  Bell,
  LogOut,
  User,
  ChevronDown,
  Play,
  Square,
  Menu,
  X,
} from 'lucide-react';

interface SystrayHeaderProps {
  currentRoute: string;
}

export const SystrayHeader: React.FC<SystrayHeaderProps> = ({ currentRoute }) => {
  const { currentUser, logout, checkIn, checkOut, checkInTime } = useAuth();
  const { data: notifications } = useNotifications();

  const [showCheckInModal, setShowCheckInModal] = useState(false);
  const [showUserDropdown, setShowUserDropdown] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  if (!currentUser) return null;

  const isCheckedIn = currentUser.workStatus === 'present';
  const unreadCount = notifications?.filter((n) => !n.read).length || 0;

  const navItems = [
    { label: 'Overview', href: '/dashboard', icon: Users },
    { label: 'Attendance', href: '/attendance', icon: Clock },
    { label: 'Time Off', href: '/leave', icon: Calendar },
    { label: 'Payroll', href: '/payroll', icon: Briefcase },
    { label: 'Notifications', href: '/notifications', icon: Bell, badgeCount: unreadCount },
  ];

  return (
    <>
      <header className="sticky top-0 z-40 w-full bg-white border-b border-zinc-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <a href="/dashboard" className="flex items-center space-x-2.5">
              <div className="w-8 h-8 rounded-lg bg-zinc-950 text-white flex items-center justify-center font-bold text-sm">
                D
              </div>
              <span className="text-base font-bold text-zinc-950 tracking-tight">
                Dayflow HRMS
              </span>
            </a>

            {/* Navigation Tabs */}
            <nav className="hidden md:flex items-center space-x-1">
              {navItems.map((item) => {
                const Icon = item.icon;
                const isActive = currentRoute === item.href || (item.href !== '/dashboard' && currentRoute.startsWith(item.href));

                return (
                  <a
                    key={item.href}
                    href={item.href}
                    className={`flex items-center space-x-2 px-3.5 py-2 rounded-lg text-xs font-semibold transition-colors ${
                      isActive
                        ? 'bg-zinc-100 text-zinc-950 font-bold'
                        : 'text-zinc-600 hover:text-zinc-950 hover:bg-zinc-50'
                    }`}
                  >
                    <Icon className="w-4 h-4 text-zinc-500" />
                    <span>{item.label}</span>
                    {item.badgeCount ? item.badgeCount > 0 && (
                      <span className="ml-1 px-1.5 py-0.5 text-[10px] font-bold rounded-full bg-zinc-950 text-white font-mono">
                        {item.badgeCount}
                      </span>
                    ) : null}
                  </a>
                );
              })}
            </nav>

            {/* Right Controls */}
            <div className="flex items-center space-x-3">
              {/* Check In/Out Quick Action */}
              <button
                type="button"
                onClick={() => setShowCheckInModal(true)}
                className="flex items-center space-x-2 px-3 py-1.5 rounded-lg bg-zinc-50 hover:bg-zinc-100 border border-zinc-200 transition-colors text-xs font-medium text-zinc-900"
              >
                <Badge status={currentUser.workStatus} showIcon={false} />
                <span className="hidden lg:inline text-zinc-500 font-mono">
                  {isCheckedIn && checkInTime ? checkInTime : 'Control'}
                </span>
              </button>

              {/* User Avatar Menu */}
              <div className="relative">
                <button
                  type="button"
                  onClick={() => setShowUserDropdown(!showUserDropdown)}
                  className="flex items-center space-x-2 p-1 rounded-lg hover:bg-zinc-100 transition-colors"
                >
                  <img
                    src={currentUser.avatar}
                    alt={currentUser.name}
                    className="w-8 h-8 rounded-full object-cover border border-zinc-200"
                  />
                  <span className="hidden sm:inline font-semibold text-xs text-zinc-950">
                    {currentUser.name.split(' ')[0]}
                  </span>
                  <ChevronDown className="w-3.5 h-3.5 text-zinc-400 hidden sm:inline" />
                </button>

                {showUserDropdown && (
                  <div className="absolute right-0 mt-2 w-52 bg-white rounded-xl shadow-lg border border-zinc-200 p-1.5 space-y-0.5 z-50">
                    <div className="px-3 py-2 border-b border-zinc-100">
                      <p className="text-xs font-bold text-zinc-950">{currentUser.name}</p>
                      <p className="text-[11px] text-zinc-500 font-mono">{currentUser.loginId}</p>
                    </div>

                    <a
                      href="/profile"
                      className="flex items-center space-x-2 px-3 py-2 rounded-lg text-xs font-medium text-zinc-700 hover:bg-zinc-100 hover:text-zinc-950"
                      onClick={() => setShowUserDropdown(false)}
                    >
                      <User className="w-4 h-4 text-zinc-500" />
                      <span>My Profile</span>
                    </a>

                    <button
                      type="button"
                      onClick={() => {
                        setShowUserDropdown(false);
                        logout();
                      }}
                      className="w-full flex items-center space-x-2 px-3 py-2 rounded-lg text-xs font-medium text-rose-600 hover:bg-rose-50"
                    >
                      <LogOut className="w-4 h-4 text-rose-500" />
                      <span>Log Out</span>
                    </button>
                  </div>
                )}
              </div>

              {/* Mobile Menu */}
              <button
                type="button"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="md:hidden p-2 rounded-lg text-zinc-950 hover:bg-zinc-100"
              >
                {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Navigation Drawer */}
        {mobileMenuOpen && (
          <div className="md:hidden border-t border-zinc-200 bg-white p-3 space-y-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = currentRoute === item.href;

              return (
                <a
                  key={item.href}
                  href={item.href}
                  className={`flex items-center justify-between px-3 py-2 rounded-lg text-xs font-semibold ${
                    isActive ? 'bg-zinc-950 text-white' : 'text-zinc-700 hover:bg-zinc-100'
                  }`}
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <div className="flex items-center space-x-2">
                    <Icon className="w-4 h-4" />
                    <span>{item.label}</span>
                  </div>
                  {item.badgeCount ? item.badgeCount > 0 && (
                    <span className="px-2 py-0.5 text-[10px] font-bold rounded-full bg-zinc-900 text-white font-mono">
                      {item.badgeCount}
                    </span>
                  ) : null}
                </a>
              );
            })}
          </div>
        )}
      </header>

      {/* Attendance Modal */}
      <Modal
        isOpen={showCheckInModal}
        onClose={() => setShowCheckInModal(false)}
        title="Attendance Session"
      >
        <div className="space-y-4 text-center py-2">
          <div>
            <h4 className="text-base font-bold text-zinc-950">
              {isCheckedIn ? 'Checked In' : 'Not Checked In'}
            </h4>
            {isCheckedIn && checkInTime && (
              <p className="text-xs text-emerald-700 font-semibold font-mono mt-1">
                Started at {checkInTime}
              </p>
            )}
          </div>

          <div className="pt-2 flex justify-center space-x-3">
            {!isCheckedIn ? (
              <Button
                variant="primary"
                size="md"
                onClick={() => {
                  checkIn();
                  setShowCheckInModal(false);
                }}
              >
                <Play className="w-4 h-4 mr-2 fill-current" />
                <span>Check In</span>
              </Button>
            ) : (
              <Button
                variant="destructive"
                size="md"
                onClick={() => {
                  checkOut();
                  setShowCheckInModal(false);
                }}
              >
                <Square className="w-4 h-4 mr-2 fill-current" />
                <span>Check Out</span>
              </Button>
            )}
          </div>
        </div>
      </Modal>
    </>
  );
};
