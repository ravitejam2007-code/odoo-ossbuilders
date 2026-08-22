import React from 'react';
import { Loader2 } from 'lucide-react';

export const LoadingSpinner: React.FC<{ size?: 'sm' | 'md' | 'lg'; label?: string; className?: string }> = ({
  size = 'md',
  label = 'Loading...',
  className = '',
}) => {
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-8 h-8',
    lg: 'w-12 h-12',
  };

  return (
    <div className="flex flex-col items-center justify-center py-12 space-y-3">
      <Loader2 className={`${sizeClasses[size]} animate-spin text-meta-primary`} />
      {label && <p className="text-xs font-semibold text-meta-steel tracking-wide animate-pulse">{label}</p>}
    </div>
  );
};

export const Skeleton: React.FC<{ className?: string }> = ({ className = 'h-4 w-full' }) => {
  return <div className={`animate-pulse bg-meta-hairline-soft rounded-xl ${className}`} />;
};
