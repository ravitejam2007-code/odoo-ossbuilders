import React from 'react';
import {
  LayoutDashboard,
  Users,
  Clock,
  Calendar,
  DollarSign,
  BarChart3,
  ChevronRight,
  Shield,
} from 'lucide-react';

interface AdminSidebarProps {
  currentRoute: string;
}

export const AdminSidebar: React.FC<AdminSidebarProps> = ({ currentRoute }) => {
  const navItems = [
    { label: 'Dashboard', href: '/admin/dashboard', icon: LayoutDashboard },
    { label: 'Employees', href: '/admin/employees', icon: Users },
    { label: 'Attendance', href: '/admin/attendance', icon: Clock },
    { label: 'Leave', href: '/admin/leave', icon: Calendar },
    { label: 'Payroll', href: '/admin/payroll', icon: DollarSign },
    { label: 'Reports', href: '/admin/reports', icon: BarChart3 },
  ];

  return (
    <aside className="w-64 bg-white border-r border-zinc-200 flex flex-col justify-between hidden md:flex min-h-screen">
      <div className="p-4 space-y-6">
        {/* Brand & Logo Mark */}
        <a href="/admin/dashboard" className="flex items-center space-x-3 px-2 py-1">
          <div className="w-8 h-8 rounded-lg bg-zinc-950 text-white flex items-center justify-center font-bold text-sm">
            D
          </div>
          <div>
            <span className="text-base font-bold text-zinc-950 tracking-tight block">
              Dayflow HRMS
            </span>
            <span className="text-[10px] font-semibold uppercase tracking-wider text-zinc-400 block">
              Admin Portal
            </span>
          </div>
        </a>

        {/* Sidebar Nav Links */}
        <nav className="space-y-1">
          <span className="text-[10px] font-bold uppercase tracking-wider text-zinc-400 px-3 block mb-2">
            Main Management
          </span>
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentRoute === item.href || (item.href !== '/admin/dashboard' && currentRoute.startsWith(item.href));

            return (
              <a
                key={item.href}
                href={item.href}
                className={`flex items-center justify-between px-3 py-2.5 rounded-lg text-xs font-semibold transition-colors ${
                  isActive
                    ? 'bg-zinc-950 text-white shadow-xs'
                    : 'text-zinc-600 hover:text-zinc-950 hover:bg-zinc-100'
                }`}
              >
                <div className="flex items-center space-x-2.5">
                  <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-zinc-500'}`} />
                  <span>{item.label}</span>
                </div>
                {isActive && <ChevronRight className="w-3.5 h-3.5 text-zinc-400" />}
              </a>
            );
          })}
        </nav>
      </div>

      {/* Footer Role Badge */}
      <div className="p-4 border-t border-zinc-100">
        <div className="p-3 rounded-xl bg-zinc-50 border border-zinc-200/80 flex items-center space-x-2.5 text-xs">
          <Shield className="w-4 h-4 text-zinc-950 flex-shrink-0" />
          <div className="min-w-0">
            <span className="font-bold text-zinc-950 block truncate">Administrator</span>
            <span className="text-[10px] text-zinc-500 block truncate">HR Clearance Level 1</span>
          </div>
        </div>
      </div>
    </aside>
  );
};
