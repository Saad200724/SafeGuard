import 'dart:async';
import 'dart:io';
import 'package:flutter/foundation.dart';
import 'package:shared_preferences/shared_preferences.dart';
import 'package:geolocator/geolocator.dart';
import 'package:device_info_plus/device_info_plus.dart';
import 'package:battery_plus/battery_plus.dart';
import 'package:permission_handler/permission_handler.dart';

import '../utils/constants.dart';
import 'auth_service.dart';
import 'permission_service.dart';
import 'storage_service.dart';

class MonitoringService with ChangeNotifier {
  final AuthService authService;
  final PermissionService permissionService;
  final StorageService storageService;
  
  bool _isMonitoringActive = false;
  bool _isLocationTrackingEnabled = false;
  bool _isAppUsageMonitoringEnabled = false;
  bool _isWebHistoryMonitoringEnabled = false;
  bool _isScreenMonitoringEnabled = false;
  bool _isAudioMonitoringEnabled = false;
  
  Position? _lastKnownLocation;
  int _batteryLevel = 100;
  bool _isCharging = false;
  
  Timer? _monitoringTimer;
  final Battery _battery = Battery();
  
  // Getters
  bool get isMonitoringActive => _isMonitoringActive;
  bool get isLocationTrackingEnabled => _isLocationTrackingEnabled;
  bool get isAppUsageMonitoringEnabled => _isAppUsageMonitoringEnabled;
  bool get isWebHistoryMonitoringEnabled => _isWebHistoryMonitoringEnabled;
  bool get isScreenMonitoringEnabled => _isScreenMonitoringEnabled;
  bool get isAudioMonitoringEnabled => _isAudioMonitoringEnabled;
  Position? get lastKnownLocation => _lastKnownLocation;
  int get batteryLevel => _batteryLevel;
  bool get isCharging => _isCharging;
  
  // Constructor
  MonitoringService({
    required this.authService,
    required this.permissionService,
    required this.storageService,
  }) {
    _init();
  }
  
  // Initialize the service
  Future<void> _init() async {
    // Load saved settings
    _loadSettings();
    
    // Start battery monitoring
    _startBatteryMonitoring();
    
    // Set up monitoring timer
    _setupMonitoringTimer();
  }
  
  // Load saved settings
  Future<void> _loadSettings() async {
    try {
      _isMonitoringActive = storageService.getBool(Constants.prefsKeyIsActive) ?? true;
      
      _isLocationTrackingEnabled = 
          storageService.getBool('location_tracking_enabled') ?? Constants.enableLocationTracking;
          
      _isAppUsageMonitoringEnabled = 
          storageService.getBool('app_usage_monitoring_enabled') ?? Constants.enableAppUsageMonitoring;
          
      _isWebHistoryMonitoringEnabled = 
          storageService.getBool('web_history_monitoring_enabled') ?? Constants.enableWebHistory;
          
      _isScreenMonitoringEnabled = 
          storageService.getBool('screen_monitoring_enabled') ?? Constants.enableScreenMonitoring;
          
      _isAudioMonitoringEnabled = 
          storageService.getBool('audio_monitoring_enabled') ?? Constants.enableAudioMonitoring;
      
      notifyListeners();
      
      // If monitoring is active, request permissions and start
      if (_isMonitoringActive) {
        await _requestPermissions();
        _startMonitoring();
      }
    } catch (e) {
      debugPrint('Error loading settings: $e');
    }
  }
  
  // Start battery monitoring
  void _startBatteryMonitoring() {
    // Get initial battery level
    _battery.batteryLevel.then((level) {
      _batteryLevel = level;
      notifyListeners();
    });
    
    // Get initial charging state
    _battery.batteryState.then((state) {
      _isCharging = state == BatteryState.charging || state == BatteryState.full;
      notifyListeners();
    });
    
    // Listen for battery level changes
    _battery.onBatteryStateChanged.listen((state) {
      _isCharging = state == BatteryState.charging || state == BatteryState.full;
      notifyListeners();
      
      // Adjust monitoring frequency based on battery level and charging state
      _adjustMonitoringFrequency();
    });
  }
  
  // Set up monitoring timer
  void _setupMonitoringTimer() {
    // Cancel existing timer if any
    _monitoringTimer?.cancel();
    
    // Create new timer
    _monitoringTimer = Timer.periodic(
      const Duration(minutes: Constants.backgroundServiceIntervalMinutes),
      (_) => _monitoringTask(),
    );
  }
  
