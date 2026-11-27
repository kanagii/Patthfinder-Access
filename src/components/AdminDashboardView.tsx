import React, { useMemo, useState } from 'react';
import { ADMIN_CHART_DATA, STITCH_ASSETS } from '../data/initialData';
import { AdminSection, DateRangeOption, Hazard } from '../types';
import { ResilientImage } from './ResilientImage';

interface AdminDashboardViewProps {
  hazards: Hazard[];
  onDispatchTicket: (id: string) => void;
  onResolveHazard: (id: string) => void;
  onExitAdmin: () => void;
  onShowToast: (msg: string) => void;
}

export const AdminDashboardView: React.FC<AdminDashboardViewProps> = ({
  hazards,
  onDispatchTicket,
  onResolveHazard,
  onExitAdmin,
  onShowToast,
}) => {
  const [activeSection, setActiveSection] = useState<AdminSection>('overview');
  const [dateRange, setDateRange] = useState<DateRangeOption>('Last 30 Days');
  const [dateMenuOpen, setDateMenuOpen] = useState(false);
  const [exportMenuOpen, setExportMenuOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [selectedPinId, setSelectedPinId] = useState<string>(
    hazards[0]?.id ?? 'haz-main-elevator'
  );
  const [tableSearch, setTableSearch] = useState('');

  const chartData = ADMIN_CHART_DATA[dateRange];

  const activeCount = useMemo(
    () => hazards.filter((h) => h.status !== 'Resolved').length,
    [hazards]
  );
  const urgentCount = useMemo(
    () => hazards.filter((h) => h.status === 'Urgent').length,
    [hazards]
  );
  const resolvedCount = useMemo(
    () =>
      chartData.resolvedCount +
      hazards.filter((h) => h.status === 'Resolved').length -
      1,
    [chartData, hazards]
  );

  const selectedHotspot = useMemo(
    () => hazards.find((h) => h.id === selectedPinId) ?? hazards[0],
    [hazards, selectedPinId]
  );

  const filteredHazards = useMemo(() => {
    const q = tableSearch.trim().toLowerCase();
    return [...hazards]
      .filter((h) => {
        if (activeSection === 'work-orders') {
          return h.dispatched || h.status !== 'Resolved';
        }
        return true;
      })
      .filter(
        (h) =>
          !q ||
          h.title.toLowerCase().includes(q) ||
          h.building.toLowerCase().includes(q) ||
          h.ticketCode.toLowerCase().includes(q)
      )
      .sort((a, b) => b.reportVolume - a.reportVolume);
  }, [hazards, activeSection, tableSearch]);

  const triggerDownload = (format: 'CSV' | 'GeoJSON') => {
    setExportMenuOpen(false);
    let content = '';
    let filename = '';
    let mime = '';

    if (format === 'CSV') {
      const header =
        'TicketCode,Building,Title,Severity,Status,Reports,AvgFixHours,Dispatched\n';
      const rows = hazards
        .map(
          (h) =>
            `"${h.ticketCode}","${h.building}","${h.title}","${h.severity}","${h.status}",${h.reportVolume},"${h.avgFixHours}",${h.dispatched}`
        )
        .join('\n');
      content = header + rows;
      filename = 'Accessibility_Report.csv';
      mime = 'text/csv;charset=utf-8;';
    } else {
      const geojson = {
        type: 'FeatureCollection',
        features: hazards.map((h) => ({
          type: 'Feature',
          properties: {
            ticketCode: h.ticketCode,
            title: h.title,
            building: h.building,
            severity: h.severity,
            status: h.status,
            reports: h.reportVolume,
          },
          geometry: {
            type: 'Point',
            coordinates: [
              +(123.881 + h.mapCoords.x * 0.0005).toFixed(5),
              +(10.294 + (100 - h.mapCoords.y) * 0.0005).toFixed(5),
            ],
          },
        })),
      };
      content = JSON.stringify(geojson, null, 2);
      filename = 'CITU_Hazards_Map.geojson';
      mime = 'application/geo+json;charset=utf-8;';
    }

    try {
      const blob = new Blob([content], { type: mime });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch {
      // ignore in restricted environments
    }

    onShowToast(`Downloaded ${filename}`);
  };

  const sidebarItems: {
    id: AdminSection;
    label: string;
    icon: string;
  }[] = [
    { id: 'overview', label: 'Overview', icon: 'dashboard' },
    { id: 'heatmap', label: 'Hazard Heatmap', icon: 'map' },
    { id: 'problem-spots', label: 'Problem Spots', icon: 'warning' },
    { id: 'work-orders', label: 'Work Orders', icon: 'construction' },
    { id: 'exports', label: 'Export & Reports', icon: 'analytics' },
  ];

  // Max value for SVG bar scaling
  const maxWeekVal = Math.max(
    ...chartData.weeks.flatMap((w) => [w.reported, w.resolved]),
    10
  );

  return (
    <div className="min-h-screen bg-surface text-on-surface flex">
      {/* Desktop Sidebar */}
      <aside className="hidden lg:flex fixed left-0 top-0 h-full w-64 bg-surface-container-low z-40 flex-col pt-6 pb-8 border-r border-outline-variant/40">
        <div className="px-6 mb-8 flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center shrink-0">
            <span className="material-symbols-outlined text-on-primary">
              accessible_forward
            </span>
          </div>
          <div className="min-w-0">
            <span className="block text-base font-bold text-on-surface">
              PathFinder
            </span>
            <span className="block text-[11px] font-bold text-primary uppercase tracking-wider">
              Admin Portal
            </span>
          </div>
        </div>

        <nav className="flex-1 px-4 flex flex-col gap-1.5">
          {sidebarItems.map((item) => {
            const active = activeSection === item.id;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => setActiveSection(item.id)}
                className={`flex items-center gap-3 px-4 py-3 min-h-[48px] rounded-xl text-left transition-all whitespace-nowrap ${
                  active
                    ? 'bg-primary-container text-on-primary-container font-bold shadow-sm'
                    : 'text-on-surface-variant hover:bg-surface-container-high hover:text-on-surface font-semibold'
                }`}
              >
                <span className="material-symbols-outlined text-[22px]">
                  {item.icon}
                </span>
                <span className="text-sm">{item.label}</span>
              </button>
            );
          })}
        </nav>

        <div className="px-4 pt-4 border-t border-outline-variant/40">
          <button
            type="button"
            onClick={onExitAdmin}
            className="w-full min-h-[48px] px-4 rounded-xl bg-surface-container-high hover:bg-surface-container-highest text-on-surface font-bold text-sm flex items-center justify-center gap-2 transition-colors"
          >
            <span className="material-symbols-outlined text-[20px]">
              smartphone
            </span>
            <span>Phone Prototype</span>
          </button>
        </div>
      </aside>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div
          onClick={() => setMobileMenuOpen(false)}
          className="fixed inset-0 z-50 bg-inverse-surface/50 lg:hidden"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="w-64 h-full bg-surface-container-low p-5 flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between mb-6">
                <span className="font-bold text-base text-on-surface">
                  Admin Portal
                </span>
                <button
                  type="button"
                  onClick={() => setMobileMenuOpen(false)}
                  className="w-9 h-9 rounded-lg flex items-center justify-center"
                >
                  <span className="material-symbols-outlined">close</span>
                </button>
              </div>
              <div className="flex flex-col gap-1.5">
                {sidebarItems.map((item) => (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => {
                      setActiveSection(item.id);
                      setMobileMenuOpen(false);
                    }}
                    className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-semibold ${
                      activeSection === item.id
                        ? 'bg-primary-container text-on-primary-container'
                        : 'text-on-surface-variant'
                    }`}
                  >
                    <span className="material-symbols-outlined text-[20px]">
                      {item.icon}
                    </span>
                    <span>{item.label}</span>
                  </button>
                ))}
              </div>
            </div>

            <button
              type="button"
              onClick={onExitAdmin}
              className="w-full min-h-[44px] rounded-xl bg-primary text-on-primary font-bold text-sm flex items-center justify-center gap-2"
            >
              <span className="material-symbols-outlined text-[18px]">
                smartphone
              </span>
              <span>Phone Prototype</span>
            </button>
          </div>
        </div>
      )}

      {/* Main Content Area */}
      <div className="flex-1 lg:pl-64 flex flex-col min-w-0">
        {/* Top Bar */}
        <header className="sticky top-0 h-16 bg-surface/90 backdrop-blur-xl border-b border-outline-variant/30 z-30 px-4 lg:px-10 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3 min-w-0">
            <button
              type="button"
              aria-label="Open admin menu"
              onClick={() => setMobileMenuOpen(true)}
              className="lg:hidden w-10 h-10 rounded-xl bg-surface-container flex items-center justify-center"
            >
              <span className="material-symbols-outlined">menu</span>
            </button>
            <span className="text-base font-bold text-on-surface whitespace-nowrap">
              PathFinder Access
            </span>
            <span className="hidden sm:inline text-xs font-semibold text-primary">
              · CIT-U &amp; Cebu City PDAO
            </span>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <button
              type="button"
              onClick={onExitAdmin}
              className="lg:hidden min-h-[38px] px-3 rounded-lg bg-surface-container text-on-surface text-xs font-bold whitespace-nowrap"
            >
              Phone Prototype
            </button>
            <span className="text-xs font-semibold text-on-surface-variant hidden sm:inline">
              Facilities Admin
            </span>
            <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center">
              <span className="material-symbols-outlined text-on-primary text-[18px]">
                person
              </span>
            </div>
          </div>
        </header>

        <main className="flex-1 px-4 lg:px-10 py-6 flex flex-col gap-7 max-w-[1440px] w-full mx-auto">
          {/* Header Row with Date Filter & Export */}
          <section className="flex flex-col lg:flex-row lg:items-end justify-between gap-4">
            <div className="flex flex-col gap-1">
              <span className="text-xs font-bold uppercase tracking-wider text-primary">
                01. CIT-U Main Campus · Cebu City PDAO
              </span>
              <h1 className="text-2xl lg:text-3xl font-extrabold text-on-surface">
                Campus &amp; City Accessibility Analytics
              </h1>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              {/* Date Range Filter */}
              <div className="relative">
                <button
                  type="button"
                  onClick={() => {
                    setDateMenuOpen((v) => !v);
                    setExportMenuOpen(false);
                  }}
                  className="min-h-[46px] px-4 bg-surface-container-lowest text-on-surface rounded-xl shadow-sm border border-outline-variant/30 hover:bg-surface-container-low transition-colors flex items-center gap-2 text-sm font-bold whitespace-nowrap"
                >
                  <span className="material-symbols-outlined text-primary text-[20px]">
                    calendar_today
                  </span>
                  <span>{dateRange}</span>
                  <span className="material-symbols-outlined text-on-surface-variant text-[20px]">
                    expand_more
                  </span>
                </button>

                {dateMenuOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-surface-container-lowest rounded-xl shadow-xl border border-outline-variant/30 z-30 p-1.5 flex flex-col gap-1">
                    {(
                      ['Last 7 Days', 'Last 30 Days', 'Last 90 Days'] as const
                    ).map((opt) => (
                      <button
                        key={opt}
                        type="button"
                        onClick={() => {
                          setDateRange(opt);
                          setDateMenuOpen(false);
                          onShowToast(`Analytics updated to ${opt}`);
                        }}
                        className={`min-h-[42px] px-3 text-left rounded-lg text-sm ${
                          dateRange === opt
                            ? 'bg-primary-fixed text-on-primary-fixed font-bold'
                            : 'hover:bg-surface-container-low text-on-surface'
                        }`}
                      >
                        {opt}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Export Data */}
              <div className="relative">
                <button
                  type="button"
                  onClick={() => {
                    setExportMenuOpen((v) => !v);
                    setDateMenuOpen(false);
                  }}
                  className="min-h-[46px] px-4 bg-primary text-on-primary rounded-xl shadow-md hover:bg-primary-container transition-colors flex items-center gap-2 text-sm font-bold whitespace-nowrap"
                >
                  <span className="material-symbols-outlined text-[20px]">
                    download
                  </span>
                  <span>Export Data</span>
                </button>

                {exportMenuOpen && (
                  <div className="absolute right-0 mt-2 w-60 bg-surface-container-lowest rounded-xl shadow-xl border border-outline-variant/30 z-30 p-1.5 flex flex-col gap-1">
                    <button
                      type="button"
                      onClick={() => triggerDownload('CSV')}
                      className="min-h-[44px] px-3 text-left rounded-lg hover:bg-surface-container-low flex items-center justify-between text-sm text-on-surface"
                    >
                      <span>Accessibility_Report.csv</span>
                      <span className="text-xs font-bold text-primary">
                        CSV
                      </span>
                    </button>
                    <button
                      type="button"
                      onClick={() => triggerDownload('GeoJSON')}
                      className="min-h-[44px] px-3 text-left rounded-lg hover:bg-surface-container-low flex items-center justify-between text-sm text-on-surface"
                    >
                      <span>CITU_Hazards_Map.geojson</span>
                      <span className="text-xs font-bold text-primary">
                        GeoJSON
                      </span>
                    </button>
                  </div>
                )}
              </div>
            </div>
          </section>

          {/* KPI Summary Cards */}
          {(activeSection === 'overview' || activeSection === 'exports') && (
            <section className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5">
              {/* KPI 1 */}
              <div className="bg-surface-container-lowest rounded-2xl p-5 shadow-sm border border-outline-variant/25 flex flex-col justify-between gap-4">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <span className="text-xs font-bold uppercase text-on-surface-variant">
                      Active Hazards
                    </span>
                    <div className="text-3xl font-extrabold text-on-surface tabular-nums mt-1">
                      {activeCount + 14}
                    </div>
                  </div>
                  <div className="w-11 h-11 rounded-xl bg-secondary-fixed text-on-secondary-fixed flex items-center justify-center shrink-0">
                    <span className="material-symbols-outlined material-symbols-filled">
                      warning
                    </span>
                  </div>
                </div>
                <div className="flex items-center justify-between gap-2">
                  <span className="text-xs font-bold text-secondary tabular-nums">
                    {urgentCount + 2} Urgent
                  </span>
                  <svg
                    aria-hidden="true"
                    className="w-20 h-8 text-secondary"
                    fill="none"
                    viewBox="0 0 80 32"
                  >
                    <path
                      d="M2 24 L18 20 L34 26 L50 12 L66 16 L78 6"
                      stroke="currentColor"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2.5"
                    />
                  </svg>
                </div>
              </div>

              {/* KPI 2 */}
              <div className="bg-surface-container-lowest rounded-2xl p-5 shadow-sm border border-outline-variant/25 flex flex-col justify-between gap-4">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <span className="text-xs font-bold uppercase text-on-surface-variant">
                      Resolved ({chartData.label})
                    </span>
                    <div className="text-3xl font-extrabold text-on-surface tabular-nums mt-1">
                      {resolvedCount}
                    </div>
                  </div>
                  <div className="w-11 h-11 rounded-xl bg-primary-fixed text-on-primary-fixed flex items-center justify-center shrink-0">
                    <span className="material-symbols-outlined material-symbols-filled">
                      task_alt
                    </span>
                  </div>
                </div>
                <div className="flex items-center justify-between gap-2">
                  <span className="text-xs font-bold text-primary">
                    +14% vs prior period
                  </span>
                  <svg
                    aria-hidden="true"
                    className="w-20 h-8 text-primary"
                    fill="none"
                    viewBox="0 0 80 32"
                  >
                    <path
                      d="M2 26 L18 22 L34 18 L50 14 L66 10 L78 4"
                      stroke="currentColor"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2.5"
                    />
                  </svg>
                </div>
              </div>

              {/* KPI 3 */}
              <div className="bg-surface-container-lowest rounded-2xl p-5 shadow-sm border border-outline-variant/25 flex flex-col justify-between gap-4">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <span className="text-xs font-bold uppercase text-on-surface-variant">
                      Average Time-to-Fix
                    </span>
                    <div className="text-3xl font-extrabold text-on-surface tabular-nums mt-1">
                      {chartData.avgFixHours}
                    </div>
                  </div>
                  <div className="w-11 h-11 rounded-xl bg-tertiary-fixed text-on-tertiary-fixed flex items-center justify-center shrink-0">
                    <span className="material-symbols-outlined material-symbols-filled">
                      schedule
                    </span>
                  </div>
                </div>
                <div className="flex items-center justify-between gap-3">
                  <span className="text-xs font-bold text-primary shrink-0">
                    -35m faster
                  </span>
                  <div className="w-24 h-2 bg-surface-container rounded-full overflow-hidden">
                    <div
                      className="h-full bg-primary rounded-full"
                      style={{ width: '78%' }}
                    />
                  </div>
                </div>
              </div>

              {/* KPI 4 */}
              <div className="bg-surface-container-lowest rounded-2xl p-5 shadow-sm border border-outline-variant/25 flex flex-col justify-between gap-4">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <span className="text-xs font-bold uppercase text-on-surface-variant">
                      Students Rerouted
                    </span>
                    <div className="text-3xl font-extrabold text-on-surface tabular-nums mt-1">
                      {chartData.studentsRerouted.toLocaleString()}
                    </div>
                  </div>
                  <div className="w-11 h-11 rounded-xl bg-surface-container text-primary flex items-center justify-center shrink-0">
                    <span className="material-symbols-outlined material-symbols-filled">
                      alt_route
                    </span>
                  </div>
                </div>
                <div className="flex items-center justify-between gap-2">
                  <span className="text-xs text-on-surface-variant">
                    Safe step-free detours
                  </span>
                  <span className="text-xs font-bold text-primary tabular-nums">
                    99.2% success
                  </span>
                </div>
              </div>
            </section>
          )}

          {/* Export Section View */}
          {activeSection === 'exports' && (
            <section className="bg-surface-container-lowest rounded-2xl p-6 shadow-sm border border-outline-variant/25 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div>
                <h2 className="text-lg font-bold text-on-surface">
                  Cebu City PDAO &amp; CIT-U Open Accessibility Datasets
                </h2>
                <p className="text-sm text-on-surface-variant mt-1">
                  Download live campus obstacle reports, ticket resolution
                  metrics, and GeoJSON coordinates.
                </p>
              </div>
              <div className="flex items-center gap-3 shrink-0">
                <button
                  type="button"
                  onClick={() => triggerDownload('CSV')}
                  className="min-h-[46px] px-4 rounded-xl bg-primary text-on-primary font-bold text-sm flex items-center gap-2"
                >
                  <span className="material-symbols-outlined text-[19px]">
                    table_view
                  </span>
                  Download CSV
                </button>
                <button
                  type="button"
                  onClick={() => triggerDownload('GeoJSON')}
                  className="min-h-[46px] px-4 rounded-xl bg-surface-container text-on-surface font-bold text-sm flex items-center gap-2"
                >
                  <span className="material-symbols-outlined text-[19px]">
                    public
                  </span>
                  Download GeoJSON
                </button>
              </div>
            </section>
          )}

          {/* Heatmap + 6-Week Trend Chart */}
          {(activeSection === 'overview' || activeSection === 'heatmap') && (
            <section className="grid grid-cols-1 xl:grid-cols-12 gap-6">
              {/* Hazard Heatmap */}
              <div
                className={`${
                  activeSection === 'heatmap'
                    ? 'xl:col-span-12'
                    : 'xl:col-span-7'
                } bg-surface-container-lowest rounded-2xl p-5 shadow-sm border border-outline-variant/25 flex flex-col gap-4`}
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div>
                    <span className="text-xs font-bold uppercase text-primary">
                      Spatial Density
                    </span>
                    <h2 className="text-lg font-bold text-on-surface">
                      Hazard Heatmap — CIT-U &amp; Cebu City
                    </h2>
                  </div>

                  <div className="flex flex-wrap items-center gap-4 text-xs font-semibold text-on-surface">
                    <span className="inline-flex items-center gap-1.5">
                      <span className="w-2.5 h-2.5 rounded-full bg-secondary" />
                      Critical Hotspot
                    </span>
                    <span className="inline-flex items-center gap-1.5">
                      <span className="w-2.5 h-2.5 rounded-full bg-tertiary" />
                      Caution
                    </span>
                    <span className="inline-flex items-center gap-1.5">
                      <span className="w-2.5 h-2.5 rounded-full bg-primary" />
                      Clear Route
                    </span>
                  </div>
                </div>

                <div className="relative w-full h-[360px] rounded-xl overflow-hidden bg-surface-container">
                  <ResilientImage
                    src={STITCH_ASSETS.campusMapPhoto}
                    alt="CIT-U and Cebu City Hazard Heatmap"
                    className="w-full h-full object-cover opacity-85"
                    fallbackIcon="map"
                    fallbackLabel="CIT-U Campus Heatmap"
                  />

                  {hazards.map((h) => {
                    const isSelected = selectedHotspot?.id === h.id;
                    return (
                      <button
                        key={h.id}
                        type="button"
                        onClick={() => setSelectedPinId(h.id)}
                        style={{
                          top: `${h.mapCoords.y}%`,
                          left: `${h.mapCoords.x}%`,
                        }}
                        className={`absolute -translate-x-1/2 -translate-y-1/2 focus:outline-none transition-transform ${
                          isSelected ? 'scale-115 z-20' : 'hover:scale-105 z-10'
                        }`}
                      >
                        <span
                          className={`relative w-11 h-11 rounded-full shadow-lg flex items-center justify-center font-bold text-sm tabular-nums ${
                            h.status === 'Resolved'
                              ? 'bg-primary text-on-primary'
                              : h.severity === 'high'
                              ? 'bg-secondary text-on-secondary'
                              : 'bg-tertiary text-on-tertiary'
                          } ${isSelected ? 'ring-4 ring-white' : ''}`}
                        >
                          {h.status === 'Resolved' ? (
                            <span className="material-symbols-outlined text-[19px]">
                              accessible_forward
                            </span>
                          ) : (
                            h.reportVolume
                          )}
                        </span>
                      </button>
                    );
                  })}

                  {/* Floating Hotspot Inspector */}
                  {selectedHotspot && (
                    <div className="absolute bottom-3 left-3 right-3 bg-surface/95 backdrop-blur-md rounded-xl p-3.5 shadow-lg flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                      <div className="flex items-center gap-2 min-w-0">
                        <span className="material-symbols-outlined text-secondary shrink-0">
                          location_on
                        </span>
                        <span className="text-sm font-bold text-on-surface truncate">
                          {selectedHotspot.building} ·{' '}
                          {selectedHotspot.reportVolume} reports (
                          {selectedHotspot.title})
                        </span>
                      </div>
                      <span className="text-xs font-bold text-primary shrink-0">
                        Click pins to inspect
                      </span>
                    </div>
                  )}
                </div>
              </div>

              {/* 6-Week Trend Chart */}
              {activeSection === 'overview' && (
                <div className="xl:col-span-5 bg-surface-container-lowest rounded-2xl p-5 shadow-sm border border-outline-variant/25 flex flex-col justify-between gap-4">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <span className="text-xs font-bold uppercase text-primary">
                        {dateRange} Trend
                      </span>
                      <h2 className="text-lg font-bold text-on-surface">
                        Hazards Reported vs. Resolved
                      </h2>
                    </div>
                    <div className="flex items-center gap-3 text-xs font-semibold">
                      <span className="inline-flex items-center gap-1.5">
                        <span className="w-3 h-3 rounded-sm bg-secondary-container" />
                        Reported
                      </span>
                      <span className="inline-flex items-center gap-1.5">
                        <span className="w-3 h-3 rounded-sm bg-primary" />
                        Resolved
                      </span>
                    </div>
                  </div>

                  <div className="w-full flex-1 flex flex-col justify-center">
                    <svg
                      aria-label="Hazards Reported vs Resolved"
                      className="w-full h-64"
                      role="img"
                      viewBox="0 0 420 240"
                    >
                      {[30, 75, 120, 165].map((y) => (
                        <line
                          key={y}
                          x1="36"
                          x2="405"
                          y1={y}
                          y2={y}
                          stroke="#e1e8fd"
                          strokeWidth="1"
                        />
                      ))}
                      <line
                        x1="36"
                        x2="405"
                        y1="210"
                        y2="210"
                        stroke="#bcc9c5"
                        strokeWidth="1.5"
                      />

                      {[
                        { y: 34, label: maxWeekVal },
                        { y: 79, label: Math.round(maxWeekVal * 0.75) },
                        { y: 124, label: Math.round(maxWeekVal * 0.5) },
                        { y: 169, label: Math.round(maxWeekVal * 0.25) },
                        { y: 214, label: 0 },
                      ].map((t) => (
                        <text
                          key={t.y}
                          x="28"
                          y={t.y}
                          textAnchor="end"
                          className="fill-on-surface-variant text-[11px] font-medium tabular-nums"
                        >
                          {t.label}
                        </text>
                      ))}

                      {chartData.weeks.map((w, idx) => {
                        const baseX = 52 + idx * 60;
                        const hRep = Math.max(
                          6,
                          Math.round((w.reported / maxWeekVal) * 175)
                        );
                        const hRes = Math.max(
                          6,
                          Math.round((w.resolved / maxWeekVal) * 175)
                        );
                        return (
                          <g key={w.name}>
                            <rect
                              x={baseX}
                              y={210 - hRep}
                              width="18"
                              height={hRep}
                              rx="4"
                              fill="#fd6442"
                            />
                            <rect
                              x={baseX + 22}
                              y={210 - hRes}
                              width="18"
                              height={hRes}
                              rx="4"
                              fill="#00685b"
                            />
                            <text
                              x={baseX + 20}
                              y="230"
                              textAnchor="middle"
                              className="fill-on-surface-variant text-[11px] font-semibold"
                            >
                              {w.name}
                            </text>
                          </g>
                        );
                      })}

                      {/* Resolution Trend Line */}
                      <path
                        d={chartData.weeks
                          .map((w, idx) => {
                            const cx = 52 + idx * 60 + 31;
                            const cy =
                              210 -
                              Math.max(
                                6,
                                Math.round((w.resolved / maxWeekVal) * 175)
                              );
                            return `${idx === 0 ? 'M' : 'L'} ${cx} ${cy}`;
                          })
                          .join(' ')}
                        fill="none"
                        stroke="#141b2b"
                        strokeWidth="2.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                      {chartData.weeks.map((w, idx) => {
                        const cx = 52 + idx * 60 + 31;
                        const cy =
                          210 -
                          Math.max(
                            6,
                            Math.round((w.resolved / maxWeekVal) * 175)
                          );
                        return (
                          <circle
                            key={w.name + '-dot'}
                            cx={cx}
                            cy={cy}
                            r="4"
                            fill="#141b2b"
                          />
                        );
                      })}
                    </svg>
                  </div>

                  <div className="bg-surface-container-low rounded-xl p-3.5 flex items-center justify-between gap-2 text-xs">
                    <span className="text-on-surface-variant">
                      Resolution rate improved over {dateRange.toLowerCase()}
                    </span>
                    <span className="font-bold text-primary tabular-nums">
                      {chartData.netClearance}
                    </span>
                  </div>
                </div>
              )}
            </section>
          )}

          {/* Top Problem Spots / Work Orders Table */}
          {(activeSection === 'overview' ||
            activeSection === 'problem-spots' ||
            activeSection === 'work-orders') && (
            <section className="bg-surface-container-lowest rounded-2xl p-5 shadow-sm border border-outline-variant/25 flex flex-col gap-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <span className="text-xs font-bold uppercase text-primary">
                    02. Priority Queue
                  </span>
                  <h2 className="text-lg font-bold text-on-surface">
                    {activeSection === 'work-orders'
                      ? 'Active Facilities Work Orders'
                      : 'Top Problem Spots'}
                  </h2>
                </div>

                <div className="flex items-center gap-2">
                  <div className="flex items-center gap-2 px-3 h-10 rounded-xl bg-surface-container-low">
                    <span className="material-symbols-outlined text-[18px] text-on-surface-variant">
                      search
                    </span>
                    <input
                      type="text"
                      value={tableSearch}
                      onChange={(e) => setTableSearch(e.target.value)}
                      placeholder="Filter building or ticket..."
                      className="bg-transparent border-0 outline-none text-xs text-on-surface w-44"
                    />
                  </div>
                </div>
              </div>

              <div className="w-full overflow-x-auto">
                <table className="w-full text-left border-collapse min-w-[760px]">
                  <thead>
                    <tr className="bg-surface-container-low text-on-surface-variant text-xs uppercase font-bold">
                      <th className="py-3 px-4 rounded-l-lg">Location</th>
                      <th className="py-3 px-4">Obstacle Type</th>
                      <th className="py-3 px-4">Reports</th>
                      <th className="py-3 px-4">Avg. Fix</th>
                      <th className="py-3 px-4">Status</th>
                      <th className="py-3 px-4 text-right rounded-r-lg">
                        Action
                      </th>
                    </tr>
                  </thead>
                  <tbody className="text-sm text-on-surface divide-y divide-outline-variant/20">
                    {filteredHazards.map((row) => (
                      <tr
                        key={row.id}
                        className="hover:bg-surface-container-low/60 transition-colors"
                      >
                        <td className="py-3.5 px-4 font-bold">
                          <div>{row.building}</div>
                          <div className="text-xs font-mono text-on-surface-variant font-normal">
                            {row.ticketCode}
                          </div>
                        </td>
                        <td className="py-3.5 px-4 text-on-surface-variant">
                          {row.title}
                        </td>
                        <td className="py-3.5 px-4 font-bold tabular-nums">
                          {row.reportVolume}
                        </td>
                        <td className="py-3.5 px-4 text-on-surface-variant tabular-nums">
                          {row.avgFixHours}
                        </td>
                        <td className="py-3.5 px-4">
                          <span
                            className={`text-xs font-bold ${
                              row.status === 'Urgent'
                                ? 'text-secondary'
                                : row.status === 'In Progress'
                                ? 'text-tertiary'
                                : 'text-primary'
                            }`}
                          >
                            {row.status}
                          </span>
                        </td>
                        <td className="py-3.5 px-4 text-right">
                          <div className="inline-flex items-center gap-2">
                            {row.status !== 'Resolved' && (
                              <button
                                type="button"
                                disabled={row.dispatched}
                                onClick={() => onDispatchTicket(row.id)}
                                className={`min-h-[40px] px-3.5 rounded-xl font-bold text-xs transition-colors whitespace-nowrap ${
                                  row.dispatched
                                    ? 'bg-primary-fixed text-on-primary-fixed cursor-default'
                                    : 'bg-primary text-on-primary hover:bg-primary-container'
                                }`}
                              >
                                {row.dispatched
                                  ? 'Dispatched'
                                  : 'Dispatch Ticket'}
                              </button>
                            )}
                            {row.status !== 'Resolved' ? (
                              <button
                                type="button"
                                onClick={() => onResolveHazard(row.id)}
                                className="min-h-[40px] px-3 rounded-xl bg-surface-container text-on-surface hover:bg-surface-container-high font-bold text-xs whitespace-nowrap"
                              >
                                Mark Resolved
                              </button>
                            ) : (
                              <span className="text-xs font-bold text-primary px-2">
                                Cleared
                              </span>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </section>
          )}
        </main>
      </div>
    </div>
  );
};
