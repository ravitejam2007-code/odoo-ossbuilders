import React, { useEffect, useRef } from 'react';
import { X } from 'lucide-react';

export interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  maxWidth?: 'sm' | 'md' | 'lg' | 'xl';
  children: React.ReactNode;
}

const maxWidthMap: Record<string, string> = {
  sm: 'max-w-sm',
  md: 'max-w-md',
  lg: 'max-w-xl',
  xl: 'max-w-3xl',
};

export const Modal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  title,
  maxWidth = 'lg',
  children,
}) => {
  const overlayRef = useRef<HTMLDivElement>(null);

  // Trap focus and close on Escape
  useEffect(() => {
    if (!isOpen) return;
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', handleKey);
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', handleKey);
      document.body.style.overflow = '';
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      ref={overlayRef}
      role="dialog"
      aria-modal="true"
      aria-label={title}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6"
    >
      {/* Tinted backdrop */}
      <div
        className="absolute inset-0 bg-[#0a1317]/50 backdrop-blur-xs transition-opacity duration-200"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Modal panel */}
      <div
        className={[
          'relative z-10 w-full',
          maxWidthMap[maxWidth],
          'bg-[#ffffff]',
          'rounded-[24px]',
          'border border-[#dee3e9]',
          'shadow-[rgba(20,22,26,0.25)_0px_8px_32px_0px]',
          'overflow-hidden',
          'max-h-[88vh] flex flex-col',
        ].join(' ')}
      >
        {/* Modal Header */}
        {title && (
          <div className="flex items-center justify-between px-6 py-4 border-b border-[#dee3e9] flex-shrink-0 bg-[#ffffff]">
            <h2 className="font-heading text-[20px] font-[600] uppercase tracking-[0.02em] text-[#0a1317]">
              {title}
            </h2>
            <button
              type="button"
              onClick={onClose}
              className="w-9 h-9 rounded-full flex items-center justify-center bg-[#f1f4f7] text-[#1c1e21] hover:bg-[#dee3e9] transition-colors cursor-pointer outline-none focus-visible:ring-2 focus-visible:ring-[#1876f2]"
              aria-label="Close dialog"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* Modal Body with smooth custom scrolling */}
        <div className="px-6 py-5 overflow-y-auto space-y-4">
          {children}
        </div>
      </div>
    </div>
  );
};
