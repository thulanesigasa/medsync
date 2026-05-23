import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { COLORS, SIZES, LAYOUT } from '../constants/theme';
import BottomTabBar from '../components/BottomTabBar';

export default function HomeScreen({ navigation }) {
  const [isDark, setIsDark] = useState(false);
  
  const handleBookAppointment = () => {
    navigation.navigate('Booking');
  };

  return (
    <View style={styles.container}>
      {/* Dynamic Header */}
      <View style={styles.header}>
        <View style={styles.headerContent}>
          <View style={styles.headerBrand}>
            <MaterialCommunityIcons name="shield-plus" size={28} color="#FFFFFF" />
            <Text style={styles.appTitle}>MedSync</Text>
          </View>
          <View style={styles.headerActions}>
            <TouchableOpacity onPress={() => setIsDark(!isDark)} style={styles.actionButton}>
              <Ionicons name={isDark ? "sunny-outline" : "moon-outline"} size={24} color="#FFFFFF" />
            </TouchableOpacity>
            <TouchableOpacity style={styles.bellIconContainer} onPress={() => navigation.navigate('Notifications')}>
              <Ionicons name="notifications-outline" size={24} color="#FFFFFF" />
              <View style={styles.badge} />
            </TouchableOpacity>
          </View>
        </View>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.greetingContainer}>
          <Text style={styles.greetingTitle}>Good morning, Kiddo</Text>
          <Text style={styles.greetingSubline}>Your Health, Your Convenience</Text>
        </View>

        <View style={styles.gridContainer}>
          <View style={styles.gridRow}>
            <TouchableOpacity style={[styles.gridTile, styles.tileNavy]} onPress={handleBookAppointment}>
              <Ionicons name="card-outline" size={32} color={COLORS.surface} style={styles.tileIcon} />
              <Text style={styles.tileTextLight}>Book Appointment</Text>
            </TouchableOpacity>
            
            <TouchableOpacity style={[styles.gridTile, styles.tileWhite]} onPress={() => navigation.navigate('Appointments')}>
              <Ionicons name="calendar-outline" size={32} color={COLORS.primary} style={styles.tileIcon} />
              <Text style={styles.tileTextDark}>My Appointments</Text>
            </TouchableOpacity>
          </View>
          
          <View style={styles.gridRow}>
            <TouchableOpacity style={[styles.gridTile, styles.tileNavy]} onPress={() => navigation.navigate('Clinics')}>
              <Ionicons name="location-outline" size={32} color={COLORS.surface} style={styles.tileIcon} />
              <Text style={styles.tileTextLight}>Clinics Near Me</Text>
            </TouchableOpacity>
            
            <TouchableOpacity style={[styles.gridTile, styles.tileWhite]} onPress={() => navigation.navigate('Notifications')}>
              <View style={styles.notificationBadgeContainer}>
                <Ionicons name="chatbubbles-outline" size={32} color={COLORS.primary} style={styles.tileIcon} />
                <View style={styles.numericBadge}>
                  <Text style={styles.numericBadgeText}>3</Text>
                </View>
              </View>
              <Text style={styles.tileTextDark}>Notifications</Text>
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.reminderCard}>
          <View style={styles.reminderContent}>
            <Text style={styles.reminderTitle}>Next Visit: Jan 12, 10:00 AM</Text>
            <Text style={styles.reminderSubtitle}>Dr. Smith - General Clinic</Text>
          </View>
        </View>
      </ScrollView>

      <BottomTabBar navigation={navigation} activeTab="Home" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
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
  headerBrand: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  appTitle: {
    color: '#FFFFFF',
    fontSize: 22,
    fontWeight: 'bold',
    marginLeft: 10,
  },
  headerActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  actionButton: {
    padding: 4,
  },
  bellIconContainer: {
    position: 'relative',
  },
  badge: {
    position: 'absolute',
    top: -2,
    right: -2,
    width: 8,
    height: 8,
    backgroundColor: '#EF4444',
    borderRadius: 4,
  },
  scrollContent: {
    padding: SIZES.margin,
  },
  greetingContainer: {
    marginVertical: 16,
  },
  greetingTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: COLORS.primary,
  },
  greetingSubline: {
    fontSize: 16,
    fontStyle: 'italic',
    color: COLORS.primary,
    opacity: 0.8,
    marginTop: 4,
  },
  gridContainer: {
    marginBottom: 16,
  },
  gridRow: {
    flexDirection: 'row',
    gap: SIZES.gutter,
    marginBottom: SIZES.gutter,
  },
  gridTile: {
    flex: 1,
    padding: SIZES.padding,
    borderRadius: SIZES.radius,
    alignItems: 'flex-start',
    justifyContent: 'center',
    height: 120,
    shadowColor: '#000',
    shadowOpacity: 0.03,
    shadowRadius: 5,
    elevation: 1,
  },
  tileNavy: {
    backgroundColor: COLORS.primary,
  },
  tileWhite: {
    backgroundColor: COLORS.surface,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  tileIcon: {
    marginBottom: 10,
  },
  tileTextLight: {
    color: COLORS.surface,
    fontWeight: '600',
    fontSize: 15,
  },
  tileTextDark: {
    color: COLORS.primary,
    fontWeight: '600',
    fontSize: 15,
  },
  notificationBadgeContainer: {
    flexDirection: 'row',
  },
  numericBadge: {
    backgroundColor: '#EF4444',
    borderRadius: 10,
    width: 20,
    height: 20,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'absolute',
    top: -5,
    right: -10,
  },
  numericBadgeText: {
    color: COLORS.surface,
    fontSize: 10,
    fontWeight: 'bold',
  },
  reminderCard: {
    backgroundColor: COLORS.surface,
    borderRadius: SIZES.radius,
    borderLeftWidth: 5,
    borderLeftColor: COLORS.accent,
    padding: SIZES.padding,
    shadowColor: '#000',
    shadowOpacity: 0.03,
    shadowRadius: 5,
    elevation: 1,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  reminderContent: {
    flexDirection: 'column',
  },
  reminderTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: COLORS.primary,
    marginBottom: 5,
  },
  reminderSubtitle: {
    fontSize: 14,
    color: COLORS.primary,
    opacity: 0.8,
  },
});

