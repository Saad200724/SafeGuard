import SQLite from 'react-native-sqlite-storage';
import DeviceInfo from 'react-native-device-info';

// Enable promises and set debugging mode
SQLite.enablePromise(true);
SQLite.DEBUG(false); // Set to true for debugging in development

// Database configuration
const DATABASE = {
  name: 'safeguard.db',
  location: 'default',
};

// Activity types
export type ActivityType = 
  | 'location'
  | 'app_usage'
  | 'web_browsing'
  | 'screenshot'
  | 'audio_sample'
  | 'check_in'
  | 'emergency'
  | 'system';

// Activity data
export interface Activity {
  id?: number;
  user_id: string;
  device_id: string;
  activity_type: ActivityType;
  timestamp: string;
  data: any;
  synced: boolean;
  priority?: 'low' | 'medium' | 'high';
}

// Blocked site data
export interface BlockedSite {
  id?: number;
  site_url: string;
  is_active: boolean;
}

// Device settings
export interface DeviceSettings {
  id?: number;
  location_enabled: boolean;
  usage_enabled: boolean;
  screen_enabled: boolean;
  audio_enabled: boolean;
  web_enabled: boolean;
  time_restriction_enabled: boolean;
  time_restriction_start: number;
  time_restriction_end: number;
  last_updated: string;
}

/**
 * Database service to handle local SQLite operations
 */
export class DatabaseService {
  private database: SQLite.SQLiteDatabase | null = null;
  private initialized: boolean = false;

  /**
   * Initialize the database
   */
  public async init(): Promise<void> {
    try {
      this.database = await SQLite.openDatabase(DATABASE);
      
      // Create tables if they don't exist
      await this.createTables();
      
      this.initialized = true;
      console.log('[DatabaseService] Database initialized successfully');
    } catch (error) {
      console.error('[DatabaseService] Error initializing database:', error);
      throw error;
    }
  }

  /**
   * Create database tables
   */
  private async createTables(): Promise<void> {
    if (!this.database) {
      throw new Error('Database not initialized');
    }

    try {
      // Activities table
      await this.database.executeSql(`
        CREATE TABLE IF NOT EXISTS activities (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          user_id TEXT NOT NULL,
          device_id TEXT NOT NULL,
          activity_type TEXT NOT NULL,
          timestamp TEXT NOT NULL,
          data TEXT NOT NULL,
          synced INTEGER NOT NULL DEFAULT 0,
          priority TEXT
        )
      `);

      // Blocked sites table
      await this.database.executeSql(`
        CREATE TABLE IF NOT EXISTS blocked_sites (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          site_url TEXT NOT NULL UNIQUE,
          is_active INTEGER NOT NULL DEFAULT 1
        )
      `);

      // Device settings table
      await this.database.executeSql(`
        CREATE TABLE IF NOT EXISTS device_settings (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          location_enabled INTEGER NOT NULL DEFAULT 1,
          usage_enabled INTEGER NOT NULL DEFAULT 1,
          screen_enabled INTEGER NOT NULL DEFAULT 0,
          audio_enabled INTEGER NOT NULL DEFAULT 0,
          web_enabled INTEGER NOT NULL DEFAULT 1,
          time_restriction_enabled INTEGER NOT NULL DEFAULT 0,
          time_restriction_start INTEGER NOT NULL DEFAULT 22,
          time_restriction_end INTEGER NOT NULL DEFAULT 7,
          last_updated TEXT NOT NULL
        )
      `);

      // Create indexes for faster queries
      await this.database.executeSql(
        'CREATE INDEX IF NOT EXISTS idx_activities_user_id ON activities (user_id)'
      );
      await this.database.executeSql(
        'CREATE INDEX IF NOT EXISTS idx_activities_synced ON activities (synced)'
      );
      await this.database.executeSql(
        'CREATE INDEX IF NOT EXISTS idx_activities_timestamp ON activities (timestamp)'
      );
    } catch (error) {
      console.error('[DatabaseService] Error creating tables:', error);
      throw error;
    }
  }

