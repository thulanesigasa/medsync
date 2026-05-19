import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, SafeAreaView } from 'react-native';
import { Ionicons, FontAwesome5, MaterialCommunityIcons } from '@expo/vector-icons';
import BottomTabBar from '../components/BottomTabBar';

export default function ConfirmationScreen({ navigation }) {
  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerBrand}>
          <MaterialCommunityIcons name="shield-plus" size={32} color="#FFFFFF" />
          <Text style={styles.headerTitle}>MedSync</Text>
        </View>
        <Ionicons name="chatbubble-ellipses-outline" size={28} color="#FFFFFF" />
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        
        {/* Success Header */}
        <View style={styles.successHeader}>
          <Ionicons name="checkmark-circle" size={28} color="#22C55E" />
          <Text style={styles.successTitle}>Appointment Confirmed!</Text>
        </View>
        <Text style={styles.successSubtitle}>Your appointment has been successfully booked.</Text>

        <View style={styles.divider} />

        {/* Ticket Card */}
        <View style={styles.ticketCard}>
          <View style={styles.dateBlock}>
            <Text style={styles.dateWeekday}>Mon</Text>
            <Text style={styles.dateDay}>27</Text>
            <Text style={styles.dateMonth}>MAY</Text>
          </View>

          <View style={styles.detailsBlock}>
            <Text style={styles.patientName}>Chris Nkwanyana</Text>
            <Text style={styles.clinicName}>Dawn Park Clinic</Text>
            
            <View style={styles.detailRow}>
              <Ionicons name="time-outline" size={18} color="#162A4A" style={styles.detailIcon} />
              <Text style={styles.detailText}>10:00 AM</Text>
            </View>
            
            <View style={styles.detailRow}>
              <FontAwesome5 name="tooth" size={16} color="#162A4A" style={styles.detailIcon} />
              <Text style={styles.detailText}>Dentist Appointment</Text>
            </View>
          </View>
        </View>

        {/* Action Buttons */}
        <View style={styles.actionRow}>
          <TouchableOpacity style={styles.outlineButton}>
            <Ionicons name="calendar-outline" size={18} color="#162A4A" />
            <Text style={styles.outlineButtonText}>Add to Calendar</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.outlineButton}>
            <Ionicons name="notifications-outline" size={18} color="#162A4A" />
            <Text style={styles.outlineButtonText}>Set Reminder</Text>
          </TouchableOpacity>
        </View>

        <TouchableOpacity style={styles.fullOutlineButton}>
          <Ionicons name="location" size={18} color="#EF4444" />
          <Text style={styles.outlineButtonText}>Get Directions</Text>
        </TouchableOpacity>

        {/* Compliance Box */}
        <View style={styles.complianceBox}>
          <Text style={styles.complianceTitle}>Appointment Tips</Text>
          <View style={styles.listItem}>
            <Text style={styles.bulletPoint}>•</Text>
            <Text style={styles.listText}>Please arrive <Text style={{fontWeight: 'bold'}}>10 minutes early</Text>.</Text>
          </View>
          <View style={styles.listItem}>
            <Text style={styles.bulletPoint}>•</Text>
            <Text style={styles.listText}>Bring your ID or medical card.</Text>
          </View>
          <View style={styles.listItem}>
            <Text style={styles.bulletPoint}>•</Text>
            <Text style={styles.listText}>Wear a mask if unwell.</Text>
          </View>
        </View>

      </ScrollView>

      <BottomTabBar navigation={navigation} activeTab="Appointments" />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  header: {
    backgroundColor: '#12418B',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 15,
  },
  headerBrand: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerTitle: {
    color: '#FFFFFF',
    fontSize: 22,
    fontWeight: 'bold',
    marginLeft: 10,
  },
  content: {
    padding: 20,
  },
  successHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 10,
    marginBottom: 5,
  },
  successTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#162A4A',
    marginLeft: 8,
  },
  successSubtitle: {
    textAlign: 'center',
    color: '#64748B',
    fontSize: 14,
    marginBottom: 20,
  },
  divider: {
    height: 1,
    backgroundColor: '#E2E8F0',
    marginBottom: 20,
  },
  ticketCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    flexDirection: 'row',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 2,
    marginBottom: 25,
  },
  dateBlock: {
    backgroundColor: '#12418B',
    borderRadius: 8,
    padding: 15,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 20,
    width: 80,
  },
  dateWeekday: {
    fontSize: 14,
    color: '#FFFFFF',
  },
  dateDay: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginVertical: 2,
  },
  dateMonth: {
    fontSize: 14,
    color: '#FFFFFF',
  },
  detailsBlock: {
    flex: 1,
    justifyContent: 'center',
  },
  patientName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#162A4A',
    marginBottom: 2,
  },
  clinicName: {
    fontSize: 15,
    color: '#64748B',
    marginBottom: 15,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
    borderTopWidth: 1,
    borderTopColor: '#F1F5F9',
    paddingTop: 8,
  },
  detailIcon: {
    marginRight: 10,
    width: 20,
    textAlign: 'center',
  },
  detailText: {
    fontSize: 15,
    color: '#162A4A',
  },
  actionRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 15,
  },
  outlineButton: {
    flex: 0.48,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: 20,
    paddingVertical: 12,
  },
  fullOutlineButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: 20,
    paddingVertical: 12,
    marginBottom: 25,
  },
  outlineButtonText: {
    color: '#162A4A',
    fontWeight: '600',
    marginLeft: 8,
  },
  complianceBox: {
    backgroundColor: '#F0F4F8',
    borderRadius: 8,
    padding: 16,
  },
  complianceTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#12418B',
    marginBottom: 10,
  },
  listItem: {
    flexDirection: 'row',
    marginBottom: 8,
    alignItems: 'flex-start',
  },
  bulletPoint: {
    fontSize: 16,
    color: '#12418B',
    marginRight: 10,
    lineHeight: 20,
  },
  listText: {
    fontSize: 14,
    color: '#162A4A',
    flex: 1,
    lineHeight: 20,
  },
  tabBar: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderTopColor: '#E2E8F0',
    paddingVertical: 10,
    paddingHorizontal: 20,
    justifyContent: 'space-between',
  },
  tabItem: {
    alignItems: 'center',
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
    color: '#12418B',
    fontWeight: 'bold',
    marginTop: 4,
  },
});
