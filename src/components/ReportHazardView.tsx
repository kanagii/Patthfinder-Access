import React, { useState } from 'react';
import { STITCH_ASSETS } from '../data/initialData';
import { HazardCategory, HazardSeverity } from '../types';
import { ResilientImage } from './ResilientImage';

export interface NewHazardPayload {
  category: HazardCategory;
  title: string;
  building: string;
  location: string;
  floor: string;
  severity: HazardSeverity;
  notes: string;
  autoAltText: boolean;
  coords: { x: number; y: number };
}

interface ReportHazardViewProps {
  onSubmitReport: (payload: NewHazardPayload) => void;
  onCancel: () => void;
  onShowToast: (msg: string) => void;
}

const OBSTACLE_CATEGORIES: {
  id: HazardCategory;
  label: string;
  desc: string;
  icon: string;
  defaultTitle: string;
}[] = [
  {
    id: 'elevator',
    label: 'Broken Elevator / Lift',
    desc: 'Out of order, doors locked, unpowered',
    icon: 'elevator',
    defaultTitle: 'Elevator Out of Service',
  },
  {
    id: 'ramp',
    label: 'Blocked Ramp',
    desc: 'Parked e-scooter, missing rail, steps only',
    icon: 'accessible_forward',
    defaultTitle: 'Blocked Wheelchair Ramp',
  },
  {
    id: 'sidewalk',
    label: 'Damaged Sidewalk',
    desc: 'Deep potholes, loose tactiles, tree roots',
    icon: 'handyman',
    defaultTitle: 'Damaged Sidewalk / Tactile Strip',
  },
  {
    id: 'door',
    label: 'Door / Gate Failure',
    desc: 'Push pad broken, heavy gate, width <80cm',
    icon: 'door_front',
    defaultTitle: 'Automatic Door Push-Pad Broken',
  },
  {
    id: 'debris',
    label: 'Temporary Debris',
    desc: 'Scaffolding, wet slippery floor, sand piles',
    icon: 'construction',
    defaultTitle: 'Temporary Construction Debris',
  },
  {
    id: 'other',
    label: 'Other Obstacle',
    desc: 'Overhead branch, steep pitch, bad signage',
    icon: 'help_center',
    defaultTitle: 'Pathway Obstacle Reported',
  },
];

const CAMPUS_ZONES = [
  {
    building: 'CIT-U Main Academic Bldg',
    location: 'West Wing Corridor near Speech Lab & Canteen Concourse',
    coords: { x: 56, y: 28 },
  },
  {
    building: 'Science Complex B',
    location: 'East Walkway near Science Complex B',
    coords: { x: 68, y: 58 },
  },
  {
    building: 'Engineering Annex',
    location: 'Ground Arcade near Makerspace Ramp',
    coords: { x: 24, y: 62 },
  },
  {
    building: 'NGE Building',
    location: 'NGE Covered Linkway Concourse',
    coords: { x: 76, y: 38 },
  },
];

const FLOORS = ['Ground Floor', '2nd Floor', '3rd Floor', 'Exterior Ramp'];

const QUICK_TAGS = [
  'Wheelchair blocked',
  'No tactile line',
  'Clearance <80cm',
  'Water ponding',
  'Steep slope >8%',
  'Caution tape up',
];

