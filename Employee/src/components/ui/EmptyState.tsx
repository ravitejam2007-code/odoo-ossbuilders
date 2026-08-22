import React from 'react';
import { FolderOpen } from 'lucide-react';
import { Button } from './Button';

export interface EmptyStateProps {
  icon?: React.ReactNode;
  title: string;
  description: string;
  actionLabel?: string;
  onAction?: () => void;
  className?: string;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  icon = <FolderOpen className="w-12 h-12 text-meta-stone/60" />,
  title,
  description,
  actionLabel,
  onAction,
  className = '',
}) => {
  return (
    <div className={`flex flex-col items-center justify-center p-12 text-center rounded-3xl bg-meta-surface/50 border border-dashed border-meta-hairline ${className}`}>
      <div className="p-4 rounded-full bg-white shadow-sm mb-4">{icon}</div>
      <h4 className="text-base font-bold text-meta-ink-deep">{title}</h4>
      <p className="text-xs text-meta-steel max-w-sm mt-1 mb-6">{description}</p>
      {actionLabel && onAction && (
        <Button variant="primary" size="sm" onClick={onAction}>
          {actionLabel}
        </Button>
      )}
    </div>
  );
};
