import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  SafeAreaView,
  TextInput,
  ScrollView,
  Modal,
  Alert
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

// Define ImprovedSleepTrackingForm component first
function ImprovedSleepTrackingForm({ onClose }) {
  // State variables
  const [startTime, setStartTime] = useState(new Date());
  const [endTime, setEndTime] = useState(null);
  const [notes, setNotes] = useState('');
  const [timerValue, setTimerValue] = useState('00:00:00');
  const [isTimerRunning, setIsTimerRunning] = useState(true);
  
  // Timer functionality
  useEffect(() => {
    let interval;
    if (isTimerRunning) {
      interval = setInterval(() => {
        const now = new Date();
        const diff = now - startTime;
        const hours = Math.floor(diff / (1000 * 60 * 60));
        const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((diff % (1000 * 60)) / 1000);
        
        setTimerValue(
          `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`
        );
      }, 1000);
    }
    
    return () => clearInterval(interval);
  }, [startTime, isTimerRunning]);
  
  // Format time for display
  const formatTime = (date) => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };
  
  // Handle end sleep
  const handleEndSleep = () => {
    setEndTime(new Date());
    setIsTimerRunning(false);
  };
  
  // Handle save
  const handleSave = () => {
    // Here we would normally save to a database
    const sleepData = {
      startTime,
      endTime: endTime || new Date(), // Use current time if endTime is null
      duration: timerValue,
      notes,
      isOngoing: !endTime
    };
    
    alert(`Sleep logged: ${sleepData.isOngoing ? 'Ongoing' : 'Completed'}, duration: ${sleepData.duration}`);
    onClose();
  };
  
  // Handle cancel
  const handleCancel = () => {
    onClose();
  };
  
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Log Sleep</Text>
        <TouchableOpacity onPress={handleCancel}>
          <Text style={styles.closeButton}>✕</Text>
        </TouchableOpacity>
      </View>
      
      <View style={styles.timerContainer}>
        <Text style={styles.timerValue}>{timerValue}</Text>
        <Text style={styles.timerLabel}>{isTimerRunning ? 'Sleep in progress' : 'Sleep ended'}</Text>
      </View>
      
      <View style={styles.timeContainer}>
        <View style={styles.timeField}>
          <Text style={styles.label}>Start Time</Text>
          <TouchableOpacity style={styles.timeButton}>
            <Text>{formatTime(startTime)}</Text>
          </TouchableOpacity>
        </View>
        
        <View style={styles.timeField}>
          <Text style={styles.label}>End Time</Text>
          {endTime ? (
            <TouchableOpacity style={styles.timeButton}>
              <Text>{formatTime(endTime)}</Text>
            </TouchableOpacity>
          ) : (
            <TouchableOpacity 
              style={styles.endSleepButton}
              onPress={handleEndSleep}
            >
              <Text style={styles.endSleepButtonText}>End Sleep</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>
      
      <View style={styles.notesContainer}>
        <Text style={styles.label}>Notes</Text>
        <TextInput
          style={styles.notesInput}
          placeholder="Add any notes about this sleep session"
          value={notes}
          onChangeText={setNotes}
          multiline
        />
      </View>
      
      <View style={styles.buttonContainer}>
        <TouchableOpacity 
          style={styles.cancelButton}
          onPress={handleCancel}
        >
          <Text style={styles.cancelButtonText}>Cancel</Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={styles.saveButton}
          onPress={handleSave}
        >
          <Text style={styles.saveButtonText}>Save</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

// Welcome Screen Component
function WelcomeScreen({ navigation }) {
  return (
    <View style={styles.content}>
      <Text style={styles.title}>Hatchling</Text>
      <Text style={styles.subtitle}>Track, understand, and nurture your baby's growth</Text>
      
      <View style={styles.placeholderImage} />
      
      <TouchableOpacity 
        style={styles.primaryButton}
        onPress={() => navigation.navigate('Register')}
      >
        <Text style={styles.primaryButtonText}>Create an account</Text>
      </TouchableOpacity>
      
      <TouchableOpacity 
        style={styles.secondaryButton}
        onPress={() => navigation.navigate('Login')}
      >
        <Text style={styles.secondaryButtonText}>Log in</Text>
      </TouchableOpacity>
    </View>
  );
}

// Login Screen Component
function LoginScreen({ navigation }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // Validate email format
  const validateEmail = (email) => {
    const re = /\S+@\S+\.\S+/;
    return re.test(email);
  };

  // Handle login
  const handleLogin = () => {
    // Reset errors
    setEmailError('');
    setPasswordError('');
    
    // Validate inputs
    let isValid = true;
    
    if (!email) {
      setEmailError('Email is required');
      isValid = false;
    } else if (!validateEmail(email)) {
      setEmailError('Please enter a valid email');
      isValid = false;
    }
    
    if (!password) {
      setPasswordError('Password is required');
      isValid = false;
    } else if (password.length < 6) {
      setPasswordError('Password must be at least 6 characters');
      isValid = false;
    }
    
    if (isValid) {
      setIsLoading(true);
      
      // Simulate API call
      setTimeout(() => {
        setIsLoading(false);
        navigation.navigate('Dashboard');
      }, 1500);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.loginContent}>
        {/* Back button */}
        <TouchableOpacity 
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Text style={styles.backButtonText}>← Back</Text>
        </TouchableOpacity>
        
        <Text style={styles.title}>Welcome back</Text>
        <Text style={styles.subtitle}>Log in to continue tracking your baby's growth</Text>
        
        {/* Email input */}
        <View style={styles.inputContainer}>
          <Text style={styles.inputLabel}>Email</Text>
          <TextInput
            style={[styles.input, emailError ? styles.inputError : null]}
            placeholder="Enter your email"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
          />
          {emailError ? <Text style={styles.errorText}>{emailError}</Text> : null}
        </View>
        
        {/* Password input */}
        <View style={styles.inputContainer}>
          <Text style={styles.inputLabel}>Password</Text>
          <TextInput
            style={[styles.input, passwordError ? styles.inputError : null]}
            placeholder="Enter your password"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
          />
          {passwordError ? <Text style={styles.errorText}>{passwordError}</Text> : null}
        </View>
        
        {/* Forgot password */}
        <TouchableOpacity 
          style={styles.forgotPasswordButton}
          onPress={() => Alert.alert('Forgot Password', 'Reset password functionality coming soon!')}
        >
          <Text style={styles.forgotPasswordText}>Forgot password?</Text>
        </TouchableOpacity>
        
        {/* Login button */}
        <TouchableOpacity 
          style={styles.primaryButton}
          onPress={handleLogin}
          disabled={isLoading}
        >
          <Text style={styles.primaryButtonText}>
            {isLoading ? 'Logging in...' : 'Log in'}
          </Text>
        </TouchableOpacity>
        
        {/* Sign up link */}
        <View style={styles.signupContainer}>
          <Text style={styles.signupText}>Don't have an account? </Text>
          <TouchableOpacity onPress={() => navigation.navigate('Register')}>
            <Text style={styles.signupLink}>Sign up</Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
}

// Register Screen Component
function RegisterScreen({ navigation }) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [nameError, setNameError] = useState('');
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [confirmPasswordError, setConfirmPasswordError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // Validate email format
  const validateEmail = (email) => {
    const re = /\S+@\S+\.\S+/;
    return re.test(email);
  };

  // Handle registration
  const handleRegister = () => {
    // Reset errors
    setNameError('');
    setEmailError('');
    setPasswordError('');
    setConfirmPasswordError('');
    
    // Validate inputs
    let isValid = true;
    
    if (!name) {
      setNameError('Name is required');
      isValid = false;
    }
    
    if (!email) {
      setEmailError('Email is required');
      isValid = false;
    } else if (!validateEmail(email)) {
      setEmailError('Please enter a valid email');
      isValid = false;
    }
    
    if (!password) {
      setPasswordError('Password is required');
      isValid = false;
    } else if (password.length < 6) {
      setPasswordError('Password must be at least 6 characters');
      isValid = false;
    }
    
    if (!confirmPassword) {
      setConfirmPasswordError('Please confirm your password');
      isValid = false;
    } else if (password !== confirmPassword) {
      setConfirmPasswordError('Passwords do not match');
      isValid = false;
    }
    
    if (isValid) {
      setIsLoading(true);
      
      // Simulate API call
      setTimeout(() => {
        setIsLoading(false);
        navigation.navigate('Dashboard');
      }, 1500);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.loginContent}>
        {/* Back button */}
        <TouchableOpacity 
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Text style={styles.backButtonText}>← Back</Text>
        </TouchableOpacity>
        
        <Text style={styles.title}>Create an account</Text>
        <Text style={styles.subtitle}>Sign up to start tracking your baby's growth</Text>
        
        {/* Name input */}
        <View style={styles.inputContainer}>
          <Text style={styles.inputLabel}>Name</Text>
          <TextInput
            style={[styles.input, nameError ? styles.inputError : null]}
            placeholder="Enter your name"
            value={name}
            onChangeText={setName}
          />
          {nameError ? <Text style={styles.errorText}>{nameError}</Text> : null}
        </View>
        
        {/* Email input */}
        <View style={styles.inputContainer}>
          <Text style={styles.inputLabel}>Email</Text>
          <TextInput
            style={[styles.input, emailError ? styles.inputError : null]}
            placeholder="Enter your email"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
          />
          {emailError ? <Text style={styles.errorText}>{emailError}</Text> : null}
        </View>
        
        {/* Password input */}
        <View style={styles.inputContainer}>
          <Text style={styles.inputLabel}>Password</Text>
          <TextInput
            style={[styles.input, passwordError ? styles.inputError : null]}
            placeholder="Create a password"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
          />
          {passwordError ? <Text style={styles.errorText}>{passwordError}</Text> : null}
        </View>
        
        {/* Confirm Password input */}
        <View style={styles.inputContainer}>
          <Text style={styles.inputLabel}>Confirm Password</Text>
          <TextInput
            style={[styles.input, confirmPasswordError ? styles.inputError : null]}
            placeholder="Confirm your password"
            value={confirmPassword}
            onChangeText={setConfirmPassword}
            secureTextEntry
          />
          {confirmPasswordError ? <Text style={styles.errorText}>{confirmPasswordError}</Text> : null}
        </View>
        
        {/* Register button */}
        <TouchableOpacity 
          style={styles.primaryButton}
          onPress={handleRegister}
          disabled={isLoading}
        >
          <Text style={styles.primaryButtonText}>
            {isLoading ? 'Creating account...' : 'Create Account'}
          </Text>
        </TouchableOpacity>
        
        {/* Login link */}
        <View style={styles.signupContainer}>
          <Text style={styles.signupText}>Already have an account? </Text>
          <TouchableOpacity onPress={() => navigation.navigate('Login')}>
            <Text style={styles.signupLink}>Log in</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

// Dashboard Screen Component
function DashboardScreen({ navigation }) {
  // We'll use this state to track the current tab
  const [activeTab, setActiveTab] = useState('timeline');
  const [modalVisible, setModalVisible] = useState(false);
  const [trackingType, setTrackingType] = useState('');
  
  const handleFabPress = () => {
    setModalVisible(true);
  };
  
  // Mock data for our dashboard
  const babyData = {
    name: 'Mari',
    age: '3 months',
    photoUrl: null, // We'll add a photo feature later
    todayStats: {
      sleep: '2h 30m',
      feeds: 3,
      diapers: 4
    },
    currentStatus: 'napping',
    nextActivity: 'Feeding at 3:00 PM'
  };

  // Render the appropriate content based on active tab
  const renderContent = () => {
    switch (activeTab) {
      case 'timeline':
        return (
          <View style={{ padding: 20 }}>
            <View style={{ 
              backgroundColor: 'white', 
              borderRadius: 10, 
              padding: 15, 
              marginBottom: 20 
            }}>
              <Text style={{ fontSize: 16, fontWeight: 'bold', marginBottom: 10 }}>Current Status</Text>
              <Text style={{ fontSize: 18, marginBottom: 5 }}>{babyData.name} is {babyData.currentStatus}</Text>
              <Text style={{ fontSize: 14, color: '#718096' }}>What's next: {babyData.nextActivity}</Text>
            </View>
            
            <View style={{ backgroundColor: 'white', borderRadius: 10, padding: 15 }}>
              <Text style={{ fontSize: 16, fontWeight: 'bold', marginBottom: 10 }}>Recent Activity</Text>
              
              <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 15 }}>
                <View style={{ 
                  width: 40, 
                  height: 40, 
                  borderRadius: 20, 
                  backgroundColor: '#9F7AEA',
                  justifyContent: 'center',
                  alignItems: 'center'
                }}>
                  <Text>😴</Text>
                </View>
                <View style={{ marginLeft: 10 }}>
                  <Text style={{ fontSize: 16, fontWeight: 'bold' }}>Nap</Text>
                  <Text style={{ fontSize: 14, color: '#718096' }}>Started at 12:00 PM (ongoing)</Text>
                </View>
              </View>
              
              <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 15 }}>
                <View style={{ 
                  width: 40, 
                  height: 40, 
                  borderRadius: 20, 
                  backgroundColor: '#4FD1C5',
                  justifyContent: 'center',
                  alignItems: 'center'
                }}>
                  <Text>🧷</Text>
                </View>
                <View style={{ marginLeft: 10 }}>
                  <Text style={{ fontSize: 16, fontWeight: 'bold' }}>Diaper</Text>
                  <Text style={{ fontSize: 14, color: '#718096' }}>11:30 AM · Wet</Text>
                </View>
              </View>
              
              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <View style={{ 
                  width: 40, 
                  height: 40, 
                  borderRadius: 20, 
                  backgroundColor: '#F6BD60',
                  justifyContent: 'center',
                  alignItems: 'center'
                }}>
                  <Text>🍼</Text>
                </View>
                <View style={{ marginLeft: 10 }}>
                  <Text style={{ fontSize: 16, fontWeight: 'bold' }}>Feeding</Text>
                  <Text style={{ fontSize: 14, color: '#718096' }}>10:15 AM · Bottle · 4 oz</Text>
                </View>
              </View>
            </View>
          </View>
        );
      case 'schedule':
        return (
          <View style={{ padding: 20, alignItems: 'center', justifyContent: 'center' }}>
            <Text style={{ fontSize: 18, color: '#718096', marginTop: 50 }}>Schedule View Coming Soon</Text>
          </View>
        );
      case 'cards':
        return (
          <View style={{ padding: 20, alignItems: 'center', justifyContent: 'center' }}>
            <Text style={{ fontSize: 18, color: '#718096', marginTop: 50 }}>Card View Coming Soon</Text>
          </View>
        );
      default:
        return null;
    }
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#f8f9fa' }}>
      {/* Header */}
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', padding: 20 }}>
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <View style={{ 
            width: 40, 
            height: 40, 
            borderRadius: 20, 
            backgroundColor: '#A4C3B2',
            justifyContent: 'center',
            alignItems: 'center'
          }}>
            <Text style={{ fontSize: 18, fontWeight: 'bold', color: 'white' }}>M</Text>
          </View>
          <View style={{ marginLeft: 10 }}>
            <Text style={{ fontSize: 18, fontWeight: 'bold' }}>{babyData.name}</Text>
            <Text style={{ fontSize: 14, color: '#718096' }}>{babyData.age}</Text>
          </View>
        </View>
        <TouchableOpacity>
          <View style={{ 
            width: 40, 
            height: 40, 
            borderRadius: 20, 
            backgroundColor: '#f8f9fa',
            justifyContent: 'center',
            alignItems: 'center',
            borderWidth: 1,
            borderColor: '#E2E8F0'
          }}>
            <Text style={{ fontSize: 18, color: '#718096' }}>⚙️</Text>
          </View>
        </TouchableOpacity>
      </View>
      
      {/* Stats */}
      <View style={{ flexDirection: 'row', justifyContent: 'space-around', marginBottom: 20 }}>
        <View style={{ alignItems: 'center' }}>
          <Text style={{ fontSize: 24, fontWeight: 'bold', color: '#6B9080' }}>{babyData.todayStats.feeds}</Text>
          <Text style={{ fontSize: 14, color: '#718096' }}>Feedings</Text>
        </View>
        <View style={{ alignItems: 'center' }}>
          <Text style={{ fontSize: 24, fontWeight: 'bold', color: '#6B9080' }}>{babyData.todayStats.diapers}</Text>
          <Text style={{ fontSize: 14, color: '#718096' }}>Diapers</Text>
        </View>
        <View style={{ alignItems: 'center' }}>
          <Text style={{ fontSize: 24, fontWeight: 'bold', color: '#6B9080' }}>{babyData.todayStats.sleep}</Text>
          <Text style={{ fontSize: 14, color: '#718096' }}>Sleep</Text>
        </View>
      </View>
      
      {/* Tabs */}
      <View style={{ flexDirection: 'row', justifyContent: 'space-around', marginBottom: 20 }}>
        <TouchableOpacity 
          style={{ 
            paddingVertical: 10, 
            paddingHorizontal: 20, 
            borderRadius: 20,
            backgroundColor: activeTab === 'timeline' ? '#6B9080' : 'transparent'
          }}
          onPress={() => setActiveTab('timeline')}
        >
          <Text style={{ 
            color: activeTab === 'timeline' ? 'white' : '#718096',
            fontWeight: activeTab === 'timeline' ? 'bold' : 'normal'
          }}>
            Timeline
          </Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={{ 
            paddingVertical: 10, 
            paddingHorizontal: 20, 
            borderRadius: 20,
            backgroundColor: activeTab === 'schedule' ? '#6B9080' : 'transparent'
          }}
          onPress={() => setActiveTab('schedule')}
        >
          <Text style={{ 
            color: activeTab === 'schedule' ? 'white' : '#718096',
            fontWeight: activeTab === 'schedule' ? 'bold' : 'normal'
          }}>
            Schedule
          </Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={{ 
            paddingVertical: 10, 
            paddingHorizontal: 20, 
            borderRadius: 20,
            backgroundColor: activeTab === 'cards' ? '#6B9080' : 'transparent'
          }}
          onPress={() => setActiveTab('cards')}
        >
          <Text style={{ 
            color: activeTab === 'cards' ? 'white' : '#718096',
            fontWeight: activeTab === 'cards' ? 'bold' : 'normal'
          }}>
            Cards
          </Text>
        </TouchableOpacity>
      </View>
      
      {/* Content */}
      <ScrollView>
        {renderContent()}
      </ScrollView>
      
      {/* FAB */}
      <TouchableOpacity 
        style={{ 
          position: 'absolute', 
          bottom: 20, 
          right: 20, 
          width: 60, 
          height: 60, 
          borderRadius: 30, 
          backgroundColor: '#6B9080',
          justifyContent: 'center',
          alignItems: 'center',
          elevation: 5,
          shadowColor: '#000',
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 0.25,
          shadowRadius: 3.84,
        }}
        onPress={handleFabPress}
      >
        <Text style={{ fontSize: 30, color: 'white' }}>+</Text>
      </TouchableOpacity>
      
      {/* Modal */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => {
          setModalVisible(!modalVisible);
        }}
      >
        <View style={{ 
          flex: 1, 
          justifyContent: 'flex-end',
          backgroundColor: 'rgba(0,0,0,0.5)'
        }}>
          <View style={{ 
            backgroundColor: 'white',
            borderTopLeftRadius: 20,
            borderTopRightRadius: 20,
            padding: 20,
            height: '50%'
          }}>
            <View style={{ 
              flexDirection: 'row', 
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: 20
            }}>
              <Text style={{ fontSize: 20, fontWeight: 'bold' }}>Add Activity</Text>
              <TouchableOpacity onPress={() => setModalVisible(false)}>
                <Text style={{ fontSize: 20 }}>✕</Text>
              </TouchableOpacity>
            </View>
            
            {trackingType === '' ? (
              <View style={{ flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between' }}>
                <TouchableOpacity 
                  style={{ 
                    width: '48%', 
                    backgroundColor: '#9F7AEA20', 
                    padding: 15, 
                    borderRadius: 10,
                    alignItems: 'center',
                    marginBottom: 15
                  }}
                  onPress={() => setTrackingType('sleep')}
                >
                  <Text style={{ fontSize: 24 }}>😴</Text>
                  <Text style={{ marginTop: 10, fontWeight: 'bold' }}>Sleep</Text>
                </TouchableOpacity>
                
                <TouchableOpacity 
                  style={{ 
                    width: '48%', 
                    backgroundColor: '#F6BD6020', 
                    padding: 15, 
                    borderRadius: 10,
                    alignItems: 'center',
                    marginBottom: 15
                  }}
                  onPress={() => setTrackingType('feeding')}
                >
                  <Text style={{ fontSize: 24 }}>🍼</Text>
                  <Text style={{ marginTop: 10, fontWeight: 'bold' }}>Feeding</Text>
                </TouchableOpacity>
                
                <TouchableOpacity 
                  style={{ 
                    width: '48%', 
                    backgroundColor: '#4FD1C520', 
                    padding: 15, 
                    borderRadius: 10,
                    alignItems: 'center'
                  }}
                  onPress={() => setTrackingType('diaper')}
                >
                  <Text style={{ fontSize: 24 }}>🧷</Text>
                  <Text style={{ marginTop: 10, fontWeight: 'bold' }}>Diaper</Text>
                </TouchableOpacity>
                
                <TouchableOpacity 
                  style={{ 
                    width: '48%', 
                    backgroundColor: '#F6E05E20', 
                    padding: 15, 
                    borderRadius: 10,
                    alignItems: 'center'
                  }}
                  onPress={() => setTrackingType('other')}
                >
                  <Text style={{ fontSize: 24 }}>📝</Text>
                  <Text style={{ marginTop: 10, fontWeight: 'bold' }}>Other</Text>
                </TouchableOpacity>
              </View>
            ) : trackingType === 'sleep' ? (
              <ImprovedSleepTrackingForm onClose={() => {
                setTrackingType('');
                setModalVisible(false);
              }} />
            ) : (
              <View style={{ alignItems: 'center', justifyContent: 'center', flex: 1 }}>
                <Text style={{ fontSize: 18 }}>
                  {trackingType.charAt(0).toUpperCase() + trackingType.slice(1)} tracking coming soon!
                </Text>
                <TouchableOpacity 
                  style={{ 
                    marginTop: 20,
                    backgroundColor: '#6B9080',
                    paddingVertical: 10,
                    paddingHorizontal: 20,
                    borderRadius: 8
                  }}
                  onPress={() => setTrackingType('')}
                >
                  <Text style={{ color: 'white', fontWeight: 'bold' }}>Back</Text>
                </TouchableOpacity>
              </View>
            )}
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

// Create the stack navigator
const Stack = createNativeStackNavigator();

// Main App component
export default function App() {
  return (
    <NavigationContainer>
      <StatusBar style="auto" />
      <Stack.Navigator initialRouteName="Welcome" screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Welcome" component={WelcomeScreen} />
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="Register" component={RegisterScreen} />
        <Stack.Screen name="Dashboard" component={DashboardScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

// Styles
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  content: {
    flex: 1,
    padding: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loginContent: {
    flex: 1,
    padding: 20,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#6B9080',
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 16,
    color: '#718096',
    textAlign: 'center',
    marginBottom: 40,
  },
  placeholderImage: {
    width: 200,
    height: 200,
    backgroundColor: '#A4C3B2',
    borderRadius: 100,
    marginBottom: 40,
  },
  primaryButton: {
    backgroundColor: '#6B9080',
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 8,
    width: '100%',
    alignItems: 'center',
    marginBottom: 10,
  },
  primaryButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  secondaryButton: {
    backgroundColor: 'transparent',
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#6B9080',
    width: '100%',
    alignItems: 'center',
  },
  secondaryButtonText: {
    color: '#6B9080',
    fontWeight: 'bold',
  },
  backButton: {
    marginBottom: 20,
  },
  backButtonText: {
    fontSize: 16,
    color: '#718096',
  },
  inputContainer: {
    marginBottom: 20,
  },
  inputLabel: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 8,
    color: '#4A5568',
  },
  input: {
    backgroundColor: 'white',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
  },
  inputError: {
    borderColor: '#FC8181',
  },
  errorText: {
    color: '#E53E3E',
    marginTop: 5,
  },
  forgotPasswordButton: {
    alignSelf: 'flex-end',
    marginBottom: 20,
  },
  forgotPasswordText: {
    color: '#6B9080',
  },
  signupContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 20,
  },
  signupText: {
    color: '#718096',
  },
  signupLink: {
    color: '#6B9080',
    fontWeight: 'bold',
  },
  // Styles for ImprovedSleepTrackingForm
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20
  },
  closeButton: {
    fontSize: 20,
    color: '#718096'
  },
  timerContainer: {
    alignItems: 'center',
    marginBottom: 30
  },
  timerValue: {
    fontSize: 36,
    fontWeight: 'bold',
    color: '#6B9080'
  },
  timerLabel: {
    fontSize: 16,
    color: '#718096',
    marginTop: 5
  },
  timeContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20
  },
  timeField: {
    width: '48%'
  },
  label: {
    fontWeight: 'bold',
    marginBottom: 8
  },
  timeButton: {
    backgroundColor: '#F7FAFC',
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    alignItems: 'center'
  },
  endSleepButton: {
    backgroundColor: '#6B9080',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center'
  },
  endSleepButtonText: {
    color: 'white',
    fontWeight: 'bold'
  },
  notesContainer: {
    marginBottom: 30
  },
  notesInput: {
    backgroundColor: '#F7FAFC',
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    height: 100,
    textAlignVertical: 'top'
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between'
  },
  cancelButton: {
    backgroundColor: 'transparent',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#6B9080',
    width: '48%',
    alignItems: 'center'
  },
  cancelButtonText: {
    color: '#6B9080',
    fontWeight: 'bold'
  },
  saveButton: {
    backgroundColor: '#6B9080',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    width: '48%',
    alignItems: 'center'
  },
  saveButtonText: {
    color: 'white',
    fontWeight: 'bold'
  }
});
