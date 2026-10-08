import React from 'react';

interface PhantomMascotProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg' | 'hero';
}

export const PhantomMascot: React.FC<PhantomMascotProps> = ({
  className = '',
  size = 'hero',
}) => {
  const sizeClasses = {
    sm: 'w-24 h-24',
    md: 'w-48 h-48',
    lg: 'w-64 h-64',
    hero: 'w-full max-w-[440px] h-auto aspect-square',
  };

  return (
    <div className={`relative flex items-center justify-center select-none ${sizeClasses[size]} ${className}`}>
      {/* Ambient background glow */}
      <div className="absolute inset-0 bg-gradient-to-tr from-phantom-purple/20 via-phantom-cyan/15 to-transparent rounded-full filter blur-2xl animate-pulse-subtle pointer-events-none" />

      {/* Floating Mysterious Bug Cards behind and around detective */}
      <div className="absolute -top-4 right-6 bg-phantom-deep/90 border border-phantom-cyan/40 rounded-lg p-2 shadow-glow-cyan animate-float transform rotate-6 z-10 hidden sm:block">
        <div className="flex items-center gap-1.5 text-[10px] font-mono text-phantom-cyan">
          <svg className="w-3.5 h-3.5 text-phantom-cyan" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <rect width="8" height="14" x="8" y="5" rx="4" />
            <path d="m19 7-3 2" /><path d="m5 7 3 2" />
            <path d="m19 19-3-2" /><path d="m5 19 3-2" />
            <path d="M20 13h-4" /><path d="M4 13h4" /><path d="m10 4 1 2" /><path d="m14 4-1 2" />
          </svg>
          <span>Shadow #042</span>
        </div>
      </div>

      <div className="absolute bottom-10 left-2 bg-phantom-deep/90 border border-phantom-crimson/50 rounded-lg p-2 shadow-lg animate-float transform -rotate-12 z-10 hidden sm:block" style={{ animationDelay: '1.5s' }}>
        <div className="flex items-center gap-1.5 text-[10px] font-mono text-phantom-crimson">
          <span className="w-2 h-2 rounded-full bg-phantom-crimson animate-ping" />
          <span>OffByOneError</span>
        </div>
      </div>

      {/* Main Mascot Detective SVG Illustration */}
      <svg
        viewBox="0 0 320 320"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-full relative z-0 filter drop-shadow-[0_12px_24px_rgba(0,0,0,0.6)]"
      >
        <defs>
          <linearGradient id="cloakGrad" x1="80" y1="60" x2="240" y2="280" gradientUnits="userSpaceOnUse">
            <stop stopColor="#3B1D7A" />
            <stop offset="0.5" stopColor="#1E1242" />
            <stop offset="1" stopColor="#0B091A" />
          </linearGradient>

          <linearGradient id="innerHood" x1="160" y1="80" x2="160" y2="180" gradientUnits="userSpaceOnUse">
            <stop stopColor="#060814" />
            <stop offset="1" stopColor="#020308" />
          </linearGradient>

          <linearGradient id="cyanLens" x1="190" y1="130" x2="250" y2="190" gradientUnits="userSpaceOnUse">
            <stop stopColor="#22D3EE" stopOpacity="0.4" />
            <stop offset="0.7" stopColor="#8B5CF6" stopOpacity="0.2" />
            <stop offset="1" stopColor="#22D3EE" stopOpacity="0.8" />
          </linearGradient>

          <filter id="cyanGlow" x="0" y="0" width="300%" height="300%">
            <feGaussianBlur stdDeviation="4" result="coloredBlur"/>
            <feMerge>
              <feMergeNode in="coloredBlur"/>
              <feMergeNode in="SourceGraphic"/>
            </feMerge>
          </filter>
        </defs>

        {/* Floating Mystical Platform / Base */}
        <ellipse cx="160" cy="285" rx="90" ry="14" fill="#0E172E" opacity="0.8" />
        <ellipse cx="160" cy="285" rx="70" ry="8" fill="#1E1242" opacity="0.6" />
        <ellipse cx="160" cy="285" rx="40" ry="3" fill="#22D3EE" opacity="0.4" className="animate-pulse" />

        {/* Flowing Cloak / Robes */}
        <path
          d="M100 130 C75 180 60 230 70 275 C100 282 220 282 250 275 C260 230 245 180 220 130 Z"
          fill="url(#cloakGrad)"
        />

        {/* Cloak folds & highlights */}
        <path
          d="M110 150 Q130 220 115 275"
          stroke="#8B5CF6"
          strokeWidth="2"
          strokeOpacity="0.3"
        />
        <path
          d="M210 150 Q190 220 205 275"
          stroke="#8B5CF6"
          strokeWidth="2"
          strokeOpacity="0.3"
        />

        {/* Hood (Deep Pointed cowl) */}
        <path
          d="M160 35 C110 40 85 85 92 145 C100 175 125 185 160 185 C195 185 220 175 228 145 C235 85 210 40 160 35 Z"
          fill="url(#cloakGrad)"
          stroke="#8B5CF6"
          strokeWidth="1.5"
          strokeOpacity="0.4"
        />

        {/* Hood peak curve */}
        <path
          d="M160 35 C155 25 145 15 135 12 C145 28 152 32 160 35 Z"
          fill="#3B1D7A"
        />

        {/* Inside of Hood (Deep Shadow Void) */}
        <path
          d="M160 55 C125 58 105 92 110 145 C115 168 135 175 160 175 C185 175 205 168 210 145 C215 92 195 58 160 55 Z"
          fill="url(#innerHood)"
        />

        {/* Glowing Cyan Detective Eyes / Visor */}
        <g filter="url(#cyanGlow)">
          {/* Left glowing eye */}
          <ellipse cx="142" cy="118" rx="8" ry="4.5" fill="#22D3EE" transform="rotate(-6 142 118)" />
          <ellipse cx="144" cy="117" rx="3.5" ry="2" fill="#FFFFFF" />

          {/* Right glowing eye */}
          <ellipse cx="178" cy="118" rx="8" ry="4.5" fill="#22D3EE" transform="rotate(6 178 118)" />
          <ellipse cx="176" cy="117" rx="3.5" ry="2" fill="#FFFFFF" />
        </g>

        {/* Collar / Detective Mantle */}
        <path
          d="M110 145 C135 165 185 165 210 145 C218 165 205 190 160 195 C115 190 102 165 110 145 Z"
          fill="#4C1D95"
          stroke="#A78BFA"
          strokeWidth="1"
          strokeOpacity="0.5"
        />

        {/* Detective Scarf / Neck Token */}
        <polygon points="160,188 167,198 160,208 153,198" fill="#22D3EE" filter="url(#cyanGlow)" />

        {/* Right Arm Holding Glowing Detective Magnifier */}
        {/* Arm Sleeve */}
        <path
          d="M215 160 C235 175 250 200 240 225 C230 220 220 200 205 185 Z"
          fill="#2E1065"
        />
        {/* Glove / Hand */}
        <ellipse cx="238" cy="223" rx="8" ry="7" fill="#1E1242" stroke="#8B5CF6" strokeWidth="1" />

        {/* Magnifying Glass Frame and Lens */}
        {/* Handle */}
        <line x1="235" y1="225" x2="220" y2="245" stroke="#8B5CF6" strokeWidth="4" strokeLinecap="round" />
        <line x1="235" y1="225" x2="220" y2="245" stroke="#22D3EE" strokeWidth="2" strokeLinecap="round" />

        {/* Big Magnifier Rim */}
        <circle
          cx="248"
          cy="195"
          r="30"
          stroke="#22D3EE"
          strokeWidth="4"
          filter="url(#cyanGlow)"
        />
        {/* Glass lens */}
        <circle cx="248" cy="195" r="28" fill="url(#cyanLens)" />
        {/* Glint reflections on lens */}
        <path
          d="M230 180 A22 22 0 0 1 266 180"
          stroke="#FFFFFF"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeOpacity="0.8"
        />

        {/* Tiny Bug inside Magnifier Lens */}
        <g transform="translate(242, 189) scale(0.65)">
          <ellipse cx="10" cy="10" rx="6" ry="8" fill="#FB7185" />
          <circle cx="10" cy="4" r="3.5" fill="#FB7185" />
          <line x1="4" y1="6" x2="0" y2="3" stroke="#FB7185" strokeWidth="1.5" />
          <line x1="16" y1="6" x2="20" y2="3" stroke="#FB7185" strokeWidth="1.5" />
          <line x1="4" y1="10" x2="0" y2="10" stroke="#FB7185" strokeWidth="1.5" />
          <line x1="16" y1="10" x2="20" y2="10" stroke="#FB7185" strokeWidth="1.5" />
          <circle cx="8" cy="3.5" r="1" fill="#FFFFFF" />
          <circle cx="12" cy="3.5" r="1" fill="#FFFFFF" />
        </g>
      </svg>
    </div>
  );
};
