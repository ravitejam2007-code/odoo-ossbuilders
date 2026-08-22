import React from 'react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

// DESIGN-meta: skeleton uses surface-soft (#f1f4f7) with animated shimmer
// Spinner uses ink-deep (#0a1317)

interface SkeletonProps {
  className?: string;
}

export const Skeleton: React.FC<SkeletonProps> = ({ className }) => (
  <div
    className={twMerge(
      clsx(
        'rounded-[8px] animate-pulse',
        'bg-[#f1f4f7]',
        className
      )
    )}
    aria-hidden="true"
  />
);

interface SpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export const LoadingSpinner: React.FC<SpinnerProps> = ({ size = 'md', className }) => {
  const sizeMap = {
    sm: 'w-4 h-4 border-2',
    md: 'w-6 h-6 border-2',
    lg: 'w-8 h-8 border-[3px]',
  };

  return (
    <span
      className={twMerge(
        clsx(
          'inline-block rounded-full',
          'border-[#0a1317] border-t-transparent',
          'animate-spin',
          sizeMap[size],
          className
        )
      )}
      role="status"
      aria-label="Loading"
    />
  );
};

interface LoadingPageProps {
  label?: string;
}

export const LoadingPage: React.FC<LoadingPageProps> = ({ label = 'Loading…' }) => (
  <div className="min-h-screen flex flex-col items-center justify-center bg-[#ffffff] gap-4">
    <LoadingSpinner size="lg" />
    {/* body-sm: 14px/400 */}
    <p className="text-[14px] font-normal leading-[1.43] text-[#5d6c7b]">{label}</p>
  </div>
);
