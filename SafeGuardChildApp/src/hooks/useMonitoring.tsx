import React, { createContext, useState, useEffect, useContext } from 'react';
import { Alert } from 'react-native';
import { supabase } from '../config/supabase';
import { useAuth } from './useAuth';
import { usePermissions } from './usePermissions';
import { startLocationTracking, stopLocationTracking } from '../services/locationService';
import { startUsageTracking, stopUsageTracking } from '../services/usageService';
import { startScreenCapture, stopScreenCapture } from '../services/screenService';
import { startAudioMonitoring, stopAudioMonitoring } from '../services/audioService';
import { startWebMonitoring, stopWebMonitoring } from '../services/webService';

// Define monitoring service types
export type MonitoringService = 
  | 'location' 
  | 'usage' 
  | 'screen' 
  | 'audio' 
  | 'web';

export interface MonitoringSettings {
  location: boolean;
  usage: boolean;
  screen: boolean;
  audio: boolean;
  web: boolean;
  time_restrictions: {
    enabled: boolean;
    start_hour: number;
    end_hour: number;
  };
  blocked_sites: string[];
  blocked_apps: string[];
}

type MonitoringContextType = {
  isMonitoring: boolean;
  settings: MonitoringSettings;
  activeServices: MonitoringService[];
  startMonitoring: () => Promise<boolean>;
  stopMonitoring: () => Promise<void>;
  toggleService: (service: MonitoringService) => Promise<void>;
  updateSettings: (newSettings: Partial<MonitoringSettings>) => Promise<void>;
  refreshSettings: () => Promise<void>;
};

// Define default monitoring settings
const defaultSettings: MonitoringSettings = {
  location: true,
  usage: true,
  screen: false,
  audio: false,
  web: true,
  time_restrictions: {
    enabled: false,
    start_hour: 22, // 10 PM
    end_hour: 7, // 7 AM
  },
  blocked_sites: [],
  blocked_apps: [],
};

// Create monitoring context
const MonitoringContext = createContext<MonitoringContextType | undefined>(undefined);