  /**
   * Insert a new activity into the database
   */
  public async addActivity(activity: Omit<Activity, 'id'>): Promise<number> {
    if (!this.database) {
      await this.init();
    }

    if (!this.database) {
      throw new Error('Database not initialized');
    }

    try {
      const [result] = await this.database.executeSql(
        `INSERT INTO activities (
          user_id, device_id, activity_type, timestamp, data, synced, priority
        ) VALUES (?, ?, ?, ?, ?, ?, ?)`,
        [
          activity.user_id,
          activity.device_id,
          activity.activity_type,
          activity.timestamp,
          JSON.stringify(activity.data),
          activity.synced ? 1 : 0,
          activity.priority || 'medium',
        ]
      );

      return result.insertId!;
    } catch (error) {
      console.error('[DatabaseService] Error adding activity:', error);
      throw error;
    }
  }

  /**
   * Get activities that haven't been synced with the server
   */
  public async getUnsynedActivities(): Promise<Activity[]> {
    if (!this.database) {
      await this.init();
    }

    if (!this.database) {
      throw new Error('Database not initialized');
    }

    try {
      const [result] = await this.database.executeSql(
        'SELECT * FROM activities WHERE synced = 0 ORDER BY timestamp ASC'
      );

      const activities: Activity[] = [];
      for (let i = 0; i < result.rows.length; i++) {
        const row = result.rows.item(i);
        activities.push({
          id: row.id,
          user_id: row.user_id,
          device_id: row.device_id,
          activity_type: row.activity_type as ActivityType,
          timestamp: row.timestamp,
          data: JSON.parse(row.data),
          synced: Boolean(row.synced),
          priority: row.priority as 'low' | 'medium' | 'high',
        });
      }

      return activities;
    } catch (error) {
      console.error('[DatabaseService] Error getting unsynced activities:', error);
      throw error;
    }
  }

  /**
   * Mark activities as synced
   */
  public async markActivitiesAsSynced(ids: number[]): Promise<void> {
    if (!this.database) {
      await this.init();
    }

    if (!this.database) {
      throw new Error('Database not initialized');
    }

    if (ids.length === 0) {
      return;
    }

    try {
      const placeholders = ids.map(() => '?').join(',');
      await this.database.executeSql(
        `UPDATE activities SET synced = 1 WHERE id IN (${placeholders})`,
        ids
      );
    } catch (error) {
      console.error('[DatabaseService] Error marking activities as synced:', error);
      throw error;
    }
  }

  /**
   * Get activities by type
   */
  public async getActivitiesByType(
    type: ActivityType,
    limit: number = 50
  ): Promise<Activity[]> {
    if (!this.database) {
      await this.init();
    }

    if (!this.database) {
      throw new Error('Database not initialized');
    }

    try {
      const [result] = await this.database.executeSql(
        'SELECT * FROM activities WHERE activity_type = ? ORDER BY timestamp DESC LIMIT ?',
        [type, limit]
      );

      const activities: Activity[] = [];
      for (let i = 0; i < result.rows.length; i++) {
        const row = result.rows.item(i);
        activities.push({
          id: row.id,
          user_id: row.user_id,
          device_id: row.device_id,
          activity_type: row.activity_type as ActivityType,
          timestamp: row.timestamp,
          data: JSON.parse(row.data),
          synced: Boolean(row.synced),
          priority: row.priority as 'low' | 'medium' | 'high',
        });
      }

      return activities;
    } catch (error) {
      console.error('[DatabaseService] Error getting activities by type:', error);
      throw error;
    }
  }

  /**
   * Get all blocked sites
   */
  public async getBlockedSites(): Promise<BlockedSite[]> {
    if (!this.database) {
      await this.init();
    }

    if (!this.database) {
      throw new Error('Database not initialized');
    }

    try {
      const [result] = await this.database.executeSql(
        'SELECT * FROM blocked_sites WHERE is_active = 1'
      );

      const blockedSites: BlockedSite[] = [];
      for (let i = 0; i < result.rows.length; i++) {
        const row = result.rows.item(i);
        blockedSites.push({
          id: row.id,
          site_url: row.site_url,
          is_active: Boolean(row.is_active),
        });
      }

      return blockedSites;
    } catch (error) {
      console.error('[DatabaseService] Error getting blocked sites:', error);
      throw error;
    }
  }

