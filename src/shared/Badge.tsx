import React from 'react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { Plane, CheckCircle2, XCircle, Clock } from 'lucide-react';

export interface BadgeProps {
  status: string;
  className?: string;
  showIcon?: boolean;
}

export const Badge: React.FC<BadgeProps> = ({ status, className, showIcon = true }) => {
  const normalized = status.toLowerCase();

  let label = status;
  // DESIGN-meta: badges use caption-bold (12px/700), rounded-full pill, padding 4px 10px
  // Semantic colors from DESIGN-meta.md
  let colorClasses = 'bg-[#f1f4f7] text-[#4b4c4f]';
  let icon: React.ReactNode = null;

  switch (normalized) {
    case 'present':
      label = 'Present';
      // badge-success: bg success (#31a24c), text white
      colorClasses = 'bg-[#e6f4ea] text-[#1a7f3c]';
      icon = <span className="w-1.5 h-1.5 rounded-full bg-[#31a24c] flex-shrink-0" />;
      break;

    case 'absent':
      label = 'Absent';
      // badge-critical: bg critical (#e41e3f), text white
      colorClasses = 'bg-[#fde8ec] text-[#c0122e]';
      icon = <span className="w-1.5 h-1.5 rounded-full bg-[#e41e3f] flex-shrink-0" />;
      break;

    case 'half_day':
    case 'half-day':
    case 'half day':
      label = 'Half-day';
      // badge-attention
      colorClasses = 'bg-[#fef3c7] text-[#92570c]';
      icon = <Clock className="w-3 h-3 flex-shrink-0" />;
      break;

    case 'on_leave':
    case 'on leave':
    case 'leave':
      label = 'On Leave';
      // Slate/steel tone for leave status
      colorClasses = 'bg-[#f1f4f7] text-[#5d6c7b]';
      icon = <Plane className="w-3 h-3 flex-shrink-0" />;
      break;

    case 'approved':
      label = 'Approved';
      colorClasses = 'bg-[#e6f4ea] text-[#1a7f3c]';
      icon = <CheckCircle2 className="w-3 h-3 flex-shrink-0" />;
      break;

    case 'pending':
      label = 'Pending';
      // badge-attention: bg attention (#f2a918), text ink-deep
      colorClasses = 'bg-[#fef3c7] text-[#92570c]';
      icon = <Clock className="w-3 h-3 flex-shrink-0" />;
      break;

    case 'rejected':
      label = 'Rejected';
      colorClasses = 'bg-[#fde8ec] text-[#c0122e]';
      icon = <XCircle className="w-3 h-3 flex-shrink-0" />;
      break;

    case 'paid':
    case 'processed':
      label = 'Processed';
      colorClasses = 'bg-[#e6f4ea] text-[#1a7f3c]';
      icon = <CheckCircle2 className="w-3 h-3 flex-shrink-0" />;
      break;

    case 'draft':
    case 'unpaid':
      label = 'Draft';
      colorClasses = 'bg-[#f1f4f7] text-[#5d6c7b]';
      break;

    case 'remote':
      label = 'Remote';
      colorClasses = 'bg-[#f1f4f7] text-[#5d6c7b]';
      break;
  }

  return (
    <span
      className={twMerge(
        clsx(
          // DESIGN-meta: caption-bold (12px/700), rounded-full pill, padding 4px 10px
          'inline-flex items-center gap-1.5',
          'px-[10px] py-[4px]',
          'rounded-full',
          'text-[12px] font-bold leading-[1.33]',
          'select-none whitespace-nowrap flex-shrink-0',
          colorClasses,
          className
        )
      )}
    >
      {showIcon && icon}
      <span>{label}</span>
    </span>
  );
};
