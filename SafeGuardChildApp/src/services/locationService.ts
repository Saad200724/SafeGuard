import Geolocation from '@react-native-community/geolocation';
import { supabase } from '../config/supabase';
import DeviceInfo from 'react-native-device-info';

// Configuration options
const LOCATION_INTERVAL = 5 * 60 * 1000; // 5 minutes in milliseconds
let watchId: number | null = null;

// Start tracking location
export const startLocationTracking = (): Promise<void> => {
  return new Promise((resolve, reject) => {
    try {
      // Clear any existing watch
      if (watchId !== null) {
        Geolocation.clearWatch(watchId);
      }

      // Set up location tracking
      watchId = Geolocation.watchPosition(
        position => {
          const { latitude, longitude, speed, heading, accuracy, altitude } = position.coords;
          const timestamp = position.timestamp;
          
          // Store the location data
          storeLocationData({
            latitude,
            longitude,
            speed: speed || 0,
            heading: heading || 0,
            accuracy: accuracy || 0,
            altitude: altitude || 0,
            timestamp,
          });
        },
        error => {
          console.error('[LocationService] Error watching position:', error);
        },
        {
          enableHighAccuracy: true,
          distanceFilter: 100, // meters
          interval: LOCATION_INTERVAL,
          fastestInterval: LOCATION_INTERVAL / 2,
        }
      );

      // Also get immediate position once
      Geolocation.getCurrentPosition(
        position => {
          const { latitude, longitude } = position.coords;
          const timestamp = position.timestamp;
          
          // Store the location data
          storeLocationData({
            latitude,
            longitude,
            speed: 0,
            heading: 0,
            accuracy: position.coords.accuracy || 0,
            altitude: position.coords.altitude || 0,
            timestamp,
          });
          
          resolve();
        },
        error => {
          console.error('[LocationService] Error getting current position:', error);
          // Resolve anyway as we've still set up the watch
          resolve();
        },
        {
          enableHighAccuracy: true,
          timeout: 15000,
          maximumAge: 10000,
        }
      );
    } catch (error) {
      reject(error);
    }
  });
};

// Store location data
const storeLocationData = async (locationData: {
  latitude: number;
  longitude: number;
  speed: number;
  heading: number;
  accuracy: number;
  altitude: number;
  timestamp: number;
}): Promise<void> => {
  try {
    const session = await supabase.auth.getSession();
    const userId = session.data.session?.user.id;
    
    if (!userId) {
      console.error('[LocationService] No user ID available');
      return;
    }

    const deviceId = await DeviceInfo.getUniqueId();
    
    // Format the data for the database
    const activityData = {
      user_id: userId,
      device_id: deviceId,
      activity_type: 'location',
      timestamp: new Date(locationData.timestamp).toISOString(),
      data: {
        latitude: locationData.latitude,
        longitude: locationData.longitude,
        speed: locationData.speed,
        heading: locationData.heading,
        accuracy: locationData.accuracy,
        altitude: locationData.altitude,
      },
    };

    // Send data to Supabase
    const { error } = await supabase
      .from('activities')
      .insert([activityData]);

    if (error) {
      console.error('[LocationService] Error storing location data:', error);
    }
  } catch (error) {
    console.error('[LocationService] Error in storeLocationData:', error);
  }
};

// Stop tracking location
export const stopLocationTracking = (): Promise<void> => {
  return new Promise((resolve) => {
    if (watchId !== null) {
      Geolocation.clearWatch(watchId);
      watchId = null;
    }
    resolve();
  });
};