  /**
   * Add a blocked site
   */
  public async addBlockedSite(siteUrl: string): Promise<number> {
    if (!this.database) {
      await this.init();
    }

    if (!this.database) {
      throw new Error('Database not initialized');
    }

    try {
      const [result] = await this.database.executeSql(
        'INSERT OR REPLACE INTO blocked_sites (site_url, is_active) VALUES (?, 1)',
        [siteUrl]
      );

      return result.insertId!;
    } catch (error) {
      console.error('[DatabaseService] Error adding blocked site:', error);
      throw error;
    }
  }

  /**
   * Remove a blocked site
   */
  public async removeBlockedSite(siteUrl: string): Promise<void> {
    if (!this.database) {
      await this.init();
    }

    if (!this.database) {
      throw new Error('Database not initialized');
    }

    try {
      await this.database.executeSql(
        'UPDATE blocked_sites SET is_active = 0 WHERE site_url = ?',
        [siteUrl]
      );
    } catch (error) {
      console.error('[DatabaseService] Error removing blocked site:', error);
      throw error;
    }
  }

  /**
   * Get device settings
   */
  public async getDeviceSettings(): Promise<DeviceSettings | null> {
    if (!this.database) {
      await this.init();
    }

    if (!this.database) {
      throw new Error('Database not initialized');
    }

    try {
      const [result] = await this.database.executeSql(
        'SELECT * FROM device_settings ORDER BY id DESC LIMIT 1'
      );

      if (result.rows.length === 0) {
        // No settings found, create default settings
        const deviceId = await DeviceInfo.getUniqueId();
        const defaultSettings: Omit<DeviceSettings, 'id'> = {
          location_enabled: true,
          usage_enabled: true,
          screen_enabled: false,
          audio_enabled: false,
          web_enabled: true,
          time_restriction_enabled: false,
          time_restriction_start: 22,
          time_restriction_end: 7,
          last_updated: new Date().toISOString(),
        };

        const id = await this.updateDeviceSettings(defaultSettings);
        return { id, ...defaultSettings };
      }

      const row = result.rows.item(0);
      return {
        id: row.id,
        location_enabled: Boolean(row.location_enabled),
        usage_enabled: Boolean(row.usage_enabled),
        screen_enabled: Boolean(row.screen_enabled),
        audio_enabled: Boolean(row.audio_enabled),
        web_enabled: Boolean(row.web_enabled),
        time_restriction_enabled: Boolean(row.time_restriction_enabled),
        time_restriction_start: row.time_restriction_start,
        time_restriction_end: row.time_restriction_end,
        last_updated: row.last_updated,
      };
    } catch (error) {
      console.error('[DatabaseService] Error getting device settings:', error);
      throw error;
    }
  }

  /**
   * Update device settings
   */
  public async updateDeviceSettings(
    settings: Omit<DeviceSettings, 'id'>
  ): Promise<number> {
    if (!this.database) {
      await this.init();
    }

    if (!this.database) {
      throw new Error('Database not initialized');
    }

    try {
      const [result] = await this.database.executeSql(
        `INSERT INTO device_settings (
          location_enabled, usage_enabled, screen_enabled, audio_enabled, web_enabled,
          time_restriction_enabled, time_restriction_start, time_restriction_end, last_updated
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          settings.location_enabled ? 1 : 0,
          settings.usage_enabled ? 1 : 0,
          settings.screen_enabled ? 1 : 0,
          settings.audio_enabled ? 1 : 0,
          settings.web_enabled ? 1 : 0,
          settings.time_restriction_enabled ? 1 : 0,
          settings.time_restriction_start,
          settings.time_restriction_end,
          settings.last_updated,
        ]
      );

      return result.insertId!;
    } catch (error) {
      console.error('[DatabaseService] Error updating device settings:', error);
      throw error;
    }
  }

  /**
   * Close the database connection
   */
  public async close(): Promise<void> {
    if (this.database) {
      await this.database.close();
      this.database = null;
      this.initialized = false;
    }
  }
}

// Create and export a singleton instance
export const db = new DatabaseService();