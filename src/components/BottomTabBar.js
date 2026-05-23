import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, SIZES, LAYOUT } from '../constants/theme';

export default function BottomTabBar({ navigation, activeTab }) {
  return (
    <View style={styles.tabBar}>
      <TouchableOpacity style={styles.tabItem} onPress={() => navigation.navigate('Home')}>
        <Ionicons name="home" size={24} color={activeTab === 'Home' ? COLORS.primary : '#64748B'} />
        <Text style={activeTab === 'Home' ? styles.tabTextActive : styles.tabText}>Home</Text>
      </TouchableOpacity>
      
      <TouchableOpacity style={styles.tabItem} onPress={() => navigation.navigate('Appointments')}>
        <View style={styles.activeTabIcon}>
          <Ionicons name="calendar" size={24} color={activeTab === 'Appointments' ? COLORS.primary : '#64748B'} />
          <View style={styles.badge} />
        </View>
        <Text style={activeTab === 'Appointments' ? styles.tabTextActive : styles.tabText}>Appointments</Text>
      </TouchableOpacity>
      
      <TouchableOpacity style={styles.tabItem} onPress={() => navigation.navigate('Records')}>
        <Ionicons name="newspaper" size={24} color={activeTab === 'Records' ? COLORS.primary : '#64748B'} />
        <Text style={activeTab === 'Records' ? styles.tabTextActive : styles.tabText}>Updates</Text>
      </TouchableOpacity>
      
      <TouchableOpacity style={styles.tabItem} onPress={() => navigation.navigate('Profile')}>
        <Ionicons name="person-outline" size={24} color={activeTab === 'Profile' ? COLORS.primary : '#64748B'} />
        <Text style={activeTab === 'Profile' ? styles.tabTextActive : styles.tabText}>Profile</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  tabBar: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderTopColor: '#E2E8F0',
    height: LAYOUT.tabBarHeight + LAYOUT.bottomPadding,
    paddingBottom: LAYOUT.bottomPadding,
    paddingHorizontal: SIZES.margin,
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  tabItem: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    height: LAYOUT.tabBarHeight,
  },
  activeTabIcon: {
    position: 'relative',
  },
  badge: {
    position: 'absolute',
    top: 0,
    right: -2,
    width: 8,
    height: 8,
    backgroundColor: '#EF4444',
    borderRadius: 4,
  },
  tabText: {
    fontSize: 11,
    color: '#64748B',
    marginTop: 4,
  },
  tabTextActive: {
    fontSize: 11,
    color: COLORS.primary,
    fontWeight: 'bold',
    marginTop: 4,
  },
});

