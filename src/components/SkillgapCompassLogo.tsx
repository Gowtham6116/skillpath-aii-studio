import React from 'react';

export interface SkillgapCompassLogoProps {
  /**
   * 'full': Stacked emblem with full typography (ideal for Login, Landing, Hero)
   * 'horizontal': Inline emblem + branding text (ideal for Sidebar, Header, Navbar)
   * 'icon': Emblem only (ideal for small buttons, avatars, badges)
   */
  variant?: 'full' | 'horizontal' | 'icon';
  size?: 'sm' | 'md' | 'lg' | 'xl' | 'custom';
  className?: string;
  showTagline?: boolean;
}

export const SkillgapCompassEmblem: React.FC<{
  className?: string;
  size?: number | string;
}> = ({ className = 'w-10 h-10', size }) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 240 240"
      className={className}
      style={size ? { width: size, height: size } : undefined}
      fill="currentColor"
    >
      <defs>
        <linearGradient id="emblemOrangeNeedle" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#FF7A1A" />
          <stop offset="60%" stopColor="#F97316" />
          <stop offset="100%" stopColor="#EA580C" />
        </linearGradient>

        <linearGradient id="emblemTealFacet" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#0E7490" />
          <stop offset="100%" stopColor="#083344" />
        </linearGradient>

        <linearGradient id="emblemBarGrad" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#0284C7" />
          <stop offset="100%" stopColor="#0F3854" />
        </linearGradient>
      </defs>

      {/* Cardinal Directions N, E, S, W */}
      <text
        x="120"
        y="24"
        textAnchor="middle"
        fontFamily="'Montserrat', 'Inter', system-ui, sans-serif"
        fontWeight="900"
        fontSize="16"
        fill="#0F3854"
      >
        N
      </text>
      <text
        x="228"
        y="125"
        textAnchor="middle"
        fontFamily="'Montserrat', 'Inter', system-ui, sans-serif"
        fontWeight="900"
        fontSize="16"
        fill="#0F3854"
      >
        E
      </text>
      <text
        x="120"
        y="228"
        textAnchor="middle"
        fontFamily="'Montserrat', 'Inter', system-ui, sans-serif"
        fontWeight="900"
        fontSize="16"
        fill="#0F3854"
      >
        S
      </text>
      <text
        x="12"
        y="125"
        textAnchor="middle"
        fontFamily="'Montserrat', 'Inter', system-ui, sans-serif"
        fontWeight="900"
        fontSize="16"
        fill="#0F3854"
      >
        W
      </text>

      {/* Outer Compass Track Rings */}
      <circle cx="120" cy="120" r="92" fill="none" stroke="#0F3854" strokeWidth="4.5" />
      <circle
        cx="120"
        cy="120"
        r="84"
        fill="none"
        stroke="#155E75"
        strokeWidth="1.8"
        strokeDasharray="3 3"
      />
      <circle cx="120" cy="120" r="74" fill="none" stroke="#0F3854" strokeWidth="3" />

      {/* Cardinal Axis Ticks */}
      <line x1="120" y1="28" x2="120" y2="46" stroke="#0F3854" strokeWidth="3.5" strokeLinecap="round" />
      <line x1="120" y1="194" x2="120" y2="212" stroke="#0F3854" strokeWidth="3.5" strokeLinecap="round" />
      <line x1="28" y1="120" x2="46" y2="120" stroke="#0F3854" strokeWidth="3.5" strokeLinecap="round" />
      <line x1="194" y1="120" x2="212" y2="120" stroke="#0F3854" strokeWidth="3.5" strokeLinecap="round" />

      {/* Diagonal Marks */}
      <line x1="55" y1="55" x2="68" y2="68" stroke="#0F3854" strokeWidth="2.5" />
      <line x1="185" y1="55" x2="172" y2="68" stroke="#0F3854" strokeWidth="2.5" />
      <line x1="55" y1="185" x2="68" y2="172" stroke="#0F3854" strokeWidth="2.5" />
      <line x1="185" y1="185" x2="172" y2="172" stroke="#0F3854" strokeWidth="2.5" />

      {/* Ascending Growth / Skill Analytics Bars (Lower Quadrant) */}
      <rect x="88" y="142" width="10" height="34" rx="2" fill="url(#emblemBarGrad)" opacity="0.9" />
      <rect x="103" y="128" width="11" height="52" rx="2" fill="url(#emblemBarGrad)" opacity="0.95" />
      <rect x="119" y="112" width="12" height="72" rx="2.5" fill="url(#emblemBarGrad)" />
      <rect x="136" y="96" width="13" height="92" rx="2.5" fill="url(#emblemBarGrad)" />

      {/* Compass Rose Star Points (Behind Needle) */}
      <polygon points="120,38 120,120 108,120" fill="#155E75" />
      <polygon points="120,38 120,120 132,120" fill="#0C2D42" />

      <polygon points="120,202 120,120 108,120" fill="#0C2D42" />
      <polygon points="120,202 120,120 132,120" fill="#155E75" />

      <polygon points="38,120 120,120 120,108" fill="#0C2D42" />
      <polygon points="38,120 120,120 120,132" fill="#155E75" />

      <polygon points="202,120 120,120 120,108" fill="#155E75" />
      <polygon points="202,120 120,120 120,132" fill="#0C2D42" />

      {/* Dynamic 3D Compass Needle & Growth Arrow (Rotated 45deg to NE) */}
      <g transform="rotate(45, 120, 120)">
        {/* Top Arrow Main Face (Vibrant Orange) */}
        <path d="M 120,18 L 146,58 L 126,54 L 124,120 L 120,120 Z" fill="url(#emblemOrangeNeedle)" />
        {/* Top Arrow Beveled 3D Edge (Cyan/Teal) */}
        <path d="M 120,18 L 94,58 L 114,54 L 116,120 L 120,120 Z" fill="url(#emblemTealFacet)" />

        {/* Bottom Needle */}
        <polygon points="120,120 114,120 120,196" fill="#F97316" />
        <polygon points="120,120 126,120 120,196" fill="#0E7490" />

        {/* Center Ridge Highlight */}
        <line x1="120" y1="20" x2="120" y2="194" stroke="#FFFFFF" strokeWidth="1.5" opacity="0.4" />
      </g>

      {/* Central Pivot Hub */}
      <circle cx="120" cy="120" r="16" fill="#F8FAFC" stroke="#0F3854" strokeWidth="4" />
      <circle cx="120" cy="120" r="8" fill="#0F3854" />
      <circle cx="120" cy="120" r="3.5" fill="#FFFFFF" />
    </svg>
  );
};

