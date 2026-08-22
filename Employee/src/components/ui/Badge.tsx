import React from 'react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { Plane, CheckCircle2, XCircle, Clock } from 'lucide-react';
import type { WorkStatus, LeaveStatus, AttendanceStatus } from '../../types/api';

export interface BadgeProps {
  status: WorkStatus | AttendanceStatus | LeaveStatus | 'paid' | 'unpaid' | 'draft' | string;
  className?: string;
  showIcon?: boolean;
}

export const Badge: React.FC<BadgeProps> = ({ status, className, showIcon = true }) => {
  const normalized = status.toLowerCase();

  let label = status;
  let bgClasses = 'bg-zinc-100 text-zinc-800 border-zinc-200';
  let icon = null;

  switch (normalized) {
    case 'present':
      label = 'Present';
      bgClasses = 'bg-emerald-50 text-emerald-800 border-emerald-200/80';
      icon = <span className="w-2 h-2 rounded-full bg-emerald-600" />;
      break;
    case 'absent':
      label = 'Absent';
      bgClasses = 'bg-rose-50 text-rose-800 border-rose-200/80';
      icon = <span className="w-2 h-2 rounded-full bg-rose-600" />;
      break;
    case 'half_day':
    case 'half-day':
    case 'half day':
      label = 'Half-day';
      bgClasses = 'bg-amber-50 text-amber-800 border-amber-200/80';
      icon = <Clock className="w-3 h-3 text-amber-700" />;
      break;
    case 'on_leave':
    case 'on leave':
    case 'leave':
      label = 'Leave';
      bgClasses = 'bg-sky-50 text-sky-800 border-sky-200/80';
      icon = <Plane className="w-3 h-3 text-sky-700" />;
      break;
    case 'approved':
      label = 'Approved';
      bgClasses = 'bg-emerald-50 text-emerald-800 border-emerald-200/80';
      icon = <CheckCircle2 className="w-3 h-3 text-emerald-700" />;
      break;
    case 'pending':
      label = 'Pending';
      bgClasses = 'bg-amber-50 text-amber-800 border-amber-200/80';
      icon = <Clock className="w-3 h-3 text-amber-700" />;
      break;
    case 'rejected':
      label = 'Rejected';
      bgClasses = 'bg-rose-50 text-rose-800 border-rose-200/80';
      icon = <XCircle className="w-3 h-3 text-rose-700" />;
      break;
    case 'paid':
      label = 'Paid';
      bgClasses = 'bg-emerald-50 text-emerald-800 border-emerald-200/80';
      break;
    case 'unpaid':
      label = 'Unpaid';
      bgClasses = 'bg-zinc-100 text-zinc-800 border-zinc-300';
      break;
  }

  return (
    <span
      className={twMerge(
        clsx(
          'inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold border tracking-wide select-none',
          bgClasses,
          className
        )
      )}
    >
      {showIcon && icon}
      <span>{label}</span>
    </span>
  );
};
