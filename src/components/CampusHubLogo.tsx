import React from 'react';

interface CampusHubLogoProps {
  className?: string;
  size?: number;
  glow?: boolean;
}

export const CampusHubLogo: React.FC<CampusHubLogoProps> = ({
  className = '',
  size = 64,
  glow = false,
}) => {
  return (
    <div
      className={`relative inline-flex items-center justify-center ${className}`}
      style={{ width: size, height: size }}
    >
      {/* Soft ambient back-glow when active */}
      {glow && (
        <div
          className="absolute inset-0 rounded-3xl bg-blue-500/25 blur-xl -z-10 transition-opacity duration-500 pointer-events-none scale-125"
          aria-hidden="true"
        />
      )}

      <svg
        width={size}
        height={size}
        viewBox="0 0 100 100"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-full drop-shadow-[0_4px_12px_rgba(37,99,235,0.18)]"
      >
        <defs>
          <linearGradient id="chPrimaryGrad" x1="12" y1="12" x2="88" y2="88" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#3B82F6" />
            <stop offset="50%" stopColor="#2563EB" />
            <stop offset="100%" stopColor="#1D4ED8" />
          </linearGradient>

          <linearGradient id="chAccentGrad" x1="28" y1="28" x2="72" y2="72" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#60A5FA" />
            <stop offset="100%" stopColor="#2563EB" />
          </linearGradient>

          <linearGradient id="chLightGrad" x1="0" y1="0" x2="100" y2="100" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.35" />
            <stop offset="100%" stopColor="#FFFFFF" stopOpacity="0" />
          </linearGradient>
        </defs>

        {/* Outer Rounded Container Base */}
        <rect
          x="6"
          y="6"
          width="88"
          height="88"
          rx="24"
          fill="url(#chPrimaryGrad)"
        />

        {/* Top-left subtle specular highlight */}
        <rect
          x="6"
          y="6"
          width="88"
          height="88"
          rx="24"
          fill="url(#chLightGrad)"
        />

        {/* NEW MODERN CAMPUSHUB SYMBOL: Interconnected Campus Community & Student Hub */}
        <g className="transition-transform duration-300">
          {/* Outer Interconnected Community Network Loop */}
          <path
            d="M 50 27 A 22.5 22.5 0 0 1 69.5 61.5 A 22.5 22.5 0 0 1 30.5 61.5 A 22.5 22.5 0 0 1 50 27"
            fill="none"
            stroke="#FFFFFF"
            strokeWidth="4.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            opacity="0.9"
          />

          {/* Converging Connection Beams to Central Hub */}
          <line
            x1="50"
            y1="27"
            x2="50"
            y2="50"
            stroke="#FFFFFF"
            strokeWidth="6.5"
            strokeLinecap="round"
          />
          <line
            x1="69.5"
            y1="61.5"
            x2="50"
            y2="50"
            stroke="#FFFFFF"
            strokeWidth="6.5"
            strokeLinecap="round"
          />
          <line
            x1="30.5"
            y1="61.5"
            x2="50"
            y2="50"
            stroke="#FFFFFF"
            strokeWidth="6.5"
            strokeLinecap="round"
          />

          {/* Central Hub Nexus */}
          <circle cx="50" cy="50" r="8" fill="#FFFFFF" />
          <circle cx="50" cy="50" r="4" fill="#2563EB" />

          {/* Three Student Community Nodes */}
          {/* Top Node */}
          <circle cx="50" cy="27" r="6.5" fill="#FFFFFF" />
          <circle cx="50" cy="27" r="2.5" fill="#2563EB" />

          {/* Bottom-Right Node */}
          <circle cx="69.5" cy="61.5" r="6.5" fill="#FFFFFF" />
          <circle cx="69.5" cy="61.5" r="2.5" fill="#2563EB" />

          {/* Bottom-Left Node */}
          <circle cx="30.5" cy="61.5" r="6.5" fill="#FFFFFF" />
          <circle cx="30.5" cy="61.5" r="2.5" fill="#2563EB" />
        </g>
      </svg>
    </div>
  );
};
