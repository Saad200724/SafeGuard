class Constants {
  // App info
  static const String appName = 'SafeGuard Child';
  static const String appVersion = '1.0.0';
  
  // Supabase configuration
  // These will need to be provided by user or stored securely
  static const String supabaseUrl = String.fromEnvironment('SUPABASE_URL');
  static const String supabaseAnonKey = String.fromEnvironment('SUPABASE_ANON_KEY');
  
  // API endpoints
  static const String apiBaseUrl = '/api';
  static const String activitiesEndpoint = '$apiBaseUrl/activities';
  static const String childrenEndpoint = '$apiBaseUrl/children';
  static const String deviceSettingsEndpoint = '$apiBaseUrl/device-settings';
  
  // Monitoring settings
  static const int locationUpdateIntervalMinutes = 15;
  static const int activitySyncIntervalMinutes = 30;
  static const int backgroundServiceIntervalMinutes = 15;
  
  // Storage keys
  static const String prefsKeyUserId = 'user_id';
  static const String prefsKeyDeviceId = 'device_id';
  static const String prefsKeyChildId = 'child_id';
  static const String prefsKeyIsActive = 'is_monitoring_active';
  static const String prefsKeyLastSyncTimestamp = 'last_sync_timestamp';
  
  // Feature flags
  static const bool enableLocationTracking = true;
  static const bool enableAppUsageMonitoring = true;
  static const bool enableWebHistory = true;
  static const bool enableScreenMonitoring = false; // Requires additional permissions
  static const bool enableAudioMonitoring = false;  // Requires additional permissions
  
  // Battery optimization
  static const int minBatteryLevelPercent = 15; // Reduce monitoring below this level
  static const int criticalBatteryLevelPercent = 5; // Stop monitoring below this level
  
  // Database
  static const String databaseName = 'safeguard.db';
  static const int databaseVersion = 1;
  
  // Table names
  static const String tableActivities = 'activities';
  static const String tableSettings = 'settings';
  
  // Permission related
  static const List<String> essentialPermissions = [
    'location',
    'storage',
  ];
  
  static const List<String> optionalPermissions = [
    'app_usage_stats',
    'camera',
    'microphone',
    'notifications',
  ];
}