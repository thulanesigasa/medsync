import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import { Feather, Ionicons } from "@expo/vector-icons";
import { COLORS, SIZES, LAYOUT } from "../constants/theme";

export default function BookingScreen({ navigation, route }) {
  const doctor = route?.params?.doctor;

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

  const [selectedTime, setSelectedTime] = useState("12:00");
  const timeSlots = ["08:00", "09:00", "10:00", "11:00", "12:00", "13:00"];

  const handleConfirm = () => {
    navigation.navigate("Confirmation", { doctor, selectedTime });
  };

  return (
    <View style={styles.container}>
      {/* HEADER */}
      <View style={styles.header}>
        <View style={styles.headerContent}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Ionicons name="arrow-back" size={24} color="#FFFFFF" />
          </TouchableOpacity>

          <Text style={styles.headerTitle}>Book Appointment</Text>

          <View style={{ width: 24 }} />
        </View>
      </View>

      {/* CONTENT */}
      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.sectionLabel}>
          {doctor?.name || "Select Doctor"}
        </Text>

        <Text style={{ color: "#64748B", marginBottom: 20 }}>
          {doctor?.specialty}
        </Text>

        <Text style={styles.sectionLabel}>Select Time</Text>

        <View style={styles.matrixContainer}>
          {timeSlots.map((time) => {
            const isActive = selectedTime === time;

            return (
              <TouchableOpacity
                key={time}
                style={[styles.timeSlot, isActive && styles.timeSlotActive]}
                onPress={() => setSelectedTime(time)}
              >
                <Text
                  style={[styles.timeText, isActive && styles.timeTextActive]}
                >
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

      {/* FOOTER */}
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
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: SIZES.margin,
  },
  headerTitle: {
    color: "#FFFFFF",
    fontSize: 20,
    fontWeight: "bold",
  },
  content: {
    padding: SIZES.margin,
  },
  sectionLabel: {
    fontSize: 16,
    fontWeight: "600",
    color: COLORS.primary,
    marginBottom: 8,
  },
  matrixContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    marginBottom: 20,
    gap: 8,
  },
  timeSlot: {
    width: "31%",
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: SIZES.radius,
    paddingVertical: 14,
    alignItems: "center",
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
    fontWeight: "600",
  },
  confirmButton: {
    backgroundColor: COLORS.primary,
    borderRadius: SIZES.radius,
    paddingVertical: 18,
    alignItems: "center",
    marginTop: 10,
  },
  confirmButtonText: {
    color: COLORS.surface,
    fontSize: 16,
    fontWeight: "bold",
    letterSpacing: 1,
  },
  footer: {
    paddingBottom: 30,
    alignItems: "center",
  },
  footerText: {
    color: "#64748B",
    fontSize: 14,
  },
});
