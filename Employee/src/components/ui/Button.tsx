import React from 'react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { LoadingSpinner } from './Loading';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'destructive' | 'buy-cta';
  size?: 'sm' | 'md' | 'lg';
  loading?: boolean;
  children: React.ReactNode;
}

export const Button: React.FC<ButtonProps> = ({
  variant = 'primary',
  size = 'md',
  loading = false,
  disabled,
  className,
  children,
  ...props
}) => {
  const baseClasses =
    'inline-flex items-center justify-center font-semibold tracking-tight rounded-lg transition-colors outline-none focus:ring-2 focus:ring-zinc-950/20 disabled:opacity-50 disabled:cursor-not-allowed select-none cursor-pointer';

  const variants = {
    primary: 'bg-zinc-950 text-white hover:bg-zinc-800 active:bg-zinc-900 border border-transparent shadow-xs',
    'buy-cta': 'bg-zinc-950 text-white hover:bg-zinc-800 active:bg-zinc-900 border border-transparent shadow-xs',
    secondary: 'bg-white text-zinc-900 border border-zinc-200 hover:bg-zinc-50 active:bg-zinc-100 shadow-2xs',
    ghost: 'bg-transparent text-zinc-700 hover:bg-zinc-100 hover:text-zinc-950 active:bg-zinc-200',
    destructive: 'bg-zinc-900 text-white hover:bg-zinc-800 active:bg-zinc-950 border border-transparent shadow-xs',
  };

  const sizes = {
    sm: 'px-3 py-1.5 text-xs gap-1.5',
    md: 'px-4 py-2 text-xs sm:text-sm gap-2',
    lg: 'px-5 py-2.5 text-sm gap-2.5',
  };

  return (
    <button
      disabled={disabled || loading}
      className={twMerge(clsx(baseClasses, variants[variant], sizes[size], className))}
      {...props}
    >
      {loading ? (
        <>
          <LoadingSpinner size="sm" className="mr-2 border-white border-t-transparent" />
          <span>Processing...</span>
        </>
      ) : (
        children
      )}
    </button>
  );
};
