import React from 'react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export interface FormFieldProps {
  label?: string;
  error?: string;
  required?: boolean;
  children: React.ReactNode;
  className?: string;
}

export const FormField: React.FC<FormFieldProps> = ({ label, error, required, children, className }) => {
  return (
    <div className={twMerge(clsx('space-y-[6px]', className))}>
      {label && (
        // DESIGN-meta: body-sm-bold (14px/700/-0.14px) for form labels
        <label className="block text-[14px] font-bold leading-[1.43] tracking-[-0.14px] text-[#1c1e21]">
          {label}
          {required && <span className="text-[#e41e3f] ml-1" aria-hidden="true">*</span>}
        </label>
      )}
      {children}
      {error && (
        // DESIGN-meta: body-sm in critical-strong color for error messages
        <p className="text-[14px] font-normal leading-[1.43] text-[#f0284a] mt-1" role="alert">
          {error}
        </p>
      )}
    </div>
  );
};

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  hasError?: boolean;
}

// DESIGN-meta text-input:
// - bg: canvas (#ffffff)
// - border: 1px solid hairline (#ced0d4)
// - rounded: lg (8px)
// - height: 44px (WCAG AA touch target)
// - focus: 2px solid fb-blue (#1876f2)
// - error: 1px solid critical-strong (#f0284a)
export const Input = React.forwardRef<HTMLInputElement, InputProps>(({ hasError, className, ...props }, ref) => {
  return (
    <input
      ref={ref}
      className={twMerge(
        clsx(
          'w-full px-3 bg-[#ffffff]',
          'rounded-[8px]',
          'h-[44px]',
          'text-[16px] font-normal leading-[1.50] tracking-[-0.16px] text-[#1c1e21]',
          'placeholder:text-[#8595a4]',
          'border border-[#ced0d4]',
          'outline-none transition-all duration-150',
          // focus: fb-blue 2px border per DESIGN-meta
          'focus:border-[#1876f2] focus:border-2',
          'disabled:bg-[#f1f4f7] disabled:text-[#8595a4] disabled:cursor-not-allowed',
          hasError && 'border border-[#f0284a] focus:border-[#f0284a]',
          className
        )
      )}
      {...props}
    />
  );
});
Input.displayName = 'Input';

export interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  hasError?: boolean;
}

export const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(({ hasError, className, ...props }, ref) => {
  return (
    <textarea
      ref={ref}
      rows={3}
      className={twMerge(
        clsx(
          'w-full px-3 py-3 bg-[#ffffff]',
          'rounded-[8px]',
          'text-[16px] font-normal leading-[1.50] tracking-[-0.16px] text-[#1c1e21]',
          'placeholder:text-[#8595a4]',
          'border border-[#ced0d4]',
          'outline-none transition-all duration-150 resize-none',
          'focus:border-[#1876f2] focus:border-2',
          'disabled:bg-[#f1f4f7] disabled:text-[#8595a4] disabled:cursor-not-allowed',
          hasError && 'border border-[#f0284a] focus:border-[#f0284a]',
          className
        )
      )}
      {...props}
    />
  );
});
Textarea.displayName = 'Textarea';

export interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  hasError?: boolean;
  children: React.ReactNode;
}

export const Select = React.forwardRef<HTMLSelectElement, SelectProps>(({ hasError, className, children, ...props }, ref) => {
  return (
    <select
      ref={ref}
      className={twMerge(
        clsx(
          'w-full px-3 bg-[#ffffff]',
          'rounded-[8px]',
          'h-[44px]',
          'text-[16px] font-normal leading-[1.50] tracking-[-0.16px] text-[#1c1e21]',
          'border border-[#ced0d4]',
          'outline-none transition-all duration-150 cursor-pointer appearance-none',
          'focus:border-[#1876f2] focus:border-2',
          'disabled:bg-[#f1f4f7] disabled:text-[#8595a4] disabled:cursor-not-allowed',
          hasError && 'border border-[#f0284a]',
          className
        )
      )}
      {...props}
    >
      {children}
    </select>
  );
});
Select.displayName = 'Select';
