import 'dart:io';
import 'package:flutter/foundation.dart';
import 'package:flutter/material.dart';
import 'package:permission_handler/permission_handler.dart';

class PermissionService with ChangeNotifier {
  // Permission status
  Map<Permission, PermissionStatus> _permissionStatus = {};
  
  // Constructor
  PermissionService() {
    _init();
  }
  
  // Initialize
  void _init() async {
    await checkPermissions();
  }
  
  // Check all permissions
  Future<void> checkPermissions() async {
    _permissionStatus = {
      Permission.location: await Permission.location.status,
      Permission.locationAlways: await Permission.locationAlways.status,
      Permission.camera: await Permission.camera.status,
      Permission.microphone: await Permission.microphone.status,
      Permission.storage: await Permission.storage.status,
      Permission.notification: await Permission.notification.status,
    };
    
    // Check for app usage stats permission specifically
    if (Platform.isAndroid) {
      _permissionStatus[Permission.activityRecognition] = await Permission.activityRecognition.status;
    }
    
    notifyListeners();
  }
  
  // Check location permission
  Future<bool> checkLocationPermission() async {
    final status = await Permission.location.status;
    _permissionStatus[Permission.location] = status;
    notifyListeners();
    return status.isGranted;
  }
  
  // Request location permission
  Future<bool> requestLocationPermission() async {
    bool hasPermission = await checkLocationPermission();
    
    if (!hasPermission) {
      final status = await Permission.location.request();
      _permissionStatus[Permission.location] = status;
      notifyListeners();
      
      if (status.isPermanentlyDenied) {
        return false;
      }
      
      if (status.isGranted) {
        // Also request background location if the regular location is granted
        await requestBackgroundLocationPermission();
      }
      
      return status.isGranted;
    }
    
    return hasPermission;
  }
  
  // Request background location permission
  Future<bool> requestBackgroundLocationPermission() async {
    final status = await Permission.locationAlways.request();
    _permissionStatus[Permission.locationAlways] = status;
    notifyListeners();
    return status.isGranted;
  }
  
  // Check usage stats permission (Android only)
  Future<bool> checkUsageStatsPermission() async {
    if (!Platform.isAndroid) return false;
    
    // This is a simplification, as actual usage stats permission is more complex on Android
    // and might require custom native code
    final status = await Permission.activityRecognition.status;
    _permissionStatus[Permission.activityRecognition] = status;
    notifyListeners();
    return status.isGranted;
  }
  
  // Request usage stats permission (Android only)
  Future<bool> requestUsageStatsPermission() async {
    if (!Platform.isAndroid) return false;
    
    // This is a simplification, as actual usage stats permission is more complex on Android
    // and might require custom native code
    final status = await Permission.activityRecognition.request();
    _permissionStatus[Permission.activityRecognition] = status;
    notifyListeners();
    return status.isGranted;
  }
  
  // Check screen capture permission
  Future<bool> checkScreenCapturePermission() async {
    // Screen capture permission is complex and might require custom native code
    // This is a placeholder implementation
    final status = await Permission.camera.status;
    _permissionStatus[Permission.camera] = status;
    notifyListeners();
    return status.isGranted;
  }
  
  // Request screen capture permission
  Future<bool> requestScreenCapturePermission() async {
    // Screen capture permission is complex and might require custom native code
    // This is a placeholder implementation
    final status = await Permission.camera.request();
    _permissionStatus[Permission.camera] = status;
    notifyListeners();
    return status.isGranted;
  }
  
  // Check microphone permission
  Future<bool> checkMicrophonePermission() async {
    final status = await Permission.microphone.status;
    _permissionStatus[Permission.microphone] = status;
    notifyListeners();
    return status.isGranted;
  }
  
  // Request microphone permission
  Future<bool> requestMicrophonePermission() async {
    final status = await Permission.microphone.request();
    _permissionStatus[Permission.microphone] = status;
    notifyListeners();
    return status.isGranted;
  }
  
  // Check storage permission
  Future<bool> checkStoragePermission() async {
    final status = await Permission.storage.status;
    _permissionStatus[Permission.storage] = status;
    notifyListeners();
    return status.isGranted;
  }
  
  // Request storage permission
  Future<bool> requestStoragePermission() async {
    final status = await Permission.storage.request();
    _permissionStatus[Permission.storage] = status;
    notifyListeners();
    return status.isGranted;
  }
  
  // Check notification permission
  Future<bool> checkNotificationPermission() async {
    final status = await Permission.notification.status;
    _permissionStatus[Permission.notification] = status;
    notifyListeners();
    return status.isGranted;
  }
  
  // Request notification permission
  Future<bool> requestNotificationPermission() async {
    final status = await Permission.notification.request();
    _permissionStatus[Permission.notification] = status;
    notifyListeners();
    return status.isGranted;
  }
  
  // Check if a specific permission is granted
  bool isPermissionGranted(Permission permission) {
    return _permissionStatus[permission]?.isGranted ?? false;
  }
  
  // Show permission denied dialog
  Future<void> showPermissionDeniedDialog(
    BuildContext context,
    String title,
    String message,
  ) async {
    return showDialog(
      context: context,
      builder: (context) => AlertDialog(
        title: Text(title),
        content: Text(message),
        actions: [
          TextButton(
            onPressed: () {
              Navigator.of(context).pop();
            },
            child: const Text('Close'),
          ),
          TextButton(
            onPressed: () {
              Navigator.of(context).pop();
              openAppSettings();
            },
            child: const Text('Open Settings'),
          ),
        ],
      ),
    );
  }
}