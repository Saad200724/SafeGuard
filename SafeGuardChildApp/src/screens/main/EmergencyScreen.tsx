import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Alert,
  TextInput,
  ActivityIndicator,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { supabase } from '../../config/supabase';
import { useAuth } from '../../hooks/useAuth';
import DeviceInfo from 'react-native-device-info';

const EmergencyScreen = () => {
  const { user } = useAuth();
  
  const [message, setMessage] = useState('');
  const [isSending, setIsSending] = useState(false);
  const [sentSuccessfully, setSentSuccessfully] = useState(false);
  
  const [parentContacts, setParentContacts] = useState<{name: string; phone?: string; email: string}[]>([]);
  const [isLoadingContacts, setIsLoadingContacts] = useState(true);
  const [currentLocation, setCurrentLocation] = useState<{latitude: number; longitude: number} | null>(null);

  // Fetch parent contacts from database
  useEffect(() => {
    const fetchContacts = async () => {
      try {
        if (!user) return;
        
        // Get the parent user associated with this child device
        const { data: deviceData, error: deviceError } = await supabase
          .from('devices')
          .select('parent_id')
          .eq('device_id', user.id)
          .single();
        
        if (deviceError) throw deviceError;
        
        if (deviceData && deviceData.parent_id) {
          // Get parent's contact information
          const { data: parentData, error: parentError } = await supabase
            .from('profiles')
            .select('full_name, phone, email')
            .eq('id', deviceData.parent_id)
            .single();
          
          if (parentError) throw parentError;
          
          if (parentData) {
            setParentContacts([{
              name: parentData.full_name || 'Parent',
              phone: parentData.phone,
              email: parentData.email,
            }]);
          }
        }
      } catch (error) {
        console.error('Error fetching contacts:', error);
        // Fallback data in case of error
        setParentContacts([{
          name: 'Default Parent Contact',
          email: 'parent@example.com',
        }]);
      } finally {
        setIsLoadingContacts(false);
      }
    };
    
    fetchContacts();
  }, [user]);

  // Try to get current location for the emergency message
  useEffect(() => {
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
  }, []);

  // Send emergency message
  const sendEmergencyAlert = async () => {
    if (!user) {
      Alert.alert('Error', 'You must be logged in to send emergency alerts');
      return;
    }
    
    setIsSending(true);
    
    try {
      const deviceName = await DeviceInfo.getDeviceName();
      const deviceId = await DeviceInfo.getUniqueId();
      
      // Create emergency data for the database
      const emergencyData = {
        user_id: user.id,
        device_id: deviceId,
        activity_type: 'emergency',
        timestamp: new Date().toISOString(),
        data: {
          message: message || 'Emergency alert triggered!',
          device_name: deviceName,
          location: currentLocation,
        },
        priority: 'high',
      };
      
      // Send to activities table
      const { error } = await supabase
        .from('activities')
        .insert([emergencyData]);
      
      if (error) throw error;
      
      // Send real-time notification (this would be handled by the server in a real implementation)
      
      Alert.alert(
        'Emergency Alert Sent',
        'Your emergency alert has been sent to your parent/guardian.',
        [{ text: 'OK' }]
      );
      
      setSentSuccessfully(true);
      setMessage('');
    } catch (error) {
      console.error('Error sending emergency alert:', error);
      Alert.alert(
        'Failed to Send Alert',
        'There was a problem sending your emergency alert. Please try again or make a phone call directly.'
      );
    } finally {
      setIsSending(false);
    }
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Icon name="alert-circle" size={48} color="#FFFFFF" />
        <Text style={styles.headerTitle}>Emergency Help</Text>
        <Text style={styles.headerDescription}>
          Use this screen to quickly contact your parents/guardians in case of an emergency.
        </Text>
      </View>
      
      <View style={styles.card}>
        <Text style={styles.sectionTitle}>Send Emergency Alert</Text>
        
        <TextInput
          style={styles.messageInput}
          placeholder="Describe your emergency or situation (optional)"
          value={message}
          onChangeText={setMessage}
          multiline
          numberOfLines={3}
        />
        
        <TouchableOpacity
          style={[styles.sendButton, isSending && styles.disabledButton]}
          onPress={sendEmergencyAlert}
          disabled={isSending}
        >
          {isSending ? (
            <ActivityIndicator color="#FFFFFF" />
          ) : (
            <>
              <Icon name="alert-octagon" size={20} color="#FFFFFF" />
              <Text style={styles.sendButtonText}>Send Emergency Alert</Text>
            </>
          )}
        </TouchableOpacity>
        
        {sentSuccessfully && (
          <View style={styles.successMessage}>
            <Icon name="check-circle" size={20} color="#10B981" />
            <Text style={styles.successText}>
              Emergency alert sent successfully!
            </Text>
          </View>
        )}
      </View>
      
      <View style={styles.card}>
        <Text style={styles.sectionTitle}>Emergency Contacts</Text>
        
        {isLoadingContacts ? (
          <ActivityIndicator color="#4C84FF" style={styles.loadingIndicator} />
        ) : (
          <>
            {parentContacts.map((contact, index) => (
              <View key={index} style={styles.contactItem}>
                <View style={styles.contactAvatar}>
                  <Text style={styles.contactInitial}>
                    {contact.name.charAt(0).toUpperCase()}
                  </Text>
                </View>
                <View style={styles.contactInfo}>
                  <Text style={styles.contactName}>{contact.name}</Text>
                  {contact.phone && (
                    <Text style={styles.contactDetail}>{contact.phone}</Text>
                  )}
                  <Text style={styles.contactDetail}>{contact.email}</Text>
                </View>
              </View>
            ))}
            
            {parentContacts.length === 0 && (
              <Text style={styles.noContactsMessage}>
                No emergency contacts available. Please ask your parent to set up emergency contacts.
              </Text>
            )}
          </>
        )}
      </View>
      
      <View style={styles.emergencyServices}>
        <Text style={styles.emergencyServicesTitle}>
          In case of a serious emergency, contact:
        </Text>
        
        <View style={styles.emergencyServiceItem}>
          <Icon name="phone" size={24} color="#FFFFFF" />
          <Text style={styles.emergencyServiceText}>911</Text>
          <Text style={styles.emergencyServiceLabel}>(Emergency Services)</Text>
        </View>
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
    backgroundColor: '#FF3B30',
    padding: 24,
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginVertical: 12,
  },
  headerDescription: {
    fontSize: 14,
    color: '#FFFFFF',
    textAlign: 'center',
    opacity: 0.9,
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
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1E293B',
    marginBottom: 16,
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
  sendButton: {
    backgroundColor: '#FF3B30',
    borderRadius: 8,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
  disabledButton: {
    backgroundColor: '#FCA5A5',
  },
  sendButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
    marginLeft: 8,
  },
  successMessage: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#D1FAE5',
    borderRadius: 8,
    padding: 12,
    marginTop: 16,
  },
  successText: {
    color: '#10B981',
    fontSize: 14,
    marginLeft: 8,
  },
  loadingIndicator: {
    margin: 20,
  },
  contactItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#E2E8F0',
  },
  contactAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#4C84FF',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  contactInitial: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: 'bold',
  },
  contactInfo: {
    flex: 1,
  },
  contactName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1E293B',
    marginBottom: 2,
  },
  contactDetail: {
    fontSize: 14,
    color: '#64748B',
  },
  noContactsMessage: {
    fontSize: 14,
    color: '#64748B',
    fontStyle: 'italic',
    textAlign: 'center',
    margin: 20,
  },
  emergencyServices: {
    backgroundColor: '#1E293B',
    borderRadius: 12,
    padding: 16,
    margin: 16,
  },
  emergencyServicesTitle: {
    fontSize: 14,
    color: '#FFFFFF',
    opacity: 0.9,
    marginBottom: 12,
  },
  emergencyServiceItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 8,
    padding: 12,
  },
  emergencyServiceText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginLeft: 12,
  },
  emergencyServiceLabel: {
    fontSize: 14,
    color: '#FFFFFF',
    opacity: 0.7,
    marginLeft: 8,
  },
});

export default EmergencyScreen;