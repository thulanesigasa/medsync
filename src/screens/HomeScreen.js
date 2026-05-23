import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  TextInput,
} from "react-native";

import {
  Ionicons,
  MaterialCommunityIcons,
  FontAwesome5,
} from "@expo/vector-icons";

import { COLORS, SIZES, LAYOUT } from "../constants/theme";
import BottomTabBar from "../components/BottomTabBar";
import { doctors } from "../data/doctors";

export default function HomeScreen({ navigation }) {
  const [isDark, setIsDark] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const theme = isDark
    ? {
        background: "#0F172A",
        surface: "#1E293B",
        text: "#F8FAFC",
        subtext: "#94A3B8",
        border: "#334155",
        primary: COLORS.primary,
      }
    : {
        background: COLORS.background,
        surface: COLORS.surface,
        text: COLORS.primary,
        subtext: "#64748B",
        border: "#EAE8FC",
        primary: COLORS.primary,
      };

  const handleBookAppointment = (doctor) => {
    navigation.navigate("Booking", { doctor });
  };

  const filteredDoctors = doctors.filter((doctor) => {
    const query = searchQuery.toLowerCase();
    return (
      doctor.name.toLowerCase().includes(query) ||
      doctor.specialty.toLowerCase().includes(query) ||
      doctor.clinic.toLowerCase().includes(query)
    );
  });

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      {/* HEADER */}
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
            <TouchableOpacity onPress={() => setIsDark(!isDark)}>
              <Ionicons
                name={isDark ? "sunny-outline" : "moon-outline"}
                size={24}
                color="#FFFFFF"
              />
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => navigation.navigate("Notifications")}
            >
              <Ionicons
                name="notifications-outline"
                size={24}
                color="#FFFFFF"
              />
            </TouchableOpacity>
          </View>
        </View>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* GREETING */}
        <View style={styles.greetingContainer}>
          <Text style={[styles.greetingTitle, { color: theme.text }]}>
            Hello, Kiddo!
          </Text>
          <Text style={[styles.greetingSubline, { color: theme.subtext }]}>
            Find your local doctor easily
          </Text>
        </View>

        {/* SEARCH */}
        <View
          style={[
            styles.searchBar,
            { backgroundColor: theme.surface, borderColor: theme.border },
          ]}
        >
          <Ionicons name="search-outline" size={20} color={theme.subtext} />

          <TextInput
            placeholder="Search doctor, clinic or specialty..."
            placeholderTextColor={theme.subtext}
            style={[styles.searchInput, { color: theme.text }]}
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
        </View>

        {/* TOP DOCTORS */}
        <View style={styles.sectionHeader}>
          <Text style={[styles.sectionTitle, { color: theme.text }]}>
            Top Doctors
          </Text>
        </View>

        <View style={styles.doctorsList}>
          {filteredDoctors.length > 0 ? (
            filteredDoctors.map((doctor) => (
              <TouchableOpacity
                key={doctor.id}
                style={[
                  styles.doctorCard,
                  { backgroundColor: theme.surface, borderColor: theme.border },
                ]}
                onPress={() => handleBookAppointment(doctor)}
              >
                <View style={styles.doctorAvatarLarge}>
                  <Text style={styles.doctorAvatarTextLarge}>
                    {doctor.name.charAt(0)}
                  </Text>
                </View>

                <View style={styles.doctorInfo}>
                  <Text style={[styles.doctorName, { color: theme.text }]}>
                    {doctor.name}
                  </Text>

                  <Text style={{ color: theme.subtext, fontSize: 13 }}>
                    {doctor.specialty}
                  </Text>

                  <View style={styles.doctorStats}>
                    <Ionicons name="star" size={14} color="#F59E0B" />
                    <Text style={styles.doctorRating}>
                      {doctor.rating} ({doctor.reviews} reviews)
                    </Text>
                  </View>
                </View>

                <Ionicons
                  name="arrow-forward-circle"
                  size={30}
                  color={COLORS.primary}
                />
              </TouchableOpacity>
            ))
          ) : (
            <Text style={{ textAlign: "center", color: theme.subtext }}>
              No doctors found
            </Text>
          )}
        </View>
      </ScrollView>

      <BottomTabBar navigation={navigation} activeTab="Home" />
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
  appTitle: {
    color: "#FFFFFF",
    fontSize: 22,
    fontWeight: "bold",
    marginLeft: 10,
  },
  headerActions: {
    flexDirection: "row",
    alignItems: "center",
    gap: 16,
  },
  actionButton: {
    padding: 4,
  },
  bellIconContainer: {
    position: "relative",
  },
  badge: {
    position: "absolute",
    top: -2,
    right: -2,
    width: 8,
    height: 8,
    backgroundColor: "#EF4444",
    borderRadius: 4,
  },
  scrollContent: {
    padding: SIZES.margin,
    paddingBottom: 120,
  },
  greetingContainer: {
    marginVertical: 12,
  },
  greetingTitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: COLORS.primary,
  },
  greetingSubline: {
    fontSize: 15,
    color: "#64748B",
    marginTop: 4,
  },
  searchBar: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: COLORS.surface,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "#EAE8FC",
    marginBottom: 20,
    shadowColor: "#0F2C59",
    shadowOpacity: 0.02,
    shadowRadius: 5,
    elevation: 1,
  },
  searchInput: {
    flex: 1,
    marginLeft: 10,
    fontSize: 15,
    color: COLORS.primary,
  },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
    marginTop: 8,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: COLORS.primary,
  },
  seeAllText: {
    fontSize: 14,
    color: COLORS.accent,
    fontWeight: "600",
  },
  specialtiesScroll: {
    paddingBottom: 8,
    gap: 16,
  },
  specialtyItem: {
    alignItems: "center",
    width: 72,
  },
  specialtyIconBox: {
    width: 56,
    height: 56,
    borderRadius: 28,
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
  specialtyLabel: {
    fontSize: 12,
    fontWeight: "600",
    color: COLORS.primary,
    marginTop: 6,
    textAlign: "center",
  },
  scheduleCard: {
    backgroundColor: COLORS.primary,
    borderRadius: 20,
    padding: 16,
    marginBottom: 20,
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 4,
  },
  scheduleHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderBottomWidth: 1,
    borderBottomColor: "rgba(255, 255, 255, 0.15)",
    paddingBottom: 14,
    marginBottom: 14,
  },
  scheduleDoctor: {
    flexDirection: "row",
    alignItems: "center",
  },
  doctorAvatarMini: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },
  doctorAvatarMiniText: {
    color: "#FFFFFF",
    fontSize: 18,
    fontWeight: "bold",
  },
  scheduleDoctorName: {
    color: "#FFFFFF",
    fontSize: 15,
    fontWeight: "bold",
  },
  scheduleDoctorTitle: {
    color: "#EAE8FC",
    fontSize: 12,
  },
  scheduleVideoBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: "rgba(255, 255, 255, 0.15)",
    alignItems: "center",
    justifyContent: "center",
  },
  scheduleTimeRow: {
    flexDirection: "row",
    gap: 20,
  },
  scheduleTimeDetail: {
    flexDirection: "row",
    alignItems: "center",
  },
  scheduleTimeText: {
    color: "#EAE8FC",
    fontSize: 13,
    marginLeft: 6,
    fontWeight: "500",
  },
  doctorsList: {
    gap: 12,
  },
  doctorCard: {
    flexDirection: "row",
    backgroundColor: COLORS.surface,
    borderRadius: 16,
    padding: 12,
    borderWidth: 1,
    borderColor: "#EAE8FC",
    alignItems: "center",
    shadowColor: "#0F2C59",
    shadowOpacity: 0.02,
    shadowRadius: 5,
    elevation: 1,
  },
  doctorAvatarLarge: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: "#EFF6FF",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 16,
  },
  doctorAvatarTextLarge: {
    color: COLORS.primary,
    fontSize: 22,
    fontWeight: "bold",
  },
  doctorInfo: {
    flex: 1,
  },
  doctorName: {
    fontSize: 15,
    fontWeight: "bold",
    color: COLORS.primary,
  },
  doctorTitle: {
    fontSize: 13,
    color: "#64748B",
    marginTop: 2,
  },
  doctorStats: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 6,
  },
  doctorRating: {
    fontSize: 12,
    color: "#64748B",
    marginLeft: 4,
    fontWeight: "500",
  },
  doctorAction: {
    paddingLeft: 8,
  },
});
