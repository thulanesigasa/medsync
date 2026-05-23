import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, SIZES, LAYOUT } from '../constants/theme';

export default function BottomTabBar({ navigation, activeTab }) {
  const isHome = activeTab === 'Home';
  const isAppt = activeTab === 'Appointments';
  const isUpdt = activeTab === 'Records'; // activeTab for records is 'Records' internally
  const isProf = activeTab === 'Profile';

  return (
    <View style={styles.tabBar}>
      <TouchableOpacity style={styles.tabItem} onPress={() => navigation.navigate('Home')}>
        <Ionicons name={isHome ? "home" : "home-outline"} size={22} color={isHome ? COLORS.primary : '#94A3B8'} />
        <Text style={isHome ? styles.tabTextActive : styles.tabText}>Home</Text>
        {isHome && <View style={styles.activeDot} />}
      </TouchableOpacity>
      
      <TouchableOpacity style={styles.tabItem} onPress={() => navigation.navigate('Appointments')}>
        <View style={styles.activeTabIcon}>
          <Ionicons name={isAppt ? "calendar" : "calendar-outline"} size={22} color={isAppt ? COLORS.primary : '#94A3B8'} />
          <View style={styles.badge} />
        </View>
        <Text style={isAppt ? styles.tabTextActive : styles.tabText}>Appointments</Text>
        {isAppt && <View style={styles.activeDot} />}
      </TouchableOpacity>
      
      <TouchableOpacity style={styles.tabItem} onPress={() => navigation.navigate('Records')}>
        <Ionicons name={isUpdt ? "newspaper" : "newspaper-outline"} size={22} color={isUpdt ? COLORS.primary : '#94A3B8'} />
        <Text style={isUpdt ? styles.tabTextActive : styles.tabText}>Updates</Text>
        {isUpdt && <View style={styles.activeDot} />}
      </TouchableOpacity>
      
      <TouchableOpacity style={styles.tabItem} onPress={() => navigation.navigate('Profile')}>
        <Ionicons name={isProf ? "person" : "person-outline"} size={22} color={isProf ? COLORS.primary : '#94A3B8'} />
        <Text style={isProf ? styles.tabTextActive : styles.tabText}>Profile</Text>
        {isProf && <View style={styles.activeDot} />}
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
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    height: LAYOUT.tabBarHeight,
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 8,
    borderWidth: 1,
    borderColor: '#EAE8FC',
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
