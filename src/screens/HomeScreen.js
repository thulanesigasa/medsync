import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  TextInput,
  RefreshControl,
} from "react-native";
import {
  Ionicons,
  MaterialCommunityIcons,
  FontAwesome5,
} from "@expo/vector-icons";

import { COLORS, SIZES, LAYOUT } from "../constants/theme";
import BottomTabBar from "../components/BottomTabBar";
import SkeletonLoader from '../components/SkeletonLoader';
import { useClinic } from '../context/ClinicContext';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { useAppointment } from '../context/AppointmentContext';

export default function HomeScreen({ navigation }) {
  const { clinics, doctors } = useClinic();
  const { currentUser } = useAuth();
  const { appointments = [] } = useAppointment();
  const { isDark, theme, toggleTheme } = useTheme();

  const [isLoading, setIsLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedSearchQuery, setDebouncedSearchQuery] = useState("");
  const [activeSpecialty, setActiveSpecialty] = useState(null);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1500);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearchQuery(searchQuery);
    }, 300);
    return () => clearTimeout(handler);
  }, [searchQuery]);

  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    setTimeout(() => {
      setRefreshing(false);
    }, 1500);
  }, []);

  const handleBookAppointment = (doctor) => {
    navigation.navigate("DoctorProfile", { doctor });
  };

  const filteredDoctors = doctors.filter((doctor) => {
    const query = debouncedSearchQuery.trim().toLowerCase();
    
    const matchesSearch = !query || (
      doctor.name?.toLowerCase().includes(query) ||
      doctor.specialty?.toLowerCase().includes(query) ||
      doctor.clinic?.toLowerCase().includes(query)
    );

    const matchesSpecialty = !activeSpecialty || 
      doctor.specialty?.toLowerCase().includes(activeSpecialty.toLowerCase());

    return matchesSearch && matchesSpecialty;
  });

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const upcomingAppt = appointments
    .filter((appt) => {
      const appointmentDate = new Date(appt.date);
      appointmentDate.setHours(0, 0, 0, 0);

      return (
        appt.patientName === currentUser?.name &&
        appointmentDate >= today &&
        (appt.status === "Confirmed" || appt.status === "Pending")
      );
    })
    .sort((a, b) => new Date(a.date) - new Date(b.date))[0];

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
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
            <TouchableOpacity onPress={toggleTheme} style={styles.actionButton}>
              <Ionicons
                name={isDark ? "sunny-outline" : "moon-outline"}
                size={24}
                color="#FFFFFF"
              />
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.bellIconContainer}
              onPress={() => navigation.navigate("Notifications")}
            >
              <Ionicons
                name="notifications-outline"
                size={24}
                color="#FFFFFF"
              />
              <View style={styles.badge} />
            </TouchableOpacity>
          </View>
        </View>
      </View>

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={COLORS.primary} />
        }
      >
        {/* Greeting */}
        <View style={styles.greetingContainer}>
          <Text style={styles.greetingTitle}>
            Hello, {currentUser?.name || "Kiddo"}!
          </Text>
          <Text style={styles.greetingSubline}>
            Find your local doctor easily
          </Text>
        </View>

        {/* Search */}
        <View style={styles.searchBar}>
          <Ionicons name="search-outline" size={20} color="#94A3B8" />
          {searchQuery.length > 0 && (
            <Text style={styles.searchResultText}>
              {filteredDoctors.length} result(s) found
            </Text>
          )}
          {searchQuery.length > 0 && (
            <View style={styles.searchResultsBox}>
              {filteredDoctors.length > 0 ? (
                filteredDoctors.map((doctor) => (
                  <TouchableOpacity
                    key={doctor.id}
                    style={styles.searchResultItem}
                    onPress={() => handleBookAppointment(doctor)}
                  >
                    <View>
                      <Text style={styles.searchResultName}>{doctor.name}</Text>
                      <Text style={styles.searchResultDetails}>
                        {doctor.specialty} • {doctor.clinic}
                      </Text>
                    </View>

                    <Ionicons
                      name="chevron-forward"
                      size={20}
                      color={COLORS.primary}
                    />
                  </TouchableOpacity>
                ))
              ) : (
                <Text style={styles.noSearchResults}>
                  No doctors or clinics found
                </Text>
              )}
            </View>
          )}
          <TextInput
            placeholder="Search doctor, clinic or specialty..."
            style={styles.searchInput}
            placeholderTextColor="#94A3B8"
            value={searchQuery}
            onChangeText={setSearchQuery}
            autoCapitalize="none"
            autoCorrect={false}
          />

          {searchQuery.length > 0 ? (
            <TouchableOpacity onPress={() => setSearchQuery("")}>
              <Ionicons name="close-circle" size={20} color="#94A3B8" />
            </TouchableOpacity>
          ) : (
            <Ionicons name="options-outline" size={20} color={COLORS.primary} />
          )}
        </View>

        {/* Specialties */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Specialties</Text>
          <TouchableOpacity onPress={() => navigation.navigate("Clinics")}>
            <Text style={styles.seeAllText}>See all</Text>
          </TouchableOpacity>
        </View>

        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.specialtiesScroll}
        >
          <TouchableOpacity
            style={[
              styles.specialtyItem,
              activeSpecialty === "General" && { backgroundColor: COLORS.primary + "20", borderColor: COLORS.primary, borderWidth: 1 }
            ]}
            onPress={() => setActiveSpecialty(activeSpecialty === "General" ? null : "General")}
          >
            <View style={styles.specialtyIconBox}>
              <FontAwesome5
                name="stethoscope"
                size={20}
                color={COLORS.primary}
              />
            </View>
            <Text style={styles.specialtyLabel}>General</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.specialtyItem,
              activeSpecialty === "Dentist" && { backgroundColor: COLORS.primary + "20", borderColor: COLORS.primary, borderWidth: 1 }
            ]}
            onPress={() => setActiveSpecialty(activeSpecialty === "Dentist" ? null : "Dentist")}
          >
            <View style={styles.specialtyIconBox}>
              <FontAwesome5 name="tooth" size={18} color={COLORS.primary} />
            </View>
            <Text style={styles.specialtyLabel}>Dentistry</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.specialtyItem,
              activeSpecialty === "Cardiologist" && { backgroundColor: COLORS.primary + "20", borderColor: COLORS.primary, borderWidth: 1 }
            ]}
            onPress={() => setActiveSpecialty(activeSpecialty === "Cardiologist" ? null : "Cardiologist")}
          >
            <View style={styles.specialtyIconBox}>
              <FontAwesome5 name="heartbeat" size={20} color={COLORS.primary} />
            </View>
            <Text style={styles.specialtyLabel}>Cardiology</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.specialtyItem,
              activeSpecialty === "Pediatrics" && { backgroundColor: COLORS.primary + "20", borderColor: COLORS.primary, borderWidth: 1 }
            ]}
            onPress={() => setActiveSpecialty(activeSpecialty === "Pediatrics" ? null : "Pediatrics")}
          >
            <View style={styles.specialtyIconBox}>
              <FontAwesome5 name="baby" size={20} color={COLORS.primary} />
            </View>
            <Text style={styles.specialtyLabel}>Pediatrics</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.specialtyItem,
              activeSpecialty === "Neurology" && { backgroundColor: COLORS.primary + "20", borderColor: COLORS.primary, borderWidth: 1 }
            ]}
            onPress={() => setActiveSpecialty(activeSpecialty === "Neurology" ? null : "Neurology")}
          >
            <View style={styles.specialtyIconBox}>
              <FontAwesome5 name="brain" size={18} color={COLORS.primary} />
            </View>
            <Text style={styles.specialtyLabel}>Neurology</Text>
          </TouchableOpacity>
        </ScrollView>

        {upcomingAppt && (
          <>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Upcoming Schedule</Text>
            </View>

            <View
              style={[
                styles.scheduleCard,
                upcomingAppt.status === "Pending" && {
                  backgroundColor: "#E28743",
                  shadowColor: "#E28743",
                },
              ]}
            >
              <View style={styles.scheduleHeader}>
                <View style={styles.scheduleDoctor}>
                  <View style={styles.doctorAvatarMini}>
                    <Text style={styles.doctorAvatarMiniText}>
                      {upcomingAppt.doctorName?.replace("Dr. ", "").charAt(0) ||
                        "D"}
                    </Text>
                  </View>

                  <View style={{ flex: 1, marginRight: 8 }}>
                    <Text style={styles.scheduleDoctorName}>
                      {upcomingAppt.doctorName}
                    </Text>
                    <Text style={styles.scheduleDoctorTitle} numberOfLines={1}>
                      {upcomingAppt.doctorTitle || "Specialist"} •{" "}
                      {upcomingAppt.clinicName}
                    </Text>
                  </View>
                </View>

                <View style={styles.statusBadgeOverlay}>
                  <Text style={styles.statusOverlayText}>
                    {upcomingAppt.status?.toUpperCase()}
                  </Text>
                </View>
              </View>

              <View style={styles.scheduleTimeRow}>
                <View style={styles.scheduleTimeDetail}>
                  <Ionicons name="calendar-outline" size={15} color="#EAE8FC" />
                  <Text style={styles.scheduleTimeText}>
                    {upcomingAppt.date}
                  </Text>
                </View>

                <View style={styles.scheduleTimeDetail}>
                  <Ionicons name="time-outline" size={15} color="#EAE8FC" />
                  <Text style={styles.scheduleTimeText}>
                    {upcomingAppt.time}
                  </Text>
                </View>
              </View>
            </View>
          </>
        )}

        {/* Top Doctors */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>
            {searchQuery ? "Search Results" : "Top Doctors"}
          </Text>
          <TouchableOpacity onPress={() => navigation.navigate("Clinics")}>
            <Text style={styles.seeAllText}>See all</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.doctorsList}>
          {isLoading ? (
            <>
              {[1, 2, 3].map((i) => (
                <View key={i} style={[styles.doctorCard, { flexDirection: 'row', alignItems: 'center' }]}>
                  <SkeletonLoader width={56} height={56} borderRadius={28} isDark={isDark} />
                  <View style={{ marginLeft: 16, flex: 1, gap: 8 }}>
                    <SkeletonLoader width={120} height={16} isDark={isDark} />
                    <SkeletonLoader width={100} height={12} isDark={isDark} />
                    <SkeletonLoader width={140} height={12} isDark={isDark} />
                  </View>
                </View>
              ))}
            </>
          ) : filteredDoctors.length > 0 ? (
            filteredDoctors.map((doctor) => (
              <TouchableOpacity
                key={doctor.id}
                style={styles.doctorCard}
                onPress={() => handleBookAppointment(doctor)}
              >
                <View style={styles.doctorAvatarLarge}>
                  <Text style={styles.doctorAvatarTextLarge}>
                    {doctor.avatarText ||
                      doctor.name?.replace("Dr. ", "").charAt(0) ||
                      "D"}
                  </Text>
                </View>

                <View style={styles.doctorInfo}>
                  <Text style={styles.doctorName}>{doctor.name}</Text>
                  <Text style={styles.doctorTitle}>{doctor.specialty}</Text>

                  <View style={styles.doctorStats}>
                    <Ionicons name="star" size={14} color="#F59E0B" />
                    <Text style={styles.doctorRating}>
                      {doctor.rating} ({doctor.reviews} reviews)
                    </Text>
                  </View>

                  <Text style={styles.doctorClinic}>{doctor.clinic}</Text>
                </View>

                <View style={styles.doctorAction}>
                  <Ionicons
                    name="arrow-forward-circle"
                    size={32}
                    color={COLORS.primary}
                  />
                </View>
              </TouchableOpacity>
            ))
          ) : (
            <View style={styles.emptySearchBox}>
              <Ionicons name="search-outline" size={28} color="#94A3B8" />
              <Text style={styles.emptySearchTitle}>No doctors found</Text>
              <Text style={styles.emptySearchSub}>
                Try searching by doctor name, clinic, or specialty.
              </Text>
            </View>
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
  statusBadgeOverlay: {
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  statusOverlayText: {
    color: "#FFFFFF",
    fontSize: 9,
    fontWeight: "bold",
  },
  noScheduleCard: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "#FFFFFF",
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "#EAE8FC",
    padding: 16,
    marginBottom: 20,
    shadowColor: "#0F2C59",
    shadowOpacity: 0.03,
    shadowRadius: 5,
    elevation: 1,
  },
  noScheduleLeft: {
    flexDirection: "row",
    alignItems: "center",
  },
  noScheduleTitle: {
    fontSize: 15,
    fontWeight: "bold",
    color: COLORS.primary,
  },
  noScheduleSub: {
    fontSize: 12,
    color: "#64748B",
    marginTop: 2,
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
  doctorClinic: {
    fontSize: 12,
    color: "#94A3B8",
    marginTop: 4,
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
  emptySearchBox: {
    backgroundColor: COLORS.surface,
    borderWidth: 1,
    borderColor: "#EAE8FC",
    borderRadius: 16,
    padding: 20,
    alignItems: "center",
  },
  emptySearchTitle: {
    fontSize: 15,
    fontWeight: "bold",
    color: COLORS.primary,
    marginTop: 8,
  },
  emptySearchSub: {
    fontSize: 12,
    color: "#64748B",
    marginTop: 4,
    textAlign: "center",
  },
  searchResultText: {
    fontSize: 13,
    color: "#64748B",
    marginBottom: 12,
    fontWeight: "600",
  },
  searchResultsBox: {
    backgroundColor: COLORS.surface,
    borderWidth: 1,
    borderColor: "#EAE8FC",
    borderRadius: 16,
    marginBottom: 20,
    overflow: "hidden",
  },

  searchResultItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 14,
    borderBottomWidth: 1,
    borderBottomColor: "#F1F5F9",
  },

  searchResultName: {
    fontSize: 15,
    fontWeight: "bold",
    color: COLORS.primary,
  },

  searchResultDetails: {
    fontSize: 12,
    color: "#64748B",
    marginTop: 3,
  },

  noSearchResults: {
    textAlign: "center",
    color: "#64748B",
    padding: 16,
    fontWeight: "600",
  },
});
