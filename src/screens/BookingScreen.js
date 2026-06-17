import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from "react-native";

import { Ionicons, Feather } from "@expo/vector-icons";
import { Calendar } from "react-native-calendars";

import { COLORS, SIZES, LAYOUT } from "../constants/theme";
import { useStateContext } from "../context/StateContext";

export default function BookingScreen({ navigation, route }) {
  const doctor = route?.params?.doctor;
  const { currentUser, addAppointment } = useStateContext();

  const [selectedDate, setSelectedDate] = useState(
    new Date().toISOString().split("T")[0],
  );

  const [selectedTime, setSelectedTime] = useState("12:00");

  const timeSlots = ["08:00", "09:00", "10:00", "11:00", "12:00", "13:00"];

  if (!doctor) {
    return (
      <View style={styles.container}>
        <Text style={styles.emptyText}>No doctor selected</Text>
      </View>
    );
  }

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
        id: Date.now().toString(),
        patientName: currentUser?.name || "Kiddo",
        doctorName: doctor?.name || "Doctor",
        doctorTitle: doctor?.specialty || "Specialist",
        clinicName: doctor?.clinic || "Clinic",
        date: selectedDate,
        time: selectedTime,
        type: doctor?.specialty || "Appointment",
        status: "Confirmed",
        reminderSet: false,
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
        <Text style={styles.sectionLabel}>Selected clinic</Text>

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

        <View style={styles.timeGrid}>
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
                  disabled && styles.timeBoxDisabled,
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

  emptyText: {
    textAlign: "center",
    marginTop: 40,
    color: COLORS.primary,
    fontSize: 16,
    fontWeight: "600",
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
    color: "#FFFFFF",
    fontSize: 18,
    fontWeight: "bold",
  },

  content: {
    padding: SIZES.margin,
    paddingBottom: 40,
  },

  doctorName: {
    fontSize: 24,
    fontWeight: "bold",
    color: COLORS.primary,
    marginBottom: 6,
  },

  specialty: {
    fontSize: 15,
    color: "#64748B",
    marginBottom: 4,
  },

  clinic: {
    fontSize: 14,
    color: COLORS.primary,
    fontWeight: "600",
    marginBottom: 20,
  },

  sectionLabel: {
    fontSize: 15,
    fontWeight: "bold",
    color: COLORS.primary,
    marginBottom: 10,
    marginTop: 16,
  },

  inputBox: {
    backgroundColor: COLORS.surface,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: COLORS.border,
    paddingHorizontal: 14,
    paddingVertical: 14,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },

  inputText: {
    color: COLORS.primary,
    fontSize: 14,
    fontWeight: "600",
  },

  calendar: {
    borderRadius: 16,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: COLORS.border,
  },

  timeGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
  },

  timeBox: {
    width: "30%",
    paddingVertical: 12,
    borderRadius: 12,
    backgroundColor: COLORS.surface,
    borderWidth: 1,
    borderColor: COLORS.border,
    alignItems: "center",
  },

  timeBoxActive: {
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primary,
  },

  timeBoxDisabled: {
    opacity: 0.3,
  },

  timeText: {
    color: COLORS.primary,
    fontWeight: "600",
  },

  timeTextActive: {
    color: "#FFFFFF",
  },

  button: {
    marginTop: 30,
    backgroundColor: COLORS.primary,
    borderRadius: 14,
    paddingVertical: 16,
    alignItems: "center",
  },

  buttonText: {
    color: "#FFFFFF",
    fontSize: 15,
    fontWeight: "bold",
    letterSpacing: 0.5,
  },
});
