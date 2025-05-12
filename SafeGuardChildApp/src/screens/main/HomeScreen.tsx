import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Alert,
  Switch,
  RefreshControl,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { MainStackParamList } from '../../navigation/MainNavigator';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

import { useAuth } from '../../hooks/useAuth';
import { useMonitoring } from '../../hooks/useMonitoring';
import { usePermissions } from '../../hooks/usePermissions';
import DeviceInfo from 'react-native-device-info';

type HomeScreenNavigationProp = StackNavigationProp<MainStackParamList>;

const HomeScreen = () => {
  const navigation = useNavigation<HomeScreenNavigationProp>();
  const { user } = useAuth();
  const { 
    isMonitoring, 
    settings, 
    activeServices, 
    startMonitoring, 
    stopMonitoring,
    toggleService,
    refreshSettings,
  } = useMonitoring();
  const { permissions, getUngrantedPermissions } = usePermissions();
  
  const [refreshing, setRefreshing] = useState(false);
  const [batteryLevel, setBatteryLevel] = useState<number | null>(null);
  const [batteryIsCharging, setBatteryIsCharging] = useState<boolean | null>(null);
  const [deviceName, setDeviceName] = useState<string>('');

  // Refresh all data
  const onRefresh = async () => {
    setRefreshing(true);
    try {
      await refreshSettings();
      await updateDeviceStats();
    } catch (error) {
      console.error('Error refreshing data:', error);
    } finally {
      setRefreshing(false);
    }
  };

  // Update device stats
  const updateDeviceStats = async () => {
    try {
      // Get battery information
      const level = await DeviceInfo.getBatteryLevel();
      setBatteryLevel(Math.round(level * 100));
      
      const isCharging = await DeviceInfo.isBatteryCharging();
      setBatteryIsCharging(isCharging);
      
      // Get device name
      const name = await DeviceInfo.getDeviceName();
      setDeviceName(name);
    } catch (error) {
      console.error('Error updating device stats:', error);
    }
  };

  // Toggle monitoring state
  const handleToggleMonitoring = async () => {
    if (isMonitoring) {
      await stopMonitoring();
    } else {
      const ungrantedPermissions = getUngrantedPermissions();
      
      if (ungrantedPermissions.length > 0) {
        navigation.navigate('Permissions');
        return;
      }
      
      const success = await startMonitoring();
      
      if (!success) {
        Alert.alert(
          'Monitoring Failed',
          'Failed to start monitoring services. Please check app permissions and try again.'
        );
      }
    }
  };

  // Handle emergency button press
  const handleEmergency = () => {
    navigation.navigate('Emergency');
  };

  // Load initial data
  useEffect(() => {
    updateDeviceStats();
  }, []);

  return (
    <ScrollView 
      style={styles.container}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }
    >
      {/* Status Card */}
      <View style={styles.card}>
        <View style={styles.profileHeader}>
          <View>
            <Text style={styles.welcomeText}>Welcome</Text>
            <Text style={styles.deviceName}>{deviceName}</Text>
          </View>
          
          <View style={styles.batteryContainer}>
            <Icon 
              name={batteryIsCharging ? 'battery-charging' : 'battery'} 
              size={18} 
              color={batteryLevel && batteryLevel < 20 ? '#FF3B30' : '#4BD963'} 
            />
            {batteryLevel !== null && (
              <Text style={styles.batteryText}>{batteryLevel}%</Text>
            )}
          </View>
        </View>
        
        <View style={styles.divider} />
        
        <View style={styles.statusContainer}>
          <Text style={styles.statusLabel}>Protection Status</Text>
          <View style={styles.statusRow}>
            <View style={styles.statusIndicator}>
              <View 
                style={[
                  styles.statusDot, 
                  { backgroundColor: isMonitoring ? '#4BD963' : '#FF3B30' }
                ]} 
              />
              <Text style={styles.statusText}>
                {isMonitoring ? 'Protected' : 'Not Protected'}
              </Text>
            </View>
            
            <Switch
              value={isMonitoring}
              onValueChange={handleToggleMonitoring}
              trackColor={{ false: '#E2E8F0', true: '#10B981' }}
              thumbColor="#FFFFFF"
            />
          </View>
        </View>
      </View>
      
      {/* Services Card */}
      <View style={styles.card}>
        <Text style={styles.cardTitle}>Monitoring Services</Text>
        
        <View style={styles.serviceItem}>
          <View style={styles.serviceInfo}>
            <Icon name="map-marker" size={24} color="#4C84FF" />
            <Text style={styles.serviceText}>Location Tracking</Text>
          </View>
          <Switch
            value={settings.location}
            onValueChange={() => toggleService('location')}
            trackColor={{ false: '#E2E8F0', true: '#10B981' }}
            thumbColor="#FFFFFF"
            disabled={!isMonitoring}
          />
        </View>
        
        <View style={styles.serviceItem}>
          <View style={styles.serviceInfo}>
            <Icon name="clock-outline" size={24} color="#4C84FF" />
            <Text style={styles.serviceText}>Usage Monitoring</Text>
          </View>
          <Switch
            value={settings.usage}
            onValueChange={() => toggleService('usage')}
            trackColor={{ false: '#E2E8F0', true: '#10B981' }}
            thumbColor="#FFFFFF"
            disabled={!isMonitoring}
          />
        </View>
        
        <View style={styles.serviceItem}>
          <View style={styles.serviceInfo}>
            <Icon name="web" size={24} color="#4C84FF" />
            <Text style={styles.serviceText}>Web Protection</Text>
          </View>
          <Switch
            value={settings.web}
            onValueChange={() => toggleService('web')}
            trackColor={{ false: '#E2E8F0', true: '#10B981' }}
            thumbColor="#FFFFFF"
            disabled={!isMonitoring}
          />
        </View>
        
        <View style={styles.serviceItem}>
          <View style={styles.serviceInfo}>
            <Icon name="cellphone-screenshot" size={24} color="#4C84FF" />
            <Text style={styles.serviceText}>Screen Monitoring</Text>
          </View>
          <Switch
            value={settings.screen}
            onValueChange={() => toggleService('screen')}
            trackColor={{ false: '#E2E8F0', true: '#10B981' }}
            thumbColor="#FFFFFF"
            disabled={!isMonitoring}
          />
        </View>
        
        <View style={styles.serviceItem}>
          <View style={styles.serviceInfo}>
            <Icon name="microphone" size={24} color="#4C84FF" />
            <Text style={styles.serviceText}>Audio Monitoring</Text>
          </View>
          <Switch
            value={settings.audio}
            onValueChange={() => toggleService('audio')}
            trackColor={{ false: '#E2E8F0', true: '#10B981' }}
            thumbColor="#FFFFFF"
            disabled={!isMonitoring}
          />
        </View>
      </View>
      
      {/* Emergency Button */}
      <TouchableOpacity 
        style={styles.emergencyButton}
        onPress={handleEmergency}
      >
        <Icon name="alert" size={24} color="#FFFFFF" />
        <Text style={styles.emergencyButtonText}>Emergency Contact</Text>
      </TouchableOpacity>
      
      {/* Permission Status */}
      {getUngrantedPermissions().length > 0 && (
        <TouchableOpacity 
          style={styles.permissionAlert}
          onPress={() => navigation.navigate('Permissions')}
        >
          <Icon name="alert-circle-outline" size={24} color="#FFFFFF" />
          <Text style={styles.permissionAlertText}>
            Missing permissions required for full functionality
          </Text>
        </TouchableOpacity>
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F1F5F9',
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    margin: 16,
    marginBottom: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 3,
  },
  profileHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  welcomeText: {
    fontSize: 14,
    color: '#64748B',
  },
  deviceName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1E293B',
  },
  batteryContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F1F5F9',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  batteryText: {
    fontSize: 12,
    color: '#64748B',
    marginLeft: 4,
  },
  divider: {
    height: 1,
    backgroundColor: '#E2E8F0',
    marginBottom: 16,
  },
  statusContainer: {
    marginBottom: 8,
  },
  statusLabel: {
    fontSize: 14,
    color: '#64748B',
    marginBottom: 8,
  },
  statusRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  statusIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statusDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    marginRight: 8,
  },
  statusText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1E293B',
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1E293B',
    marginBottom: 16,
  },
  serviceItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#E2E8F0',
  },
  serviceInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  serviceText: {
    fontSize: 15,
    color: '#1E293B',
    marginLeft: 12,
  },
  emergencyButton: {
    backgroundColor: '#FF3B30',
    borderRadius: 12,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
    margin: 16,
    marginTop: 8,
  },
  emergencyButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
    marginLeft: 8,
  },
  permissionAlert: {
    backgroundColor: '#F59E0B',
    borderRadius: 12,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
    margin: 16,
    marginTop: 0,
  },
  permissionAlertText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: 'bold',
    marginLeft: 8,
    flexShrink: 1,
  },
});

export default HomeScreen;