export const SkillgapCompassLogo: React.FC<SkillgapCompassLogoProps> = ({
  variant = 'horizontal',
  size = 'md',
  className = '',
  showTagline = true,
}) => {
  // Size presets for emblem
  const emblemSizes = {
    sm: 'w-7 h-7',
    md: 'w-10 h-10',
    lg: 'w-14 h-14',
    xl: 'w-24 h-24 sm:w-28 sm:h-28',
    custom: '',
  };

  if (variant === 'icon') {
    return (
      <div className={`inline-flex items-center justify-center shrink-0 ${className}`}>
        <SkillgapCompassEmblem className={emblemSizes[size]} />
      </div>
    );
  }

  if (variant === 'full') {
    return (
      <div className={`flex flex-col items-center text-center ${className}`}>
        {/* Emblem with subtle glow */}
        <div className="relative mb-3 flex items-center justify-center">
          <SkillgapCompassEmblem className={emblemSizes[size]} />
        </div>

        {/* Brand Typography */}
        <div className="space-y-0.5">
          <h1 className="text-2xl sm:text-3xl font-black tracking-tight leading-none text-[#0F334A] flex flex-col items-center">
            <span className="text-[#0F334A] tracking-wider">SKILLGAP</span>
            <span className="text-[#F97316] tracking-wide mt-0.5">COMPASS</span>
          </h1>

          {showTagline && (
            <p className="text-[11px] sm:text-xs font-bold tracking-[0.22em] text-[#EA580C] uppercase mt-1">
              NAVIGATE YOUR GROWTH
            </p>
          )}
        </div>
      </div>
    );
  }

  // Default: 'horizontal' (Emblem on left, text on right)
  return (
    <div className={`inline-flex items-center gap-3 text-left ${className}`}>
      <SkillgapCompassEmblem className={`${emblemSizes[size]} shrink-0`} />
      <div className="leading-tight">
        <div className="font-black tracking-tight text-slate-900 flex items-center gap-1.5 text-base sm:text-lg">
          <span className="text-[#0F334A]">SKILLGAP</span>
          <span className="text-[#F97316]">COMPASS</span>
        </div>
        {showTagline && (
          <p className="text-[9px] font-bold tracking-[0.16em] text-[#EA580C] uppercase">
            NAVIGATE YOUR GROWTH
          </p>
        )}
      </div>
    </div>
  );
};
