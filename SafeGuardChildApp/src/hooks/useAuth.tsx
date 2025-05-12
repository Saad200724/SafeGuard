import React, { createContext, useState, useEffect, useContext } from 'react';
import { supabase, getSession, type User } from '../config/supabase';
import * as Keychain from 'react-native-keychain';

// Define auth context type
type AuthContextType = {
  user: User | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<{ error: Error | null }>;
  signUp: (email: string, password: string, deviceName: string) => Promise<{ error: Error | null }>;
  signOut: () => Promise<void>;
  resetPassword: (email: string) => Promise<{ error: Error | null }>;
  updateProfile: (data: { deviceName?: string }) => Promise<{ error: Error | null }>;
};

// Create auth context
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Provider component
export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  // Initialize auth state
  useEffect(() => {
    getSession().then(session => {
      setUser(session?.user ?? null);
      setLoading(false);
    });

    // Listen for auth state changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, []);

  // Sign in with email and password
  const signIn = async (email: string, password: string) => {
    try {
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      
      if (!error) {
        // Store credentials securely
        await Keychain.setGenericPassword(email, password);
      }
      
      return { error };
    } catch (error) {
      console.error('Sign in error:', error);
      return { error: error instanceof Error ? error : new Error('Unknown error during sign in') };
    }
  };

  // Sign up with email and password
  const signUp = async (email: string, password: string, deviceName: string) => {
    try {
      const { error } = await supabase.auth.signUp({ 
        email, 
        password,
        options: {
          data: {
            device_name: deviceName,
            is_child_device: true
          }
        }
      });
      
      if (!error) {
        // Store credentials securely
        await Keychain.setGenericPassword(email, password);
      }
      
      return { error };
    } catch (error) {
      console.error('Sign up error:', error);
      return { error: error instanceof Error ? error : new Error('Unknown error during sign up') };
    }
  };

  // Sign out
  const signOut = async () => {
    await supabase.auth.signOut();
    await Keychain.resetGenericPassword();
  };

  // Reset password
  const resetPassword = async (email: string) => {
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email);
      return { error };
    } catch (error) {
      console.error('Reset password error:', error);
      return { error: error instanceof Error ? error : new Error('Unknown error during password reset') };
    }
  };

  // Update profile
  const updateProfile = async (data: { deviceName?: string }) => {
    try {
      const { error } = await supabase.auth.updateUser({
        data: {
          device_name: data.deviceName,
        },
      });
      return { error };
    } catch (error) {
      console.error('Update profile error:', error);
      return { error: error instanceof Error ? error : new Error('Unknown error during profile update') };
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        signIn,
        signUp,
        signOut,
        resetPassword,
        updateProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

// Hook to use auth context
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};