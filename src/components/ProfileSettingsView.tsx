import React, { useState } from 'react';
import { MOBILITY_PROFILES, STITCH_ASSETS } from '../data/initialData';
import { MobilityModeId, SensorySettings } from '../types';
import { ResilientImage } from './ResilientImage';

interface ProfileSettingsViewProps {
  karmaPoints: number;
  mobilityMode: MobilityModeId;
  onChangeMobilityMode: (mode: MobilityModeId) => void;
  sensory: SensorySettings;
  onUpdateSensory: (next: Partial<SensorySettings>) => void;
  onResetDefaults: () => void;
  onOpenOnboarding: () => void;
  onOpenAdminPortal: () => void;
  onShowToast: (msg: string) => void;
}

export const ProfileSettingsView: React.FC<ProfileSettingsViewProps> = ({
  karmaPoints,
  mobilityMode,
  onChangeMobilityMode,
  sensory,
  onUpdateSensory,
  onResetDefaults,
  onOpenOnboarding,
  onOpenAdminPortal,
  onShowToast,
}) => {
  const [showEscortModal, setShowEscortModal] = useState(false);
  const [showSignOutModal, setShowSignOutModal] = useState(false);
  const [packSyncing, setPackSyncing] = useState(false);

  const activeProfile =
    MOBILITY_PROFILES.find((p) => p.id === mobilityMode) ??
    MOBILITY_PROFILES[0];

  const handleShareScoutCard = async () => {
    try {
      await navigator.clipboard?.writeText(
        `Maria Elena Santos (CIT-U 21-8942-104) · Level 4 Gold Scout · ${karmaPoints.toLocaleString()} Karma Points`
      );
    } catch {
      // ignore
    }
    onShowToast('Scout ID copied to clipboard! (CIT-U 21-8942-104)');
  };

  const handleOfflineUpdate = () => {
    setPackSyncing(true);
    setTimeout(() => {
      setPackSyncing(false);
      onShowToast('CIT-U Offline Route Pack updated (44 MB · Main Quad & CCS)');
    }, 900);
  };

  const sensoryRows: {
    key: keyof Pick<
      SensorySettings,
      | 'voiceAlerts'
      | 'hapticVibrations'
      | 'tactileBeacons'
      | 'screenReaderPriority'
    >;
    title: string;
    desc: string;
    icon: string;
    iconBg: string;
  }[] = [
    {
      key: 'voiceAlerts',
      title: 'High-Clarity Voice Alerts',
      desc: 'Elevator call buttons, automatic sliding doors, and ramp arrival audio cues',
      icon: 'record_voice_over',
      iconBg: 'bg-primary/10 text-primary',
    },
    {
      key: 'hapticVibrations',
      title: 'Tactile Turn & Hazard Vibrations',
      desc: 'Distinct pulse cadences for upcoming turns, steep grades, and temporary blockages',
      icon: 'vibration',
      iconBg: 'bg-secondary-container text-on-secondary-container',
    },
    {
      key: 'tactileBeacons',
      title: 'Tactile Paving & Braille Prompts',
      desc: 'Proximity chimes when entering yellow blister tile pathways or braille plate stations',
      icon: 'blind',
      iconBg: 'bg-tertiary-container text-on-tertiary-container',
    },
    {
      key: 'screenReaderPriority',
      title: 'WCAG AAA Screen Reader Priority',
      desc: 'Enhanced descriptive landmark markers for TalkBack and VoiceOver navigation',
      icon: 'format_size',
      iconBg: 'bg-surface-container text-on-surface',
    },
  ];

  return (
    <div className="w-full px-4 py-4 flex flex-col gap-5">
      <div className="flex flex-col gap-5">
        {/* Profile Hero, Mobility Engine & Parameters */}
        <div className="flex flex-col gap-5">
          {/* Student & Scout Profile Hero Card */}
          <section className="w-full bg-surface-container-lowest rounded-2xl p-5 shadow-sm border border-outline-variant/25 relative overflow-hidden">
            <div className="flex items-start gap-4">
              <div className="relative shrink-0">
                <div className="w-20 h-20 rounded-full overflow-hidden bg-surface-container-high shadow-md">
                  <ResilientImage
                    src={STITCH_ASSETS.userMariaAvatar}
                    alt="Maria Elena Santos"
                    className="w-full h-full object-cover"
                    fallbackIcon="person"
                  />
                </div>
                <button
                  type="button"
                  aria-label="Edit Profile Picture"
                  onClick={() =>
                    onShowToast('CIT-U student portrait synced from ID portal.')
                  }
                  className="absolute -bottom-1 -right-1 w-7 h-7 rounded-full bg-primary text-on-primary flex items-center justify-center shadow-md active:scale-90 transition-transform"
                >
                  <span className="material-symbols-outlined text-[15px]">
                    edit
                  </span>
                </button>
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <h2 className="text-xl font-bold text-on-surface truncate">
                    Maria Elena Santos
                  </h2>
                  <span className="inline-flex items-center gap-0.5 text-xs font-bold text-primary">
                    <span className="material-symbols-outlined text-[15px] material-symbols-filled">
                      verified
                    </span>
                    Wildcat
                  </span>
                </div>
                <p className="text-sm text-on-surface-variant truncate mt-0.5">
                  CIT-U College of Computer Studies · BSIT 3rd Year
                </p>
                <p className="text-xs font-mono text-outline mt-0.5">
                  ID: 21-8942-104 · Main Academic Quad
                </p>
              </div>
            </div>

            {/* Scout Badge & Karma Strip */}
            <div className="mt-4 bg-surface-container-low rounded-xl p-3.5 flex items-center justify-between gap-3">
              <div className="flex items-center gap-3 min-w-0">
                <div className="w-10 h-10 rounded-full bg-tertiary-container text-on-tertiary-container flex items-center justify-center shrink-0">
                  <span className="material-symbols-outlined text-[22px] material-symbols-filled">
                    military_tech
                  </span>
                </div>
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-bold text-on-surface">
                      Level 4 Scout
                    </span>
                    <span className="text-[11px] font-bold uppercase text-tertiary">
                      Gold Tier
                    </span>
                  </div>
                  <p className="text-xs text-on-surface-variant truncate tabular-nums">
                    {karmaPoints.toLocaleString()} Karma Points earned
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={handleShareScoutCard}
                className="min-h-[42px] px-3.5 rounded-xl bg-surface-container-lowest text-on-surface text-xs font-bold flex items-center gap-1.5 shadow-sm hover:bg-surface-container active:scale-95 transition-all shrink-0"
              >
                <span className="material-symbols-outlined text-[17px]">
                  share
                </span>
                <span>Scout Card</span>
              </button>
            </div>
          </section>

          {/* Mobility Routing Engine */}
          <section className="space-y-3">
            <div className="flex items-center justify-between gap-2">
              <h3 className="text-base font-bold text-on-surface">
                Mobility Routing Engine
              </h3>
              <button
                type="button"
                onClick={onOpenOnboarding}
                className="text-xs font-bold text-primary hover:underline"
              >
                Launch Guided Wizard
              </button>
            </div>

            <div className="flex gap-2.5 overflow-x-auto snap-x snap-mandatory -mx-4 px-4 pb-1 no-scrollbar">
              {MOBILITY_PROFILES.filter((p) => p.id !== 'pedestrian').map(
                (profile) => {
                  const isActive = mobilityMode === profile.id;
                  return (
                    <button
                      key={profile.id}
                      type="button"
                      onClick={() => {
                        onChangeMobilityMode(profile.id);
                        onUpdateSensory({ maxIncline: profile.defaultIncline });
                        onShowToast(
                          `Routing mode set: ${profile.shortTitle}`
                        );
                      }}
                      className={`shrink-0 snap-start flex items-center gap-2.5 px-4 py-3 rounded-xl transition-all text-left min-h-[58px] ${
                        isActive
                          ? 'bg-primary text-on-primary shadow-md'
                          : 'bg-surface-container-lowest text-on-surface border border-outline-variant/30 shadow-sm hover:bg-surface-container-low'
                      }`}
                    >
                      <span className="material-symbols-outlined text-[23px]">
                        {profile.icon}
                      </span>
                      <div>
                        <span className="block text-sm font-bold whitespace-nowrap">
                          {profile.shortTitle}
                        </span>
                        <span
                          className={`block text-[11px] whitespace-nowrap ${
                            isActive
                              ? 'text-on-primary/90'
                              : 'text-on-surface-variant'
                          }`}
                        >
                          {isActive
                            ? 'Active Route Filter'
                            : `Max ${profile.defaultIncline}% ramp`}
                        </span>
                      </div>
                    </button>
                  );
                }
              )}
            </div>

            {/* Active Filter Parameters Card */}
            <div className="bg-surface-container-lowest rounded-2xl p-5 shadow-sm border border-outline-variant/25 space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-primary text-[22px]">
                    tune
                  </span>
                  <h4 className="text-base font-bold text-on-surface">
                    Active Filter Parameters
                  </h4>
                </div>
                <button
                  type="button"
                  onClick={onResetDefaults}
                  className="text-xs font-bold text-primary hover:underline"
                >
                  Reset Defaults
                </button>
              </div>

              {/* Max Ramp Incline Slider */}
              <div className="space-y-2 bg-surface-container-low p-3.5 rounded-xl">
                <div className="flex justify-between items-center">
                  <label
                    htmlFor="inclineRange"
                    className="text-sm font-bold text-on-surface flex items-center gap-1.5"
                  >
                    <span className="material-symbols-outlined text-[18px] text-tertiary">
                      landscape
                    </span>
                    Max Ramp Incline
                  </label>
                  <span className="text-base font-extrabold text-primary font-mono tabular-nums">
                    {sensory.maxIncline.toFixed(1)}%
                  </span>
                </div>
                <input
                  id="inclineRange"
                  type="range"
                  min="2"
                  max="10"
                  step="0.5"
                  value={sensory.maxIncline}
                  onChange={(e) =>
                    onUpdateSensory({ maxIncline: parseFloat(e.target.value) })
                  }
                  className="w-full h-2 bg-surface-dim rounded-lg appearance-none cursor-pointer accent-primary"
                />
                <div className="flex justify-between text-[11px] font-semibold text-outline">
                  <span>Gentle (3%)</span>
                  <span>ADA Standard (8.3%)</span>
                  <span>Steep (10%)</span>
                </div>
              </div>

              {/* 2x2 Tolerance Grid */}
              <div className="grid grid-cols-2 gap-2.5">
                <div className="bg-surface-container-low p-3 rounded-xl">
                  <div className="flex items-center gap-1.5 text-secondary text-xs font-bold uppercase">
                    <span className="material-symbols-outlined text-[18px]">
                      stairs
                    </span>
                    Stairs
                  </div>
                  <p className="text-base font-bold text-on-surface mt-1.5">
                    {activeProfile.stairsRule}
                  </p>
                  <p className="text-xs text-on-surface-variant">
                    Step-free bypass only
                  </p>
                </div>

                <div className="bg-surface-container-low p-3 rounded-xl">
                  <div className="flex items-center gap-1.5 text-primary text-xs font-bold uppercase">
                    <span className="material-symbols-outlined text-[18px]">
                      door_front
                    </span>
                    Clearance
                  </div>
                  <p className="text-base font-bold text-on-surface mt-1.5 tabular-nums">
                    {activeProfile.clearanceRule}
                  </p>
                  <p className="text-xs text-on-surface-variant">
                    Doorway &amp; turn radius
                  </p>
                </div>

                <div className="bg-surface-container-low p-3 rounded-xl">
                  <div className="flex items-center gap-1.5 text-tertiary text-xs font-bold uppercase">
                    <span className="material-symbols-outlined text-[18px]">
                      layers
                    </span>
                    Pavement
                  </div>
                  <p className="text-sm font-bold text-on-surface mt-1.5">
                    {activeProfile.pavementRule}
                  </p>
                  <p className="text-xs text-on-surface-variant">
                    Avoid gravel &amp; cobble
                  </p>
                </div>

                <div className="bg-surface-container-low p-3 rounded-xl">
                  <div className="flex items-center gap-1.5 text-primary text-xs font-bold uppercase">
                    <span className="material-symbols-outlined text-[18px]">
                      alt_route
                    </span>
                    Curb Cut
                  </div>
                  <p className="text-sm font-bold text-on-surface mt-1.5">
                    {activeProfile.curbCutRule}
                  </p>
                  <p className="text-xs text-on-surface-variant">
                    Zero dropoffs
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* Sensory & Navigational Assists */}
          <section className="space-y-2.5">
            <h3 className="text-base font-bold text-on-surface">
              Sensory &amp; Navigational Assists
            </h3>
            <div className="bg-surface-container-lowest rounded-2xl p-4 shadow-sm border border-outline-variant/25 divide-y divide-surface-container-high">
              {sensoryRows.map((row) => {
                const enabled = sensory[row.key];
                return (
                  <div
                    key={row.key}
                    className="py-3 first:pt-0 last:pb-0 flex items-center justify-between gap-3"
                  >
                    <div className="flex items-start gap-3 min-w-0">
                      <div
                        className={`w-10 h-10 rounded-full ${row.iconBg} flex items-center justify-center shrink-0 mt-0.5`}
                      >
                        <span className="material-symbols-outlined text-[20px]">
                          {row.icon}
                        </span>
                      </div>
                      <div className="min-w-0">
                        <p className="text-sm font-bold text-on-surface">
                          {row.title}
                        </p>
                        <p className="text-xs text-on-surface-variant">
                          {row.desc}
                        </p>
                      </div>
                    </div>

                    <button
                      type="button"
                      role="switch"
                      aria-checked={enabled}
                      onClick={() => onUpdateSensory({ [row.key]: !enabled })}
                      className={`w-13 h-7 rounded-full p-1 flex items-center transition-colors shrink-0 ${
                        enabled
                          ? 'bg-primary justify-end'
                          : 'bg-outline-variant justify-start'
                      }`}
                    >
                      <div className="w-5 h-5 rounded-full bg-surface-container-lowest shadow flex items-center justify-center text-primary">
                        {enabled && (
                          <span className="material-symbols-outlined text-[13px] font-bold">
                            check
                          </span>
                        )}
                      </div>
                    </button>
                  </div>
                );
              })}
            </div>
          </section>
        </div>

        {/* Safety Desk, Offline Sync, Display & Admin Portal */}
        <div className="flex flex-col gap-5">
          {/* CIT-U Campus Safety Desk */}
          <section className="bg-surface-container-lowest rounded-2xl p-5 shadow-sm border border-outline-variant/25 space-y-3.5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-secondary text-[23px] material-symbols-filled">
                  security
                </span>
                <h3 className="text-base font-bold text-on-surface">
                  CIT-U Campus Safety Desk
                </h3>
              </div>
              <span className="text-xs font-bold text-secondary">
                24/7 Active
              </span>
            </div>

            <p className="text-xs text-on-surface-variant leading-relaxed">
              Direct line to Wildcat Safety Officers, campus escort services,
              and facilities rescue squads.
            </p>

            <div className="grid grid-cols-2 gap-2.5">
              <button
                type="button"
                onClick={() =>
                  onShowToast(
                    'Calling CIT-U Campus Security Desk (032) 261-7741...'
                  )
                }
                className="min-h-[48px] px-3 rounded-xl bg-secondary text-on-secondary font-bold text-sm flex items-center justify-center gap-1.5 shadow-sm active:scale-95 transition-transform"
              >
                <span className="material-symbols-outlined text-[19px]">
                  call
                </span>
                <span>Call Security</span>
              </button>

              <button
                type="button"
                onClick={() =>
                  onShowToast(
                    'Dispatched alert to CIT-U Campus Clinic (032) 261-7742.'
                  )
                }
                className="min-h-[48px] px-3 rounded-xl bg-surface-container-high text-on-surface font-bold text-sm flex items-center justify-center gap-1.5 active:scale-95 transition-transform"
              >
                <span className="material-symbols-outlined text-secondary text-[19px]">
                  medical_services
                </span>
                <span>Campus Clinic</span>
              </button>
            </div>

            <div className="bg-surface-container-low rounded-xl p-3 flex items-center justify-between gap-2">
              <div className="flex items-center gap-2.5 min-w-0">
                <div className="w-9 h-9 rounded-full bg-primary/10 text-primary flex items-center justify-center shrink-0">
                  <span className="material-symbols-outlined text-[19px]">
                    share_location
                  </span>
                </div>
                <div className="min-w-0">
                  <p className="text-xs font-bold text-on-surface">
                    Night Escort Route Sharing
                  </p>
                  <p className="text-[11px] text-on-surface-variant truncate">
                    2 Trusted Guardians connected
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setShowEscortModal(true)}
                className="px-3 py-1.5 rounded-lg bg-surface-container-lowest text-on-surface text-xs font-bold shadow-sm hover:bg-surface-container"
              >
                Manage
              </button>
            </div>
          </section>

          {/* Scout Verification Impact & Offline Cache */}
          <section className="bg-surface-container-lowest rounded-2xl p-5 shadow-sm border border-outline-variant/25 space-y-3.5">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-bold text-on-surface flex items-center gap-2">
                <span className="material-symbols-outlined text-primary text-[22px]">
                  diversity_3
                </span>
                Scout Verification Impact
              </h3>
              <span className="text-xs font-bold text-primary">
                CIT-U Rank #14
              </span>
            </div>

            <div className="grid grid-cols-3 gap-2 text-center tabular-nums">
              <div className="bg-surface-container-low rounded-xl p-2.5">
                <span className="block text-lg font-extrabold text-primary">
                  38
                </span>
                <span className="block text-[11px] text-on-surface-variant font-medium">
                  Flagged
                </span>
              </div>
              <div className="bg-surface-container-low rounded-xl p-2.5">
                <span className="block text-lg font-extrabold text-primary">
                  99.2%
                </span>
                <span className="block text-[11px] text-on-surface-variant font-medium">
                  Accuracy
                </span>
              </div>
              <div className="bg-surface-container-low rounded-xl p-2.5">
                <span className="block text-lg font-extrabold text-tertiary">
                  14
                </span>
                <span className="block text-[11px] text-on-surface-variant font-medium">
                  Ramps Verified
                </span>
              </div>
            </div>

            <div className="bg-surface-container-low rounded-xl p-3 flex items-center justify-between gap-2.5">
              <div className="flex items-center gap-2.5 min-w-0">
                <div className="w-9 h-9 rounded-full bg-surface-container-high text-on-surface flex items-center justify-center shrink-0">
                  <span className="material-symbols-outlined text-[19px]">
                    cloud_download
                  </span>
                </div>
                <div className="min-w-0">
                  <p className="text-xs font-bold text-on-surface truncate">
                    CIT-U Offline Route Pack
                  </p>
                  <p className="text-[11px] text-on-surface-variant">
                    Cached: 42 MB · Main Quad &amp; CCS
                  </p>
                </div>
              </div>
              <button
                type="button"
                disabled={packSyncing}
                onClick={handleOfflineUpdate}
                className="min-h-[38px] px-3 rounded-lg bg-surface-container-lowest text-primary text-xs font-bold shadow-sm flex items-center gap-1 shrink-0"
              >
                <span
                  className={`material-symbols-outlined text-[16px] ${
                    packSyncing ? 'animate-spin' : ''
                  }`}
                >
                  refresh
                </span>
                <span>{packSyncing ? 'Syncing' : 'Update'}</span>
              </button>
            </div>
          </section>

          {/* Display & Language */}
          <section className="bg-surface-container-lowest rounded-2xl p-5 shadow-sm border border-outline-variant/25 space-y-4">
            <h3 className="text-base font-bold text-on-surface">
              Display &amp; Language
            </h3>

            <div className="flex items-center justify-between gap-3">
              <div className="flex items-center gap-3 min-w-0">
                <div className="w-10 h-10 rounded-full bg-surface-container-high text-on-surface flex items-center justify-center shrink-0">
                  <span className="material-symbols-outlined text-[21px]">
                    contrast
                  </span>
                </div>
                <div className="min-w-0">
                  <p className="text-sm font-bold text-on-surface">
                    Ultra High-Contrast Cartography
                  </p>
                  <p className="text-xs text-on-surface-variant">
                    Enhance sidewalk outlines for direct sunlight
                  </p>
                </div>
              </div>
              <button
                type="button"
                role="switch"
                aria-checked={sensory.highContrastMap}
                onClick={() => {
                  const next = !sensory.highContrastMap;
                  onUpdateSensory({ highContrastMap: next });
                  onShowToast(
                    next
                      ? 'Ultra High-Contrast mode enabled'
                      : 'Standard contrast restored'
                  );
                }}
                className={`w-13 h-7 rounded-full p-1 flex items-center transition-colors shrink-0 ${
                  sensory.highContrastMap
                    ? 'bg-primary justify-end'
                    : 'bg-outline-variant justify-start'
                }`}
              >
                <div className="w-5 h-5 rounded-full bg-surface-container-lowest shadow flex items-center justify-center text-primary">
                  {sensory.highContrastMap && (
                    <span className="material-symbols-outlined text-[13px] font-bold">
                      check
                    </span>
                  )}
                </div>
              </button>
            </div>

            <div className="flex items-center justify-between gap-3 pt-1">
              <div className="flex items-center gap-3 min-w-0">
                <div className="w-10 h-10 rounded-full bg-surface-container-high text-on-surface flex items-center justify-center shrink-0">
                  <span className="material-symbols-outlined text-[21px]">
                    language
                  </span>
                </div>
                <div className="min-w-0">
                  <p className="text-sm font-bold text-on-surface">
                    Voice &amp; System Language
                  </p>
                  <p className="text-xs text-on-surface-variant">
                    {sensory.language === 'EN'
                      ? 'English (US)'
                      : sensory.language === 'CEB'
                      ? 'Cebuano (Bisaya)'
                      : 'Filipino (Tagalog)'}
                  </p>
                </div>
              </div>

              <div className="flex gap-1 bg-surface-container p-1 rounded-lg shrink-0">
                {(['EN', 'CEB', 'FIL'] as const).map((lang) => (
                  <button
                    key={lang}
                    type="button"
                    onClick={() => {
                      onUpdateSensory({ language: lang });
                      onShowToast(`Language set to ${lang}`);
                    }}
                    className={`px-2.5 py-1 rounded text-xs font-bold transition-colors ${
                      sensory.language === lang
                        ? 'bg-surface-container-lowest text-primary shadow-sm'
                        : 'text-on-surface-variant hover:text-on-surface'
                    }`}
                  >
                    {lang}
                  </button>
                ))}
              </div>
            </div>
          </section>

          {/* CIT-U & Cebu City PDAO Admin Portal Switcher */}
          <button
            type="button"
            onClick={onOpenAdminPortal}
            className="w-full min-h-[54px] px-4 py-3 rounded-2xl bg-primary-fixed text-on-primary-fixed hover:bg-primary-fixed-dim font-bold text-sm flex items-center justify-between gap-3 shadow-sm transition-colors"
          >
            <span className="flex items-center gap-2.5">
              <span className="material-symbols-outlined text-[22px]">
                analytics
              </span>
              <span>Open CIT-U &amp; Cebu City PDAO Admin Portal</span>
            </span>
            <span className="material-symbols-outlined text-[20px]">
              arrow_forward
            </span>
          </button>

          <button
            type="button"
            onClick={() => setShowSignOutModal(true)}
            className="w-full min-h-[50px] rounded-xl bg-surface-container-low text-secondary font-bold text-sm flex items-center justify-center gap-2 hover:bg-surface-container-high transition-colors"
          >
            <span className="material-symbols-outlined text-[20px]">
              logout
            </span>
            <span>Switch / Sign Out Student ID</span>
          </button>
        </div>
      </div>

      {/* Night Escort Modal */}
      {showEscortModal && (
        <div className="fixed inset-0 z-50 bg-inverse-surface/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-surface-container-lowest rounded-2xl p-6 max-w-sm w-full shadow-2xl space-y-4">
            <h3 className="text-lg font-bold text-on-surface">
              Trusted Guardians
            </h3>
            <div className="space-y-2.5 text-sm">
              <div className="p-3 rounded-xl bg-surface-container-low flex items-center justify-between">
                <div>
                  <div className="font-bold text-on-surface">Elena Santos</div>
                  <div className="text-xs text-on-surface-variant">
                    Emergency Contact · Live ETA enabled
                  </div>
                </div>
                <span className="text-xs font-bold text-primary">Active</span>
              </div>
              <div className="p-3 rounded-xl bg-surface-container-low flex items-center justify-between">
                <div>
                  <div className="font-bold text-on-surface">
                    CIT-U Accessibility Desk
                  </div>
                  <div className="text-xs text-on-surface-variant">
                    Campus Escort Dispatch · 24/7
                  </div>
                </div>
                <span className="text-xs font-bold text-primary">Active</span>
              </div>
            </div>
            <button
              type="button"
              onClick={() => setShowEscortModal(false)}
              className="w-full min-h-[44px] rounded-xl bg-primary text-on-primary font-bold text-sm"
            >
              Done
            </button>
          </div>
        </div>
      )}

      {/* Switch Student ID Modal */}
      {showSignOutModal && (
        <div className="fixed inset-0 z-50 bg-inverse-surface/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-surface-container-lowest rounded-2xl p-6 max-w-sm w-full shadow-2xl space-y-4">
            <h3 className="text-lg font-bold text-on-surface">
              Switch Student Profile?
            </h3>
            <p className="text-sm text-on-surface-variant">
              Would you like to re-run Mobility Onboarding for another student
              ID?
            </p>
            <div className="flex justify-end gap-2.5">
              <button
                type="button"
                onClick={() => setShowSignOutModal(false)}
                className="min-h-[44px] px-4 rounded-xl bg-surface-container text-on-surface font-semibold text-sm"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => {
                  setShowSignOutModal(false);
                  onOpenOnboarding();
                }}
                className="min-h-[44px] px-4 rounded-xl bg-primary text-on-primary font-semibold text-sm"
              >
                Open Onboarding
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
