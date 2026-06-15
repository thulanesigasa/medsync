import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Modal,
  KeyboardAvoidingView,
  Platform,
  Alert,
  RefreshControl,
} from "react-native";
import {
  MaterialCommunityIcons,
  Ionicons,
  FontAwesome5,
} from "@expo/vector-icons";

import { COLORS, SIZES, LAYOUT } from "../constants/theme";
import BottomTabBar from "../components/BottomTabBar";
import { useAuth } from '../context/AuthContext';
import { useAppointment } from '../context/AppointmentContext';
import { useTheme } from '../context/ThemeContext';
import { useClinic } from '../context/ClinicContext';
import { useChat } from '../context/ChatContext';
import EmptyAppointmentsSVG from '../components/EmptyAppointmentsSVG';

export default function AppointmentsScreen({ navigation }) {
  const { currentUser } = useAuth();
  const { appointments, updateAppointmentStatus } = useAppointment();
  const { patients } = useClinic();
  const { messages, sendMessage } = useChat();
  const { isDark, theme, toggleTheme } = useTheme();

  const [selectedNoteApptId, setSelectedNoteApptId] = useState(null);
  const [activeChatApptId, setActiveChatApptId] = useState(null);
  const [chatText, setChatText] = useState("");
  const [refreshing, setRefreshing] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    setTimeout(() => {
      setRefreshing(false);
    }, 1500);
  }, []);

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const upcomingAppointments = appointments.filter((appt) => {
    const appointmentDate = new Date(appt.date);
    appointmentDate.setHours(0, 0, 0, 0);
    const matchesSearch = appt.doctorName.toLowerCase().includes(searchQuery.toLowerCase()) || appt.clinicName.toLowerCase().includes(searchQuery.toLowerCase());

    return (
      appointmentDate >= today &&
      (appt.status === "Confirmed" || appt.status === "Pending") && matchesSearch
    );
  });

  const pastAppointments = appointments.filter((appt) => {
    const appointmentDate = new Date(appt.date);
    appointmentDate.setHours(0, 0, 0, 0);
    const matchesSearch = appt.doctorName.toLowerCase().includes(searchQuery.toLowerCase()) || appt.clinicName.toLowerCase().includes(searchQuery.toLowerCase());

    return (
      (appointmentDate < today ||
      appt.status === "Completed" ||
      appt.status === "Declined" ||
      appt.status === "Cancelled") && matchesSearch
    );
  });

  const getMedicalNoteForAppointment = (appt) => {
    const patientRecord = patients.find(
      (p) => p.name?.toLowerCase() === appt.patientName?.toLowerCase(),
    );

    if (!patientRecord) return null;

    return patientRecord.medicalNotes?.find(
      (note) => note.date === appt.date || note.doctorName === appt.doctorName,
    );
  };

  const handleCancelAppointment = (appt) => {
    Alert.alert(
      "Cancel Appointment",
      "Are you sure you want to cancel this appointment?",
      [
        {
          text: "No",
          style: "cancel",
        },
        {
          text: "Yes, Cancel",
          style: "destructive",
          onPress: () => updateAppointmentStatus(appt.id, "Cancelled"),
        },
      ],
    );
  };

  const handleSendChatMessage = () => {
    if (!chatText.trim() || !activeChatApptId) return;

    const targetAppt = appointments.find(
      (appt) => appt.id === activeChatApptId,
    );

    if (!targetAppt) return;

    sendMessage(
      targetAppt.clinicName,
      targetAppt.patientName,
      "patient",
      chatText.trim(),
      activeChatApptId,
    );

    setChatText("");
  };

  const getStatusStyle = (status) => {
    if (status === "Confirmed") return styles.statusConfirmed;
    if (status === "Pending") return styles.statusPending;
    if (status === "Cancelled" || status === "Declined")
      return styles.statusCancelled;
    return styles.statusCompleted;
  };

  const getStatusTextStyle = (status) => {
    if (status === "Confirmed") return styles.statusTextConfirmed;
    if (status === "Pending") return styles.statusTextPending;
    if (status === "Cancelled" || status === "Declined")
      return styles.statusTextCancelled;
    return styles.statusTextCompleted;
  };

  const getDateDisplay = (dateString) => {
    if (!dateString) {
      return { day: "--", month: "---", weekday: "---" };
    }

    const date = new Date(dateString);

    if (Number.isNaN(date.getTime())) {
      return { day: "--", month: "---", weekday: "---" };
    }

    const day = String(date.getDate()).padStart(2, "0");
    const month = date
      .toLocaleString("en-US", { month: "short" })
      .toUpperCase();
    const weekday = date.toLocaleString("en-US", { weekday: "short" });

    return { day, month, weekday };
  };

  const renderAppointmentCard = (appt) => (
    <View key={appt.id} style={styles.premiumCard}>
      <View style={styles.cardHeader}>
        <View style={styles.doctorBadge}>
          <Text style={styles.doctorBadgeText}>
            {appt.doctorName?.replace("Dr. ", "").charAt(0) || "D"}
          </Text>
        </View>

        <View style={styles.doctorMeta}>
          <Text style={styles.doctorNameText}>
            {appt.doctorName || "Doctor"}
          </Text>
          <Text style={styles.doctorSpecText}>
            {appt.doctorTitle || appt.type || "Specialist"}
          </Text>
        </View>

        <View style={[styles.statusBadge, getStatusStyle(appt.status)]}>
          <Text
            style={[styles.statusBadgeText, getStatusTextStyle(appt.status)]}
          >
            {appt.status}
          </Text>
        </View>
      </View>

      <View style={styles.cardDivider} />

      <View style={styles.infoRow}>
        <View style={styles.infoCol}>
          <Ionicons name="location-sharp" size={16} color={COLORS.primary} />
          <Text style={styles.infoColText}>
            {appt.clinicName || "Clinic unavailable"}
          </Text>
        </View>

        <View style={styles.infoCol}>
          <Ionicons name="time" size={16} color={COLORS.primary} />
          <Text style={styles.infoColText}>
            {appt.date || "Date not set"} at {appt.time || "Time not set"}
          </Text>
        </View>
      </View>

      <View style={styles.actionRow}>
        <TouchableOpacity
          style={styles.outlineActionBtn}
          onPress={() => handleCancelAppointment(appt)}
        >
          <Text style={styles.outlineActionText}>Cancel</Text>
        </TouchableOpacity>

        {appt.status === "Confirmed" && (
          <TouchableOpacity
            style={[styles.primaryActionBtn, { backgroundColor: '#10B981', marginRight: 8 }]}
            onPress={() => navigation.navigate("Telehealth", { doctorName: appt.doctorName })}
          >
            <Ionicons name="videocam" size={16} color="#fff" style={{ marginRight: 4 }} />
            <Text style={styles.primaryActionText}>Join Call</Text>
          </TouchableOpacity>
        )}

        <TouchableOpacity
          style={styles.primaryActionBtn}
          onPress={() => setActiveChatApptId(appt.id)}
        >
          <Ionicons name="chatbubble" size={16} color="#fff" style={{ marginRight: 4 }} />
          <Text style={styles.primaryActionText}>Chat</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  const renderPastAppointment = (appt) => {
    const { day, month, weekday } = getDateDisplay(appt.date);
    const medicalNote = getMedicalNoteForAppointment(appt);
    const isExpanded = selectedNoteApptId === appt.id;

    return (
      <View key={appt.id} style={styles.pastWrapper}>
        <View style={[styles.ticketCard, { opacity: 0.85 }]}>
          <View style={[styles.dateBlock, { backgroundColor: "#64748B" }]}>
            <Text style={styles.dateWeekday}>{weekday}</Text>
            <Text style={styles.dateDay}>{day}</Text>
            <Text style={styles.dateMonth}>{month}</Text>
          </View>

          <View style={styles.detailsBlock}>
            <View style={styles.pastHeaderRow}>
              <Text style={styles.clinicName}>
                {appt.clinicName || "Clinic unavailable"}
              </Text>

              <View style={[styles.statusBadge, getStatusStyle(appt.status)]}>
                <Text
                  style={[
                    styles.statusBadgeText,
                    getStatusTextStyle(appt.status),
                  ]}
                >
                  {appt.status}
                </Text>
              </View>
            </View>

            <View style={styles.detailRow}>
              <Ionicons
                name="time-outline"
                size={16}
                color={COLORS.primary}
                style={styles.detailIcon}
              />
              <Text style={styles.detailText}>{appt.time}</Text>
            </View>

            <View style={styles.detailRow}>
              <FontAwesome5
                name="stethoscope"
                size={14}
                color={COLORS.primary}
                style={styles.detailIcon}
              />
              <Text style={styles.detailText}>
                {appt.doctorName || "Doctor"} - {appt.type || "Appointment"}
              </Text>
            </View>

            {medicalNote && (
              <TouchableOpacity
                style={styles.btnViewSummary}
                onPress={() =>
                  setSelectedNoteApptId(isExpanded ? null : appt.id)
                }
              >
                <Text style={styles.btnViewSummaryText}>
                  {isExpanded ? "Hide Health Notes" : "View Consultation Notes"}
                </Text>
                <Ionicons
                  name={isExpanded ? "chevron-up" : "chevron-down"}
                  size={14}
                  color={COLORS.primary}
                />
              </TouchableOpacity>
            )}
          </View>
        </View>

        {isExpanded && medicalNote && (
          <View style={styles.expandedNoteCard}>
            <Text style={styles.noteTitleLabel}>
              EHR Visit Consultation Notes
            </Text>

            <Text style={styles.noteBodyText}>
              <Text style={styles.bold}>Diagnosis: </Text>
              {medicalNote.diagnosis}
            </Text>

            <Text style={styles.noteBodyText}>
              <Text style={styles.bold}>Treatment Plan: </Text>
              {medicalNote.treatment}
            </Text>

            {medicalNote.notes ? (
              <Text style={styles.noteBodyText}>
                <Text style={styles.bold}>Physician Notes: </Text>
                {medicalNote.notes}
              </Text>
            ) : null}
          </View>
        )}
      </View>
    );
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
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

          <TouchableOpacity
            onPress={toggleTheme}
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

      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={COLORS.primary} />
        }
      >
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
            ].map((item) => (
              <TouchableOpacity
                key={`${item.weekday}-${item.day}`}
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

        <View style={styles.searchContainer}>
          <Ionicons name="search" size={20} color="#94A3B8" style={styles.searchIcon} />
          <TextInput
            style={styles.searchInput}
            placeholder="Search by doctor or clinic..."
            placeholderTextColor="#94A3B8"
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
        </View>

        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Upcoming Appointments</Text>
          <View style={styles.countBadge}><Text style={styles.countBadgeText}>{upcomingAppointments.length}</Text></View>
        </View>

        {upcomingAppointments.length === 0 ? (
          <View style={styles.emptyContainer}>
            <EmptyAppointmentsSVG width={140} height={140} />
            <Text style={styles.emptyText}>
              No upcoming appointments scheduled
            </Text>
          </View>
        ) : (
          upcomingAppointments.map(renderAppointmentCard)
        )}

        <Text style={styles.sectionTitle}>Past Appointments</Text>

        {pastAppointments.length === 0 ? (
          <View style={styles.emptyContainer}>
            <EmptyAppointmentsSVG width={140} height={140} />
            <Text style={styles.emptyText}>No past appointments found</Text>
          </View>
        ) : (
          pastAppointments.map(renderPastAppointment)
        )}
      </ScrollView>

      <Modal
        visible={activeChatApptId !== null}
        animationType="slide"
        transparent
        onRequestClose={() => setActiveChatApptId(null)}
      >
        <View style={styles.modalOverlay}>
          <KeyboardAvoidingView
            behavior={Platform.OS === "ios" ? "padding" : "height"}
            style={styles.chatModalContainer}
          >
            <View style={styles.modalHeader}>
              <View>
                <Text style={styles.modalTitle}>Clinic Live Chat Support</Text>
                <Text style={styles.modalSubtitle}>
                  Appt ID: {activeChatApptId}
                </Text>
              </View>

              <TouchableOpacity
                style={styles.modalCloseBtn}
                onPress={() => setActiveChatApptId(null)}
              >
                <Ionicons name="close" size={24} color={COLORS.primary} />
              </TouchableOpacity>
            </View>

            <ScrollView
              contentContainerStyle={styles.chatMessageScroll}
              showsVerticalScrollIndicator={false}
            >
              {messages
                .filter((msg) => msg.apptId === activeChatApptId)
                .map((msg) => {
                  const isPatient = msg.sender === "patient";

                  return (
                    <View
                      key={msg.id}
                      style={[
                        styles.messageBubbleContainer,
                        isPatient
                          ? styles.bubbleContainerRight
                          : styles.bubbleContainerLeft,
                      ]}
                    >
                      <View
                        style={[
                          styles.messageBubble,
                          isPatient ? styles.bubbleRight : styles.bubbleLeft,
                        ]}
                      >
                        <Text
                          style={[
                            styles.messageText,
                            isPatient
                              ? styles.messageTextRight
                              : styles.messageTextLeft,
                          ]}
                        >
                          {msg.text}
                        </Text>

                        <Text
                          style={[
                            styles.messageTimeText,
                            isPatient
                              ? styles.messageTimeRight
                              : styles.messageTimeLeft,
                          ]}
                        >
                          {msg.time}
                        </Text>
                      </View>
                    </View>
                  );
                })}
            </ScrollView>

            <View style={styles.chatInputRow}>
              <TextInput
                placeholder="Type your message..."
                value={chatText}
                onChangeText={setChatText}
                style={styles.chatInputField}
                placeholderTextColor="#94A3B8"
              />

              <TouchableOpacity
                style={styles.chatSendBtn}
                onPress={handleSendChatMessage}
              >
                <Ionicons name="send" size={18} color="#FFFFFF" />
              </TouchableOpacity>
            </View>
          </KeyboardAvoidingView>
        </View>
      </Modal>

      {activeChatApptId === null && (
        <BottomTabBar navigation={navigation} activeTab="Appointments" />
      )}
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
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  statusBadgeText: {
    fontSize: 11,
    fontWeight: "bold",
  },
  statusConfirmed: {
    backgroundColor: "#F0FDF4",
  },
  statusPending: {
    backgroundColor: "#FFFBEB",
  },
  statusCancelled: {
    backgroundColor: "#FEF2F2",
  },
  statusCompleted: {
    backgroundColor: "#EFF6FF",
  },
  statusTextConfirmed: {
    color: COLORS.success,
  },
  statusTextPending: {
    color: "#D97706",
  },
  statusTextCancelled: {
    color: "#DC2626",
  },
  statusTextCompleted: {
    color: COLORS.primary,
  },
  emptyContainer: {
    backgroundColor: COLORS.surface,
    borderWidth: 1,
    borderColor: "#EAE8FC",
    borderRadius: 20,
    padding: 30,
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
  },
  emptyText: {
    color: "#64748B",
    fontSize: 14,
    fontWeight: "600",
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
  pastWrapper: {
    marginBottom: 12,
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
  pastHeaderRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 8,
    marginBottom: 8,
  },
  clinicName: {
    flex: 1,
    fontSize: 15,
    fontWeight: "bold",
    color: COLORS.primary,
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
  btnViewSummary: {
    flexDirection: "row",
    justifyContent: "flex-end",
    alignItems: "center",
    marginTop: 8,
    gap: 4,
  },
  btnViewSummaryText: {
    color: COLORS.primary,
    fontSize: 12,
    fontWeight: "700",
  },
  expandedNoteCard: {
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#EAE8FC",
    borderTopWidth: 0,
    borderBottomLeftRadius: 16,
    borderBottomRightRadius: 16,
    padding: 14,
    marginTop: -4,
    gap: 6,
    shadowColor: "#0F2C59",
    shadowOpacity: 0.02,
    shadowRadius: 5,
    elevation: 1,
  },
  noteTitleLabel: {
    fontSize: 12,
    fontWeight: "bold",
    color: COLORS.primary,
    letterSpacing: 0.5,
    marginBottom: 2,
  },
  noteBodyText: {
    fontSize: 12,
    color: "#475569",
    lineHeight: 16,
  },
  bold: {
    fontWeight: "bold",
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(15, 44, 89, 0.4)",
    justifyContent: "flex-end",
  },
  chatModalContainer: {
    backgroundColor: "#FFFFFF",
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    height: "75%",
    paddingBottom: Platform.OS === "ios" ? 24 : 12,
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 18,
    borderBottomWidth: 1,
    borderBottomColor: "#F1F5F9",
  },
  modalTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: COLORS.primary,
  },
  modalSubtitle: {
    fontSize: 11,
    color: "#94A3B8",
    marginTop: 2,
    fontWeight: "500",
  },
  modalCloseBtn: {
    padding: 4,
  },
  chatMessageScroll: {
    padding: 16,
    gap: 12,
  },
  messageBubbleContainer: {
    flexDirection: "row",
    width: "100%",
  },
  bubbleContainerLeft: {
    justifyContent: "flex-start",
  },
  bubbleContainerRight: {
    justifyContent: "flex-end",
  },
  messageBubble: {
    maxWidth: "75%",
    borderRadius: 16,
    paddingHorizontal: 14,
    paddingVertical: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 1,
    elevation: 1,
  },
  bubbleLeft: {
    backgroundColor: "#F1F5F9",
    borderTopLeftRadius: 4,
  },
  bubbleRight: {
    backgroundColor: COLORS.primary,
    borderTopRightRadius: 4,
  },
  messageText: {
    fontSize: 14,
    lineHeight: 18,
  },
  messageTextLeft: {
    color: COLORS.primary,
  },
  messageTextRight: {
    color: "#FFFFFF",
  },
  messageTimeText: {
    fontSize: 9,
    marginTop: 4,
    fontWeight: "500",
    textAlign: "right",
  },
  messageTimeLeft: {
    color: "#94A3B8",
  },
  messageTimeRight: {
    color: "#BFDBFE",
  },
  chatInputRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: "#F1F5F9",
    gap: 8,
  },
  chatInputStyle: {
    flex: 1,
    height: 40,
    backgroundColor: "#F1F5F9",
    borderRadius: 20,
    paddingHorizontal: 15,
    marginRight: 10,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 12,
    paddingHorizontal: 16,
    height: 50,
    marginHorizontal: SIZES.margin,
    marginTop: 10,
    marginBottom: 5,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  searchIcon: {
    marginRight: 10,
  },
  searchInput: {
    flex: 1,
    fontSize: 15,
    color: COLORS.primary,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingRight: SIZES.margin,
  },
  countBadge: {
    backgroundColor: COLORS.primary,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  countBadgeText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: 'bold',
  },
  chatInputField: {
    flex: 1,
    backgroundColor: "#F8FAFC",
    borderWidth: 1,
    borderColor: "#E2E8F0",
    borderRadius: 14,
    paddingHorizontal: 14,
    paddingVertical: Platform.OS === "ios" ? 12 : 8,
    color: COLORS.primary,
    fontSize: 14,
  },
  chatSendBtn: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: COLORS.primary,
    alignItems: "center",
    justifyContent: "center",
  },
});
