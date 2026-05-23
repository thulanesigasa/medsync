import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { COLORS, SIZES, LAYOUT } from "../constants/theme";

export default function BookingScreen({ navigation, route }) {
  const doctor = route?.params?.doctor;

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

        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text
            style={{
              textAlign: "center",
              marginTop: 10,
              color: COLORS.primary,
            }}
          >
            Go back
          </Text>
        </TouchableOpacity>
      </View>
    );
  }

  const handleConfirm = () => {
    navigation.navigate("Confirmation", {
      doctor,
      selectedTime,
      date: new Date().toDateString(),
    });
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
        <Text style={styles.doctorName}>{doctor.name}</Text>
        <Text style={styles.specialty}>{doctor.specialty}</Text>

        <Text style={styles.sectionTitle}>Select Time</Text>

        <View style={styles.timeGrid}>
          {timeSlots.map((time) => {
            const active = selectedTime === time;

            return (
              <TouchableOpacity
                key={time}
                onPress={() => setSelectedTime(time)}
                style={[
                  styles.timeBox,
                  active && { backgroundColor: COLORS.primary },
                ]}
              >
                <Text style={{ color: active ? "#fff" : COLORS.primary }}>
                  {time}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>

        <TouchableOpacity style={styles.button} onPress={handleConfirm}>
          <Text style={styles.buttonText}>CONFIRM APPOINTMENT</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff" },

  header: {
    backgroundColor: COLORS.primary,
    paddingTop: LAYOUT.statusBarHeight,
    height: LAYOUT.headerHeight + LAYOUT.statusBarHeight,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
  },

  headerTitle: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },

  content: {
    padding: 20,
  },

  doctorName: {
    fontSize: 22,
    fontWeight: "bold",
    color: COLORS.primary,
  },

  specialty: {
    color: "#64748B",
    marginBottom: 20,
  },

  sectionTitle: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 10,
  },

  timeGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
  },

  timeBox: {
    borderWidth: 1,
    borderColor: COLORS.primary,
    padding: 12,
    borderRadius: 10,
    width: "30%",
    alignItems: "center",
  },

  button: {
    marginTop: 30,
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
