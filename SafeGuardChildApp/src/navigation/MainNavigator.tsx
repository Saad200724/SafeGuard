import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import { View, Text, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

// Import screens
import HomeScreen from '../screens/main/HomeScreen';
import SettingsScreen from '../screens/main/SettingsScreen';
import ActivitiesScreen from '../screens/main/ActivitiesScreen';
import CheckInScreen from '../screens/main/CheckInScreen';
import EmergencyScreen from '../screens/main/EmergencyScreen';
import PermissionsScreen from '../screens/main/PermissionsScreen';

// Import service to check if monitoring is active
import { useMonitoring } from '../hooks/useMonitoring';

// Define tab navigator param list
export type MainTabParamList = {
  Home: undefined;
  Activities: undefined;
  CheckIn: undefined;
  Settings: undefined;
};

export type MainStackParamList = {
  MainTabs: undefined;
  Emergency: undefined;
  Permissions: undefined;
};

const Tab = createBottomTabNavigator<MainTabParamList>();
const Stack = createStackNavigator<MainStackParamList>();

const MainTabs = () => {
  const { isMonitoring } = useMonitoring();

  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName = '';

          if (route.name === 'Home') {
            iconName = 'home';
          } else if (route.name === 'Activities') {
            iconName = 'clock-outline';
          } else if (route.name === 'CheckIn') {
            iconName = 'check-circle-outline';
          } else if (route.name === 'Settings') {
            iconName = 'cog-outline';
          }

          return <Icon name={iconName} size={size} color={color} />;
        },
        tabBarStyle: {
          backgroundColor: '#FFFFFF',
          borderTopWidth: 0,
          elevation: 8,
          shadowOpacity: 0.1,
          shadowRadius: 4,
        },
        tabBarActiveTintColor: '#4C84FF',
        tabBarInactiveTintColor: '#8E8E93',
        headerStyle: {
          backgroundColor: '#4C84FF',
          elevation: 0,
          shadowOpacity: 0,
        },
        headerTintColor: '#FFFFFF',
        headerTitleStyle: {
          fontWeight: 'bold',
        },
      })}
    >
      <Tab.Screen
        name="Home"
        component={HomeScreen}
        options={{
          title: 'SafeGuard',
          headerRight: () => (
            <View style={styles.monitoringIndicator}>
              <Icon
                name={isMonitoring ? 'shield-check' : 'shield-off-outline'}
                size={18}
                color={isMonitoring ? '#4BD963' : '#FF3B30'}
              />
              <Text style={[
                styles.monitoringText,
                { color: isMonitoring ? '#4BD963' : '#FF3B30' }
              ]}>
                {isMonitoring ? 'Protected' : 'Not Protected'}
              </Text>
            </View>
          ),
        }}
      />
      <Tab.Screen name="Activities" component={ActivitiesScreen} />
      <Tab.Screen name="CheckIn" component={CheckInScreen} />
      <Tab.Screen name="Settings" component={SettingsScreen} />
    </Tab.Navigator>
  );
};

const MainNavigator = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen name="MainTabs" component={MainTabs} />
      <Stack.Screen
        name="Emergency"
        component={EmergencyScreen}
        options={{
          headerShown: true,
          headerStyle: {
            backgroundColor: '#FF3B30',
          },
          headerTintColor: '#FFFFFF',
          headerTitle: 'Emergency',
        }}
      />
      <Stack.Screen
        name="Permissions"
        component={PermissionsScreen}
        options={{
          headerShown: true,
          headerStyle: {
            backgroundColor: '#4C84FF',
          },
          headerTintColor: '#FFFFFF',
          headerTitle: 'App Permissions',
        }}
      />
    </Stack.Navigator>
  );
};

const styles = StyleSheet.create({
  monitoringIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    marginRight: 12,
  },
  monitoringText: {
    marginLeft: 4,
    fontSize: 12,
    fontWeight: 'bold',
  },
});

export default MainNavigator;