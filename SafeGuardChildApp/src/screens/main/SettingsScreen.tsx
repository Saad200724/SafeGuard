import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Switch,
  Alert,
  ActivityIndicator,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { useAuth } from '../../hooks/useAuth';
import { useMonitoring } from '../../hooks/useMonitoring';
import DeviceInfo from 'react-native-device-info';

const SettingsScreen = () => {
  const { user, signOut } = useAuth();
  const { settings, updateSettings } = useMonitoring();
  
  const [isSigningOut, setIsSigningOut] = useState(false);
  const [deviceInfo, setDeviceInfo] = useState({
    name: '',
    model: '',
    version: '',
    uniqueId: '',
  });

  // Load device info
  React.useEffect(() => {
    const loadDeviceInfo = async () => {
      const name = await DeviceInfo.getDeviceName();
      const model = DeviceInfo.getModel();
      const version = DeviceInfo.getSystemVersion();
      const uniqueId = await DeviceInfo.getUniqueId();
      
      setDeviceInfo({
        name,
        model,
        version,
        uniqueId,
      });
    };
    
    loadDeviceInfo();
  }, []);

  // Toggle time restrictions
  const toggleTimeRestrictions = () => {
    updateSettings({
      time_restrictions: {
        ...settings.time_restrictions,
        enabled: !settings.time_restrictions.enabled,
      },
    });
  };

  // Update time restriction hours
  const updateTimeRestrictionHours = (startHour: number, endHour: number) => {
    updateSettings({
      time_restrictions: {
        ...settings.time_restrictions,
        start_hour: startHour,
        end_hour: endHour,
      },
    });
  };

  // Handle sign out
  const handleSignOut = async () => {
    Alert.alert(
      'Sign Out',
      'Are you sure you want to sign out? Monitoring will be disabled.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Sign Out',
          style: 'destructive',
          onPress: async () => {
            setIsSigningOut(true);
            try {
              await signOut();
            } catch (error) {
              console.error('Error signing out:', error);
              Alert.alert('Error', 'Failed to sign out. Please try again.');
            } finally {
              setIsSigningOut(false);
            }
          },
        },
      ]
    );
  };

  return (
    <ScrollView style={styles.container}>
      {/* Account Section */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Account</Text>
        
        <View style={styles.accountInfo}>
          <View style={styles.accountAvatar}>
            <Icon name="account" size={32} color="#FFFFFF" />
          </View>
          
          <View style={styles.accountDetails}>
            <Text style={styles.accountEmail}>{user?.email || 'Not signed in'}</Text>
            <Text style={styles.accountType}>Child Account</Text>
          </View>
        </View>
        
        <TouchableOpacity 
          style={[styles.signOutButton, isSigningOut && styles.disabledButton]}
          onPress={handleSignOut}
          disabled={isSigningOut}
        >
          {isSigningOut ? (
            <ActivityIndicator color="#FFFFFF" size="small" />
          ) : (
            <Text style={styles.signOutButtonText}>Sign Out</Text>
          )}
        </TouchableOpacity>
      </View>
      
      {/* Time Restrictions */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Time Restrictions</Text>
        
        <View style={styles.settingItem}>
          <View style={styles.settingInfo}>
            <Icon name="clock-outline" size={24} color="#4C84FF" />
            <Text style={styles.settingText}>Enable Time Restrictions</Text>
          </View>
          
          <Switch
            value={settings.time_restrictions.enabled}
            onValueChange={toggleTimeRestrictions}
            trackColor={{ false: '#E2E8F0', true: '#10B981' }}
            thumbColor="#FFFFFF"
          />
        </View>
        
        {settings.time_restrictions.enabled && (
          <View style={styles.timeRestrictionControls}>
            <Text style={styles.timeSettingLabel}>Restricted Hours:</Text>
            <Text style={styles.timeSettingValue}>
              {settings.time_restrictions.start_hour}:00 - {settings.time_restrictions.end_hour}:00
            </Text>
            
            <Text style={styles.timeSettingNote}>
              During these hours, device usage will be limited according to parent settings.
            </Text>
          </View>
        )}
      </View>
      
      {/* Device Information */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Device Information</Text>
        
        <View style={styles.infoItem}>
          <Text style={styles.infoLabel}>Device Name</Text>
          <Text style={styles.infoValue}>{deviceInfo.name}</Text>
        </View>
        
        <View style={styles.infoItem}>
          <Text style={styles.infoLabel}>Model</Text>
          <Text style={styles.infoValue}>{deviceInfo.model}</Text>
        </View>
        
        <View style={styles.infoItem}>
          <Text style={styles.infoLabel}>OS Version</Text>
          <Text style={styles.infoValue}>Android {deviceInfo.version}</Text>
        </View>
        
        <View style={styles.infoItem}>
          <Text style={styles.infoLabel}>Device ID</Text>
          <Text style={styles.infoValue}>{deviceInfo.uniqueId}</Text>
        </View>
        
        <View style={styles.infoItem}>
          <Text style={styles.infoLabel}>App Version</Text>
          <Text style={styles.infoValue}>1.0.0</Text>
        </View>
      </View>
      
      {/* About Section */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>About</Text>
        
        <TouchableOpacity style={styles.aboutItem}>
          <Icon name="shield-check" size={20} color="#4C84FF" />
          <Text style={styles.aboutItemText}>Privacy Policy</Text>
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.aboutItem}>
          <Icon name="file-document-outline" size={20} color="#4C84FF" />
          <Text style={styles.aboutItemText}>Terms of Service</Text>
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.aboutItem}>
          <Icon name="help-circle-outline" size={20} color="#4C84FF" />
          <Text style={styles.aboutItemText}>Help & Support</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F1F5F9',
  },
  section: {
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
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1E293B',
    marginBottom: 16,
  },
  accountInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  accountAvatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#4C84FF',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  accountDetails: {
    flex: 1,
  },
  accountEmail: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1E293B',
    marginBottom: 4,
  },
  accountType: {
    fontSize: 14,
    color: '#64748B',
  },
  signOutButton: {
    backgroundColor: '#EF4444',
    borderRadius: 8,
    padding: 12,
    alignItems: 'center',
  },
  disabledButton: {
    backgroundColor: '#FCA5A5',
  },
  signOutButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  settingItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#E2E8F0',
  },
  settingInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  settingText: {
    fontSize: 15,
    color: '#1E293B',
    marginLeft: 12,
  },
  timeRestrictionControls: {
    paddingVertical: 12,
    paddingHorizontal: 8,
  },
  timeSettingLabel: {
    fontSize: 14,
    color: '#64748B',
    marginBottom: 8,
  },
  timeSettingValue: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1E293B',
    marginBottom: 8,
  },
  timeSettingNote: {
    fontSize: 12,
    color: '#94A3B8',
    fontStyle: 'italic',
  },
  infoItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#E2E8F0',
  },
  infoLabel: {
    fontSize: 14,
    color: '#64748B',
  },
  infoValue: {
    fontSize: 14,
    color: '#1E293B',
    fontWeight: '500',
  },
  aboutItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#E2E8F0',
  },
  aboutItemText: {
    fontSize: 15,
    color: '#1E293B',
    marginLeft: 12,
  },
});

export default SettingsScreen;