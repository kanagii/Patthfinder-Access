import React from 'react';
import { AppView } from '../types';

interface PhonePrototypeFrameProps {
  currentView: AppView;
  onSelectView: (view: AppView) => void;
  children: React.ReactNode;
}

const PROTOTYPE_SCREENS: {
  id: AppView;
  step: string;
  label: string;
  icon: string;
}[] = [
  { id: 'onboarding', step: '01', label: 'Mobility Onboarding', icon: 'tune' },
  { id: 'map', step: '02', label: 'Home Campus Map', icon: 'map' },
  { id: 'routes', step: '03', label: 'Route A vs Route B', icon: 'alt_route' },
  { id: 'navigation', step: '04', label: 'Turn-by-Turn Reroute', icon: 'navigation' },
  { id: 'hazard-detail', step: '05', label: 'Hazard Detail', icon: 'info' },
  { id: 'report', step: '06', label: 'Report Obstacle', icon: 'warning' },
  { id: 'report-success', step: '07', label: 'Karma Unlock', icon: 'verified' },
  { id: 'rewards', step: '08', label: 'Rewards & Leaderboard', icon: 'award_star' },
  { id: 'profile', step: '09', label: 'Profile & Assists', icon: 'accessibility_new' },
  { id: 'admin', step: '10', label: 'PDAO Desktop Portal', icon: 'analytics' },
];

export const PhonePrototypeFrame: React.FC<PhonePrototypeFrameProps> = ({
  currentView,
  onSelectView,
  children,
}) => {
  return (
    <div className="min-h-screen w-full bg-[#e6ebf5] sm:bg-[radial-gradient(circle_at_top,_#f4f7ff_0%,_#dfe6f4_100%)] flex flex-col lg:flex-row items-center justify-center sm:py-5 sm:px-6 gap-6">
      {/* Smartphone Device Shell (Edge-to-edge on small phones, realistic frame on sm+) */}
      <div className="w-full h-[100dvh] sm:w-[412px] sm:h-[852px] sm:max-h-[calc(100vh-2.5rem)] sm:rounded-[52px] sm:p-[11px] sm:bg-gradient-to-b sm:from-[#262d3a] sm:to-[#171b24] sm:shadow-[0_28px_72px_rgba(20,27,43,0.32)] sm:ring-1 sm:ring-white/20 relative flex flex-col shrink-0">
        {/* Side Hardware Buttons (Desktop Prototype Aesthetic) */}
        <div
          aria-hidden="true"
          className="hidden sm:block absolute -left-[3px] top-28 w-[3px] h-8 rounded-l-sm bg-[#343c4d]"
        />
        <div
          aria-hidden="true"
          className="hidden sm:block absolute -left-[3px] top-40 w-[3px] h-14 rounded-l-sm bg-[#343c4d]"
        />
        <div
          aria-hidden="true"
          className="hidden sm:block absolute -left-[3px] top-56 w-[3px] h-14 rounded-l-sm bg-[#343c4d]"
        />
        <div
          aria-hidden="true"
          className="hidden sm:block absolute -right-[3px] top-36 w-[3px] h-20 rounded-r-sm bg-[#343c4d]"
        />

        {/* Phone Inner Display (transform creates containing block for fixed modals & toasts) */}
        <div className="w-full h-full bg-surface text-on-surface sm:rounded-[41px] overflow-hidden relative flex flex-col [transform:translateZ(0)] sm:ring-1 sm:ring-black/15">
          {/* Simulated Phone Status Bar + Dynamic Island */}
          <div className="hidden sm:flex items-center justify-between px-6 h-11 bg-surface/95 backdrop-blur-md text-on-surface shrink-0 select-none z-40">
            <span className="text-xs font-bold tabular-nums tracking-tight w-12">
              10:42
            </span>
            <div
              aria-hidden="true"
              className="w-24 h-6 rounded-full bg-[#11151d] flex items-center justify-end pr-2 shadow-inner"
            >
              <span className="w-2.5 h-2.5 rounded-full bg-[#1e2736] ring-1 ring-white/10" />
            </div>
            <div className="flex items-center gap-1.5 text-on-surface w-12 justify-end">
              <span className="material-symbols-outlined text-[15px]">
                signal_cellular_alt
              </span>
              <span className="material-symbols-outlined text-[15px]">
                wifi
              </span>
              <span className="material-symbols-outlined text-[16px]">
                battery_full
              </span>
            </div>
          </div>

          {/* App Viewport */}
          <div className="flex-1 min-h-0 flex flex-col relative overflow-hidden">
            {children}
          </div>

          {/* Phone Home Indicator */}
          <div className="hidden sm:flex items-center justify-center py-2 bg-surface/95 shrink-0 z-40">
            <div className="w-32 h-1 rounded-full bg-on-surface/25" />
          </div>
        </div>
      </div>

      {/* Prototype Screen Switcher Dock (Visible beside phone on desktop) */}
      <aside
        aria-label="Prototype Screen Switcher"
        className="hidden lg:flex flex-col w-72 bg-surface-container-lowest/90 backdrop-blur-md rounded-2xl p-4 shadow-[0_12px_36px_rgba(20,27,43,0.08)] border border-outline-variant/30 gap-3 max-h-[calc(100vh-2.5rem)]"
      >
        <div className="pb-2.5 border-b border-outline-variant/30">
          <span className="text-[11px] font-bold uppercase tracking-wider text-primary">
            Interactive Mobile Prototype
          </span>
          <h2 className="text-base font-extrabold text-on-surface mt-0.5">
            PathFinder Access
          </h2>
          <p className="text-xs text-on-surface-variant mt-0.5">
            Tap inside the phone or jump to any screen below.
          </p>
        </div>

        <div className="flex flex-col gap-1 overflow-y-auto no-scrollbar pr-0.5">
          {PROTOTYPE_SCREENS.map((screen) => {
            const isActive = currentView === screen.id;
            return (
              <button
                key={screen.id}
                type="button"
                onClick={() => onSelectView(screen.id)}
                className={`w-full px-3 py-2.5 rounded-xl flex items-center gap-2.5 text-left transition-all ${
                  isActive
                    ? 'bg-primary text-on-primary shadow-sm font-bold'
                    : 'hover:bg-surface-container text-on-surface-variant hover:text-on-surface font-medium'
                }`}
              >
                <span
                  className={`font-mono text-[11px] font-bold w-5 shrink-0 ${
                    isActive ? 'text-primary-fixed' : 'text-outline'
                  }`}
                >
                  {screen.step}
                </span>
                <span
                  className={`material-symbols-outlined text-[18px] shrink-0 ${
                    isActive ? 'material-symbols-filled' : ''
                  }`}
                >
                  {screen.icon}
                </span>
                <span className="text-xs truncate flex-1">{screen.label}</span>
              </button>
            );
          })}
        </div>
      </aside>
    </div>
  );
};
