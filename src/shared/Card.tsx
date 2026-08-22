import React from 'react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  /**
   * feature  — Standard feature card: white, 16px radius, hairline-soft border, flat (no shadow)
   * photo    — Photographic card: white, 32px radius, no border (image is the surface)
   * promo    — Dark promotional strip: ink-deep bg, white text, 32px radius
   * summary  — Sticky purchase/summary panel: white, 16px radius, hairline-soft border, subtle shadow
   * surface  — Subdued surface card: meta-surface bg, 16px radius, no border
   */
  variant?: 'feature' | 'photo' | 'promo' | 'summary' | 'surface';
  children: React.ReactNode;
}

export const Card: React.FC<CardProps> = ({
  variant = 'feature',
  className,
  children,
  ...props
}) => {
  // DESIGN-meta: cards are predominantly flat — elevation is a commerce-flow signal, not a flourish
  const variants: Record<string, string> = {
    // card-icon-feature / card-product-feature: white, 16px radius, 1px hairline-soft, no shadow
    feature: [
      'bg-[#ffffff]',
      'rounded-[16px]',
      'border border-[#dee3e9]',
      'shadow-none',
    ].join(' '),

    // card-feature-photo: 32px radius, no chrome — image IS the surface
    photo: [
      'bg-[#ffffff]',
      'rounded-[32px]',
      'overflow-hidden',
      'shadow-none',
    ].join(' '),

    // card-promo-strip: ink-deep bg, white text, 32px radius
    promo: [
      'bg-[#0a1317] text-white',
      'rounded-[32px]',
      'shadow-none',
    ].join(' '),

    // card-checkout-summary: white, 16px radius, hairline-soft border, panel shadow
    summary: [
      'bg-[#ffffff]',
      'rounded-[16px]',
      'border border-[#dee3e9]',
      'shadow-[rgba(20,22,26,0.3)_0px_1px_4px_0px]',
    ].join(' '),

    // Subdued surface bg: meta-surface, 16px radius, no border
    surface: [
      'bg-[#f1f4f7]',
      'rounded-[16px]',
      'shadow-none',
    ].join(' '),
  };

  return (
    <div className={twMerge(clsx(variants[variant], className))} {...props}>
      {children}
    </div>
  );
};