// Provider component
export const MonitoringProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useAuth();
  const { permissions, areAllPermissionsGranted } = usePermissions();
  
  const [isMonitoring, setIsMonitoring] = useState(false);
  const [settings, setSettings] = useState<MonitoringSettings>(defaultSettings);
  const [activeServices, setActiveServices] = useState<MonitoringService[]>([]);

  // Fetch settings from Supabase
  const fetchSettings = async (): Promise<MonitoringSettings | null> => {
    if (!user) return null;
    
    try {
      const { data, error } = await supabase
        .from('device_settings')
        .select('*')
        .eq('device_id', user.id)
        .single();
      
      if (error) throw error;
      
      return data as MonitoringSettings || defaultSettings;
    } catch (error) {
      console.error('Error fetching monitoring settings:', error);
      return null;
    }
  };

  // Update settings in Supabase
  const saveSettings = async (updatedSettings: MonitoringSettings): Promise<void> => {
    if (!user) return;
    
    try {
      const { error } = await supabase
        .from('device_settings')
        .upsert({
          device_id: user.id,
          ...updatedSettings,
        });
      
      if (error) throw error;
    } catch (error) {
      console.error('Error saving monitoring settings:', error);
    }
  };

  // Refresh settings from server
  const refreshSettings = async (): Promise<void> => {
    const fetchedSettings = await fetchSettings();
    if (fetchedSettings) {
      setSettings(fetchedSettings);
    }
  };

  // Start a specific monitoring service
  const startService = async (service: MonitoringService): Promise<boolean> => {
    try {
      switch (service) {
        case 'location':
          if (permissions.location !== 'granted') return false;
          await startLocationTracking();
          break;
        case 'usage':
          if (permissions.usage !== 'granted') return false;
          await startUsageTracking();
          break;
        case 'screen':
          if (permissions.overlay !== 'granted') return false;
          await startScreenCapture();
          break;
        case 'audio':
          if (permissions.microphone !== 'granted') return false;
          await startAudioMonitoring();
          break;
        case 'web':
          await startWebMonitoring(settings.blocked_sites);
          break;
      }
      
      setActiveServices(prev => 
        prev.includes(service) ? prev : [...prev, service]
      );
      
      return true;
    } catch (error) {
      console.error(`Error starting ${service} service:`, error);
      return false;
    }
  };

  // Stop a specific monitoring service
  const stopService = async (service: MonitoringService): Promise<void> => {
    try {
      switch (service) {
        case 'location':
          await stopLocationTracking();
          break;
        case 'usage':
          await stopUsageTracking();
          break;
        case 'screen':
          await stopScreenCapture();
          break;
        case 'audio':
          await stopAudioMonitoring();
          break;
        case 'web':
          await stopWebMonitoring();
          break;
      }
      
      setActiveServices(prev => 
        prev.filter(s => s !== service)
      );
    } catch (error) {
      console.error(`Error stopping ${service} service:`, error);
    }
  };

  // Start all enabled monitoring services
  const startMonitoring = async (): Promise<boolean> => {
    if (!user) {
      Alert.alert('Error', 'You must be logged in to start monitoring');
      return false;
    }
    
    if (!areAllPermissionsGranted) {
      Alert.alert(
        'Missing Permissions', 
        'Some required permissions are not granted. Please go to settings and grant all required permissions.'
      );
      return false;
    }
    
    try {
      const servicePromises = [];
      
      if (settings.location) servicePromises.push(startService('location'));
      if (settings.usage) servicePromises.push(startService('usage'));
      if (settings.screen) servicePromises.push(startService('screen'));
      if (settings.audio) servicePromises.push(startService('audio'));
      if (settings.web) servicePromises.push(startService('web'));
      
      const results = await Promise.all(servicePromises);
      const allSucceeded = results.every(result => result);
      
      setIsMonitoring(allSucceeded);
      return allSucceeded;
    } catch (error) {
      console.error('Error starting monitoring:', error);
      return false;
    }
  };

  // Stop all monitoring services
  const stopMonitoring = async (): Promise<void> => {
    try {
      await Promise.all(
        activeServices.map(service => stopService(service))
      );
      
      setIsMonitoring(false);
    } catch (error) {
      console.error('Error stopping monitoring:', error);
    }
  };

  // Toggle a specific service
  const toggleService = async (service: MonitoringService): Promise<void> => {
    const updatedSettings = { ...settings };
    
    updatedSettings[service] = !settings[service];
    setSettings(updatedSettings);
    
    // If service is active, stop it; otherwise start it if monitoring is active
    if (activeServices.includes(service)) {
      await stopService(service);
    } else if (isMonitoring && updatedSettings[service]) {
      await startService(service);
    }
    
    await saveSettings(updatedSettings);
  };

  // Update settings
  const updateSettings = async (newSettings: Partial<MonitoringSettings>): Promise<void> => {
    const updatedSettings = { ...settings, ...newSettings };
    setSettings(updatedSettings);
    
    // If monitoring is active, restart affected services
    if (isMonitoring) {
      // Handle service changes
      for (const service of ['location', 'usage', 'screen', 'audio', 'web'] as MonitoringService[]) {
        const wasActive = settings[service];
        const shouldBeActive = updatedSettings[service];
        
        if (wasActive && !shouldBeActive) {
          await stopService(service);
        } else if (!wasActive && shouldBeActive) {
          await startService(service);
        } else if (service === 'web' && newSettings.blocked_sites) {
          // Restart web monitoring if blocked sites changed
          await stopService('web');
          await startService('web');
        }
      }
    }
    
    await saveSettings(updatedSettings);
  };

  // Initialize settings when user changes
  useEffect(() => {
    if (user) {
      refreshSettings();
    } else {
      setIsMonitoring(false);
      setActiveServices([]);
      setSettings(defaultSettings);
    }
  }, [user]);

  // Auto-start monitoring when settings change (if was previously monitoring)
  useEffect(() => {
    if (isMonitoring) {
      startMonitoring();
    }
  }, [settings]);

  return (
    <MonitoringContext.Provider
      value={{
        isMonitoring,
        settings,
        activeServices,
        startMonitoring,
        stopMonitoring,
        toggleService,
        updateSettings,
        refreshSettings,
      }}
    >
      {children}
    </MonitoringContext.Provider>
  );
};

// Hook to use monitoring context
export const useMonitoring = () => {
  const context = useContext(MonitoringContext);
  if (context === undefined) {
    throw new Error('useMonitoring must be used within a MonitoringProvider');
  }
  return context;
};