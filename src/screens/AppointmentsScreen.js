import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { MaterialCommunityIcons, Ionicons, FontAwesome5 } from '@expo/vector-icons';
import { COLORS, SIZES, LAYOUT } from '../constants/theme';
import BottomTabBar from '../components/BottomTabBar';

export default function AppointmentsScreen({ navigation }) {
  const [isDark, setIsDark] = useState(false);

  return (
    <View style={styles.container}>
      {/* Header */}
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
          </View>
        </View>
      </View>
      
      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.sectionTitle}>Upcoming</Text>
        
        {/* Ticket Card */}
        <View style={styles.ticketCard}>
          <View style={styles.dateBlock}>
            <Text style={styles.dateWeekday}>Mon</Text>
            <Text style={styles.dateDay}>27</Text>
            <Text style={styles.dateMonth}>MAY</Text>
          </View>
          <View style={styles.detailsBlock}>
            <Text style={styles.clinicName}>Dawn Park Clinic</Text>
            <View style={styles.detailRow}>
              <Ionicons name="time-outline" size={16} color={COLORS.primary} style={styles.detailIcon} />
              <Text style={styles.detailText}>10:00 AM</Text>
            </View>
            <View style={styles.detailRow}>
              <FontAwesome5 name="tooth" size={14} color={COLORS.primary} style={styles.detailIcon} />
              <Text style={styles.detailText}>Dentist Appointment</Text>
            </View>
            <TouchableOpacity style={styles.rescheduleBtn}>
              <Text style={styles.rescheduleText}>Reschedule</Text>
            </TouchableOpacity>
          </View>
        </View>

        <Text style={styles.sectionTitle}>Past Appointments</Text>
        
        <View style={[styles.ticketCard, { opacity: 0.7 }]}>
          <View style={[styles.dateBlock, { backgroundColor: '#64748B' }]}>
            <Text style={styles.dateWeekday}>Fri</Text>
            <Text style={styles.dateDay}>12</Text>
            <Text style={styles.dateMonth}>APR</Text>
          </View>
          <View style={styles.detailsBlock}>
            <Text style={styles.clinicName}>City General Hospital</Text>
            <View style={styles.detailRow}>
              <Ionicons name="time-outline" size={16} color={COLORS.primary} style={styles.detailIcon} />
              <Text style={styles.detailText}>02:30 PM</Text>
            </View>
            <View style={styles.detailRow}>
              <FontAwesome5 name="stethoscope" size={14} color={COLORS.primary} style={styles.detailIcon} />
              <Text style={styles.detailText}>General Checkup</Text>
            </View>
          </View>
        </View>
      </ScrollView>
      
      <BottomTabBar navigation={navigation} activeTab="Appointments" />
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
  headerBrand: { 
    flexDirection: 'row', 
    alignItems: 'center' 
  },
  headerActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  actionButton: {
    padding: 4,
  },
  appTitle: { 
    color: '#FFFFFF', 
    fontSize: 22, 
    fontWeight: 'bold', 
    marginLeft: 10 
  },
  content: { 
    padding: SIZES.margin,
    gap: SIZES.gutter,
  },
  sectionTitle: { 
    fontSize: 18, 
    fontWeight: 'bold', 
    color: COLORS.primary, 
    marginTop: 8,
    marginBottom: -4,
  },
  ticketCard: { 
    backgroundColor: COLORS.surface, 
    borderRadius: SIZES.radius, 
    padding: 16, 
    flexDirection: 'row', 
    borderWidth: 1, 
    borderColor: COLORS.border, 
    shadowColor: '#000', 
    shadowOpacity: 0.03, 
    shadowRadius: 5, 
    elevation: 1,
  },
  dateBlock: { 
    backgroundColor: COLORS.primary, 
    borderRadius: 8, 
    padding: 15, 
    alignItems: 'center', 
    justifyContent: 'center', 
    marginRight: 15, 
    width: 75 
  },
  dateWeekday: { 
    fontSize: 12, 
    color: '#FFFFFF' 
  },
  dateDay: { 
    fontSize: 24, 
    fontWeight: 'bold', 
    color: '#FFFFFF', 
    marginVertical: 2 
  },
  dateMonth: { 
    fontSize: 12, 
    color: '#FFFFFF' 
  },
  detailsBlock: { 
    flex: 1, 
    justifyContent: 'center' 
  },
  clinicName: { 
    fontSize: 16, 
    fontWeight: 'bold', 
    color: COLORS.primary, 
    marginBottom: 10 
  },
  detailRow: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    marginBottom: 6 
  },
  detailIcon: { 
    marginRight: 8, 
    width: 16, 
    textAlign: 'center' 
  },
  detailText: { 
    fontSize: 14, 
    color: '#64748B' 
  },
  rescheduleBtn: { 
    marginTop: 10, 
    alignSelf: 'flex-start', 
    paddingVertical: 6, 
    paddingHorizontal: 12, 
    borderRadius: 20, 
    borderWidth: 1, 
    borderColor: COLORS.primary 
  },
  rescheduleText: { 
    color: COLORS.primary, 
    fontSize: 12, 
    fontWeight: '600' 
  }
});

