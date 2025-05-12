import { NativeModules, Platform } from 'react-native';
import DeviceInfo from 'react-native-device-info';
import { supabase } from '../config/supabase';

// Note: This would require a native module to fully implement
// It would intercept web traffic or integrate with browser history

// Start web monitoring
export const startWebMonitoring = async (blockedSites: string[] = []): Promise<void> => {
  if (Platform.OS !== 'android') {
    console.warn('[WebService] Web monitoring is only available on Android');
    return Promise.resolve();
  }

  try {
    // This would normally call a native module to set up the monitoring
    // For example: await NativeModules.WebMonitorModule.startMonitoring(blockedSites);

    console.log('[WebService] Web monitoring started with blocked sites:', blockedSites);
    return Promise.resolve();
  } catch (error) {
    console.error('[WebService] Failed to start web monitoring:', error);
    return Promise.reject(error);
  }
};

// Stop web monitoring
export const stopWebMonitoring = async (): Promise<void> => {
  if (Platform.OS !== 'android') {
    return Promise.resolve();
  }

  try {
    // This would normally call a native module to stop the monitoring
    // For example: await NativeModules.WebMonitorModule.stopMonitoring();

    console.log('[WebService] Web monitoring stopped');
    return Promise.resolve();
  } catch (error) {
    console.error('[WebService] Failed to stop web monitoring:', error);
    return Promise.reject(error);
  }
};

// Record browsing activity
export const recordBrowsingActivity = async (
  url: string,
  title: string,
  duration: number = 0
): Promise<void> => {
  try {
    const session = await supabase.auth.getSession();
    const userId = session.data.session?.user.id;
    
    if (!userId) {
      console.error('[WebService] No user ID available');
      return;
    }

    const deviceId = await DeviceInfo.getUniqueId();
    
    // Format the browsing data
    const browsingData = {
      user_id: userId,
      device_id: deviceId,
      activity_type: 'web_browsing',
      timestamp: new Date().toISOString(),
      data: {
        url,
        title,
        duration,
      },
    };

    // Send data to Supabase
    const { error } = await supabase
      .from('activities')
      .insert([browsingData]);

    if (error) {
      console.error('[WebService] Error storing browsing data:', error);
    }
  } catch (error) {
    console.error('[WebService] Error recording browsing activity:', error);
  }
};

// Block a website
export const addBlockedSite = async (site: string): Promise<boolean> => {
  try {
    // This would call a native module to add a site to the block list
    // For example: await NativeModules.WebMonitorModule.addBlockedSite(site);
    
    // Update blocked sites in the database
    const session = await supabase.auth.getSession();
    const userId = session.data.session?.user.id;
    
    if (!userId) {
      console.error('[WebService] No user ID available');
      return false;
    }

    // Get current settings
    const { data: settings, error: fetchError } = await supabase
      .from('device_settings')
      .select('blocked_sites')
      .eq('user_id', userId)
      .single();

    if (fetchError) {
      console.error('[WebService] Error fetching settings:', fetchError);
      return false;
    }

    // Update blocked sites
    const blockedSites = settings?.blocked_sites || [];
    if (!blockedSites.includes(site)) {
      blockedSites.push(site);
    }

    // Save updated settings
    const { error: updateError } = await supabase
      .from('device_settings')
      .update({ blocked_sites: blockedSites })
      .eq('user_id', userId);

    if (updateError) {
      console.error('[WebService] Error updating blocked sites:', updateError);
      return false;
    }

    return true;
  } catch (error) {
    console.error('[WebService] Error adding blocked site:', error);
    return false;
  }
};

// Remove a website from the blocked list
export const removeBlockedSite = async (site: string): Promise<boolean> => {
  try {
    // This would call a native module to remove a site from the block list
    // For example: await NativeModules.WebMonitorModule.removeBlockedSite(site);
    
    // Update blocked sites in the database
    const session = await supabase.auth.getSession();
    const userId = session.data.session?.user.id;
    
    if (!userId) {
      console.error('[WebService] No user ID available');
      return false;
    }

    // Get current settings
    const { data: settings, error: fetchError } = await supabase
      .from('device_settings')
      .select('blocked_sites')
      .eq('user_id', userId)
      .single();

    if (fetchError) {
      console.error('[WebService] Error fetching settings:', fetchError);
      return false;
    }

    // Update blocked sites
    const blockedSites = settings?.blocked_sites || [];
    const updatedSites = blockedSites.filter(s => s !== site);

    // Save updated settings
    const { error: updateError } = await supabase
      .from('device_settings')
      .update({ blocked_sites: updatedSites })
      .eq('user_id', userId);

    if (updateError) {
      console.error('[WebService] Error updating blocked sites:', updateError);
      return false;
    }

    return true;
  } catch (error) {
    console.error('[WebService] Error removing blocked site:', error);
    return false;
  }
};