  // Adjust monitoring frequency based on battery level and charging state
  void _adjustMonitoringFrequency() {
    // If battery is critical, reduce monitoring frequency
    if (_batteryLevel <= Constants.criticalBatteryLevelPercent && !_isCharging) {
      debugPrint('Critical battery level, reducing monitoring frequency');
      _monitoringTimer?.cancel();
      _monitoringTimer = Timer.periodic(
        const Duration(minutes: Constants.backgroundServiceIntervalMinutes * 3),
        (_) => _monitoringTask(),
      );
    }
    // If battery is low, reduce monitoring frequency
    else if (_batteryLevel <= Constants.minBatteryLevelPercent && !_isCharging) {
      debugPrint('Low battery level, reducing monitoring frequency');
      _monitoringTimer?.cancel();
      _monitoringTimer = Timer.periodic(
        const Duration(minutes: Constants.backgroundServiceIntervalMinutes * 2),
        (_) => _monitoringTask(),
      );
    }
    // Otherwise, use normal frequency
    else {
      debugPrint('Normal battery level, using standard monitoring frequency');
      _monitoringTimer?.cancel();
      _monitoringTimer = Timer.periodic(
        const Duration(minutes: Constants.backgroundServiceIntervalMinutes),
        (_) => _monitoringTask(),
      );
    }
  }
  
  // Request necessary permissions
  Future<void> _requestPermissions() async {
    if (_isLocationTrackingEnabled) {
      await permissionService.requestLocationPermission();
    }
    
    if (_isAppUsageMonitoringEnabled) {
      await permissionService.requestUsageStatsPermission();
    }
    
    if (_isScreenMonitoringEnabled) {
      await permissionService.requestScreenCapturePermission();
    }
    
    if (_isAudioMonitoringEnabled) {
      await permissionService.requestMicrophonePermission();
    }
  }
  
  // Start monitoring
  void _startMonitoring() async {
    if (!_isMonitoringActive) return;
    
    try {
      // Get device info
      final deviceInfo = await DeviceInfoPlugin().androidInfo;
      final deviceId = deviceInfo.id;
      
      // Save device ID
      await storageService.setString(Constants.prefsKeyDeviceId, deviceId);
      
      // Start location tracking if enabled
      if (_isLocationTrackingEnabled && 
          await permissionService.checkLocationPermission()) {
        _startLocationTracking();
      }
      
      // Start app usage monitoring if enabled
      if (_isAppUsageMonitoringEnabled && 
          await permissionService.checkUsageStatsPermission()) {
        _startAppUsageMonitoring();
      }
      
      // Start web history monitoring if enabled
      if (_isWebHistoryMonitoringEnabled) {
        _startWebHistoryMonitoring();
      }
      
      // Start screen monitoring if enabled
      if (_isScreenMonitoringEnabled && 
          await permissionService.checkScreenCapturePermission()) {
        _startScreenMonitoring();
      }
      
      // Start audio monitoring if enabled
      if (_isAudioMonitoringEnabled && 
          await permissionService.checkMicrophonePermission()) {
        _startAudioMonitoring();
      }
      
      debugPrint('Monitoring started');
    } catch (e) {
      debugPrint('Error starting monitoring: $e');
    }
  }
  
  // Stop monitoring
  void _stopMonitoring() {
    try {
      // Stop location tracking
      _stopLocationTracking();
      
      // Stop app usage monitoring
      _stopAppUsageMonitoring();
      
      // Stop web history monitoring
      _stopWebHistoryMonitoring();
      
      // Stop screen monitoring
      _stopScreenMonitoring();
      
      // Stop audio monitoring
      _stopAudioMonitoring();
      
      debugPrint('Monitoring stopped');
    } catch (e) {
      debugPrint('Error stopping monitoring: $e');
    }
  }
  
  // Monitoring task
  void _monitoringTask() async {
    if (!_isMonitoringActive || !authService.isAuthenticated) return;
    
    try {
      // Update battery level
      _batteryLevel = await _battery.batteryLevel;
      
      // Check battery level
      if (_batteryLevel <= Constants.criticalBatteryLevelPercent && !_isCharging) {
        // Critical battery level, stop monitoring
        setMonitoringActive(false);
        return;
      }
      
      // Perform monitoring tasks
      if (_isLocationTrackingEnabled && 
          await permissionService.checkLocationPermission()) {
        await _updateLocation();
      }
      
      if (_isAppUsageMonitoringEnabled && 
          await permissionService.checkUsageStatsPermission()) {
        await _collectAppUsageStats();
      }
      
      if (_isWebHistoryMonitoringEnabled) {
        await _collectWebHistory();
      }
      
      if (_isScreenMonitoringEnabled && 
          await permissionService.checkScreenCapturePermission()) {
        await _captureScreen();
      }
      
      if (_isAudioMonitoringEnabled && 
          await permissionService.checkMicrophonePermission()) {
        await _recordAudio();
      }
      
      // Sync data with server
      // await _syncData();
      
      notifyListeners();
    } catch (e) {
      debugPrint('Error in monitoring task: $e');
    }
  }
  
  // Update location
  Future<void> _updateLocation() async {
    try {
      final position = await Geolocator.getCurrentPosition();
      _lastKnownLocation = position;
      
      debugPrint('Location updated: ${position.latitude}, ${position.longitude}');
      
      // Save to storage or send to server
      // ...
      
      notifyListeners();
    } catch (e) {
      debugPrint('Error updating location: $e');
    }
  }
  
