import React, { useState, useEffect } from "react";

import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from "react-native";

import AsyncStorage from "@react-native-async-storage/async-storage";

import {
  MaterialCommunityIcons,
  Ionicons,
  FontAwesome5,
} from "@expo/vector-icons";

import { COLORS, SIZES, LAYOUT } from "../constants/theme";

import BottomTabBar from "../components/BottomTabBar";

export default function AppointmentsScreen({ navigation }) {
  const [isDark, setIsDark] = useState(false);
  const [appointments, setAppointments] = useState([]);

  useEffect(() => {
    loadAppointments();
  }, []);

  const loadAppointments = async () => {
    try {
      const storedAppointments = await AsyncStorage.getItem("appointments");

      if (storedAppointments) {
        setAppointments(JSON.parse(storedAppointments));
      }
    } catch (error) {
      console.log("Error loading appointments:", error);
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
              size={28}
              color="#FFFFFF"
            />

            <Text style={styles.appTitle}>MedSync</Text>
          </View>

          <View style={styles.headerActions}>
            <TouchableOpacity
              onPress={() => setIsDark(!isDark)}
              style={styles.actionButton}
            >
              <Ionicons
                name={isDark ? "sunny-outline" : "moon-outline"}
                size={24}
                color="#FFFFFF"
              />
            </TouchableOpacity>
          </View>
        </View>
      </View>

      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        {/* Calendar Strip */}
        <View style={styles.calendarStrip}>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.calendarStripContent}
          >
            {[
              { day: "24", weekday: "Sun" },
              { day: "25", weekday: "Mon" },
              { day: "26", weekday: "Tue" },
              { day: "27", weekday: "Wed", active: true },
              { day: "28", weekday: "Thu" },
              { day: "29", weekday: "Fri" },
              { day: "30", weekday: "Sat" },
            ].map((item, index) => (
              <TouchableOpacity
                key={index}
                style={[
                  styles.calendarDayBtn,
                  item.active && styles.calendarDayBtnActive,
                ]}
              >
                <Text
                  style={[
                    styles.calendarDayText,
                    item.active && styles.calendarDayTextActive,
                  ]}
                >
                  {item.day}
                </Text>

                <Text
                  style={[
                    styles.calendarWeekdayText,
                    item.active && styles.calendarWeekdayTextActive,
                  ]}
                >
                  {item.weekday}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        {/* Dynamic Upcoming Appointments */}
        <Text style={styles.sectionTitle}>Upcoming Appointments</Text>

        {appointments.length > 0 ? (
          appointments.map((appointment, index) => (
            <View key={index} style={styles.premiumCard}>
              <View style={styles.cardHeader}>
                <View style={styles.doctorBadge}>
                  <Text style={styles.doctorBadgeText}>
                    {appointment.doctor.name.charAt(0)}
                  </Text>
                </View>

                <View style={styles.doctorMeta}>
                  <Text style={styles.doctorNameText}>
                    {appointment.doctor.name}
                  </Text>

                  <Text style={styles.doctorSpecText}>
                    {appointment.doctor.specialty}
                  </Text>
                </View>

                <View style={styles.statusBadge}>
                  <Text style={styles.statusBadgeText}>Confirmed</Text>
                </View>
              </View>

              <View style={styles.cardDivider} />

              <View style={styles.infoRow}>
                <View style={styles.infoCol}>
                  <Ionicons
                    name="location-sharp"
                    size={16}
                    color={COLORS.primary}
                  />

                  <Text style={styles.infoColText}>
                    {appointment.doctor.clinic}
                  </Text>
                </View>

                <View style={styles.infoCol}>
                  <Ionicons name="time" size={16} color={COLORS.primary} />

                  <Text style={styles.infoColText}>
                    {appointment.selectedTime}
                  </Text>
                </View>
              </View>

              <View style={styles.actionRow}>
                <TouchableOpacity style={styles.outlineActionBtn}>
                  <Text style={styles.outlineActionText}>Cancel</Text>
                </TouchableOpacity>

                <TouchableOpacity style={styles.primaryActionBtn}>
                  <Text style={styles.primaryActionText}>Reschedule</Text>
                </TouchableOpacity>
              </View>
            </View>
          ))
        ) : (
          <Text
            style={{
              textAlign: "center",
              marginTop: 20,
              color: "#64748B",
            }}
          >
            No appointments booked yet
          </Text>
        )}

        {/* Past Appointments */}
        <Text style={styles.sectionTitle}>Past Appointments</Text>

        <View style={[styles.ticketCard, { opacity: 0.75 }]}>
          <View style={[styles.dateBlock, { backgroundColor: "#64748B" }]}>
            <Text style={styles.dateWeekday}>Fri</Text>

            <Text style={styles.dateDay}>12</Text>

            <Text style={styles.dateMonth}>APR</Text>
          </View>

          <View style={styles.detailsBlock}>
            <Text style={styles.clinicName}>Unjani Clinic Germiston</Text>

            <View style={styles.detailRow}>
              <Ionicons
                name="time-outline"
                size={16}
                color={COLORS.primary}
                style={styles.detailIcon}
              />

              <Text style={styles.detailText}>02:30 PM</Text>
            </View>

            <View style={styles.detailRow}>
              <FontAwesome5
                name="stethoscope"
                size={14}
                color={COLORS.primary}
                style={styles.detailIcon}
              />

              <Text style={styles.detailText}>
                Dr. Lerato Mokoena - General Checkup
              </Text>
            </View>
          </View>
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

  headerActions: {
    flexDirection: "row",
    alignItems: "center",
    gap: 16,
  },

  actionButton: {
    padding: 4,
  },

  appTitle: {
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

  calendarStrip: {
    marginVertical: 4,
  },

  calendarStripContent: {
    gap: 12,
  },

  calendarDayBtn: {
    width: 54,
    height: 68,
    borderRadius: 16,
    backgroundColor: COLORS.surface,
    borderWidth: 1,
    borderColor: "#EAE8FC",
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#0F2C59",
    shadowOpacity: 0.02,
    shadowRadius: 5,
    elevation: 1,
  },

  calendarDayBtnActive: {
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primary,
  },

  calendarDayText: {
    fontSize: 18,
    fontWeight: "bold",
    color: COLORS.primary,
  },

  calendarDayTextActive: {
    color: "#FFFFFF",
  },

  calendarWeekdayText: {
    fontSize: 10,
    color: "#94A3B8",
    marginTop: 4,
    fontWeight: "600",
  },

  calendarWeekdayTextActive: {
    color: "#EAE8FC",
  },

  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: COLORS.primary,
    marginTop: 12,
    marginBottom: -4,
  },

  premiumCard: {
    backgroundColor: COLORS.surface,
    borderRadius: 20,
    padding: 16,
    borderWidth: 1,
    borderColor: "#EAE8FC",
    shadowColor: "#0F2C59",
    shadowOpacity: 0.04,
    shadowRadius: 10,
    elevation: 2,
  },

  cardHeader: {
    flexDirection: "row",
    alignItems: "center",
  },

  doctorBadge: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: "#EFF6FF",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },

  doctorBadgeText: {
    color: COLORS.primary,
    fontSize: 18,
    fontWeight: "bold",
  },

  doctorMeta: {
    flex: 1,
  },

  doctorNameText: {
    fontSize: 16,
    fontWeight: "bold",
    color: COLORS.primary,
  },

  doctorSpecText: {
    fontSize: 13,
    color: "#64748B",
    marginTop: 2,
  },

  statusBadge: {
    backgroundColor: "#F0FDF4",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },

  statusBadgeText: {
    color: COLORS.success,
    fontSize: 11,
    fontWeight: "bold",
  },

  cardDivider: {
    height: 1,
    backgroundColor: "#EAE8FC",
    marginVertical: 14,
  },

  infoRow: {
    gap: 8,
    marginBottom: 16,
  },

  infoCol: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },

  infoColText: {
    fontSize: 14,
    color: "#475569",
    fontWeight: "500",
  },

  actionRow: {
    flexDirection: "row",
    gap: 12,
  },

  outlineActionBtn: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#CBD5E1",
    backgroundColor: "#FFFFFF",
  },

  outlineActionText: {
    color: "#64748B",
    fontSize: 14,
    fontWeight: "bold",
  },

  primaryActionBtn: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 12,
    borderRadius: 12,
    backgroundColor: COLORS.primary,
  },

  primaryActionText: {
    color: "#FFFFFF",
    fontSize: 14,
    fontWeight: "bold",
  },

  ticketCard: {
    backgroundColor: COLORS.surface,
    borderRadius: SIZES.radius,
    padding: 16,
    flexDirection: "row",
    borderWidth: 1,
    borderColor: COLORS.border,
    shadowColor: "#000",
    shadowOpacity: 0.02,
    shadowRadius: 5,
    elevation: 1,
  },

  dateBlock: {
    backgroundColor: COLORS.primary,
    borderRadius: 8,
    padding: 15,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 15,
    width: 75,
  },

  dateWeekday: {
    fontSize: 12,
    color: "#FFFFFF",
  },

  dateDay: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#FFFFFF",
    marginVertical: 2,
  },

  dateMonth: {
    fontSize: 12,
    color: "#FFFFFF",
  },

  detailsBlock: {
    flex: 1,
    justifyContent: "center",
  },

  clinicName: {
    fontSize: 15,
    fontWeight: "bold",
    color: COLORS.primary,
    marginBottom: 8,
  },

  detailRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 6,
  },

  detailIcon: {
    marginRight: 8,
    width: 16,
    textAlign: "center",
  },

  detailText: {
    fontSize: 13,
    color: "#64748B",
  },
});
