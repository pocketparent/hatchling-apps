import React from 'react';
import {
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  ScrollView,
  Modal,
  Alert,
  ActivityIndicator,
  SafeAreaView,
  View
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

// Auth & Navigation imports ─────────────
import { AuthProvider, useAuth } from './src/context/AuthContext';
import { NavigationContainer } from '@react-navigation/native';
import AuthStack from './src/navigation/AuthStack';
import MainStack from './src/navigation/MainStack';

// 1) AppContent: decides which navigator to show based on auth state
const AppContent = () => {
  const { user, loading } = useAuth();

  // While checking auth state:
  if (loading) {
    return (
      <SafeAreaView style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" />
      </SafeAreaView>
    );
  }

  // Once loaded, choose navigator:
  return (
    <NavigationContainer>
      {user
        ? (user.onboarded
            ? <MainStack />                // Main app (Today → Timeline by default)
            : <AuthStack initialScreen="Onboarding" />  // Onboarding flow
          )
        : <AuthStack initialScreen="SignIn" />        // Signed‑out flow
      }
    </NavigationContainer>
  );
};

// 2) Wrap the entire existing app in AuthProvider
const App = () => (
  <AuthProvider>
    <AppContent />
  </AuthProvider>
);

export default App;
