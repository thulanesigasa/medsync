import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, SIZES, LAYOUT } from '../constants/theme';

export default function DoctorProfileScreen({ navigation, route }) {
  const doctor = route?.params?.doctor;

  if (!doctor) return null;

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Doctor Profile</Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.profileHeader}>
          <View style={styles.avatarLarge}>
             <Text style={styles.avatarText}>{doctor.name?.replace('Dr. ', '').charAt(0)}</Text>
          </View>
          <Text style={styles.doctorName}>{doctor.name}</Text>
          <Text style={styles.specialty}>{doctor.specialty}</Text>
          
          <View style={styles.statsRow}>
            <View style={styles.statBox}>
              <Ionicons name="star" size={20} color="#F59E0B" />
              <Text style={styles.statValue}>{doctor.rating}</Text>
              <Text style={styles.statLabel}>Rating</Text>
            </View>
            <View style={styles.statBox}>
              <Ionicons name="chatbubble-ellipses" size={20} color={COLORS.primary} />
              <Text style={styles.statValue}>{doctor.reviews}</Text>
              <Text style={styles.statLabel}>Reviews</Text>
            </View>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>About</Text>
          <Text style={styles.aboutText}>
            {doctor.name} is a highly experienced {doctor.specialty?.toLowerCase()} at {doctor.clinic}. 
            They are committed to providing the highest quality of care to patients.
          </Text>
        </View>
        
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Availability</Text>
          <View style={styles.shiftsGrid}>
            {['Mon', 'Tue', 'Wed', 'Thu', 'Fri'].map(day => (
              <View key={day} style={styles.shiftCard}>
                <Text style={styles.shiftDay}>{day}</Text>
                <Text style={styles.shiftTime}>08:00 - 16:00</Text>
              </View>
            ))}
          </View>
        </View>
      </ScrollView>

      <View style={styles.footer}>
        <TouchableOpacity 
          style={styles.bookButton}
          onPress={() => navigation.navigate("Booking", { doctor })}
        >
          <Text style={styles.bookButtonText}>Book Appointment</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F8FAFC' },
  header: { backgroundColor: COLORS.primary, paddingTop: LAYOUT.statusBarHeight, height: LAYOUT.statusBarHeight + LAYOUT.headerHeight, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 16 },
  headerTitle: { color: '#FFF', fontSize: 18, fontWeight: 'bold' },
  content: { padding: 20, paddingBottom: 100 },
  profileHeader: { alignItems: 'center', marginBottom: 24 },
  avatarLarge: { width: 100, height: 100, borderRadius: 50, backgroundColor: '#E0E7FF', alignItems: 'center', justifyContent: 'center', marginBottom: 16 },
  avatarText: { fontSize: 40, fontWeight: 'bold', color: COLORS.primary },
  doctorName: { fontSize: 24, fontWeight: 'bold', color: '#1E293B', marginBottom: 4 },
  specialty: { fontSize: 16, color: '#64748B', marginBottom: 20 },
  statsRow: { flexDirection: 'row', gap: 20, justifyContent: 'center' },
  statBox: { alignItems: 'center', backgroundColor: '#FFF', padding: 16, borderRadius: 16, minWidth: 100, shadowColor: '#000', shadowOpacity: 0.05, shadowRadius: 10, elevation: 2 },
  statValue: { fontSize: 18, fontWeight: 'bold', color: '#1E293B', marginTop: 8 },
  statLabel: { fontSize: 12, color: '#64748B', marginTop: 4 },
  section: { marginBottom: 24 },
  sectionTitle: { fontSize: 18, fontWeight: 'bold', color: '#1E293B', marginBottom: 12 },
  aboutText: { fontSize: 15, color: '#475569', lineHeight: 24 },
  shiftsGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 10, justifyContent: 'space-between' },
  shiftCard: { backgroundColor: '#FFF', padding: 12, borderRadius: 12, width: '48%', shadowColor: '#000', shadowOpacity: 0.02, shadowRadius: 5, elevation: 1 },
  shiftDay: { fontSize: 14, fontWeight: 'bold', color: '#1E293B' },
  shiftTime: { fontSize: 12, color: '#64748B', marginTop: 4 },
  footer: { position: 'absolute', bottom: 0, left: 0, right: 0, padding: 20, backgroundColor: '#FFF', borderTopWidth: 1, borderTopColor: '#E2E8F0', shadowColor: '#000', shadowOffset: { width: 0, height: -3 }, shadowOpacity: 0.05, shadowRadius: 10, elevation: 5 },
  bookButton: { backgroundColor: COLORS.primary, padding: 16, borderRadius: 16, alignItems: 'center' },
  bookButtonText: { color: '#FFF', fontSize: 16, fontWeight: 'bold' }
});
