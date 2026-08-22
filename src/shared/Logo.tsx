import React from 'react';

interface LogoProps {
  size?: 'sm' | 'md' | 'lg';
  showText?: boolean;
  textVariant?: 'dark' | 'light';
  className?: string;
}

export const Logo: React.FC<LogoProps> = ({
  size = 'md',
  showText = true,
  textVariant = 'dark',
  className = '',
}) => {
  const sizeMap = {
    sm: { img: 'w-7 h-7', text: 'text-[15px]', sub: 'text-[10px]' },
    md: { img: 'w-8 h-8', text: 'text-[17px]', sub: 'text-[11px]' },
    lg: { img: 'w-10 h-10', text: 'text-[22px]', sub: 'text-[12px]' },
  };

  const { img, text, sub } = sizeMap[size];

  return (
    <div className={`flex items-center gap-2.5 select-none ${className}`}>
      {/* Brand logo image from Kakha Kakhadzen logo asset */}
      <img
        src="/logo.jpg"
        alt="Dayflow Logo"
        className={`${img} rounded-[8px] object-cover border border-[#dee3e9] shadow-2xs flex-shrink-0`}
      />
      {showText && (
        <div className="flex items-baseline gap-1.5 leading-none">
          <span
            className={`font-extrabold tracking-[-0.02em] ${
              textVariant === 'light' ? 'text-white' : 'text-[#0a1317]'
            } ${text}`}
          >
            Dayflow
          </span>
          <span
            className={`font-bold uppercase tracking-[0.08em] ${
              textVariant === 'light' ? 'text-[#8595a4]' : 'text-[#8595a4]'
            } ${sub}`}
          >
            HRMS
          </span>
        </div>
      )}
    </div>
  );
};
