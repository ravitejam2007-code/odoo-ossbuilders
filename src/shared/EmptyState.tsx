import React from 'react';
import { Button } from './Button';

interface EmptyStateProps {
  title: string;
  description?: string;
  actionLabel?: string;
  onAction?: () => void;
  icon?: React.ReactNode;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  title,
  description,
  actionLabel,
  onAction,
  icon,
}) => (
  <div className="flex flex-col items-center justify-center py-16 px-6 text-center gap-4">
    {icon && (
      <div className="w-12 h-12 rounded-full bg-[#f1f4f7] flex items-center justify-center text-[#5d6c7b]">
        {icon}
      </div>
    )}
    {/* heading-sm: 24px/500 */}
    <h3 className="text-[18px] font-bold leading-[1.44] text-[#0a1317]">{title}</h3>
    {description && (
      /* body-sm: 14px/400 steel */
      <p className="text-[14px] font-normal leading-[1.43] tracking-[-0.14px] text-[#5d6c7b] max-w-xs">
        {description}
      </p>
    )}
    {actionLabel && onAction && (
      <Button variant="secondary" size="md" onClick={onAction}>
        {actionLabel}
      </Button>
    )}
  </div>
);
