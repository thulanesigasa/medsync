import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, SafeAreaView, ScrollView } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { COLORS, SIZES } from '../constants/theme';

export default function BookingScreen({ navigation }) {
  const [selectedTime, setSelectedTime] = useState('12:00');
  const timeSlots = ["08:00", "09:00", "10:00", "11:00", "12:00", "13:00"];

  const handleConfirm = () => {
    navigation.navigate('Confirmation');
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.mainTitle}>Booking</Text>

        <Text style={styles.sectionLabel}>Select clinic</Text>
        <View style={styles.inputBox}>
          <Text style={styles.inputText}>Cape Town Family Clinic</Text>
          <Feather name="chevron-down" size={20} color="#162A4A" />
        </View>

        <Text style={styles.sectionLabel}>Select date</Text>
        <View style={styles.inputBox}>
          <Text style={styles.inputText}>2026-01-15</Text>
          <Feather name="calendar" size={20} color="#162A4A" />
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
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  content: {
    padding: 24,
  },
  mainTitle: {
    fontSize: 36,
    fontWeight: 'bold',
    color: '#162A4A',
    marginBottom: 30,
    marginTop: 20,
  },
  sectionLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#162A4A',
    marginBottom: 10,
  },
  inputBox: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: 8,
    padding: 16,
    marginBottom: 24,
  },
  inputText: {
    fontSize: 16,
    color: '#162A4A',
  },
  matrixContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: 30,
  },
  timeSlot: {
    width: '31%',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: 8,
    paddingVertical: 14,
    alignItems: 'center',
    marginBottom: 12,
    backgroundColor: '#FFFFFF',
  },
  timeSlotActive: {
    backgroundColor: '#162A4A',
    borderColor: '#162A4A',
  },
  timeText: {
    fontSize: 15,
    color: '#162A4A',
  },
  timeTextActive: {
    color: '#FFFFFF',
    fontWeight: '600',
  },
  confirmButton: {
    backgroundColor: '#162A4A',
    borderRadius: 8,
    paddingVertical: 18,
    alignItems: 'center',
    marginTop: 10,
  },
  confirmButtonText: {
    color: '#FFFFFF',
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
