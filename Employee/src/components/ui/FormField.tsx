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
    <div className={twMerge(clsx('space-y-1.5', className))}>
      {label && (
        <label className="block text-xs font-semibold text-zinc-900 tracking-tight">
          {label}
          {required && <span className="text-rose-600 ml-1">*</span>}
        </label>
      )}
      {children}
      {error && <p className="text-xs font-medium text-rose-600 mt-1">{error}</p>}
    </div>
  );
};

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  hasError?: boolean;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(({ hasError, className, ...props }, ref) => {
  return (
    <input
      ref={ref}
      className={twMerge(
        clsx(
          'w-full px-3.5 py-2 rounded-lg bg-white border border-zinc-200 text-xs sm:text-sm font-medium text-zinc-900 placeholder:text-zinc-400 outline-none transition-colors',
          'focus:border-zinc-950 focus:ring-1 focus:ring-zinc-950',
          'disabled:bg-zinc-100 disabled:text-zinc-500 disabled:cursor-not-allowed',
          hasError && 'border-rose-500 focus:border-rose-600 focus:ring-rose-500/20',
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
          'w-full px-3.5 py-2 rounded-lg bg-white border border-zinc-200 text-xs sm:text-sm font-medium text-zinc-900 placeholder:text-zinc-400 outline-none transition-colors resize-none',
          'focus:border-zinc-950 focus:ring-1 focus:ring-zinc-950',
          'disabled:bg-zinc-100 disabled:text-zinc-500 disabled:cursor-not-allowed',
          hasError && 'border-rose-500 focus:border-rose-600 focus:ring-rose-500/20',
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
          'w-full px-3.5 py-2 rounded-lg bg-white border border-zinc-200 text-xs sm:text-sm font-medium text-zinc-900 outline-none transition-colors cursor-pointer appearance-none',
          'focus:border-zinc-950 focus:ring-1 focus:ring-zinc-950',
          'disabled:bg-zinc-100 disabled:text-zinc-500 disabled:cursor-not-allowed',
          hasError && 'border-rose-500 focus:border-rose-600 focus:ring-rose-500/20',
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
