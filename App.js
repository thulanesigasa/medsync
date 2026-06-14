import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { ThemeProvider } from './src/context/ThemeContext';
import { AuthProvider, useAuth } from './src/context/AuthContext';
import { ClinicProvider } from './src/context/ClinicContext';
import { AppointmentProvider } from './src/context/AppointmentContext';
import { ChatProvider } from './src/context/ChatContext';
import { ToastProvider } from './src/context/ToastContext';

import LoginScreen from './src/screens/LoginScreen';
import SignupScreen from './src/screens/SignupScreen';
import AdminScreen from './src/screens/AdminScreen';
import HomeScreen from './src/screens/HomeScreen';
import BookingScreen from './src/screens/BookingScreen';
import ConfirmationScreen from './src/screens/ConfirmationScreen';
import AppointmentsScreen from './src/screens/AppointmentsScreen';
import RecordsScreen from './src/screens/RecordsScreen';
import ProfileScreen from './src/screens/ProfileScreen';
import ClinicsScreen from './src/screens/ClinicsScreen';
import NotificationsScreen from './src/screens/NotificationsScreen';
import ChatsScreen from './src/screens/ChatsScreen';
import DoctorProfileScreen from './src/screens/DoctorProfileScreen';
import { View, ActivityIndicator, Text, TouchableOpacity, StyleSheet, Modal } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useState } from 'react';

const Stack = createNativeStackNavigator();

function AppNavigator() {
  const { currentUser, isAuthLoaded } = useAuth();
  const [isLocked, setIsLocked] = useState(true);

  if (!isAuthLoaded) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#0F172A' }}>
        <ActivityIndicator size="large" color="#3B82F6" />
      </View>
    );
  }

  // Show lock screen if user is logged in but app is locked
  if (currentUser && isLocked) {
    return (
      <View style={styles.lockContainer}>
        <Ionicons name="finger-print" size={80} color="#3B82F6" style={{ marginBottom: 20 }} />
        <Text style={styles.lockTitle}>App Locked</Text>
        <Text style={styles.lockSub}>Verify your identity to continue</Text>
        
        <TouchableOpacity style={styles.unlockBtn} onPress={() => setIsLocked(false)}>
          <Text style={styles.unlockBtnText}>Use Face ID / Touch ID</Text>
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.pinBtn} onPress={() => setIsLocked(false)}>
          <Text style={styles.pinBtnText}>Use PIN instead</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <NavigationContainer>
      <Stack.Navigator 
        initialRouteName={currentUser ? (currentUser.role === 'admin' ? 'Admin' : 'Home') : 'Login'}
        screenOptions={{ headerShown: false }}
      >
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="Signup" component={SignupScreen} />
        <Stack.Screen name="Admin" component={AdminScreen} />
        <Stack.Screen name="Home" component={HomeScreen} />
        <Stack.Screen name="DoctorProfile" component={DoctorProfileScreen} />
        <Stack.Screen name="Booking" component={BookingScreen} />
        <Stack.Screen name="Confirmation" component={ConfirmationScreen} />
        <Stack.Screen name="Appointments" component={AppointmentsScreen} />
        <Stack.Screen name="Records" component={RecordsScreen} />
        <Stack.Screen name="Chats" component={ChatsScreen} />
        <Stack.Screen name="Profile" component={ProfileScreen} />
        <Stack.Screen name="Clinics" component={ClinicsScreen} />
        <Stack.Screen name="Notifications" component={NotificationsScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <ClinicProvider>
          <ChatProvider>
            <AppointmentProvider>
              <ToastProvider>
                <AppNavigator />
              </ToastProvider>
            </AppointmentProvider>
          </ChatProvider>
        </ClinicProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}

const styles = StyleSheet.create({
  lockContainer: {
    flex: 1,
    backgroundColor: '#0F172A',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  lockTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 8,
  },
  lockSub: {
    fontSize: 14,
    color: '#94A3B8',
    marginBottom: 40,
  },
  unlockBtn: {
    backgroundColor: '#3B82F6',
    paddingVertical: 14,
    paddingHorizontal: 30,
    borderRadius: 30,
    marginBottom: 16,
    width: '100%',
    alignItems: 'center',
  },
  unlockBtnText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  pinBtn: {
    paddingVertical: 14,
    paddingHorizontal: 30,
    borderRadius: 30,
    width: '100%',
    alignItems: 'center',
  },
  pinBtnText: {
    color: '#3B82F6',
    fontSize: 16,
    fontWeight: '600',
  }
});
