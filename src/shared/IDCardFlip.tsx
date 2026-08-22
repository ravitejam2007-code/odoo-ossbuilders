import React from 'react';
import { Badge } from './Badge';
import type { Employee } from '../employee/types/api';

interface IDCardFlipProps {
  employee: Employee;
  onClick?: () => void;
}

export const IDCardFlip: React.FC<IDCardFlipProps> = ({ employee, onClick }) => {
  return (
    // DESIGN-meta card-product-feature: white bg, 16px radius, 1px hairline-soft border, flat
    <div
      role="button"
      tabIndex={0}
      onClick={onClick}
      onKeyDown={(e) => e.key === 'Enter' && onClick?.()}
      className={[
        'bg-[#ffffff] rounded-[16px] border border-[#dee3e9]',
        'p-5 flex flex-col gap-4',
        'cursor-pointer outline-none',
        'transition-all duration-150',
        'hover:border-[#ced0d4] hover:shadow-[rgba(20,22,26,0.08)_0px_2px_8px_0px]',
        'focus-visible:ring-2 focus-visible:ring-[#1876f2]',
        'select-none',
      ].join(' ')}
      aria-label={`View details for ${employee.name}`}
    >
      {/* Top row: avatar + name + badge */}
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-3">
          <img
            src={employee.avatar || 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150'}
            alt={employee.name || 'Employee'}
            className="w-11 h-11 rounded-full object-cover border border-[#dee3e9] flex-shrink-0"
          />
          <div className="min-w-0">
            {/* subtitle-lg: 18px/700 */}
            <h3 className="text-[16px] font-bold leading-[1.43] tracking-[-0.14px] text-[#0a1317] truncate">
              {employee.name}
            </h3>
            {/* body-sm: 14px/400 steel */}
            <p className="text-[13px] font-normal leading-[1.43] text-[#5d6c7b] truncate">
              {employee.jobTitle}
            </p>
          </div>
        </div>
        <Badge status={employee.workStatus} showIcon />
      </div>

      {/* Divider */}
      <div className="border-t border-[#dee3e9]" />

      {/* Bottom row: dept + login ID */}
      <div className="flex items-center justify-between gap-2">
        <span className="text-[13px] font-normal leading-[1.43] text-[#5d6c7b] truncate">
          {employee.department}
        </span>
        {/* caption-bold: 12px/700 */}
        <span className="text-[12px] font-bold leading-[1.33] text-[#8595a4] font-mono truncate">
          {employee.loginId}
        </span>
      </div>
    </div>
  );
};
