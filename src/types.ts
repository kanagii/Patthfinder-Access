export type AppView =
  | 'onboarding'
  | 'map'
  | 'routes'
  | 'navigation'
  | 'hazard-detail'
  | 'report'
  | 'report-success'
  | 'rewards'
  | 'profile'
  | 'admin';

export type MobilityModeId =
  | 'wheelchair'
  | 'power-chair'
  | 'cane'
  | 'vision'
  | 'pedestrian';

export type MapFilterChipId =
  | 'wheelchair'
  | 'strollers'
  | 'vision'
  | 'cane'
  | 'step-free'
  | 'elevators'
  | 'covered';

export type HazardSeverity = 'high' | 'medium' | 'low';
export type HazardStatus = 'Urgent' | 'In Progress' | 'Resolved';
export type HazardCategory =
  | 'elevator'
  | 'ramp'
  | 'sidewalk'
  | 'door'
  | 'debris'
  | 'other';

export interface HazardComment {
  id: string;
  author: string;
  role: string;
  initials: string;
  isStaff?: boolean;
  isScout?: boolean;
  timeAgo: string;
  text: string;
}

export interface Hazard {
  id: string;
  ticketCode: string;
  title: string;
  location: string;
  building: string;
  floor: string;
  category: HazardCategory;
  severity: HazardSeverity;
  status: HazardStatus;
  reportedAgo: string;
  reporterName: string;
  reporterRole: string;
  reporterKarma: number;
  verifiedCount: number;
  upvotes: number;
  downvotes: number;
  distanceMeters: number;
  detourTitle: string;
  detourSubtitle: string;
  detourSlope: string;
  photoUrl: string;
  photoCaption: string;
  photoZone: string;
  facilitiesNote: string;
  avgFixHours: string;
  reportVolume: number;
  dispatched: boolean;
  mapCoords: { x: number; y: number }; // percentage 0-100 on campus map
  comments: HazardComment[];
}

export interface Quest {
  id: string;
  title: string;
  subtitle: string;
  points: number;
  meta: string;
  icon: string;
  completed: boolean;
  accentColor: 'primary' | 'tertiary';
}

export interface BadgeItem {
  id: string;
  title: string;
  description: string;
  icon: string;
  status: 'Unlocked' | 'In Progress' | 'Master Tier';
  bgClass: string;
  textClass: string;
}

export interface CampusPerk {
  id: string;
  title: string;
  partner: string;
  pointsCost: number;
  icon: string;
  iconColorClass: string;
  description?: string;
  imageUrl?: string;
  redeemed: boolean;
}

export interface LeaderboardEntry {
  id: string;
  name: string;
  initials: string;
  level: number;
  department: string;
  points: number;
  isCurrentUser?: boolean;
  avatarBgClass: string;
  avatarTextClass: string;
}

export interface ActivityItem {
  id: string;
  title: string;
  subtitle: string;
  pointsText: string;
  icon: string;
}

export interface SensorySettings {
  voiceAlerts: boolean;
  hapticVibrations: boolean;
  tactileBeacons: boolean;
  screenReaderPriority: boolean;
  highContrastMap: boolean;
  language: 'EN' | 'CEB' | 'FIL';
  maxIncline: number;
}

export type AdminSection =
  | 'overview'
  | 'heatmap'
  | 'problem-spots'
  | 'work-orders'
  | 'exports';

export type DateRangeOption = 'Last 7 Days' | 'Last 30 Days' | 'Last 90 Days';
