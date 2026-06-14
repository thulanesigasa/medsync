import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { ThemeProvider } from './src/context/ThemeContext';
import { AuthProvider } from './src/context/AuthContext';
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

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <ClinicProvider>
          <ChatProvider>
            <AppointmentProvider>
              <ToastProvider>
                <NavigationContainer>
                  <Stack.Navigator 
                    initialRouteName="Login"
                    screenOptions={{ headerShown: false }}
                  >
                    <Stack.Screen name="Login" component={LoginScreen} />
                    <Stack.Screen name="Signup" component={SignupScreen} />
                    <Stack.Screen name="Admin" component={AdminScreen} />
                    <Stack.Screen name="Home" component={HomeScreen} />
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
              </ToastProvider>
            </AppointmentProvider>
          </ChatProvider>
        </ClinicProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}
