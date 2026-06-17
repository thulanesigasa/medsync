import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, SIZES, LAYOUT } from '../constants/theme';
import { useTheme } from '../context/ThemeContext';

export default function BottomTabBar({ navigation, activeTab, isAdmin = false, onTabPress }) {
  const { theme, isDark } = useTheme();
  
  const activeColor = isDark ? '#3B82F6' : COLORS.primary;
  const isHome = activeTab === 'Home';
  const isAppt = activeTab === 'Appointments';
  const isUpdt = activeTab === 'Records'; // activeTab for records is 'Records' internally
  const isChat = activeTab === 'Chats';
  const isProf = activeTab === 'Profile';

  if (isAdmin) {
    const isDash = activeTab === 'overview';
    const isAdminAppt = activeTab === 'bookings';
    const isPat = activeTab === 'patients';
    const isAdminChat = activeTab === 'chats';
    const isAdminProf = activeTab === 'manage';

    return (
      <View style={[styles.tabBar, { backgroundColor: theme.surface, borderColor: theme.border }]}>
        <TouchableOpacity style={styles.tabItem} onPress={() => onTabPress ? onTabPress('overview') : navigation.navigate('Admin')}>
          <Ionicons name={isDash ? "grid" : "grid-outline"} size={22} color={isDash ? activeColor : '#94A3B8'} />
          <Text style={[isDash ? styles.tabTextActive : styles.tabText, isDash && { color: activeColor }]}>Dashboard</Text>
          {isDash && <View style={[styles.activeDot, { backgroundColor: activeColor }]} />}
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.tabItem} onPress={() => onTabPress ? onTabPress('bookings') : navigation.navigate('Appointments')}>
          <View style={styles.activeTabIcon}>
            <Ionicons name={isAdminAppt ? "calendar" : "calendar-outline"} size={22} color={isAdminAppt ? activeColor : '#94A3B8'} />
          </View>
          <Text style={[isAdminAppt ? styles.tabTextActive : styles.tabText, isAdminAppt && { color: activeColor }]}>Bookings</Text>
          {isAdminAppt && <View style={[styles.activeDot, { backgroundColor: activeColor }]} />}
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.tabItem} onPress={() => onTabPress ? onTabPress('patients') : navigation.navigate('Records')}>
          <Ionicons name={isPat ? "people" : "people-outline"} size={22} color={isPat ? activeColor : '#94A3B8'} />
          <Text style={[isPat ? styles.tabTextActive : styles.tabText, isPat && { color: activeColor }]}>Patients</Text>
          {isPat && <View style={[styles.activeDot, { backgroundColor: activeColor }]} />}
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.tabItem} onPress={() => onTabPress ? onTabPress('chats') : navigation.navigate('Chats')}>
          <Ionicons name={isAdminChat ? "chatbubbles" : "chatbubbles-outline"} size={22} color={isAdminChat ? activeColor : '#94A3B8'} />
          <Text style={[isAdminChat ? styles.tabTextActive : styles.tabText, isAdminChat && { color: activeColor }]}>Chats</Text>
          {isAdminChat && <View style={[styles.activeDot, { backgroundColor: activeColor }]} />}
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.tabItem} onPress={() => onTabPress ? onTabPress('manage') : navigation.navigate('Profile')}>
          <Ionicons name={isAdminProf ? "settings" : "settings-outline"} size={22} color={isAdminProf ? activeColor : '#94A3B8'} />
          <Text style={[isAdminProf ? styles.tabTextActive : styles.tabText, isAdminProf && { color: activeColor }]}>Manage</Text>
          {isAdminProf && <View style={[styles.activeDot, { backgroundColor: activeColor }]} />}
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={[styles.tabBar, { backgroundColor: theme.surface, borderColor: theme.border }]}>
      <TouchableOpacity style={styles.tabItem} onPress={() => navigation.navigate('Home')}>
        <Ionicons name={isHome ? "home" : "home-outline"} size={22} color={isHome ? activeColor : '#94A3B8'} />
        <Text style={[isHome ? styles.tabTextActive : styles.tabText, isHome && { color: activeColor }]}>Home</Text>
        {isHome && <View style={[styles.activeDot, { backgroundColor: activeColor }]} />}
      </TouchableOpacity>
      
      <TouchableOpacity style={styles.tabItem} onPress={() => navigation.navigate('Appointments')}>
        <View style={styles.activeTabIcon}>
          <Ionicons name={isAppt ? "calendar" : "calendar-outline"} size={22} color={isAppt ? activeColor : '#94A3B8'} />
          <View style={styles.badge} />
        </View>
        <Text style={[isAppt ? styles.tabTextActive : styles.tabText, isAppt && { color: activeColor }]}>Appointments</Text>
        {isAppt && <View style={[styles.activeDot, { backgroundColor: activeColor }]} />}
      </TouchableOpacity>
      
      <TouchableOpacity style={styles.tabItem} onPress={() => navigation.navigate('Records')}>
        <Ionicons name={isUpdt ? "newspaper" : "newspaper-outline"} size={22} color={isUpdt ? activeColor : '#94A3B8'} />
        <Text style={[isUpdt ? styles.tabTextActive : styles.tabText, isUpdt && { color: activeColor }]}>Updates</Text>
        {isUpdt && <View style={[styles.activeDot, { backgroundColor: activeColor }]} />}
      </TouchableOpacity>
      
      <TouchableOpacity style={styles.tabItem} onPress={() => navigation.navigate('Chats')}>
        <Ionicons name={isChat ? "chatbubbles" : "chatbubbles-outline"} size={22} color={isChat ? activeColor : '#94A3B8'} />
        <Text style={[isChat ? styles.tabTextActive : styles.tabText, isChat && { color: activeColor }]}>Chats</Text>
        {isChat && <View style={[styles.activeDot, { backgroundColor: activeColor }]} />}
      </TouchableOpacity>
      
      <TouchableOpacity style={styles.tabItem} onPress={() => navigation.navigate('Profile')}>
        <Ionicons name={isProf ? "person" : "person-outline"} size={22} color={isProf ? activeColor : '#94A3B8'} />
        <Text style={[isProf ? styles.tabTextActive : styles.tabText, isProf && { color: activeColor }]}>Profile</Text>
        {isProf && <View style={[styles.activeDot, { backgroundColor: activeColor }]} />}
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  tabBar: {
    position: 'absolute',
    bottom: Platform.OS === 'ios' ? 28 : 16,
    left: SIZES.margin,
    right: SIZES.margin,
    flexDirection: 'row',
    borderRadius: 24,
    height: LAYOUT.tabBarHeight,
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 8,
    borderWidth: 1,
    shadowColor: '#0F2C59',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.08,
    shadowRadius: 16,
    elevation: 8,
  },
  tabItem: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    height: '100%',
  },
  activeTabIcon: {
    position: 'relative',
  },
  badge: {
    position: 'absolute',
    top: -2,
    right: -2,
    width: 6,
    height: 6,
    backgroundColor: '#EF4444',
    borderRadius: 3,
  },
  tabText: {
    fontSize: 10,
    color: '#94A3B8',
    marginTop: 2,
    fontWeight: '500',
  },
  tabTextActive: {
    fontSize: 10,
    color: COLORS.primary,
    fontWeight: '700',
    marginTop: 2,
  },
  activeDot: {
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: COLORS.primary,
    position: 'absolute',
    bottom: 4,
  }
});
