import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Alert,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { usePermissions, PermissionStatus } from '../../hooks/usePermissions';

const PermissionsScreen = () => {
  const { 
    permissions, 
    requestPermission, 
    checkPermissions,
    areAllPermissionsGranted,
  } = usePermissions();

  // Handle permission request
  const handleRequestPermission = async (permission: keyof typeof permissions) => {
    const granted = await requestPermission(permission);
    
    if (!granted) {
      Alert.alert(
        'Permission Required',
        'This permission is required for the app to function properly. Please grant the permission in your device settings.',
        [
          { text: 'OK' },
        ]
      );
    }
    
    // Refresh permissions after request
    await checkPermissions();
  };

  // Get icon name based on permission type
  const getIconForPermission = (permission: keyof typeof permissions): string => {
    switch (permission) {
      case 'location':
        return 'map-marker';
      case 'camera':
        return 'camera';
      case 'microphone':
        return 'microphone';
      case 'storage':
        return 'folder';
      case 'usage':
        return 'cellphone-settings';
      case 'overlay':
        return 'layers';
      case 'notifications':
        return 'bell';
      case 'contacts':
        return 'account-box';
      case 'calendar':
        return 'calendar';
      default:
        return 'help-circle';
    }
  };

  // Get permission description
  const getPermissionDescription = (permission: keyof typeof permissions): string => {
    switch (permission) {
      case 'location':
        return 'Required to track device location for parents';
      case 'camera':
        return 'Required for capturing evidence';
      case 'microphone':
        return 'Required for audio monitoring';
      case 'storage':
        return 'Required to save monitoring data';
      case 'usage':
        return 'Required to monitor app usage and screen time';
      case 'overlay':
        return 'Required to display alerts and notifications';
      case 'notifications':
        return 'Required to send important alerts';
      case 'contacts':
        return 'Required for emergency contacts';
      case 'calendar':
        return 'Required to monitor scheduled activities';
      default:
        return 'Required for app functionality';
    }
  };

  // Get color based on permission status
  const getStatusColor = (status: PermissionStatus): string => {
    switch (status) {
      case 'granted':
        return '#10B981';
      case 'denied':
        return '#EF4444';
      case 'unavailable':
        return '#94A3B8';
      case 'checking':
        return '#F59E0B';
      default:
        return '#94A3B8';
    }
  };

  // Get user-friendly permission name
  const getFormattedPermissionName = (permission: string): string => {
    return permission.charAt(0).toUpperCase() + permission.slice(1).replace(/([A-Z])/g, ' $1');
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Required Permissions</Text>
        <Text style={styles.headerDescription}>
          SafeGuard needs these permissions to properly monitor and protect your device.
        </Text>
      </View>
      
      {Object.entries(permissions).map(([permission, status]) => (
        <View key={permission} style={styles.permissionItem}>
          <View style={styles.permissionIconContainer}>
            <Icon 
              name={getIconForPermission(permission as keyof typeof permissions)} 
              size={24} 
              color="#4C84FF" 
            />
          </View>
          
          <View style={styles.permissionInfo}>
            <View style={styles.permissionHeader}>
              <Text style={styles.permissionName}>
                {getFormattedPermissionName(permission)}
              </Text>
              <View style={[
                styles.statusBadge, 
                { backgroundColor: getStatusColor(status) }
              ]}>
                <Text style={styles.statusText}>
                  {status === 'granted' ? 'Granted' : 
                   status === 'denied' ? 'Denied' : 
                   status === 'unavailable' ? 'N/A' : 'Checking'}
                </Text>
              </View>
            </View>
            
            <Text style={styles.permissionDescription}>
              {getPermissionDescription(permission as keyof typeof permissions)}
            </Text>
            
            {status !== 'granted' && status !== 'unavailable' && (
              <TouchableOpacity 
                style={styles.grantButton}
                onPress={() => handleRequestPermission(permission as keyof typeof permissions)}
              >
                <Text style={styles.grantButtonText}>Grant Permission</Text>
              </TouchableOpacity>
            )}
          </View>
        </View>
      ))}
      
      {areAllPermissionsGranted ? (
        <View style={styles.successContainer}>
          <Icon name="check-circle" size={36} color="#10B981" />
          <Text style={styles.successText}>All required permissions granted!</Text>
        </View>
      ) : (
        <View style={styles.warningContainer}>
          <Icon name="alert-circle" size={24} color="#F59E0B" />
          <Text style={styles.warningText}>
            Some permissions are still required for full functionality.
          </Text>
        </View>
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F1F5F9',
  },
  header: {
    padding: 16,
    backgroundColor: '#FFFFFF',
    marginBottom: 8,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1E293B',
    marginBottom: 8,
  },
  headerDescription: {
    fontSize: 14,
    color: '#64748B',
    lineHeight: 20,
  },
  permissionItem: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    padding: 16,
    marginBottom: 1,
    borderBottomWidth: 1,
    borderBottomColor: '#E2E8F0',
  },
  permissionIconContainer: {
    width: 40,
    marginRight: 12,
    alignItems: 'center',
  },
  permissionInfo: {
    flex: 1,
  },
  permissionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },
  permissionName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1E293B',
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 12,
  },
  statusText: {
    fontSize: 12,
    color: '#FFFFFF',
    fontWeight: 'bold',
  },
  permissionDescription: {
    fontSize: 14,
    color: '#64748B',
    marginBottom: 12,
  },
  grantButton: {
    backgroundColor: '#4C84FF',
    borderRadius: 6,
    paddingVertical: 8,
    paddingHorizontal: 12,
    alignSelf: 'flex-start',
  },
  grantButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: 'bold',
  },
  successContainer: {
    backgroundColor: '#ECFDF5',
    borderRadius: 12,
    padding: 16,
    margin: 16,
    alignItems: 'center',
  },
  successText: {
    fontSize: 16,
    color: '#10B981',
    fontWeight: 'bold',
    marginTop: 8,
  },
  warningContainer: {
    backgroundColor: '#FFFBEB',
    borderRadius: 12,
    padding: 16,
    margin: 16,
    flexDirection: 'row',
    alignItems: 'center',
  },
  warningText: {
    fontSize: 14,
    color: '#B45309',
    marginLeft: 8,
    flex: 1,
  },
});

export default PermissionsScreen;