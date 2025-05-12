import 'dart:convert';
import 'package:flutter/foundation.dart';
import 'package:shared_preferences/shared_preferences.dart';

class StorageService with ChangeNotifier {
  final SharedPreferences prefs;
  
  StorageService({required this.prefs});
  
  // String operations
  String? getString(String key) {
    return prefs.getString(key);
  }
  
  Future<bool> setString(String key, String value) async {
    return await prefs.setString(key, value);
  }
  
  // Int operations
  int? getInt(String key) {
    return prefs.getInt(key);
  }
  
  Future<bool> setInt(String key, int value) async {
    return await prefs.setInt(key, value);
  }
  
  // Double operations
  double? getDouble(String key) {
    return prefs.getDouble(key);
  }
  
  Future<bool> setDouble(String key, double value) async {
    return await prefs.setDouble(key, value);
  }
  
  // Bool operations
  bool? getBool(String key) {
    return prefs.getBool(key);
  }
  
  Future<bool> setBool(String key, bool value) async {
    return await prefs.setBool(key, value);
  }
  
  // String list operations
  List<String>? getStringList(String key) {
    return prefs.getStringList(key);
  }
  
  Future<bool> setStringList(String key, List<String> value) async {
    return await prefs.setStringList(key, value);
  }
  
  // Json operations
  Map<String, dynamic>? getJson(String key) {
    final jsonString = prefs.getString(key);
    if (jsonString == null) return null;
    
    try {
      return json.decode(jsonString) as Map<String, dynamic>;
    } catch (e) {
      debugPrint('Error decoding JSON: $e');
      return null;
    }
  }
  
  Future<bool> setJson(String key, Map<String, dynamic> value) async {
    try {
      final jsonString = json.encode(value);
      return await prefs.setString(key, jsonString);
    } catch (e) {
      debugPrint('Error encoding JSON: $e');
      return false;
    }
  }
  
  // Check if key exists
  bool containsKey(String key) {
    return prefs.containsKey(key);
  }
  
  // Remove a specific key
  Future<bool> remove(String key) async {
    return await prefs.remove(key);
  }
  
  // Clear all data
  Future<bool> clear() async {
    return await prefs.clear();
  }
  
  // Get all keys
  Set<String> getKeys() {
    return prefs.getKeys();
  }
  
  // Save timestamp
  Future<bool> saveTimestamp(String key) async {
    return await setString(key, DateTime.now().toIso8601String());
  }
  
  // Get timestamp
  DateTime? getTimestamp(String key) {
    final timestampString = getString(key);
    if (timestampString == null) return null;
    
    try {
      return DateTime.parse(timestampString);
    } catch (e) {
      debugPrint('Error parsing timestamp: $e');
      return null;
    }
  }
}