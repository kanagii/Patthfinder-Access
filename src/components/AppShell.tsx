import React, { useEffect, useRef } from 'react';
import { STITCH_ASSETS } from '../data/initialData';
import { AppView } from '../types';
import { ResilientImage } from './ResilientImage';

interface AppShellProps {
  currentView: AppView;
  onNavigate: (view: AppView) => void;
  onBack?: () => void;
  onTriggerSafetyModal: () => void;
  children: React.ReactNode;
}

const VIEW_TITLES: Record<AppView, string> = {
  onboarding: 'Mobility Profile',
  map: 'Campus Map',
  routes: 'Route Comparison',
  navigation: 'Turn-by-Turn',
  'hazard-detail': 'Hazard Details',
  report: 'Report Obstacle',
  'report-success': 'Report Submitted',
  rewards: 'Rewards & Karma',
  profile: 'Profile & Settings',
  admin: 'Admin Portal',
};

const STACK_VIEWS: AppView[] = ['hazard-detail', 'routes', 'navigation'];

export const AppShell: React.FC<AppShellProps> = ({
  currentView,
  onNavigate,
  onBack,
  onTriggerSafetyModal,
  children,
}) => {
  const mainRef = useRef<HTMLElement>(null);
  const isStackHeader = STACK_VIEWS.includes(currentView);
  const showBottomNav =
    currentView !== 'onboarding' && currentView !== 'report-success';

  useEffect(() => {
    mainRef.current?.scrollTo({ top: 0, behavior: 'smooth' });
  }, [currentView]);

  return (
    <div className="h-full flex-1 min-h-0 bg-surface text-on-surface flex flex-col overflow-hidden">
      {/* Top Mobile App Bar */}
      <header className="shrink-0 w-full z-30 bg-surface/95 backdrop-blur-xl border-b border-outline-variant/30">
        <div className="h-14 px-3.5 flex items-center justify-between gap-2">
          <div className="flex items-center gap-2.5 min-w-0">
            {isStackHeader && onBack ? (
              <button
                type="button"
                aria-label="Go back"
                onClick={onBack}
                className="w-10 h-10 flex items-center justify-center rounded-xl text-on-surface hover:bg-surface-container-high transition-colors shrink-0"
              >
                <span className="material-symbols-outlined text-[22px]">
                  arrow_back
                </span>
              </button>
            ) : (
              <div className="shrink-0">
                <ResilientImage
                  src={STITCH_ASSETS.logo}
                  alt="PathFinder Access Logo"
                  className="h-8 w-8 object-contain rounded-md"
                  fallbackIcon="accessible_forward"
                />
              </div>
            )}
            <div className="flex flex-col min-w-0">
              <span className="text-[10px] font-bold text-primary uppercase tracking-wider truncate">
                PathFinder Access
              </span>
              <h1 className="text-base font-bold text-on-surface truncate leading-tight">
                {VIEW_TITLES[currentView]}
              </h1>
            </div>
          </div>

          <div className="flex items-center gap-1.5 shrink-0">
            <button
              type="button"
              aria-label="Campus Safety & Assistance"
              onClick={onTriggerSafetyModal}
              className="w-10 h-10 rounded-full flex items-center justify-center text-secondary hover:bg-surface-container active:scale-95 transition-transform"
            >
              <span className="material-symbols-outlined text-[22px]">
                video_search
              </span>
            </button>

            <button
              type="button"
              aria-label="Open Profile"
              onClick={() => onNavigate('profile')}
              className="w-8 h-8 rounded-full bg-primary text-on-primary flex items-center justify-center shrink-0 hover:bg-primary-container transition-colors"
            >
              <span className="material-symbols-outlined text-[18px]">
                person
              </span>
            </button>
          </div>
        </div>
      </header>

      {/* Scrollable Screen Content */}
      <main
        ref={mainRef}
        className="flex-1 min-h-0 overflow-y-auto no-scrollbar flex flex-col w-full pb-4"
      >
        {children}
      </main>

      {/* Mobile Bottom Tab Bar (Pinned inside phone screen) */}
      {showBottomNav && (
        <nav
          aria-label="Primary Mobile Navigation"
          className="shrink-0 w-full z-30 pb-safe bg-surface/95 backdrop-blur-xl shadow-[0_-4px_16px_rgba(20,27,43,0.08)] border-t border-outline-variant/30"
        >
          <div className="flex items-center justify-around h-[72px] px-2">
            <button
              type="button"
              onClick={() => onNavigate('map')}
              className={`flex flex-col items-center justify-center min-w-[56px] min-h-[52px] px-2 transition-colors ${
                currentView === 'map' ||
                currentView === 'routes' ||
                currentView === 'navigation' ||
                currentView === 'hazard-detail'
                  ? 'text-primary font-bold'
                  : 'text-on-surface-variant hover:text-on-surface'
              }`}
            >
              <span
                className={`material-symbols-outlined text-[24px] ${
                  currentView === 'map' ? 'material-symbols-filled' : ''
                }`}
              >
                map
              </span>
              <span className="text-[11px] font-semibold mt-0.5">Map</span>
            </button>

            <button
              type="button"
              onClick={() => onNavigate('report')}
              className={`flex flex-col items-center justify-center min-w-[56px] min-h-[52px] px-2 transition-colors ${
                currentView === 'report'
                  ? 'text-secondary font-bold'
                  : 'text-on-surface-variant hover:text-on-surface'
              }`}
            >
              <span
                className={`material-symbols-outlined text-[24px] ${
                  currentView === 'report' ? 'material-symbols-filled' : ''
                }`}
              >
                warning
              </span>
              <span className="text-[11px] font-semibold mt-0.5">Report</span>
            </button>

            <button
              type="button"
              onClick={() => onNavigate('rewards')}
              className={`flex flex-col items-center justify-center min-w-[56px] min-h-[52px] px-2 transition-colors ${
                currentView === 'rewards'
                  ? 'text-primary font-bold'
                  : 'text-on-surface-variant hover:text-on-surface'
              }`}
            >
              <span
                className={`material-symbols-outlined text-[24px] ${
                  currentView === 'rewards' ? 'material-symbols-filled' : ''
                }`}
              >
                award_star
              </span>
              <span className="text-[11px] font-semibold mt-0.5">Rewards</span>
            </button>

            <button
              type="button"
              onClick={() => onNavigate('profile')}
              className={`flex flex-col items-center justify-center min-w-[56px] min-h-[52px] px-2 transition-colors ${
                currentView === 'profile'
                  ? 'text-primary font-bold'
                  : 'text-on-surface-variant hover:text-on-surface'
              }`}
            >
              <span
                className={`material-symbols-outlined text-[24px] ${
                  currentView === 'profile' ? 'material-symbols-filled' : ''
                }`}
              >
                accessibility_new
              </span>
              <span className="text-[11px] font-semibold mt-0.5">Profile</span>
            </button>
          </div>
        </nav>
      )}
    </div>
  );
};
