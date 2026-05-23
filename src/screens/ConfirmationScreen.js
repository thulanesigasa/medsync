import React from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Alert,
} from "react-native";

import * as Calendar from "expo-calendar";

import {
  Ionicons,
  FontAwesome5,
  MaterialCommunityIcons,
} from "@expo/vector-icons";

import { COLORS, SIZES, LAYOUT } from "../constants/theme";
import BottomTabBar from "../components/BottomTabBar";

export default function ConfirmationScreen({ navigation, route }) {
  // ✅ receive booking data from Booking screen
  const { doctor, date, time } = route.params || {};

  const getCalendarPermission = async () => {
    const { status } = await Calendar.requestCalendarPermissionsAsync();
    return status === "granted";
  };

  const getDefaultCalendarSource = async () => {
    const calendars = await Calendar.getCalendarsAsync(
      Calendar.EntityTypes.EVENT,
    );

    const defaultCalendar = calendars.find((cal) => cal.allowsModifications);

    return defaultCalendar ? defaultCalendar.source : undefined;
  };

  const addToCalendar = async () => {
    try {
      const hasPermission = await getCalendarPermission();

      if (!hasPermission) {
        Alert.alert("Permission required", "Calendar access is needed.");
        return;
      }

      const calendarSource = await getDefaultCalendarSource();

      const calendarId = await Calendar.createCalendarAsync({
        title: "MedSync Appointments",
        color: "#4F46E5",
        entityType: Calendar.EntityTypes.EVENT,
        sourceId: calendarSource?.id,
        source: calendarSource,
        name: "MedSync Calendar",
        ownerAccount: "personal",
        accessLevel: Calendar.CalendarAccessLevel.OWNER,
      });

      const startDate = new Date(`${date} ${time}`);
      const endDate = new Date(startDate.getTime() + 30 * 60000);

      await Calendar.createEventAsync(calendarId, {
        title: `Doctor Appointment - ${doctor?.name}`,
        location: doctor?.clinic,
        startDate,
        endDate,
        notes: `Appointment with ${doctor?.name} (${doctor?.specialty})`,
      });

      Alert.alert("Success", "Added to calendar!");
    } catch (error) {
      console.log(error);
      Alert.alert("Error", "Could not add to calendar");
    }
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerContent}>
          <View style={styles.headerBrand}>
            <MaterialCommunityIcons
              name="shield-plus"
              size={32}
              color="#FFFFFF"
            />
            <Text style={styles.headerTitle}>MedSync</Text>
          </View>
        </View>
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        {/* Success */}
        <View style={styles.successHeader}>
          <Ionicons name="checkmark-circle" size={28} color={COLORS.success} />
          <Text style={styles.successTitle}>Appointment Confirmed!</Text>
        </View>

        {/* Ticket */}
        <View style={styles.ticketCard}>
          <View style={styles.detailsBlock}>
            <Text style={styles.patientName}>Kiddo</Text>
            <Text style={styles.doctorName}>{doctor?.name || "Doctor"}</Text>
            <Text style={styles.clinicName}>{doctor?.clinic || "Clinic"}</Text>

            <View style={styles.detailRow}>
              <Ionicons name="time-outline" size={18} color={COLORS.primary} />
              <Text style={styles.detailText}>{time || "Not set"}</Text>
            </View>
          </View>
        </View>

        {/* Buttons */}
        <View style={styles.actionRow}>
          <TouchableOpacity
            style={styles.outlineButton}
            onPress={addToCalendar}
          >
            <Ionicons
              name="calendar-outline"
              size={18}
              color={COLORS.primary}
            />
            <Text style={styles.outlineButtonText}>Add to Calendar</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>

      <BottomTabBar navigation={navigation} activeTab="Appointments" />
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
  headerBrand: {
    flexDirection: "row",
    alignItems: "center",
  },
  headerTitle: {
    color: "#FFFFFF",
    fontSize: 22,
    fontWeight: "bold",
    marginLeft: 10,
  },
  content: {
    padding: SIZES.margin,
    paddingBottom: 120,
    gap: SIZES.gutter,
  },
  successHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginTop: 10,
    marginBottom: 5,
  },
  successTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: COLORS.primary,
    marginLeft: 8,
  },
  successSubtitle: {
    textAlign: "center",
    color: "#64748B",
    fontSize: 14,
    marginBottom: 8,
  },
  divider: {
    height: 1,
    backgroundColor: COLORS.border,
    marginBottom: 8,
  },
  ticketCard: {
    backgroundColor: COLORS.surface,
    borderRadius: SIZES.radius,
    padding: 16,
    flexDirection: "row",
    borderWidth: 1,
    borderColor: COLORS.border,
    shadowColor: "#000",
    shadowOpacity: 0.03,
    shadowRadius: 5,
    elevation: 1,
  },
  dateBlock: {
    backgroundColor: COLORS.primary,
    borderRadius: 8,
    padding: 15,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 20,
    width: 80,
  },
  dateWeekday: {
    fontSize: 14,
    color: "#FFFFFF",
  },
  dateDay: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#FFFFFF",
    marginVertical: 2,
  },
  dateMonth: {
    fontSize: 14,
    color: "#FFFFFF",
  },
  detailsBlock: {
    flex: 1,
    justifyContent: "center",
  },
  patientName: {
    fontSize: 18,
    fontWeight: "bold",
    color: COLORS.primary,
    marginBottom: 2,
  },
  doctorName: {
    fontSize: 15,
    fontWeight: "600",
    color: COLORS.primary,
    marginBottom: 2,
  },
  clinicName: {
    fontSize: 13,
    color: "#64748B",
    marginBottom: 10,
  },
  detailRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
    borderTopWidth: 1,
    borderTopColor: "#F1F5F9",
    paddingTop: 8,
  },
  detailIcon: {
    marginRight: 10,
    width: 20,
    textAlign: "center",
  },
  detailText: {
    fontSize: 15,
    color: COLORS.primary,
  },
  actionRow: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  outlineButton: {
    flex: 0.48,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 20,
    paddingVertical: 12,
    backgroundColor: COLORS.surface,
  },
  fullOutlineButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 20,
    paddingVertical: 12,
    backgroundColor: COLORS.surface,
  },
  outlineButtonText: {
    color: COLORS.primary,
    fontWeight: "600",
    marginLeft: 8,
  },
  complianceBox: {
    backgroundColor: "#F0F4F8",
    borderRadius: 8,
    padding: 16,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  complianceTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: COLORS.primary,
    marginBottom: 10,
  },
  listItem: {
    flexDirection: "row",
    marginBottom: 8,
    alignItems: "flex-start",
  },
  bulletPoint: {
    fontSize: 16,
    color: COLORS.primary,
    marginRight: 10,
    lineHeight: 20,
  },
  listText: {
    fontSize: 14,
    color: COLORS.primary,
    flex: 1,
    lineHeight: 20,
  },
});
