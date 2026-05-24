import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Platform } from 'react-native';
import { Feather, Ionicons } from '@expo/vector-icons';
import { COLORS, SIZES, LAYOUT } from '../constants/theme';
import { useStateContext } from '../context/StateContext';

export default function BookingScreen({ navigation, route }) {
  const { currentUser, clinics, doctors, addAppointment } = useStateContext();
  
  // Default to parameter from ClinicsScreen, or first clinic
  const initialClinicName = route.params?.selectedClinicName || clinics[0].name;
  
  const [selectedClinic, setSelectedClinic] = useState(initialClinicName);
  const [showClinicDropdown, setShowClinicDropdown] = useState(false);
  
  const [selectedDoctor, setSelectedDoctor] = useState(null);
  const [showDoctorDropdown, setShowDoctorDropdown] = useState(false);
  
  const [selectedTime, setSelectedTime] = useState('10:00');
  const timeSlots = ["08:00", "09:00", "10:00", "11:00", "12:00", "13:00"];

  // Filter doctors based on selected clinic
  const filteredDoctors = doctors.filter(
    doc => doc.clinic.toLowerCase().includes(selectedClinic.toLowerCase())
  );

  // Set active doctor to first filtered doctor if not set or invalid
  const activeDoctor = selectedDoctor || filteredDoctors[0] || doctors[0];

  const handleConfirm = () => {
    addAppointment({
      patientName: currentUser?.name || 'Kiddo',
      doctorName: activeDoctor.name,
      doctorTitle: activeDoctor.specialty,
      clinicName: selectedClinic,
      date: '2026-05-28',
      time: `${selectedTime} AM`,
      type: activeDoctor.specialty.includes('Dentist') ? 'Dentist Appointment' : 'General Checkup'
    });
    navigation.navigate('Confirmation');
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerContent}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
            <Ionicons name="arrow-back" size={24} color="#FFFFFF" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Book Appointment</Text>
          <View style={{ width: 24 }} />
        </View>
      </View>

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        {/* Clinic Selector */}
        <Text style={styles.sectionLabel}>Select Clinic</Text>
        <View style={{ zIndex: 20, position: 'relative' }}>
          <TouchableOpacity 
            style={styles.inputBox} 
            onPress={() => {
              setShowClinicDropdown(!showClinicDropdown);
              setShowDoctorDropdown(false);
            }}
          >
            <Text style={styles.inputText}>{selectedClinic}</Text>
            <Feather name="chevron-down" size={20} color={COLORS.primary} />
          </TouchableOpacity>

          {showClinicDropdown && (
            <View style={styles.dropdown}>
              {clinics.map((clinic) => (
                <TouchableOpacity 
                  key={clinic.id} 
                  style={styles.dropdownItem}
                  onPress={() => {
                    setSelectedClinic(clinic.name);
                    setSelectedDoctor(null); // Reset doctor when clinic changes
                    setShowClinicDropdown(false);
                  }}
                >
                  <Text style={styles.dropdownItemText}>{clinic.name}</Text>
                </TouchableOpacity>
              ))}
            </View>
          )}
        </View>

        {/* Doctor Selector */}
        <Text style={styles.sectionLabel}>Select Doctor</Text>
        <View style={{ zIndex: 10, position: 'relative' }}>
          <TouchableOpacity 
            style={styles.inputBox} 
            onPress={() => {
              setShowDoctorDropdown(!showDoctorDropdown);
              setShowClinicDropdown(false);
            }}
          >
            <Text style={styles.inputText}>
              {activeDoctor ? `${activeDoctor.name} (${activeDoctor.specialty})` : 'Select Doctor'}
            </Text>
            <Feather name="chevron-down" size={20} color={COLORS.primary} />
          </TouchableOpacity>

          {showDoctorDropdown && (
            <View style={styles.dropdown}>
              {filteredDoctors.map((doc) => (
                <TouchableOpacity 
                  key={doc.id} 
                  style={styles.dropdownItem}
                  onPress={() => {
                    setSelectedDoctor(doc);
                    setShowDoctorDropdown(false);
                  }}
                >
                  <Text style={styles.dropdownItemText}>{doc.name} ({doc.specialty})</Text>
                </TouchableOpacity>
              ))}
            </View>
          )}
        </View>

        {/* Date Display */}
        <Text style={styles.sectionLabel}>Select Date</Text>
        <View style={styles.inputBox}>
          <Text style={styles.inputText}>2026-05-28</Text>
          <Feather name="calendar" size={20} color={COLORS.primary} />
        </View>

        {/* Time Selector */}
        <Text style={styles.sectionLabel}>Select Time</Text>
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
    paddingBottom: 40,
  },
  sectionLabel: {
    fontSize: 15,
    fontWeight: '700',
    color: COLORS.primary,
    marginBottom: 8,
    marginTop: 10,
  },
  inputBox: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: SIZES.radius,
    padding: 16,
    marginBottom: 16,
    backgroundColor: COLORS.surface,
    shadowColor: '#0F2C59',
    shadowOpacity: 0.02,
    shadowRadius: 5,
    elevation: 1,
  },
  inputText: {
    fontSize: 15,
    color: COLORS.primary,
    fontWeight: '600',
  },
  dropdown: {
    position: 'absolute',
    top: 55,
    left: 0,
    right: 0,
    backgroundColor: '#FFFFFF',
    borderRadius: SIZES.radius,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    shadowColor: '#0F2C59',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 5,
    zIndex: 100,
  },
  dropdownItem: {
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
  },
  dropdownItemText: {
    color: COLORS.primary,
    fontSize: 15,
    fontWeight: '600',
  },
  matrixContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: 24,
    gap: 8,
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
    fontWeight: '600',
  },
  timeTextActive: {
    color: COLORS.surface,
    fontWeight: 'bold',
  },
  confirmButton: {
    backgroundColor: COLORS.primary,
    borderRadius: SIZES.radius,
    paddingVertical: 18,
    alignItems: 'center',
    marginTop: 10,
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 10,
    elevation: 3,
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
    color: '#94A3B8',
    fontSize: 13,
  },
});
