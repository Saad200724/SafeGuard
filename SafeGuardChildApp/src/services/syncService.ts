import { Platform, NativeEventEmitter, NativeModules } from 'react-native';
import BackgroundTimer from 'react-native-background-timer';
import NetInfo from '@react-native-community/netinfo';
import { supabase } from '../config/supabase';
import { db } from './databaseService';

// Sync intervals
const FOREGROUND_SYNC_INTERVAL = 2 * 60 * 1000; // 2 minutes in milliseconds
const BACKGROUND_SYNC_INTERVAL = 15 * 60 * 1000; // 15 minutes in milliseconds
const MAX_BATCH_SIZE = 50; // Maximum number of activities to sync at once

// Tracking variables
let syncTimerId: number | null = null;
let isSyncing = false;
let lastSyncTimestamp: Date | null = null;
let isAppInForeground = true;

/**
 * Service to handle syncing local data with the server
 */
export class SyncService {
  /**
   * Start the sync service
   */
  public start(): void {
    this.setupAppStateListener();
    this.scheduleSyncInterval();
    console.log('[SyncService] Started');
  }

  /**
   * Stop the sync service
   */
  public stop(): void {
    this.clearSyncInterval();
    console.log('[SyncService] Stopped');
  }

  /**
   * Set up app state listener to adjust sync interval based on foreground/background state
   */
  private setupAppStateListener(): void {
    // Handle app state changes (foreground/background)
    const appStateListener = (nextAppState: string) => {
      if (nextAppState === 'active') {
        // App came to foreground
        isAppInForeground = true;
        console.log('[SyncService] App in foreground, adjusting sync interval');
        this.scheduleSyncInterval();
        this.syncImmediately();
      } else if (nextAppState === 'background') {
        // App went to background
        isAppInForeground = false;
        console.log('[SyncService] App in background, adjusting sync interval');
        this.scheduleSyncInterval();
      }
    };

    // Set up listener based on platform
    if (Platform.OS === 'ios') {
      // iOS uses AppState events
      NativeModules.AppState.getCurrentAppState(
        ({ app_state }: { app_state: string }) => {
          isAppInForeground = app_state === 'active';
          this.scheduleSyncInterval();
        },
        (error: any) => console.error('[SyncService] Error getting app state:', error)
      );

      // Set up event emitter for app state changes
      const appStateEmitter = new NativeEventEmitter(NativeModules.AppState);
      appStateEmitter.addListener('appStateDidChange', (event: { app_state: string }) => {
        appStateListener(event.app_state);
      });
    } else {
      // Android uses Activity lifecycle events
      // This would normally be handled by a native module
      // For the purpose of this example, we'll use a dummy implementation
      isAppInForeground = true;
    }
  }

  /**
   * Schedule sync interval based on app state
   */
  private scheduleSyncInterval(): void {
    // Clear existing interval if any
    this.clearSyncInterval();

    // Set new interval based on app state
    const interval = isAppInForeground
      ? FOREGROUND_SYNC_INTERVAL
      : BACKGROUND_SYNC_INTERVAL;

    // Schedule new interval
    syncTimerId = BackgroundTimer.setInterval(() => {
      this.sync();
    }, interval);

    console.log(
      `[SyncService] Scheduled sync every ${interval / 1000} seconds (${
        isAppInForeground ? 'foreground' : 'background'
      } mode)`
    );
  }

  /**
   * Clear sync interval
   */
  private clearSyncInterval(): void {
    if (syncTimerId !== null) {
      BackgroundTimer.clearInterval(syncTimerId);
      syncTimerId = null;
    }
  }

  /**
   * Trigger an immediate sync
   */
  public async syncImmediately(): Promise<boolean> {
    console.log('[SyncService] Manual sync triggered');
    return this.sync();
  }

  /**
   * Sync local data with server
   */
  private async sync(): Promise<boolean> {
    // Prevent multiple syncs running simultaneously
    if (isSyncing) {
      console.log('[SyncService] Sync already in progress, skipping');
      return false;
    }

    // Check network connectivity
    const netInfo = await NetInfo.fetch();
    if (!netInfo.isConnected) {
      console.log('[SyncService] No network connection, skipping sync');
      return false;
    }

    isSyncing = true;

    try {
      // Get session
      const { data: sessionData } = await supabase.auth.getSession();
      if (!sessionData.session) {
        console.log('[SyncService] No active session, skipping sync');
        isSyncing = false;
        return false;
      }

      // Get unsynced activities
      const unsynced = await db.getUnsynedActivities();
      if (unsynced.length === 0) {
        console.log('[SyncService] No unsynced activities to sync');
        isSyncing = false;
        return true;
      }

      console.log(`[SyncService] Syncing ${unsynced.length} activities`);

      // Sync in batches to avoid large payloads
      let syncedCount = 0;
      const syncedIds: number[] = [];

      // Process in batches
      for (let i = 0; i < unsynced.length; i += MAX_BATCH_SIZE) {
        const batch = unsynced.slice(i, i + MAX_BATCH_SIZE);
        
        // Format for server
        const activitiesForServer = batch.map(activity => ({
          user_id: activity.user_id,
          device_id: activity.device_id,
          activity_type: activity.activity_type,
          timestamp: activity.timestamp,
          data: activity.data,
          priority: activity.priority,
        }));

        // Send to server
        const { error } = await supabase
          .from('activities')
          .upsert(activitiesForServer);

        if (error) {
          console.error('[SyncService] Error syncing batch:', error);
          continue;
        }

        // Mark successful batch as synced locally
        const batchIds = batch.map(a => a.id!);
        syncedIds.push(...batchIds);
        syncedCount += batch.length;
      }

      // Update synced status in local database
      if (syncedIds.length > 0) {
        await db.markActivitiesAsSynced(syncedIds);
      }

      console.log(`[SyncService] Successfully synced ${syncedCount}/${unsynced.length} activities`);
      
      // Update last sync timestamp
      lastSyncTimestamp = new Date();
      
      isSyncing = false;
      return syncedCount > 0;
    } catch (error) {
      console.error('[SyncService] Error during sync:', error);
      isSyncing = false;
      return false;
    }
  }

  /**
   * Get last sync timestamp
   */
  public getLastSyncTimestamp(): Date | null {
    return lastSyncTimestamp;
  }

  /**
   * Check if sync is currently in progress
   */
  public isSyncing(): boolean {
    return isSyncing;
  }
}

// Create and export a singleton instance
export const syncService = new SyncService();