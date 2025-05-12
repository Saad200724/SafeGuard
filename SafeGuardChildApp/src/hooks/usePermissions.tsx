import React, { createContext, useState, useEffect, useContext } from 'react';
import { Platform, Alert } from 'react-native';
import { check, request, PERMISSIONS, RESULTS, Permission } from 'react-native-permissions';

// Define permission types
export type PermissionStatus = 'granted' | 'denied' | 'unavailable' | 'checking';

export type PermissionsState = {
  location: PermissionStatus;
  camera: PermissionStatus;
  microphone: PermissionStatus;
  storage: PermissionStatus;
  usage: PermissionStatus;
  overlay: PermissionStatus;
  notifications: PermissionStatus;
  contacts: PermissionStatus;
  calendar: PermissionStatus;
};

export type PermissionsContextType = {
  permissions: PermissionsState;
  requestPermission: (permission: keyof PermissionsState) => Promise<boolean>;
  checkPermissions: () => Promise<void>;
  areAllPermissionsGranted: boolean;
  getUngrantedPermissions: () => (keyof PermissionsState)[];
};

// Create initial permissions state
const initialPermissions: PermissionsState = {
  location: 'checking',
  camera: 'checking',
  microphone: 'checking',
  storage: 'checking',
  usage: 'checking',
  overlay: 'checking',
  notifications: 'checking',
  contacts: 'checking',
  calendar: 'checking',
};

// Create permissions context
const PermissionsContext = createContext<PermissionsContextType | undefined>(undefined);

// Map permission keys to actual permission constants
const permissionMap: Record<keyof PermissionsState, Permission | null> = {
  location: Platform.OS === 'ios' 
    ? PERMISSIONS.IOS.LOCATION_ALWAYS 
    : PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION,
  camera: Platform.OS === 'ios' 
    ? PERMISSIONS.IOS.CAMERA 
    : PERMISSIONS.ANDROID.CAMERA,
  microphone: Platform.OS === 'ios' 
    ? PERMISSIONS.IOS.MICROPHONE 
    : PERMISSIONS.ANDROID.RECORD_AUDIO,
  storage: Platform.OS === 'ios' 
    ? PERMISSIONS.IOS.MEDIA_LIBRARY 
    : PERMISSIONS.ANDROID.WRITE_EXTERNAL_STORAGE,
  usage: Platform.OS === 'ios' 
    ? null  // iOS doesn't have equivalent
    : PERMISSIONS.ANDROID.PACKAGE_USAGE_STATS,
  overlay: Platform.OS === 'ios' 
    ? null  // iOS doesn't have equivalent
    : PERMISSIONS.ANDROID.SYSTEM_ALERT_WINDOW,
  notifications: Platform.OS === 'ios' 
    ? PERMISSIONS.IOS.NOTIFICATIONS 
    : PERMISSIONS.ANDROID.POST_NOTIFICATIONS,
  contacts: Platform.OS === 'ios' 
    ? PERMISSIONS.IOS.CONTACTS 
    : PERMISSIONS.ANDROID.READ_CONTACTS,
  calendar: Platform.OS === 'ios' 
    ? PERMISSIONS.IOS.CALENDARS 
    : PERMISSIONS.ANDROID.READ_CALENDAR,
};

// Provider component
export const PermissionsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [permissions, setPermissions] = useState<PermissionsState>(initialPermissions);

  // Convert RESULTS to our PermissionStatus
  const mapPermissionResult = (result: string): PermissionStatus => {
    if (result === RESULTS.GRANTED || result === RESULTS.LIMITED) return 'granted';
    if (result === RESULTS.DENIED || result === RESULTS.BLOCKED) return 'denied';
    return 'unavailable';
  };

  // Check a specific permission
  const checkPermission = async (key: keyof PermissionsState): Promise<PermissionStatus> => {
    const permission = permissionMap[key];
    if (!permission) return 'unavailable';
    
    try {
      const result = await check(permission);
      return mapPermissionResult(result);
    } catch (error) {
      console.error(`Error checking ${key} permission:`, error);
      return 'unavailable';
    }
  };

  // Check all permissions
  const checkPermissions = async () => {
    const permissionUpdates = {} as PermissionsState;
    
    for (const key of Object.keys(permissions) as Array<keyof PermissionsState>) {
      permissionUpdates[key] = await checkPermission(key);
    }
    
    setPermissions(permissionUpdates);
  };

  // Request a specific permission
  const requestPermission = async (key: keyof PermissionsState): Promise<boolean> => {
    const permission = permissionMap[key];
    if (!permission) {
      Alert.alert(
        'Permission Unavailable',
        `This permission is not available on your device type.`
      );
      return false;
    }
    
    try {
      const result = await request(permission);
      const status = mapPermissionResult(result);
      
      setPermissions(prev => ({
        ...prev,
        [key]: status,
      }));
      
      return status === 'granted';
    } catch (error) {
      console.error(`Error requesting ${key} permission:`, error);
      
      setPermissions(prev => ({
        ...prev,
        [key]: 'denied',
      }));
      
      return false;
    }
  };

  // Check if all permissions are granted
  const areAllPermissionsGranted = Object.values(permissions).every(
    status => status === 'granted' || status === 'unavailable'
  );

  // Get a list of permissions that haven't been granted
  const getUngrantedPermissions = (): (keyof PermissionsState)[] => {
    return Object.entries(permissions)
      .filter(([_, status]) => status !== 'granted' && status !== 'unavailable')
      .map(([key]) => key as keyof PermissionsState);
  };

  // Initialize permission checks
  useEffect(() => {
    checkPermissions();
  }, []);

  return (
    <PermissionsContext.Provider
      value={{
        permissions,
        requestPermission,
        checkPermissions,
        areAllPermissionsGranted,
        getUngrantedPermissions,
      }}
    >
      {children}
    </PermissionsContext.Provider>
  );
};

// Hook to use permissions context
export const usePermissions = () => {
  const context = useContext(PermissionsContext);
  if (context === undefined) {
    throw new Error('usePermissions must be used within a PermissionsProvider');
  }
  return context;
};