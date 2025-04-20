import WelcomeScreen from './screens/auth/WelcomeScreen';
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { useApp } from './context/AppContext';

// We'll create placeholder screens for now
const PlaceholderScreen = ({ route }: any) => (
  <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
    <Text>This is the {route.name} screen</Text>
  </View>
);

// Import necessary components
import { View, Text } from 'react-native';

// Define navigation types
type RootStackParamList = {
  Auth: undefined;
  Onboarding: undefined;
  Main: undefined;
};

type AuthStackParamList = {
  Welcome: undefined;
  Login: undefined;
  Register: undefined;
};

type OnboardingStackParamList = {
  Introduction: undefined;
  ChildInfo: undefined;
  Preferences: undefined;
};

type MainTabParamList = {
  Today: undefined;
  Schedule: undefined;
  Analytics: undefined;
  Settings: undefined;
};

// Create navigators
const RootStack = createNativeStackNavigator<RootStackParamList>();
const AuthStack = createNativeStackNavigator<AuthStackParamList>();
const OnboardingStack = createNativeStackNavigator<OnboardingStackParamList>();
const MainTab = createBottomTabNavigator<MainTabParamList>();

// Auth navigator
const AuthNavigator = () => (
  <AuthStack.Navigator screenOptions={{ headerShown: false }}>
    <AuthStack.Screen name="Welcome" component={PlaceholderScreen} />
    <AuthStack.Screen name="Login" component={PlaceholderScreen} />
    <AuthStack.Screen name="Register" component={PlaceholderScreen} />
  </AuthStack.Navigator>
);

// Onboarding navigator
const OnboardingNavigator = () => (
  <OnboardingStack.Navigator screenOptions={{ headerShown: false }}>
    <OnboardingStack.Screen name="Introduction" component={PlaceholderScreen} />
    <OnboardingStack.Screen name="ChildInfo" component={PlaceholderScreen} />
    <OnboardingStack.Screen name="Preferences" component={PlaceholderScreen} />
  </OnboardingStack.Navigator>
);

// Main tab navigator
const MainNavigator = () => (
  <MainTab.Navigator>
    <MainTab.Screen name="Today" component={PlaceholderScreen} />
    <MainTab.Screen name="Schedule" component={PlaceholderScreen} />
    <MainTab.Screen name="Analytics" component={PlaceholderScreen} />
    <MainTab.Screen name="Settings" component={PlaceholderScreen} />
  </MainTab.Navigator>
);

// Root navigator
export const Navigation = () => {
  const { user, isLoading, children } = useApp();
  
  // Show loading screen if app is loading
  if (isLoading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <Text>Loading...</Text>
      </View>
    );
  }
  
  return (
    <NavigationContainer>
      <RootStack.Navigator screenOptions={{ headerShown: false }}>
        {!user ? (
          <RootStack.Screen name="Auth" component={AuthNavigator} />
        ) : children.length === 0 ? (
          <RootStack.Screen name="Onboarding" component={OnboardingNavigator} />
        ) : (
          <RootStack.Screen name="Main" component={MainNavigator} />
        )}
      </RootStack.Navigator>
    </NavigationContainer>
  );
};
