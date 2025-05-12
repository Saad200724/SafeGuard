import BackgroundFetch from 'react-native-background-fetch';
import { AppState, AppStateStatus } from 'react-native';
import { supabase } from '../config/supabase';

// Initialize background services
export const initBackgroundServices = async (): Promise<void> => {
  try {
    // Configure background fetch
    const status = await BackgroundFetch.configure(
      {
        minimumFetchInterval: 15, // Fetch every 15 minutes (minimum allowed)
        stopOnTerminate: false,
        startOnBoot: true,
        enableHeadless: true,
        requiredNetworkType: BackgroundFetch.NETWORK_TYPE_ANY,
        requiresBatteryNotLow: false,
        requiresCharging: false,
        requiresDeviceIdle: false,
        requiresStorageNotLow: false,
      },
      async (taskId) => {
        console.log('[BackgroundFetch] Task:', taskId);
        
        // Sync data with server
        await syncDataWithServer();
        
        // Signal completion of background task
        BackgroundFetch.finish(taskId);
      },
      (taskId) => {
        // Task timeout callback
        console.warn('[BackgroundFetch] TIMEOUT task:', taskId);
        BackgroundFetch.finish(taskId);
      }
    );

    console.log('[BackgroundFetch] configure status:', status);

    // Set up app state monitoring for foreground/background transitions
    AppState.addEventListener('change', handleAppStateChange);

    return Promise.resolve();
  } catch (error) {
    console.error('[BackgroundService] Failed to initialize:', error);
    return Promise.reject(error);
  }
};

// Handle app state changes (foreground/background)
const handleAppStateChange = (nextAppState: AppStateStatus) => {
  if (nextAppState === 'active') {
    // App came to foreground
    console.log('[AppState] App came to foreground');
    syncDataWithServer();
  } else if (nextAppState === 'background') {
    // App went to background
    console.log('[AppState] App went to background');
    // Perform any cleanup if needed
  }
};

// Sync collected data with the server
const syncDataWithServer = async (): Promise<void> => {
  try {
    // Get pending data from local storage
    const pendingData = await getPendingData();
    
    if (pendingData && pendingData.length > 0) {
      // Submit data to Supabase
      const { error } = await supabase
        .from('activities')
        .upsert(pendingData);
      
      if (error) {
        console.error('[SyncData] Error uploading data:', error);
        return;
      }
      
      // Clear synced data from local storage
      await clearSyncedData(pendingData);
    }
  } catch (error) {
    console.error('[SyncData] Error syncing data:', error);
  }
};

// Get pending data from local storage that needs to be synced
// This is a placeholder - actual implementation would use SQLite or AsyncStorage
const getPendingData = async (): Promise<any[]> => {
  // This would be replaced with actual code to fetch stored data
  return [];
};

// Clear data that has been successfully synced
// This is a placeholder - actual implementation would use SQLite or AsyncStorage
const clearSyncedData = async (syncedData: any[]): Promise<void> => {
  // This would be replaced with actual code to clear stored data
  return Promise.resolve();
};

// Clean up services when app is shutting down
export const cleanupBackgroundServices = async (): Promise<void> => {
  try {
    // Remove app state listener
    AppState.removeEventListener('change', handleAppStateChange);
    
    // Disable background fetch
    await BackgroundFetch.stop();
    
    return Promise.resolve();
  } catch (error) {
    console.error('[BackgroundService] Cleanup error:', error);
    return Promise.reject(error);
  }
};