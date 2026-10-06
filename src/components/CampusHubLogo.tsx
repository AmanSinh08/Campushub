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

        {/* Connected Campus Hub Geometric Nodes (Interlocking 'C' & 'H' / Campus Grid Network) */}
        {/* Left Vertical Pillar */}
        <rect x="25" y="26" width="13" height="48" rx="6.5" fill="#FFFFFF" />

        {/* Right Vertical Pillar */}
        <rect x="62" y="26" width="13" height="48" rx="6.5" fill="#FFFFFF" />

        {/* Connecting Central Bridge / Hub Node */}
        <rect x="25" y="44" width="50" height="12" rx="6" fill="#FFFFFF" />

        {/* Dynamic Center Pulse Core */}
        <circle cx="50" cy="50" r="5" fill="#2563EB" />

        {/* Subtle Top Right Connection Pip */}
        <circle cx="68.5" cy="32.5" r="3" fill="#93C5FD" />
      </svg>
    </div>
  );
};
