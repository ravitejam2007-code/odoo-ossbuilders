import React from 'react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'flat' | 'interactive';
  children: React.ReactNode;
}

export const Card: React.FC<CardProps> = ({ variant = 'default', className, children, ...props }) => {
  const baseClasses = 'bg-white rounded-xl border border-zinc-200/80 transition-all';

  const variants = {
    default: 'shadow-2xs',
    flat: 'shadow-none bg-zinc-50/60 border-zinc-200/60',
    interactive: 'shadow-2xs hover:border-zinc-300 hover:shadow-xs cursor-pointer',
  };

  return (
    <div className={twMerge(clsx(baseClasses, variants[variant], className))} {...props}>
      {children}
    </div>
  );
};
