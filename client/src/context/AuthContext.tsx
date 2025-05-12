import React, { createContext, useContext, useState, useEffect } from "react";

// Mock User interface to replace Firebase User
interface MockUser {
  uid: string;
  email: string;
  displayName: string;
  photoURL: string | null;
}

interface AuthContextType {
  user: MockUser | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Create a mock user for development without Firebase
const mockUser: MockUser = {
  uid: "mock-user-123",
  email: "parent@example.com",
  displayName: "Demo Parent",
  photoURL: null,
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Always set the mockUser as the current user
  const [user, setUser] = useState<MockUser | null>(mockUser);
  const [loading, setLoading] = useState<boolean>(false); // Set loading to false by default

  // Mock implementations of auth methods
  const login = async (email: string, password: string) => {
    setUser(mockUser);
    return Promise.resolve();
  };

  const register = async (email: string, password: string) => {
    setUser(mockUser);
    return Promise.resolve();
  };

  const logout = async () => {
    setUser(null);
    return Promise.resolve();
  };

  const value = {
    user,
    loading,
    login,
    register,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