  // Collect app usage stats
  Future<void> _collectAppUsageStats() async {
    try {
      // Use app_usage package to get app usage stats
      // ...
      
      debugPrint('App usage stats collected');
    } catch (e) {
      debugPrint('Error collecting app usage stats: $e');
    }
  }
  
  // Collect web history
  Future<void> _collectWebHistory() async {
    try {
      // Collect web history
      // This would require deeper integration with the browser
      // ...
      
      debugPrint('Web history collected');
    } catch (e) {
      debugPrint('Error collecting web history: $e');
    }
  }
  
  // Capture screen
  Future<void> _captureScreen() async {
    try {
      // Capture screen
      // This requires specific implementation for the platform
      // ...
      
      debugPrint('Screen captured');
    } catch (e) {
      debugPrint('Error capturing screen: $e');
    }
  }
  
  // Record audio
  Future<void> _recordAudio() async {
    try {
      // Record audio
      // This requires specific implementation for the platform
      // ...
      
      debugPrint('Audio recorded');
    } catch (e) {
      debugPrint('Error recording audio: $e');
    }
  }
  
  // Start location tracking
  void _startLocationTracking() {
    debugPrint('Location tracking started');
  }
  
  // Stop location tracking
  void _stopLocationTracking() {
    debugPrint('Location tracking stopped');
  }
  
  // Start app usage monitoring
  void _startAppUsageMonitoring() {
    debugPrint('App usage monitoring started');
  }
  
  // Stop app usage monitoring
  void _stopAppUsageMonitoring() {
    debugPrint('App usage monitoring stopped');
  }
  
  // Start web history monitoring
  void _startWebHistoryMonitoring() {
    debugPrint('Web history monitoring started');
  }
  
  // Stop web history monitoring
  void _stopWebHistoryMonitoring() {
    debugPrint('Web history monitoring stopped');
  }
  
  // Start screen monitoring
  void _startScreenMonitoring() {
    debugPrint('Screen monitoring started');
  }
  
  // Stop screen monitoring
  void _stopScreenMonitoring() {
    debugPrint('Screen monitoring stopped');
  }
  
  // Start audio monitoring
  void _startAudioMonitoring() {
    debugPrint('Audio monitoring started');
  }
  
  // Stop audio monitoring
  void _stopAudioMonitoring() {
    debugPrint('Audio monitoring stopped');
  }
  
  // Set monitoring active
  Future<void> setMonitoringActive(bool active) async {
    _isMonitoringActive = active;
    
    await storageService.setBool(Constants.prefsKeyIsActive, active);
    
    if (active) {
      await _requestPermissions();
      _startMonitoring();
    } else {
      _stopMonitoring();
    }
    
    notifyListeners();
  }
  
  // Set location tracking enabled
  Future<void> setLocationTrackingEnabled(bool enabled) async {
    _isLocationTrackingEnabled = enabled;
    
    await storageService.setBool('location_tracking_enabled', enabled);
    
    if (enabled && _isMonitoringActive) {
      await permissionService.requestLocationPermission();
      _startLocationTracking();
    } else {
      _stopLocationTracking();
    }
    
    notifyListeners();
  }
  
  // Set app usage monitoring enabled
  Future<void> setAppUsageMonitoringEnabled(bool enabled) async {
    _isAppUsageMonitoringEnabled = enabled;
    
    await storageService.setBool('app_usage_monitoring_enabled', enabled);
    
    if (enabled && _isMonitoringActive) {
      await permissionService.requestUsageStatsPermission();
      _startAppUsageMonitoring();
    } else {
      _stopAppUsageMonitoring();
    }
    
    notifyListeners();
  }
  
  // Set web history monitoring enabled
  Future<void> setWebHistoryMonitoringEnabled(bool enabled) async {
    _isWebHistoryMonitoringEnabled = enabled;
    
    await storageService.setBool('web_history_monitoring_enabled', enabled);
    
    if (enabled && _isMonitoringActive) {
      _startWebHistoryMonitoring();
    } else {
      _stopWebHistoryMonitoring();
    }
    
    notifyListeners();
  }
  
  // Set screen monitoring enabled
  Future<void> setScreenMonitoringEnabled(bool enabled) async {
    _isScreenMonitoringEnabled = enabled;
    
    await storageService.setBool('screen_monitoring_enabled', enabled);
    
    if (enabled && _isMonitoringActive) {
      await permissionService.requestScreenCapturePermission();
      _startScreenMonitoring();
    } else {
      _stopScreenMonitoring();
    }
    
    notifyListeners();
  }
  
  // Set audio monitoring enabled
  Future<void> setAudioMonitoringEnabled(bool enabled) async {
    _isAudioMonitoringEnabled = enabled;
    
    await storageService.setBool('audio_monitoring_enabled', enabled);
    
    if (enabled && _isMonitoringActive) {
      await permissionService.requestMicrophonePermission();
      _startAudioMonitoring();
    } else {
      _stopAudioMonitoring();
    }
    
    notifyListeners();
  }
  
  @override
  void dispose() {
    _monitoringTimer?.cancel();
    super.dispose();
  }
}