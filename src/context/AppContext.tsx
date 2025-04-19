import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { storageClient } from '../services/storage/storageClient';
import { APP_INFO, FEATURES } from '../utils/config';

// Define types for our context
interface User {
  id: string;
  name: string;
  email: string;
  isPremium: boolean;
}

interface Child {
  id: string;
  name: string;
  birthDate: string;
  gender?: 'male' | 'female' | 'other';
  photoUrl?: string;
}

interface AppContextType {
  // User state
  user: User | null;
  setUser: (user: User | null) => void;
  
  // Children state
  children: Child[];
  setChildren: (children: Child[]) => void;
  currentChild: Child | null;
  setCurrentChild: (child: Child | null) => void;
  
  // App state
  isLoading: boolean;
  setIsLoading: (loading: boolean) => void;
  isPremium: boolean;
  
  // Feature access (cost optimization)
  canUseFeature: (featureName: keyof typeof FEATURES) => boolean;
}

// Create the context
const AppContext = createContext<AppContextType | undefined>(undefined);

// Provider component
export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  // State
  const [user, setUser] = useState<User | null>(null);
  const [children, setChildren] = useState<Child[]>([]);
  const [currentChild, setCurrentChild] = useState<Child | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  
  // Derived state
  const isPremium = user?.isPremium || false;
  
  // Feature access control for cost optimization
  const canUseFeature = (featureName: keyof typeof FEATURES): boolean => {
    // Free features are always available
    if (
      featureName === 'basicTracking' ||
      featureName === 'simpleAnalytics'
    ) {
      return true;
    }
    
    // Premium features require premium subscription
    if (
      featureName === 'aiInsights' ||
      featureName === 'smsNotifications' ||
      featureName === 'advancedAnalytics'
    ) {
      return isPremium && FEATURES[featureName];
    }
    
    return FEATURES[featureName] || false;
  };
  
  // Load user data on mount
  useEffect(() => {
    const loadUserData = async () => {
      try {
        const savedUser = await storageClient.getItem<User>('user');
        const savedChildren = await storageClient.getItem<Child[]>('children');
        const savedCurrentChild = await storageClient.getItem<Child>('currentChild');
        
        if (savedUser) setUser(savedUser);
        if (savedChildren) setChildren(savedChildren);
        if (savedCurrentChild) setCurrentChild(savedCurrentChild);
      } catch (error) {
        console.error('Error loading user data:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    loadUserData();
  }, []);
  
  // Save user data when it changes
  useEffect(() => {
    const saveUserData = async () => {
      if (user) await storageClient.setItem('user', user);
      if (children.length > 0) await storageClient.setItem('children', children);
      if (currentChild) await storageClient.setItem('currentChild', currentChild);
    };
    
    saveUserData();
  }, [user, children, currentChild]);
  
  return (
    <AppContext.Provider
      value={{
        user,
        setUser,
        children,
        setChildren,
        currentChild,
        setCurrentChild,
        isLoading,
        setIsLoading,
        isPremium,
        canUseFeature,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

// Custom hook for using the context
export const useApp = (): AppContextType => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
