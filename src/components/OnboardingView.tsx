import React from 'react';
import { MOBILITY_PROFILES } from '../data/initialData';
import { useHorizontalScroll } from '../hooks/useHorizontalScroll';
import { MobilityModeId } from '../types';

interface OnboardingViewProps {
  selectedMode: MobilityModeId;
  onSelectMode: (mode: MobilityModeId) => void;
  onContinue: () => void;
  onSkip: () => void;
}

export const OnboardingView: React.FC<OnboardingViewProps> = ({
  selectedMode,
  onSelectMode,
  onContinue,
  onSkip,
}) => {
  const {
    scrollRef: carouselRef,
    edgeState,
    scrollByStep,
    containerProps,
  } = useHorizontalScroll(296);
  const onboardingProfiles = MOBILITY_PROFILES;

  const scrollToProfile = (idx: number, id: MobilityModeId) => {
    onSelectMode(id);
    const el = carouselRef.current?.children[idx] as HTMLElement | undefined;
    el?.scrollIntoView({
      behavior: 'smooth',
      inline: 'center',
      block: 'nearest',
    });
  };

  return (
    <div className="w-full min-w-0 overflow-x-hidden px-4 py-4 flex flex-col flex-1">
      {/* Header Progress */}
      <div className="pb-3 flex flex-col gap-1.5">
        <div className="flex items-center justify-between flex-wrap gap-2">
          <span className="text-xs font-bold text-primary tracking-wide">
            Step 1 of 3 · Personalized Navigation
          </span>
          <span className="text-[11px] font-semibold text-on-surface-variant">
            CIT-U Onboarding
          </span>
        </div>
        <h2 className="text-2xl font-extrabold text-on-surface tracking-tight text-balance">
          Choose your mobility profile
        </h2>
        <p className="text-sm text-on-surface-variant leading-relaxed">
          PathFinder customizes route inclines, surface smoothness, and eliminates
          physical barriers across CIT-U campus based on your needs.
        </p>
      </div>

      {/* Horizontal Scroll Header + Quick Controls */}
      <div className="flex items-center justify-between mt-1 mb-1.5">
        <span className="text-xs font-semibold text-on-surface-variant flex items-center gap-1">
          <span className="material-symbols-outlined text-[16px] text-primary">
            swipe
          </span>
          Swipe or scroll profiles
        </span>
        <div className="flex items-center gap-1">
          <button
            type="button"
            aria-label="Scroll profiles left"
            disabled={!edgeState.canScrollLeft}
            onClick={() => scrollByStep(-1)}
            className="w-8 h-8 rounded-lg bg-surface-container hover:bg-surface-container-high disabled:opacity-35 text-on-surface flex items-center justify-center active:scale-95 transition-all"
          >
            <span className="material-symbols-outlined text-[18px]">
              chevron_left
            </span>
          </button>
          <button
            type="button"
            aria-label="Scroll profiles right"
            disabled={!edgeState.canScrollRight}
            onClick={() => scrollByStep(1)}
            className="w-8 h-8 rounded-lg bg-surface-container hover:bg-surface-container-high disabled:opacity-35 text-on-surface flex items-center justify-center active:scale-95 transition-all"
          >
            <span className="material-symbols-outlined text-[18px]">
              chevron_right
            </span>
          </button>
        </div>
      </div>

      {/* Profile Cards Horizontal Carousel */}
      <div
        ref={carouselRef}
        role="radiogroup"
        aria-label="Campus Mobility Profile Options"
        {...containerProps}
        className="flex flex-nowrap gap-3 overflow-x-auto overscroll-x-contain snap-x snap-mandatory touch-pan-x scroll-smooth -mx-4 px-4 scroll-px-4 py-1.5 no-scrollbar cursor-grab active:cursor-grabbing select-none"
      >
        {onboardingProfiles.map((profile, idx) => {
          const isSelected = selectedMode === profile.id;
          return (
            <button
              key={profile.id}
              type="button"
              role="radio"
              aria-checked={isSelected}
              onClick={() => scrollToProfile(idx, profile.id)}
              className={`relative shrink-0 w-[284px] snap-center text-left p-4 rounded-2xl transition-all duration-150 cursor-pointer flex flex-col justify-between gap-3 ${
                isSelected
                  ? 'bg-primary/5 ring-2 ring-primary shadow-md'
                  : 'bg-surface-container-lowest shadow-sm hover:bg-surface-container-low border border-outline-variant/25'
              }`}
            >
              <div className="flex items-start justify-between gap-3">
                <div
                  className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 transition-colors ${
                    isSelected
                      ? 'bg-primary text-on-primary shadow-sm'
                      : 'bg-surface-container-high text-on-surface-variant'
                  }`}
                >
                  <span
                    className={`material-symbols-outlined text-[28px] ${
                      isSelected ? 'material-symbols-filled' : ''
                    }`}
                  >
                    {profile.icon}
                  </span>
                </div>

                {/* Radio Check Indicator */}
                <div
                  className={`w-6 h-6 rounded-full flex items-center justify-center transition-all shrink-0 ${
                    isSelected
                      ? 'bg-primary text-on-primary shadow-sm'
                      : 'bg-surface-container-high text-transparent'
                  }`}
                >
                  <span className="material-symbols-outlined text-[16px] font-bold">
                    check
                  </span>
                </div>
              </div>

              <div className="min-w-0">
                <h3 className="text-base font-bold text-on-surface leading-snug">
                  {profile.title}
                </h3>
                <p className="text-xs text-on-surface-variant mt-1 line-clamp-3 leading-relaxed">
                  {profile.description}
                </p>
              </div>

              {/* Clean Key Parameters Row */}
              <div className="p-2.5 rounded-xl bg-surface-container-low flex flex-wrap gap-x-3 gap-y-1.5 items-center text-xs font-semibold text-on-surface">
                {profile.tags.map((tag) => (
                  <span
                    key={tag.label}
                    className="inline-flex items-center gap-1"
                  >
                    <span className="material-symbols-outlined text-[15px] text-primary">
                      {tag.icon}
                    </span>
                    <span>{tag.label}</span>
                  </span>
                ))}
              </div>
            </button>
          );
        })}
      </div>

      {/* Pagination Dots */}
      <div className="flex items-center justify-center gap-1.5 mt-2">
        {onboardingProfiles.map((profile, idx) => {
          const isSelected = selectedMode === profile.id;
          return (
            <button
              key={profile.id}
              type="button"
              aria-label={`Select ${profile.title}`}
              onClick={() => scrollToProfile(idx, profile.id)}
              className={`h-2 rounded-full transition-all ${
                isSelected
                  ? 'w-6 bg-primary'
                  : 'w-2 bg-outline-variant hover:bg-outline'
              }`}
            />
          );
        })}
      </div>

      {/* Flexibility Notice */}
      <div className="mt-4 mb-5 p-4 rounded-xl bg-surface-container-high flex items-start gap-3">
        <span className="material-symbols-outlined text-primary text-[22px] shrink-0 mt-0.5">
          tips_and_updates
        </span>
        <p className="text-sm text-on-surface-variant leading-relaxed">
          <strong className="text-on-surface">Flexibility Guaranteed:</strong>{' '}
          You can fine-tune ramp inclines, curb tolerances, and auditory alerts
          anytime in Profile &amp; Settings.
        </p>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-col items-center gap-2.5 mt-auto pt-2">
        <button
          type="button"
          onClick={onContinue}
          className="w-full min-h-[52px] py-3 px-5 rounded-xl bg-primary text-on-primary font-semibold text-sm flex items-center justify-center gap-2 shadow-md hover:bg-primary-container active:scale-[0.99] transition-all"
        >
          <span>Continue to CIT-U Campus Map</span>
          <span className="material-symbols-outlined text-[20px]">
            arrow_forward
          </span>
        </button>

        <button
          type="button"
          onClick={onSkip}
          className="w-full min-h-[44px] py-2 px-4 rounded-xl text-on-surface-variant hover:text-on-surface hover:bg-surface-container font-semibold text-xs transition-colors flex items-center justify-center whitespace-nowrap"
        >
          Skip for now (Standard Walk)
        </button>
      </div>
    </div>
  );
};