export const ReportHazardView: React.FC<ReportHazardViewProps> = ({
  onSubmitReport,
  onCancel,
  onShowToast,
}) => {
  const [category, setCategory] = useState<HazardCategory>('elevator');
  const [zoneIdx, setZoneIdx] = useState(0);
  const [floor, setFloor] = useState('Ground Floor');
  const [severity, setSeverity] = useState<HazardSeverity>('high');
  const [hasSecondPhoto, setHasSecondPhoto] = useState(false);
  const [autoAltText, setAutoAltText] = useState(true);
  const [notes, setNotes] = useState(
    'North wing elevator push panel is unresponsive; caution tape placed. Stroller and wheelchair users must detour around South Ramp B.'
  );
  const [submitting, setSubmitting] = useState(false);

  const selectedCat =
    OBSTACLE_CATEGORIES.find((c) => c.id === category) ??
    OBSTACLE_CATEGORIES[0];
  const selectedZone = CAMPUS_ZONES[zoneIdx];

  const appendTag = (tag: string) => {
    setNotes((prev) => {
      const trimmed = prev.trim();
      if (trimmed.includes(tag)) return prev;
      return trimmed ? `${trimmed}, ${tag}` : tag;
    });
  };

  const handleSubmit = () => {
    setSubmitting(true);
    setTimeout(() => {
      setSubmitting(false);
      onSubmitReport({
        category,
        title: `${selectedCat.defaultTitle}, ${selectedZone.building}`,
        building: selectedZone.building,
        location: `${selectedZone.location} (${floor})`,
        floor,
        severity,
        notes: notes.trim() || selectedCat.desc,
        autoAltText,
        coords: selectedZone.coords,
      });
    }, 550);
  };

  return (
    <div className="w-full px-4 py-4 flex flex-col gap-4">
      {/* Header & Progress */}
      <div className="flex flex-col gap-2">
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center justify-center w-7 h-7 rounded-full bg-secondary-container text-on-secondary-container text-xs font-bold">
              2
            </span>
            <span className="text-xs font-bold text-secondary uppercase tracking-wider">
              Obstacle Report · Instant Campus Alert
            </span>
          </div>
          <button
            type="button"
            aria-label="Cancel Report"
            onClick={onCancel}
            className="min-w-[44px] min-h-[44px] rounded-full flex items-center justify-center text-on-surface-variant hover:bg-surface-container"
          >
            <span className="material-symbols-outlined text-[22px]">close</span>
          </button>
        </div>

        <h2 className="text-2xl font-extrabold text-on-surface">
          Report an Obstacle
        </h2>
        <p className="text-sm text-on-surface-variant">
          Help scouts and pedestrians with mobility challenges navigate CIT-U
          safely.
        </p>

        <div className="w-full h-2 bg-surface-container-high rounded-full overflow-hidden">
          <div className="h-full bg-secondary-container rounded-full w-full" />
        </div>
      </div>

      {/* Community Shield Banner */}
      <div className="bg-surface-container-high rounded-2xl p-4 shadow-sm flex items-center justify-between gap-3">
        <div className="flex items-center gap-3 min-w-0">
          <div className="w-10 h-10 rounded-full bg-primary-fixed flex items-center justify-center text-on-primary-fixed shrink-0">
            <span className="material-symbols-outlined text-[22px] material-symbols-filled">
              volunteer_activism
            </span>
          </div>
          <div className="min-w-0">
            <p className="text-sm font-bold text-on-surface">
              Community Shield Activated
            </p>
            <p className="text-xs text-on-surface-variant truncate">
              Help fellow Wildcats navigate · Earn{' '}
              <strong className="text-primary">+25 Scout Karma</strong>
            </p>
          </div>
        </div>
        <span className="text-xs font-bold text-primary shrink-0">
          CIT-U Grid
        </span>
      </div>

      <div className="flex flex-col gap-5">
        {/* Category + Location */}
        <div className="flex flex-col gap-5">
          {/* Step 1: Obstacle Type */}
          <section className="space-y-3">
            <div className="flex items-baseline justify-between">
              <h3 className="text-base font-bold text-on-surface flex items-center gap-2">
                <span className="w-6 h-6 rounded-full bg-primary text-on-primary flex items-center justify-center text-xs font-bold shrink-0">
                  1
                </span>
                Type of Obstacle <span className="text-secondary">*</span>
              </h3>
              <span className="text-xs font-bold text-secondary">REQUIRED</span>
            </div>

            <div
              role="radiogroup"
              aria-label="Type of Obstacle"
              className="grid grid-cols-1 gap-2.5"
            >
              {OBSTACLE_CATEGORIES.map((cat) => {
                const isSelected = category === cat.id;
                return (
                  <button
                    key={cat.id}
                    type="button"
                    role="radio"
                    aria-checked={isSelected}
                    onClick={() => setCategory(cat.id)}
                    className={`text-left p-3.5 rounded-xl transition-all flex items-start gap-3 relative border ${
                      isSelected
                        ? 'bg-primary/10 border-primary shadow-md'
                        : 'bg-surface-container-lowest border-outline-variant/30 shadow-sm hover:bg-surface-container-low'
                    }`}
                  >
                    <div
                      className={`w-11 h-11 rounded-xl flex items-center justify-center shrink-0 transition-colors ${
                        isSelected
                          ? 'bg-primary text-on-primary shadow-sm'
                          : 'bg-surface-container-high text-on-surface-variant'
                      }`}
                    >
                      <span className="material-symbols-outlined text-[24px]">
                        {cat.icon}
                      </span>
                    </div>
                    <div className="flex-1 min-w-0 pr-6">
                      <span className="block text-sm font-bold text-on-surface">
                        {cat.label}
                      </span>
                      <p className="text-xs text-on-surface-variant mt-0.5 line-clamp-2">
                        {cat.desc}
                      </p>
                    </div>
                    <span
                      className={`material-symbols-outlined text-[20px] absolute top-3.5 right-3.5 ${
                        isSelected ? 'text-primary' : 'text-outline-variant'
                      }`}
                    >
                      {isSelected ? 'check_circle' : 'radio_button_unchecked'}
                    </span>
                  </button>
                );
              })}
            </div>
          </section>

          {/* Step 2: Location & Floor */}
          <section className="space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-bold text-on-surface flex items-center gap-2">
                <span className="w-6 h-6 rounded-full bg-primary text-on-primary flex items-center justify-center text-xs font-bold shrink-0">
                  2
                </span>
                Hazard Location
              </h3>
              <span className="text-xs font-bold text-primary tabular-nums">
                GPS Live · ±2m
              </span>
            </div>

            <div className="bg-surface-container-lowest rounded-2xl p-4 shadow-sm border border-outline-variant/30 space-y-4">
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-start gap-2.5 min-w-0">
                  <div className="w-10 h-10 rounded-full bg-surface-container flex items-center justify-center shrink-0 text-primary">
                    <span className="material-symbols-outlined text-[21px]">
                      share_location
                    </span>
                  </div>
                  <div className="min-w-0">
                    <span className="block text-xs font-bold text-primary uppercase">
                      GPS Confirmed · ±2m precision
                    </span>
                    <p className="text-base font-bold text-on-surface truncate">
                      {selectedZone.building}
                    </p>
                    <p className="text-xs text-on-surface-variant truncate">
                      {selectedZone.location}
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => {
                    const next = (zoneIdx + 1) % CAMPUS_ZONES.length;
                    setZoneIdx(next);
                    onShowToast(
                      `Pin moved to ${CAMPUS_ZONES[next].building}`
                    );
                  }}
                  className="min-h-[44px] px-3 flex items-center gap-1 text-primary text-xs font-bold rounded-xl bg-surface-container-low hover:bg-surface-container shrink-0"
                >
                  <span className="material-symbols-outlined text-[17px]">
                    edit_location
                  </span>
                  <span>Adjust Pin</span>
                </button>
              </div>

              {/* Mini Map Preview */}
              <div
                onClick={() => {
                  const next = (zoneIdx + 1) % CAMPUS_ZONES.length;
                  setZoneIdx(next);
                }}
                className="relative w-full h-32 rounded-xl overflow-hidden shadow-inner cursor-pointer bg-surface-container"
              >
                <ResilientImage
                  src={STITCH_ASSETS.miniMapPreview}
                  alt="Campus pin location"
                  className="w-full h-full object-cover"
                  fallbackIcon="map"
                />
                <div className="absolute inset-0 bg-primary/10" />
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                  <div className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center text-on-secondary shadow-lg">
                    <span className="material-symbols-outlined text-[22px]">
                      priority_high
                    </span>
                  </div>
                </div>
                <div className="absolute bottom-2 left-2 px-2.5 py-1 bg-surface/90 backdrop-blur-md rounded-md flex items-center gap-1 text-[11px] font-mono font-bold text-on-surface">
                  <span className="material-symbols-outlined text-secondary text-[15px]">
                    pin_drop
                  </span>
                  <span>10.3541° N, 123.9114° E</span>
                </div>
              </div>

              {/* Floor Selector */}
              <div className="space-y-2">
                <span className="text-xs font-bold text-on-surface block">
                  Specific Level / Zone
                </span>
                <div className="flex flex-wrap gap-2">
                  {FLOORS.map((f) => {
                    const active = floor === f;
                    return (
                      <button
                        key={f}
                        type="button"
                        onClick={() => setFloor(f)}
                        className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all min-h-[40px] ${
                          active
                            ? 'bg-primary text-on-primary shadow-sm'
                            : 'bg-surface-container-high text-on-surface hover:bg-surface-variant'
                        }`}
                      >
                        {f}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          </section>
        </div>

        {/* Severity, Photo Proof, Notes & Submit */}
        <div className="flex flex-col gap-5">
          {/* Step 3: Severity Impact */}
          <section className="space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-bold text-on-surface flex items-center gap-2">
                <span className="w-6 h-6 rounded-full bg-primary text-on-primary flex items-center justify-center text-xs font-bold shrink-0">
                  3
                </span>
                Severity Impact
              </h3>
              <span className="text-xs font-bold text-secondary">
                {severity === 'high' ? 'URGENT REROUTE' : 'ROUTE ADVISORY'}
              </span>
            </div>

            <div className="bg-surface-container-lowest rounded-2xl p-4 shadow-sm border border-outline-variant/30 space-y-3">
              <div className="grid grid-cols-3 gap-2">
                <button
                  type="button"
                  onClick={() => setSeverity('high')}
                  className={`p-3 rounded-xl flex flex-col items-center justify-center text-center gap-1 transition-all ${
                    severity === 'high'
                      ? 'bg-secondary text-on-secondary shadow-sm'
                      : 'bg-surface-container text-on-surface hover:bg-surface-container-high'
                  }`}
                >
                  <span className="material-symbols-outlined text-[22px]">
                    block
                  </span>
                  <span className="text-xs font-bold">Fully Blocked</span>
                  <span className="text-[10px] opacity-85">No bypass</span>
                </button>

                <button
                  type="button"
                  onClick={() => setSeverity('medium')}
                  className={`p-3 rounded-xl flex flex-col items-center justify-center text-center gap-1 transition-all ${
                    severity === 'medium'
                      ? 'bg-tertiary-container text-on-tertiary-container shadow-sm'
                      : 'bg-surface-container text-on-surface hover:bg-surface-container-high'
                  }`}
                >
                  <span className="material-symbols-outlined text-[22px]">
                    warning
                  </span>
                  <span className="text-xs font-bold">Difficult</span>
                  <span className="text-[10px] opacity-85">+4 min detour</span>
                </button>

                <button
                  type="button"
                  onClick={() => setSeverity('low')}
                  className={`p-3 rounded-xl flex flex-col items-center justify-center text-center gap-1 transition-all ${
                    severity === 'low'
                      ? 'bg-primary text-on-primary shadow-sm'
                      : 'bg-surface-container text-on-surface hover:bg-surface-container-high'
                  }`}
                >
                  <span className="material-symbols-outlined text-[22px]">
                    info
                  </span>
                  <span className="text-xs font-bold">Caution</span>
                  <span className="text-[10px] opacity-85">Proceed slow</span>
                </button>
              </div>

              <div className="bg-error-container text-on-error-container p-3 rounded-xl flex items-center gap-2.5 text-xs">
                <span className="material-symbols-outlined text-error text-[20px] shrink-0">
                  alt_route
                </span>
                <p>
                  <strong>Immediate Safety Reroute:</strong> Triggers
                  autonomous navigation detour for wheelchair users within 200m
                  radius.
                </p>
              </div>
            </div>
          </section>

          {/* Step 4: Visual Proof */}
          <section className="space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-bold text-on-surface flex items-center gap-2">
                <span className="w-6 h-6 rounded-full bg-primary text-on-primary flex items-center justify-center text-xs font-bold shrink-0">
                  4
                </span>
                Visual Proof
              </h3>
              <span className="text-xs font-bold text-primary tabular-nums">
                {hasSecondPhoto ? '2 OF 2 ADDED' : '1 OF 2 ADDED'}
              </span>
            </div>

            <div className="bg-surface-container-lowest rounded-2xl p-4 shadow-sm border border-outline-variant/30 space-y-3">
              <div className="grid grid-cols-2 gap-2.5">
                <div className="relative rounded-xl overflow-hidden shadow-sm h-32 bg-surface-container">
                  <ResilientImage
                    src={STITCH_ASSETS.elevatorReport}
                    alt="Primary hazard photo"
                    className="w-full h-full object-cover"
                    fallbackIcon="photo_camera"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-on-surface/80 via-transparent to-transparent flex items-end p-2">
                    <span className="text-xs font-bold text-on-primary flex items-center gap-1">
                      <span className="material-symbols-outlined text-[14px] text-primary-fixed">
                        verified
                      </span>
                      Photo 1
                    </span>
                  </div>
                </div>

                {hasSecondPhoto ? (
                  <div className="relative rounded-xl overflow-hidden shadow-sm h-32 bg-surface-container">
                    <ResilientImage
                      src={STITCH_ASSETS.obstacleReportPhoto}
                      alt="Secondary hazard angle"
                      className="w-full h-full object-cover"
                      fallbackIcon="photo_camera"
                    />
                    <button
                      type="button"
                      aria-label="Remove second photo"
                      onClick={() => setHasSecondPhoto(false)}
                      className="absolute top-1.5 right-1.5 w-7 h-7 rounded-full bg-error text-on-error flex items-center justify-center shadow"
                    >
                      <span className="material-symbols-outlined text-[16px]">
                        close
                      </span>
                    </button>
                  </div>
                ) : (
                  <button
                    type="button"
                    onClick={() => {
                      setHasSecondPhoto(true);
                      onShowToast('Alternate corridor angle attached.');
                    }}
                    className="w-full h-32 rounded-xl bg-surface-container-low hover:bg-surface-container-high transition-colors flex flex-col items-center justify-center gap-1 p-2 text-center"
                  >
                    <div className="w-10 h-10 rounded-full bg-primary-fixed text-on-primary-fixed flex items-center justify-center">
                      <span className="material-symbols-outlined text-[20px]">
                        add_a_photo
                      </span>
                    </div>
                    <span className="text-xs font-bold text-on-surface">
                      + Add 2nd Photo
                    </span>
                    <span className="text-[11px] text-on-surface-variant">
                      Alternate angle
                    </span>
                  </button>
                )}
              </div>

              {/* Auto-generate Alt Text Toggle */}
              <div className="flex items-center justify-between p-2.5 bg-surface-container-low rounded-xl gap-2">
                <div className="flex items-center gap-2.5 min-w-0">
                  <div className="w-9 h-9 rounded-full bg-primary text-on-primary flex items-center justify-center shrink-0">
                    <span className="material-symbols-outlined text-[18px]">
                      auto_read_pause
                    </span>
                  </div>
                  <div className="min-w-0">
                    <span className="block text-xs font-bold text-on-surface truncate">
                      Auto-generate Alt Text
                    </span>
                    <span className="block text-[11px] text-on-surface-variant truncate">
                      Screen-reader descriptions for blind scouts
                    </span>
                  </div>
                </div>
                <button
                  type="button"
                  role="switch"
                  aria-checked={autoAltText}
                  onClick={() => setAutoAltText((v) => !v)}
                  className={`w-13 h-7 rounded-full p-1 flex items-center transition-colors shrink-0 ${
                    autoAltText
                      ? 'bg-primary justify-end'
                      : 'bg-outline-variant justify-start'
                  }`}
                >
                  <div className="w-5 h-5 rounded-full bg-surface-container-lowest shadow flex items-center justify-center text-primary">
                    {autoAltText && (
                      <span className="material-symbols-outlined text-[13px] font-bold">
                        check
                      </span>
                    )}
                  </div>
                </button>
              </div>
            </div>
          </section>

          {/* Step 5: Scout Field Notes */}
          <section className="space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-bold text-on-surface flex items-center gap-2">
                <span className="w-6 h-6 rounded-full bg-primary text-on-primary flex items-center justify-center text-xs font-bold shrink-0">
                  5
                </span>
                Scout Field Notes
              </h3>
              <span className="text-xs text-on-surface-variant">Optional</span>
            </div>

            <div className="bg-surface-container-lowest rounded-2xl p-4 shadow-sm border border-outline-variant/30 space-y-3">
              <div className="flex flex-wrap gap-1.5">
                {QUICK_TAGS.map((tag) => (
                  <button
                    key={tag}
                    type="button"
                    onClick={() => appendTag(tag)}
                    className="min-h-[36px] px-3 py-1 rounded-lg bg-surface-container-high hover:bg-primary hover:text-on-primary text-on-surface text-xs font-semibold transition-colors"
                  >
                    + {tag}
                  </button>
                ))}
              </div>

              <div className="rounded-xl bg-surface-container-low p-3">
                <textarea
                  rows={3}
                  maxLength={300}
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Provide extra guidance (e.g., caution tape up, doors won't open)..."
                  className="w-full bg-transparent border-0 outline-none text-on-surface text-sm resize-none"
                />
                <div className="flex items-center justify-between pt-1.5">
                  <button
                    type="button"
                    onClick={() => {
                      appendTag('Staff notified on site');
                      onShowToast('Voice note appended to field details.');
                    }}
                    className="text-xs font-bold text-primary flex items-center gap-1 hover:underline"
                  >
                    <span className="material-symbols-outlined text-[17px]">
                      mic
                    </span>
                    Voice Dictate
                  </button>
                  <span className="text-xs text-on-surface-variant font-mono tabular-nums">
                    {notes.length} / 300
                  </span>
                </div>
              </div>
            </div>
          </section>

          {/* Submit & Draft Actions */}
          <div className="space-y-2.5 pt-1">
            <button
              type="button"
              disabled={submitting}
              onClick={handleSubmit}
              className="w-full min-h-[54px] bg-primary hover:bg-primary-container disabled:opacity-75 text-on-primary rounded-xl font-bold text-base flex items-center justify-center gap-2 shadow-lg active:scale-[0.98] transition-all"
            >
              <span className="material-symbols-outlined text-[22px]">
                {submitting ? 'hourglass_top' : 'send'}
              </span>
              <span>
                {submitting
                  ? 'Dispatching Alert...'
                  : 'Publish Obstacle Report (+25 Karma)'}
              </span>
            </button>

            <div className="grid grid-cols-2 gap-2.5">
              <button
                type="button"
                onClick={() =>
                  onShowToast('Draft saved locally on your device.')
                }
                className="min-h-[46px] bg-surface-container-lowest hover:bg-surface-container text-on-surface rounded-xl font-semibold text-sm flex items-center justify-center gap-1.5 shadow-sm border border-outline-variant/30"
              >
                <span className="material-symbols-outlined text-[19px]">
                  bookmark_border
                </span>
                <span>Save Draft</span>
              </button>
              <button
                type="button"
                onClick={onCancel}
                className="min-h-[46px] bg-surface-container-lowest hover:bg-error-container text-error rounded-xl font-semibold text-sm flex items-center justify-center gap-1.5 shadow-sm border border-outline-variant/30"
              >
                <span className="material-symbols-outlined text-[19px]">
                  delete_outline
                </span>
                <span>Discard</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
