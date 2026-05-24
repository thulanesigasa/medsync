import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { Feather, Ionicons } from '@expo/vector-icons';
import { COLORS, SIZES, LAYOUT } from '../constants/theme';
import { useStateContext } from '../context/StateContext';

export default function BookingScreen({ navigation }) {
  const { currentUser, addAppointment } = useStateContext();
  const [selectedTime, setSelectedTime] = useState('10:00');
  const timeSlots = ["08:00", "09:00", "10:00", "11:00", "12:00", "13:00"];

  const handleConfirm = () => {
    addAppointment({
      patientName: currentUser?.name || 'Kiddo',
      doctorName: 'Dr. Chris Nkwanyana',
      doctorTitle: 'Dentist Specialist',
      clinicName: 'Dawn Park Clinic',
      date: '2026-05-28',
      time: `${selectedTime} AM`,
      type: 'Dentist Appointment'
    });
    navigation.navigate('Confirmation');
  };

  return (
    <View style={styles.container}>
      {/* Header with platform heights */}
      <View style={styles.header}>
        <View style={styles.headerContent}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
            <Ionicons name="arrow-back" size={24} color="#FFFFFF" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Book Appointment</Text>
          <View style={{ width: 24 }} />
        </View>
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.sectionLabel}>Select clinic</Text>
        <View style={styles.inputBox}>
          <Text style={styles.inputText}>Dawn Park Clinic</Text>
          <Feather name="chevron-down" size={20} color={COLORS.primary} />
        </View>

        <Text style={styles.sectionLabel}>Select date</Text>
        <View style={styles.inputBox}>
          <Text style={styles.inputText}>2026-05-28</Text>
          <Feather name="calendar" size={20} color={COLORS.primary} />
        </View>

        <Text style={styles.sectionLabel}>Select time</Text>
        <View style={styles.matrixContainer}>
          {timeSlots.map((time, index) => {
            const isActive = selectedTime === time;
            return (
              <TouchableOpacity
                key={index}
                style={[styles.timeSlot, isActive && styles.timeSlotActive]}
                onPress={() => setSelectedTime(time)}
              >
                <Text style={[styles.timeText, isActive && styles.timeTextActive]}>
                  {time}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>

        <TouchableOpacity style={styles.confirmButton} onPress={handleConfirm}>
          <Text style={styles.confirmButtonText}>CONFIRM</Text>
        </TouchableOpacity>
      </ScrollView>

      <View style={styles.footer}>
        <Text style={styles.footerText}>Powered by Hokma Tech</Text>
      </View>
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
  backButton: {
    padding: 4,
  },
  headerTitle: {
    color: '#FFFFFF',
    fontSize: 20,
    fontWeight: 'bold',
  },
  content: {
    padding: SIZES.margin,
  },
  sectionLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.primary,
    marginBottom: 8,
  },
  inputBox: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: SIZES.radius,
    padding: 16,
    marginBottom: 20,
    backgroundColor: COLORS.surface,
  },
  inputText: {
    fontSize: 16,
    color: COLORS.primary,
  },
  matrixContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: 20,
    gap: 8, // space slots
  },
  timeSlot: {
    width: '31%',
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: SIZES.radius,
    paddingVertical: 14,
    alignItems: 'center',
    backgroundColor: COLORS.surface,
  },
  timeSlotActive: {
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primary,
  },
  timeText: {
    fontSize: 15,
    color: COLORS.primary,
  },
  timeTextActive: {
    color: COLORS.surface,
    fontWeight: '600',
  },
  confirmButton: {
    backgroundColor: COLORS.primary,
    borderRadius: SIZES.radius,
    paddingVertical: 18,
    alignItems: 'center',
    marginTop: 10,
  },
  confirmButtonText: {
    color: COLORS.surface,
    fontSize: 16,
    fontWeight: 'bold',
    letterSpacing: 1,
  },
  footer: {
    paddingBottom: 30,
    alignItems: 'center',
  },
  footerText: {
    color: '#64748B',
    fontSize: 14,
  },
});

