export interface ActivityItem {
  id: number;
  type: 'app_usage' | 'blocked_content' | 'location_update' | 'device_status';
  title: string;
  description: string;
  time: string;
  timestamp: Date;
}

export interface StatCardData {
  title: string;
  value: string;
  change?: {
    value: string;
    type: 'increase' | 'decrease';
  };
  icon: JSX.Element;
  color: 'primary' | 'secondary' | 'warning' | 'indigo';
  linkText: string;
  linkHref: string;
}

export interface QuickControlsState {
  internetAccess: boolean;
  appInstallation: boolean;
  screenTimeBonus: boolean;
}

export interface Child {
  id: number;
  name: string;
  age: number;
  deviceId: string;
}

export interface BlockedSite {
  id: number;
  url: string;
  isActive: boolean;
}

export interface LocationData {
  name: string;
  latitude: number;
  longitude: number;
  arrivalTime: string;
}

export interface BrowsingHistoryItem {
  id: number;
  url: string;
  title: string;
  timestamp: Date;
  duration: number;
}

export interface ScreenViewSession {
  id: number;
  timestamp: Date;
  imageUrl: string;
  appName: string;
}

export interface AudioSession {
  id: number;
  timestamp: Date;
  duration: number;
  recordingUrl: string;
}

export interface UserProfile {
  name: string;
  email: string;
  photoURL?: string;
}
