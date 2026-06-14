import React, { useState } from "react";

import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from "react-native";

import { useAuth } from '../context/AuthContext';
import { useAppointment } from '../context/AppointmentContext';

import { Ionicons, Feather } from "@expo/vector-icons";

import { Calendar } from "react-native-calendars";

import { COLORS, SIZES, LAYOUT } from "../constants/theme";

export default function BookingScreen({ navigation, route }) {
  const { currentUser } = useAuth();
  const { addAppointment } = useAppointment();
  const doctor = route?.params?.doctor;

  const [selectedDate, setSelectedDate] = useState(
    new Date().toISOString().split("T")[0],
  );

  const [selectedTime, setSelectedTime] = useState("12:00");

  const timeSlots = ["08:00", "09:00", "10:00", "11:00", "12:00", "13:00"];

  if (!doctor) {
    return (
      <View style={styles.container}>
        <Text style={{ textAlign: "center", marginTop: 20 }}>
          No doctor selected
        </Text>
      </View>
    );
  }

  // disable past times
  const now = new Date();
  const currentHour = now.getHours();

  const isPastTime = (time) => {
    if (selectedDate !== now.toISOString().split("T")[0]) {
      return false;
    }

    const hour = parseInt(time.split(":")[0], 10);

    return hour < currentHour;
  };

  const handleConfirm = () => {
    try {
      const appointment = {
        patientName: currentUser?.name || 'Guest',
        doctorName: doctor.name,
        doctorTitle: doctor.specialty,
        clinicName: doctor.clinic,
        type: "Checkup",
        date: selectedDate,
        time: selectedTime,
        status: "Confirmed",
      };

      addAppointment(appointment);

      navigation.navigate("Confirmation", appointment);
    } catch (error) {
      console.log("Error saving appointment:", error);
    }
  };

  return (
    <View style={styles.container}>
      {/* HEADER */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color="#fff" />
        </TouchableOpacity>

        <Text style={styles.headerTitle}>Book Appointment</Text>

        <View style={{ width: 24 }} />
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        {/* DOCTOR */}
        <Text style={styles.doctorName}>{doctor.name}</Text>

        <Text style={styles.specialty}>{doctor.specialty}</Text>

        <Text style={styles.clinic}>{doctor.clinic}</Text>

        {/* CLINIC */}
        <Text style={styles.sectionLabel}>Select clinic</Text>

        <View style={styles.inputBox}>
          <Text style={styles.inputText}>{doctor.clinic}</Text>

          <Feather name="chevron-down" size={20} color={COLORS.primary} />
        </View>

        {/* DATE */}
        <Text style={styles.sectionLabel}>Select date</Text>

        <Calendar
          onDayPress={(day) => setSelectedDate(day.dateString)}
          markedDates={{
            [selectedDate]: {
              selected: true,
              selectedColor: COLORS.primary,
            },
          }}
          minDate={new Date().toISOString().split("T")[0]}
          theme={{
            todayTextColor: COLORS.primary,
            arrowColor: COLORS.primary,
          }}
          style={styles.calendar}
        />

        {/* TIME */}
        <Text style={styles.sectionLabel}>Select time</Text>

        <View style={styles.matrixContainer}>
          {timeSlots.map((time) => {
            const disabled = isPastTime(time);

            const active = selectedTime === time;

            return (
              <TouchableOpacity
                key={time}
                disabled={disabled}
                onPress={() => setSelectedTime(time)}
                style={[
                  styles.timeBox,
                  active && styles.timeBoxActive,
                  disabled && { opacity: 0.3 },
                ]}
              >
                <Text
                  style={[styles.timeText, active && styles.timeTextActive]}
                >
                  {time}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>

        {/* CONFIRM */}
        <TouchableOpacity style={styles.button} onPress={handleConfirm}>
          <Text style={styles.buttonText}>CONFIRM APPOINTMENT</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },

  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: COLORS.primary,
    paddingTop: LAYOUT.statusBarHeight,
    height: LAYOUT.statusBarHeight + LAYOUT.headerHeight,
    paddingHorizontal: SIZES.margin,
  },

  headerTitle: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },

  content: {
    padding: SIZES.margin,
    paddingBottom: 100,
  },

  doctorName: {
    fontSize: 24,
    fontWeight: "bold",
    color: COLORS.primary,
  },

  specialty: {
    fontSize: 15,
    color: "#64748B",
    marginTop: 4,
  },

  clinic: {
    color: "#94A3B8",
    marginBottom: 20,
  },

  sectionLabel: {
    fontSize: 16,
    fontWeight: "600",
    color: COLORS.primary,
    marginBottom: 10,
    marginTop: 10,
  },

  inputBox: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 14,
    padding: 16,
    marginBottom: 20,
    backgroundColor: COLORS.surface,
  },

  inputText: {
    color: COLORS.primary,
    fontSize: 15,
    fontWeight: "600",
  },

  calendar: {
    borderRadius: 16,
    overflow: "hidden",
    marginBottom: 20,
    borderWidth: 1,
    borderColor: "#EAE8FC",
  },

  matrixContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
    marginBottom: 20,
  },

  timeBox: {
    paddingVertical: 12,
    paddingHorizontal: 18,
    borderWidth: 1,
    borderColor: COLORS.primary,
    borderRadius: 12,
    backgroundColor: COLORS.surface,
  },

  timeBoxActive: {
    backgroundColor: COLORS.primary,
  },

  timeText: {
    color: COLORS.primary,
    fontWeight: "600",
  },

  timeTextActive: {
    color: "#FFFFFF",
  },

  button: {
    marginTop: 20,
    backgroundColor: COLORS.primary,
    borderRadius: 14,
    paddingVertical: 18,
    alignItems: "center",
  },

  buttonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "bold",
    letterSpacing: 1,
  },
});
