import React, { useState, useEffect } from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { NavigationContainer } from '@react-navigation/native';
import { StatusBar } from 'react-native';

// Import navigation
import MainNavigator from './src/navigation/MainNavigator';
import AuthNavigator from './src/navigation/AuthNavigator';

// Import Context Providers
import { AuthProvider, useAuth } from './src/hooks/useAuth';
import { PermissionsProvider } from './src/hooks/usePermissions';
import { MonitoringProvider } from './src/hooks/useMonitoring';

// Import services
import { initBackgroundServices } from './src/services/backgroundService';

const AppContent = () => {
  const { user, loading } = useAuth();
  const [servicesInitialized, setServicesInitialized] = useState(false);

  useEffect(() => {
    // Initialize background services when user is authenticated
    if (user && !servicesInitialized) {
      initBackgroundServices()
        .then(() => setServicesInitialized(true))
        .catch(err => console.error('Failed to start background services:', err));
    }
  }, [user, servicesInitialized]);

  if (loading) {
    // You could render a splash screen here
    return null;
  }

  return (
    <NavigationContainer>
      {user ? <MainNavigator /> : <AuthNavigator />}
    </NavigationContainer>
  );
};

const App = () => {
  return (
    <SafeAreaProvider>
      <StatusBar barStyle="dark-content" />
      <AuthProvider>
        <PermissionsProvider>
          <MonitoringProvider>
            <AppContent />
          </MonitoringProvider>
        </PermissionsProvider>
      </AuthProvider>
    </SafeAreaProvider>
  );
};

export default App;