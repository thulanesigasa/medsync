import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Ionicons } from "@expo/vector-icons";
import { Calendar } from "react-native-calendars";
import { COLORS, SIZES, LAYOUT } from "../constants/theme";

export default function BookingScreen({ navigation, route }) {
  const doctor = route?.params?.doctor;

  const [selectedDate, setSelectedDate] = useState(
    new Date().toISOString().split("T")[0],
  );

  const [selectedTime, setSelectedTime] = useState("10:00");

  const timeSlots = [
    "08:00",
    "09:00",
    "10:00",
    "11:00",
    "12:00",
    "13:00",
    "14:00",
  ];

  if (!doctor) {
    return (
      <View style={styles.container}>
        <Text style={{ textAlign: "center", marginTop: 20 }}>
          No doctor selected
        </Text>
      </View>
    );
  }

  // 🚫 disable past times (simple logic)
  const now = new Date();
  const currentHour = now.getHours();

  const isPastTime = (time) => {
    if (selectedDate !== now.toISOString().split("T")[0]) return false;

    const hour = parseInt(time.split(":")[0], 10);
    return hour < currentHour;
  };

  const handleConfirm = async () => {
    try {
      const appointment = {
        id: Date.now().toString(),
        doctor,
        date: selectedDate,
        time: selectedTime,
        status: "Confirmed",
      };

      // get old appointments
      const existingAppointments = await AsyncStorage.getItem("appointments");

      let appointments = [];

      if (existingAppointments) {
        appointments = JSON.parse(existingAppointments);
      }

      // add new appointment
      appointments.push(appointment);

      // save updated appointments
      await AsyncStorage.setItem("appointments", JSON.stringify(appointments));

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

        {/* CALENDAR PICKER */}
        <Text style={styles.sectionTitle}>Select Date</Text>

        <Calendar
          onDayPress={(day) => setSelectedDate(day.dateString)}
          markedDates={{
            [selectedDate]: {
              selected: true,
              selectedColor: COLORS.primary,
            },
          }}
          minDate={new Date().toISOString().split("T")[0]}
        />

        {/* TIME */}
        <Text style={styles.sectionTitle}>Select Time</Text>

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
                  active && { backgroundColor: COLORS.primary },
                  disabled && { opacity: 0.3 },
                ]}
              >
                <Text
                  style={{
                    color: active ? "#fff" : COLORS.primary,
                  }}
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
  container: { flex: 1, backgroundColor: COLORS.background },

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
    fontSize: 22,
    fontWeight: "bold",
    color: COLORS.primary,
  },

  specialty: {
    color: "#64748B",
  },

  clinic: {
    color: "#94A3B8",
    marginBottom: 10,
  },

  sectionTitle: {
    marginTop: 15,
    marginBottom: 10,
    fontWeight: "bold",
    color: COLORS.primary,
  },

  timeGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
  },

  timeBox: {
    padding: 10,
    borderWidth: 1,
    borderColor: COLORS.primary,
    borderRadius: 10,
  },

  button: {
    marginTop: 20,
    backgroundColor: COLORS.primary,
    padding: 15,
    borderRadius: 12,
    alignItems: "center",
  },

  buttonText: {
    color: "#fff",
    fontWeight: "bold",
  },
});
