import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  ScrollView,
  ActivityIndicator,
  Alert,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { supabase } from '../../config/supabase';
import { useAuth } from '../../hooks/useAuth';
import DeviceInfo from 'react-native-device-info';

const PRESET_MESSAGES = [
  "I'm at school",
  "I'm at home",
  "I'm at a friend's house",
  "I'm on my way home",
  "I'm doing homework",
  "I'm okay, just checking in",
];

const CheckInScreen = () => {
  const { user } = useAuth();
  
  const [customMessage, setCustomMessage] = useState('');
  const [includeLocation, setIncludeLocation] = useState(true);
  const [isSending, setIsSending] = useState(false);
  const [lastCheckIn, setLastCheckIn] = useState<string | null>(null);
  const [currentLocation, setCurrentLocation] = useState<{latitude: number; longitude: number} | null>(null);

  // Fetch last check-in time
  useEffect(() => {
    fetchLastCheckIn();
    getCurrentLocation();
  }, []);

  // Get current location
  const getCurrentLocation = () => {
    navigator.geolocation.getCurrentPosition(
      position => {
        const { latitude, longitude } = position.coords;
        setCurrentLocation({ latitude, longitude });
      },
      error => {
        console.error('Error getting location:', error);
      },
      { enableHighAccuracy: true, timeout: 15000, maximumAge: 10000 }
    );
  };

  // Fetch the last check-in from the database
  const fetchLastCheckIn = async () => {
    try {
      if (!user) return;
      
      const { data, error } = await supabase
        .from('activities')
        .select('timestamp')
        .eq('user_id', user.id)
        .eq('activity_type', 'check_in')
        .order('timestamp', { ascending: false })
        .limit(1);
      
      if (error) throw error;
      
      if (data && data.length > 0) {
        const timestamp = new Date(data[0].timestamp);
        setLastCheckIn(timestamp.toLocaleString());
      }
    } catch (error) {
      console.error('Error fetching last check-in:', error);
    }
  };

  // Send a check-in
  const sendCheckIn = async (message: string) => {
    if (!user) {
      Alert.alert('Error', 'You must be logged in to check in');
      return;
    }
    
    setIsSending(true);
    
    try {
      const deviceName = await DeviceInfo.getDeviceName();
      const deviceId = await DeviceInfo.getUniqueId();
      
      // Create check-in data for the database
      const checkInData = {
        user_id: user.id,
        device_id: deviceId,
        activity_type: 'check_in',
        timestamp: new Date().toISOString(),
        data: {
          message,
          device_name: deviceName,
          location: includeLocation ? currentLocation : null,
        },
      };
      
      // Send to activities table
      const { error } = await supabase
        .from('activities')
        .insert([checkInData]);
      
      if (error) throw error;
      
      Alert.alert(
        'Check-In Sent',
        'Your check-in has been sent successfully to your parent/guardian.'
      );
      
      // Update last check-in time
      setLastCheckIn(new Date().toLocaleString());
      
      // Clear custom message
      setCustomMessage('');
    } catch (error) {
      console.error('Error sending check-in:', error);
      Alert.alert(
        'Check-In Failed',
        'There was an error sending your check-in. Please try again.'
      );
    } finally {
      setIsSending(false);
    }
  };

  // Handle preset message selection
  const handlePresetMessage = (message: string) => {
    sendCheckIn(message);
  };

  // Handle custom message submission
  const handleCustomMessage = () => {
    if (!customMessage.trim()) {
      Alert.alert('Empty Message', 'Please enter a message to check in');
      return;
    }
    
    sendCheckIn(customMessage.trim());
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Icon name="check-circle" size={48} color="#10B981" />
        <Text style={styles.headerTitle}>Check In</Text>
        <Text style={styles.headerDescription}>
          Let your parents know you're safe by sending a quick check-in message.
        </Text>
      </View>
      
      {lastCheckIn && (
        <View style={styles.lastCheckInContainer}>
          <Text style={styles.lastCheckInLabel}>Last Check-In:</Text>
          <Text style={styles.lastCheckInTime}>{lastCheckIn}</Text>
        </View>
      )}
      
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Quick Check-In Messages</Text>
        
        <View style={styles.presetContainer}>
          {PRESET_MESSAGES.map((message, index) => (
            <TouchableOpacity
              key={index}
              style={styles.presetButton}
              onPress={() => handlePresetMessage(message)}
              disabled={isSending}
            >
              <Text style={styles.presetButtonText}>{message}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>
      
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Custom Message</Text>
        
        <TextInput
          style={styles.messageInput}
          placeholder="Type your message here..."
          value={customMessage}
          onChangeText={setCustomMessage}
          multiline
          numberOfLines={3}
        />
        
        <View style={styles.locationToggleContainer}>
          <TouchableOpacity
            style={styles.locationToggle}
            onPress={() => setIncludeLocation(!includeLocation)}
          >
            <Icon
              name={includeLocation ? 'checkbox-marked' : 'checkbox-blank-outline'}
              size={24}
              color={includeLocation ? '#10B981' : '#64748B'}
            />
            <Text style={styles.locationToggleText}>Include my current location</Text>
          </TouchableOpacity>
          
          {includeLocation && !currentLocation && (
            <Text style={styles.locationStatus}>Getting location...</Text>
          )}
          
          {includeLocation && currentLocation && (
            <Text style={styles.locationStatus}>Location available</Text>
          )}
        </View>
        
        <TouchableOpacity
          style={[styles.sendButton, isSending && styles.disabledButton]}
          onPress={handleCustomMessage}
          disabled={isSending}
        >
          {isSending ? (
            <ActivityIndicator color="#FFFFFF" />
          ) : (
            <>
              <Icon name="send" size={20} color="#FFFFFF" />
              <Text style={styles.sendButtonText}>Send Check-In</Text>
            </>
          )}
        </TouchableOpacity>
      </View>
      
      <View style={styles.infoSection}>
        <Icon name="information-outline" size={20} color="#4C84FF" />
        <Text style={styles.infoText}>
          Regular check-ins help keep your parents informed and give them peace of mind.
        </Text>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F1F5F9',
  },
  header: {
    backgroundColor: '#ECFDF5',
    padding: 24,
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#10B981',
    marginVertical: 12,
  },
  headerDescription: {
    fontSize: 14,
    color: '#065F46',
    textAlign: 'center',
    opacity: 0.9,
  },
  lastCheckInContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    backgroundColor: '#F0F9FF',
    marginHorizontal: 16,
    marginTop: 16,
    borderRadius: 8,
  },
  lastCheckInLabel: {
    fontSize: 14,
    color: '#0369A1',
    fontWeight: 'bold',
    marginRight: 8,
  },
  lastCheckInTime: {
    fontSize: 14,
    color: '#075985',
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
  presetContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  presetButton: {
    backgroundColor: '#E0F2FE',
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 16,
    width: '48%',
    marginBottom: 12,
  },
  presetButtonText: {
    color: '#0369A1',
    fontSize: 14,
    textAlign: 'center',
  },
  messageInput: {
    backgroundColor: '#F1F5F9',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    minHeight: 100,
    textAlignVertical: 'top',
    marginBottom: 16,
  },
  locationToggleContainer: {
    marginBottom: 16,
  },
  locationToggle: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  locationToggleText: {
    marginLeft: 8,
    fontSize: 14,
    color: '#1E293B',
  },
  locationStatus: {
    marginLeft: 32,
    fontSize: 12,
    color: '#64748B',
    marginTop: 4,
  },
  sendButton: {
    backgroundColor: '#10B981',
    borderRadius: 8,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
  disabledButton: {
    backgroundColor: '#A1E9D2',
  },
  sendButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
    marginLeft: 8,
  },
  infoSection: {
    backgroundColor: '#F0F9FF',
    borderRadius: 8,
    flexDirection: 'row',
    alignItems: 'flex-start',
    padding: 12,
    margin: 16,
  },
  infoText: {
    color: '#0369A1',
    fontSize: 14,
    lineHeight: 20,
    marginLeft: 8,
    flex: 1,
  },
});

export default CheckInScreen;