import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, SIZES, LAYOUT } from '../constants/theme';

export default function NotificationsScreen({ navigation }) {
  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerContent}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
            <Ionicons name="arrow-back" size={24} color="#FFFFFF" />
          </TouchableOpacity>
          <Text style={styles.appTitle}>Notifications</Text>
          <View style={{ width: 24 }} />
        </View>
      </View>
      
      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.notificationCard}>
          <View style={styles.unreadDot} />
          <View style={[styles.iconBox, { backgroundColor: '#EFF6FF' }]}>
            <Ionicons name="calendar" size={20} color={COLORS.primary} />
          </View>
          <View style={styles.textContainer}>
            <Text style={styles.notifTitle}>Appointment Reminder</Text>
            <Text style={styles.notifDesc}>You have a dentist appointment tomorrow at 10:00 AM.</Text>
            <Text style={styles.notifTime}>2 hours ago</Text>
          </View>
        </View>

        <View style={styles.notificationCard}>
          <View style={[styles.iconBox, { backgroundColor: '#F0FDF4' }]}>
            <Ionicons name="document-text" size={20} color={COLORS.success} />
          </View>
          <View style={styles.textContainer}>
            <Text style={styles.notifTitle}>Lab Results Ready</Text>
            <Text style={styles.notifDesc}>Your blood test results from May 10 are now available.</Text>
            <Text style={styles.notifTime}>Yesterday</Text>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    backgroundColor: COLORS.background 
  },
  header: { 
    backgroundColor: COLORS.primary,
    paddingTop: LAYOUT.statusBarHeight,
    height: LAYOUT.statusBarHeight + LAYOUT.headerHeight,
  },
  headerContent: {
    height: LAYOUT.headerHeight,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: SIZES.margin,
  },
  backButton: {
    padding: 4,
  },
  appTitle: { 
    color: '#FFFFFF', 
    fontSize: 20, 
    fontWeight: 'bold' 
  },
  content: { 
    padding: SIZES.margin,
    gap: SIZES.gutter,
  },
  notificationCard: { 
    flexDirection: 'row', 
    backgroundColor: COLORS.surface, 
    borderRadius: SIZES.radius, 
    padding: 15, 
    borderWidth: 1, 
    borderColor: COLORS.border, 
    alignItems: 'flex-start' 
  },
  unreadDot: { 
    width: 8, 
    height: 8, 
    borderRadius: 4, 
    backgroundColor: '#EF4444', 
    position: 'absolute', 
    top: 15, 
    left: 10 
  },
  iconBox: { 
    width: 40, 
    height: 40, 
    borderRadius: 20, 
    alignItems: 'center', 
    justifyContent: 'center', 
    marginRight: 15, 
    marginLeft: 5 
  },
  textContainer: { 
    flex: 1 
  },
  notifTitle: { 
    fontSize: 15, 
    fontWeight: 'bold', 
    color: COLORS.primary, 
    marginBottom: 4 
  },
  notifDesc: { 
    fontSize: 13, 
    color: '#64748B', 
    lineHeight: 18, 
    marginBottom: 6 
  },
  notifTime: { 
    fontSize: 11, 
    color: '#94A3B8', 
    fontWeight: '500' 
  }
});

