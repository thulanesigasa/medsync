import React from 'react';
import { View, Text, StyleSheet, SafeAreaView, ScrollView, TouchableOpacity } from 'react-native';
import { MaterialCommunityIcons, Ionicons, FontAwesome5 } from '@expo/vector-icons';
import BottomTabBar from '../components/BottomTabBar';

export default function AppointmentsScreen({ navigation }) {
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <View style={styles.headerBrand}>
          <MaterialCommunityIcons name="shield-plus" size={28} color="#FFFFFF" />
          <Text style={styles.appTitle}>MedSync</Text>
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
              <Ionicons name="time-outline" size={16} color="#162A4A" style={styles.detailIcon} />
              <Text style={styles.detailText}>10:00 AM</Text>
            </View>
            <View style={styles.detailRow}>
              <FontAwesome5 name="tooth" size={14} color="#162A4A" style={styles.detailIcon} />
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
              <Ionicons name="time-outline" size={16} color="#162A4A" style={styles.detailIcon} />
              <Text style={styles.detailText}>02:30 PM</Text>
            </View>
            <View style={styles.detailRow}>
              <FontAwesome5 name="stethoscope" size={14} color="#162A4A" style={styles.detailIcon} />
              <Text style={styles.detailText}>General Checkup</Text>
            </View>
          </View>
        </View>
      </ScrollView>
      
      <BottomTabBar navigation={navigation} activeTab="Appointments" />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F8FAFC' },
  header: { backgroundColor: '#12418B', flexDirection: 'row', alignItems: 'center', paddingHorizontal: 20, paddingVertical: 15 },
  headerBrand: { flexDirection: 'row', alignItems: 'center' },
  appTitle: { color: '#FFFFFF', fontSize: 22, fontWeight: 'bold', marginLeft: 10 },
  content: { padding: 20 },
  sectionTitle: { fontSize: 18, fontWeight: 'bold', color: '#162A4A', marginBottom: 15, marginTop: 10 },
  ticketCard: { backgroundColor: '#FFFFFF', borderRadius: 12, padding: 16, flexDirection: 'row', borderWidth: 1, borderColor: '#E2E8F0', shadowColor: '#000', shadowOpacity: 0.05, shadowRadius: 10, elevation: 2, marginBottom: 20 },
  dateBlock: { backgroundColor: '#12418B', borderRadius: 8, padding: 15, alignItems: 'center', justifyContent: 'center', marginRight: 15, width: 75 },
  dateWeekday: { fontSize: 12, color: '#FFFFFF' },
  dateDay: { fontSize: 24, fontWeight: 'bold', color: '#FFFFFF', marginVertical: 2 },
  dateMonth: { fontSize: 12, color: '#FFFFFF' },
  detailsBlock: { flex: 1, justifyContent: 'center' },
  clinicName: { fontSize: 16, fontWeight: 'bold', color: '#162A4A', marginBottom: 10 },
  detailRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 6 },
  detailIcon: { marginRight: 8, width: 16, textAlign: 'center' },
  detailText: { fontSize: 14, color: '#64748B' },
  rescheduleBtn: { marginTop: 10, alignSelf: 'flex-start', paddingVertical: 6, paddingHorizontal: 12, borderRadius: 20, borderWidth: 1, borderColor: '#12418B' },
  rescheduleText: { color: '#12418B', fontSize: 12, fontWeight: '600' }
});
