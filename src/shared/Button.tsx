import React from 'react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { LoadingSpinner } from './Loading';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  /**
   * primary     — Black pill CTA for marketing surfaces ("Shop", "Sign In", "Save")
   * buy-cta     — Cobalt pill CTA for action flows ("Check In", "Submit Leave", "Approve")
   * secondary   — Outlined ghost with ink-deep border
   * ghost       — Quieter outlined, translucent border
   * destructive — Critical/reject action
   * pill-tab    — Category nav chip (inactive)
   * pill-tab-active — Category nav chip (active)
   */
  variant?: 'primary' | 'buy-cta' | 'secondary' | 'ghost' | 'destructive' | 'pill-tab' | 'pill-tab-active';
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
  // DESIGN-meta: ALL buttons are pill-shaped (rounded-full = 100px radius)
  // This is a brand signature — never squared
  const baseClasses = [
    'inline-flex items-center justify-center',
    'font-bold tracking-tight',
    'rounded-full',                               // brand signature pill
    'transition-colors duration-150',
    'outline-none',
    'focus-visible:ring-2 focus-visible:ring-[#1876f2] focus-visible:ring-offset-1',
    'disabled:cursor-not-allowed select-none cursor-pointer',
  ].join(' ');

  const variants: Record<string, string> = {
    // Black pill — marketing CTAs (Sign In, Shop, Save, Submit)
    primary: [
      'bg-[#000000] text-white',
      'active:bg-[#444950]',
      'disabled:bg-[#bcc0c4] disabled:text-white',
    ].join(' '),

    // Cobalt pill — commerce/action CTAs only (Check In, Approve Leave, Submit Leave Request)
    'buy-cta': [
      'bg-[#0064e0] text-white',
      'active:bg-[#0457cb]',
      'disabled:bg-[#bcc0c4] disabled:text-white',
    ].join(' '),

    // Outlined ghost — secondary marketing CTA
    secondary: [
      'bg-transparent text-[#0a1317]',
      'border-2 border-[#0a1317]',
      'active:bg-[#f1f4f7]',
      'disabled:border-[#bcc0c4] disabled:text-[#bcc0c4]',
    ].join(' '),

    // Quieter outline — tertiary actions
    ghost: [
      'bg-transparent text-[#0a1317]',
      'border-2 border-[rgba(10,19,23,0.12)]',
      'active:bg-[#f1f4f7]',
      'disabled:border-[#dee3e9] disabled:text-[#bcc0c4]',
    ].join(' '),

    // Destructive — reject, delete actions
    destructive: [
      'bg-[#e41e3f] text-white',
      'active:bg-[#c0122e]',
      'disabled:bg-[#bcc0c4] disabled:text-white',
    ].join(' '),

    // Category nav pill — inactive state
    'pill-tab': [
      'bg-[#ffffff] text-[#1c1e21]',
      'border border-[#ced0d4]',
      'active:bg-[#f1f4f7]',
    ].join(' '),

    // Category nav pill — active state
    'pill-tab-active': [
      'bg-[#0a1317] text-white',
      'border border-transparent',
    ].join(' '),
  };

  // DESIGN-meta: button-md uses 14px/700, padding 14px 30px for full, adjust for sm/lg
  const sizes: Record<string, string> = {
    sm: 'px-4 py-1.5 text-[13px] gap-1.5 min-h-[36px]',
    md: 'px-[22px] py-[11px] text-[14px] gap-2 min-h-[44px]',   // WCAG AA min 44px
    lg: 'px-[30px] py-[14px] text-[14px] gap-2 min-h-[48px]',
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
          <span>Processing…</span>
        </>
      ) : (
        children
      )}
    </button>
  );
};
