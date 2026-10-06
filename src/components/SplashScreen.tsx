import React, { useState, useEffect } from 'react';
import { CampusHubLogo } from './CampusHubLogo';

interface SplashScreenProps {
  onComplete: () => void;
  isMobilePreview?: boolean;
}

export const SplashScreen: React.FC<SplashScreenProps> = ({
  onComplete,
  isMobilePreview = false,
}) => {
  // Stage 0: 0.0 - 0.2s -> Clean minimal background only
  // Stage 1: 0.2 - 0.6s -> Logo fades in & scales 70% to 100% + soft blue glow
  // Stage 2: 0.6 - 0.9s -> "CampusHub" bold typography reveals with slight upward motion
  // Stage 3: 0.9 - 1.2s -> "Our Campus. One Hub." tagline reveals
  // Stage 4: 1.2 - 1.5s -> Hold composition
  // Stage 5: 1.5 - 1.8s -> Smooth fade & zoom transition into dashboard
  const [phase, setPhase] = useState<0 | 1 | 2 | 3 | 4 | 5>(0);

  useEffect(() => {
    // 0.2s mark: Begin Logo reveal & scale
    const t1 = setTimeout(() => setPhase(1), 200);

    // 0.6s mark: Reveal "CampusHub" brand text
    const t2 = setTimeout(() => setPhase(2), 600);

    // 0.9s mark: Reveal "Our Campus. One Hub." tagline
    const t3 = setTimeout(() => setPhase(3), 900);

    // 1.2s mark: Hold complete composition
    const t4 = setTimeout(() => setPhase(4), 1200);

    // 1.5s mark: Begin smooth transition out into app
    const t5 = setTimeout(() => setPhase(5), 1500);

    // 1.8s mark: Complete transition
    const t6 = setTimeout(() => {
      onComplete();
    }, 1800);

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
      clearTimeout(t4);
      clearTimeout(t5);
      clearTimeout(t6);
    };
  }, [onComplete]);

  return (
    <div
      className={`fixed inset-0 z-100 flex items-center justify-center overflow-hidden transition-all duration-300 ease-out select-none ${
        phase === 5 ? 'opacity-0 scale-105 pointer-events-none' : 'opacity-100 scale-100'
      }`}
      style={{
        background:
          'radial-gradient(circle at 50% 45%, #FFFFFF 0%, #F5F9FF 55%, #EBF3FE 100%)',
      }}
    >
      {/* Subtle ambient soft blue background light */}
      <div
        className={`absolute w-96 h-96 rounded-full bg-blue-400/10 blur-3xl pointer-events-none transition-all duration-700 ease-out ${
          phase >= 1 ? 'opacity-100 scale-100' : 'opacity-0 scale-75'
        }`}
        style={{ top: 'calc(50% - 192px)', left: 'calc(50% - 192px)' }}
        aria-hidden="true"
      />

      {/* Main Centered Content Container */}
      <div className="relative z-10 flex flex-col items-center justify-center text-center px-6 max-w-sm w-full">
        {/* Exact CampusHub Logo: Fades in and scales 70% -> 100% between 0.2s - 0.6s */}
        <div
          className={`transition-all duration-400 ease-[cubic-bezier(0.16,1,0.3,1)] ${
            phase >= 1
              ? 'opacity-100 scale-100 translate-y-0'
              : 'opacity-0 scale-70 translate-y-2'
          }`}
        >
          <CampusHubLogo
            size={88}
            glow={phase >= 1}
            className="transition-transform duration-500"
          />
        </div>

        {/* Brand Name: "CampusHub" reveals smoothly at 0.6s - 0.9s with slight upward movement */}
        <div
          className={`mt-5 transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] ${
            phase >= 2
              ? 'opacity-100 translate-y-0'
              : 'opacity-0 translate-y-3'
          }`}
        >
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-[#171717] font-sans">
            Campus<span className="text-[#2563EB]">Hub</span>
          </h1>
        </div>

        {/* Tagline: "Our Campus. One Hub." reveals smoothly at 0.9s - 1.2s */}
        <div
          className={`mt-1.5 transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] ${
            phase >= 3
              ? 'opacity-100 translate-y-0'
              : 'opacity-0 translate-y-2'
          }`}
        >
          <p className="text-xs sm:text-sm font-light tracking-wide text-[#6B7280]">
            Our Campus. One Hub.
          </p>
        </div>
      </div>
    </div>
  );
};
