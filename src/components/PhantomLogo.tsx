import React from 'react';

interface PhantomLogoProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showText?: boolean;
  className?: string;
}

export const PhantomLogo: React.FC<PhantomLogoProps> = ({
  size = 'md',
  showText = true,
  className = '',
}) => {
  const iconSizes = {
    sm: 'w-6 h-6',
    md: 'w-8 h-8',
    lg: 'w-10 h-10',
    xl: 'w-14 h-14',
  };

  const textSizes = {
    sm: 'text-lg',
    md: 'text-xl',
    lg: 'text-2xl',
    xl: 'text-4xl',
  };

  return (
    <div className={`inline-flex items-center gap-2.5 select-none ${className}`}>
      {/* Custom Vector Icon: Curly Braces framing Glowing Phantom Magnifier */}
      <div className={`relative ${iconSizes[size]} flex items-center justify-center shrink-0`}>
        <svg
          viewBox="0 0 40 40"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="w-full h-full drop-shadow-[0_0_8px_rgba(34,211,238,0.4)]"
        >
          {/* Left Bracket */}
          <path
            d="M11 8C6.5 8 5 11 5 15V17.5C5 19 3 20 1.5 20C3 20 5 21 5 22.5V25C5 29 6.5 32 11 32"
            stroke="#8B5CF6"
            strokeWidth="2.5"
            strokeLinecap="round"
          />

          {/* Right Bracket */}
          <path
            d="M29 8C33.5 8 35 11 35 15V17.5C35 19 37 20 38.5 20C37 20 35 21 35 22.5V25C35 29 33.5 32 29 32"
            stroke="#8B5CF6"
            strokeWidth="2.5"
            strokeLinecap="round"
          />

          {/* Detective Magnifier Rim */}
          <circle
            cx="19"
            cy="18"
            r="7"
            stroke="#22D3EE"
            strokeWidth="2.5"
            className="filter drop-shadow-[0_0_4px_#22D3EE]"
          />

          {/* Lens Glass Gradient & Phantom Glint */}
          <circle cx="19" cy="18" r="5.5" fill="#080D1B" fillOpacity="0.8" />
          <path
            d="M17 15C18 14 20 14 21 15"
            stroke="#A78BFA"
            strokeWidth="1.5"
            strokeLinecap="round"
          />

          {/* Glowing Phantom Iris */}
          <circle cx="19" cy="18" r="2" fill="#22D3EE" className="animate-pulse" />

          {/* Magnifier Handle */}
          <line
            x1="24.5"
            y1="23.5"
            x2="30"
            y2="29"
            stroke="#22D3EE"
            strokeWidth="3"
            strokeLinecap="round"
          />
        </svg>
      </div>

      {/* Brand Wordmark */}
      {showText && (
        <div className={`font-bold tracking-tight ${textSizes[size]} flex items-center`}>
          <span className="text-slate-900 dark:text-white drop-shadow-sm font-sans transition-colors">
            Code
          </span>
          <span className="bg-gradient-to-r from-phantom-purple via-phantom-violet to-phantom-cyan bg-clip-text text-transparent font-sans ml-0.5">
            Phantom
          </span>
        </div>
      )}
    </div>
  );
};
