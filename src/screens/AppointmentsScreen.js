import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput, Modal, KeyboardAvoidingView, Platform } from 'react-native';
import { MaterialCommunityIcons, Ionicons, FontAwesome5 } from '@expo/vector-icons';
import { COLORS, SIZES, LAYOUT } from '../constants/theme';
import BottomTabBar from '../components/BottomTabBar';
import { useStateContext } from '../context/StateContext';

export default function AppointmentsScreen({ navigation }) {
  const { appointments, patients, messages, sendMessage } = useStateContext();
  const [isDark, setIsDark] = useState(false);
  const [selectedNoteApptId, setSelectedNoteApptId] = useState(null);
  const [activeChatApptId, setActiveChatApptId] = useState(null);
  const [chatText, setChatText] = useState('');

  // Filter appointments for upcoming and past
  const upcomingAppointments = appointments.filter(
    appt => appt.status === 'Confirmed' || appt.status === 'Pending'
  );

  const pastAppointments = appointments.filter(
    appt => appt.status === 'Completed' || appt.status === 'Declined' || appt.id === 'appt-2'
  );

  const getMedicalNoteForAppointment = (appt) => {
    const patientRecord = patients.find(p => p.name.toLowerCase() === appt.patientName.toLowerCase());
    if (!patientRecord) return null;
    return patientRecord.medicalNotes.find(
      note => note.date === appt.date || note.doctorName === appt.doctorName
    );
  };

  const handleSendChatMessage = () => {
    if (!chatText.trim() || !activeChatApptId) return;
    const targetAppt = appointments.find(a => a.id === activeChatApptId);
    if (!targetAppt) return;
    sendMessage(targetAppt.clinicName, targetAppt.patientName, 'patient', chatText.trim(), activeChatApptId);
    setChatText('');
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerContent}>
          <View style={styles.headerBrand}>
            <MaterialCommunityIcons name="shield-plus" size={28} color="#FFFFFF" />
            <Text style={styles.appTitle}>MedSync</Text>
          </View>
          <View style={styles.headerActions}>
            <TouchableOpacity onPress={() => setIsDark(!isDark)} style={styles.actionButton}>
              <Ionicons name={isDark ? "sunny-outline" : "moon-outline"} size={24} color="#FFFFFF" />
            </TouchableOpacity>
          </View>
        </View>
      </View>
      
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        {/* Calendar Strip */}
        <View style={styles.calendarStrip}>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.calendarStripContent}>
            {[
              { day: '24', weekday: 'Sun' },
              { day: '25', weekday: 'Mon' },
              { day: '26', weekday: 'Tue' },
              { day: '27', weekday: 'Wed', active: true },
              { day: '28', weekday: 'Thu' },
              { day: '29', weekday: 'Fri' },
              { day: '30', weekday: 'Sat' },
            ].map((item, index) => (
              <TouchableOpacity key={index} style={[styles.calendarDayBtn, item.active && styles.calendarDayBtnActive]}>
                <Text style={[styles.calendarDayText, item.active && styles.calendarDayTextActive]}>{item.day}</Text>
                <Text style={[styles.calendarWeekdayText, item.active && styles.calendarWeekdayTextActive]}>{item.weekday}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        <Text style={styles.sectionTitle}>Upcoming Appointments</Text>
        
        {upcomingAppointments.length === 0 ? (
          <View style={styles.emptyContainer}>
            <Ionicons name="calendar-outline" size={36} color="#94A3B8" />
            <Text style={styles.emptyText}>No upcoming appointments scheduled</Text>
          </View>
        ) : (
          upcomingAppointments.map((appt) => (
            <View key={appt.id} style={styles.premiumCard}>
              <View style={styles.cardHeader}>
                <View style={styles.doctorBadge}>
                  <Text style={styles.doctorBadgeText}>
                    {appt.doctorName.replace('Dr. ', '').charAt(0)}
                  </Text>
                </View>
                <View style={styles.doctorMeta}>
                  <Text style={styles.doctorNameText}>{appt.doctorName}</Text>
                  <Text style={styles.doctorSpecText}>{appt.doctorTitle || 'Specialist'}</Text>
                </View>
                <View style={[
                  styles.statusBadge, 
                  appt.status === 'Confirmed' ? styles.statusConfirmed : styles.statusPending
                ]}>
                  <Text style={[
                    styles.statusBadgeText,
                    appt.status === 'Confirmed' ? styles.statusTextConfirmed : styles.statusTextPending
                  ]}>{appt.status}</Text>
                </View>
              </View>
              
              <View style={styles.cardDivider} />

              <View style={styles.infoRow}>
                <View style={styles.infoCol}>
                  <Ionicons name="location-sharp" size={16} color={COLORS.primary} />
                  <Text style={styles.infoColText}>{appt.clinicName}</Text>
                </View>
                <View style={styles.infoCol}>
                  <Ionicons name="time" size={16} color={COLORS.primary} />
                  <Text style={styles.infoColText}>{appt.date} at {appt.time}</Text>
                </View>
              </View>

              <View style={styles.actionRow}>
                <TouchableOpacity style={styles.outlineActionBtn}>
                  <Text style={styles.outlineActionText}>Cancel</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.primaryActionBtn} onPress={() => setActiveChatApptId(appt.id)}>
                  <Text style={styles.primaryActionText}>Chat Support</Text>
                </TouchableOpacity>
              </View>
            </View>
          ))
        )}

        <Text style={styles.sectionTitle}>Past Appointments</Text>
        
        {pastAppointments.length === 0 ? (
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>No past appointments found</Text>
          </View>
        ) : (
          pastAppointments.map((appt) => {
            const dateParts = appt.date.split('-');
            const day = dateParts[2] || '12';
            const weekday = appt.date === '2026-04-12' ? 'Fri' : 'Mon';
            const month = appt.date === '2026-04-12' ? 'APR' : 'MAY';
            const medicalNote = getMedicalNoteForAppointment(appt);
            const isNoteExpanded = selectedNoteApptId === appt.id;

            return (
              <View key={appt.id} style={{ marginBottom: 12 }}>
                <View style={[styles.ticketCard, { opacity: 0.85 }]}>
                  <View style={[styles.dateBlock, { backgroundColor: '#64748B' }]}>
                    <Text style={styles.dateWeekday}>{weekday}</Text>
                    <Text style={styles.dateDay}>{day}</Text>
                    <Text style={styles.dateMonth}>{month}</Text>
                  </View>
                  <View style={styles.detailsBlock}>
                    <Text style={styles.clinicName}>{appt.clinicName}</Text>
                    <View style={styles.detailRow}>
                      <Ionicons name="time-outline" size={16} color={COLORS.primary} style={styles.detailIcon} />
                      <Text style={styles.detailText}>{appt.time}</Text>
                    </View>
                    <View style={styles.detailRow}>
                      <FontAwesome5 name="stethoscope" size={14} color={COLORS.primary} style={styles.detailIcon} />
                      <Text style={styles.detailText}>{appt.doctorName} - {appt.type}</Text>
                    </View>
                    
                    {medicalNote && (
                      <TouchableOpacity 
                        style={styles.btnViewSummary}
                        onPress={() => setSelectedNoteApptId(isNoteExpanded ? null : appt.id)}
                      >
                        <Text style={styles.btnViewSummaryText}>
                          {isNoteExpanded ? 'Hide Health Notes' : 'View Consultation Notes'}
                        </Text>
                        <Ionicons name={isNoteExpanded ? "chevron-up" : "chevron-down"} size={14} color={COLORS.primary} />
                      </TouchableOpacity>
                    )}
                  </View>
                </View>

                {isNoteExpanded && medicalNote && (
                  <View style={styles.expandedNoteCard}>
                    <Text style={styles.noteTitleLabel}>EHR Visit Consultation Notes</Text>
                    <Text style={styles.noteBodyText}><Text style={{ fontWeight: 'bold' }}>Diagnosis: </Text>{medicalNote.diagnosis}</Text>
                    <Text style={styles.noteBodyText}><Text style={{ fontWeight: 'bold' }}>Treatment Plan: </Text>{medicalNote.treatment}</Text>
                    {medicalNote.notes ? <Text style={styles.noteBodyText}><Text style={{ fontWeight: 'bold' }}>Physician Notes: </Text>{medicalNote.notes}</Text> : null}
                  </View>
                )}
              </View>
            );
          })
        )}
      </ScrollView>

      {/* -------------------- LIVE CHAT MODAL -------------------- */}
      <Modal
        visible={activeChatApptId !== null}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setActiveChatApptId(null)}
      >
        <View style={styles.modalOverlay}>
          <KeyboardAvoidingView 
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            style={styles.chatModalContainer}
          >
            {/* Modal Header */}
            <View style={styles.modalHeader}>
              <View>
                <Text style={styles.modalTitle}>Clinic Live Chat Support</Text>
                <Text style={styles.modalSubtitle}>Appt ID: {activeChatApptId}</Text>
              </View>
              <TouchableOpacity 
                style={styles.modalCloseBtn}
                onPress={() => setActiveChatApptId(null)}
              >
                <Ionicons name="close" size={24} color={COLORS.primary} />
              </TouchableOpacity>
            </View>

            {/* Message logs */}
            <ScrollView 
              contentContainerStyle={styles.chatMessageScroll}
              showsVerticalScrollIndicator={false}
              ref={ref => { if (ref) ref.scrollToEnd({ animated: true }); }}
            >
              {messages
                .filter(m => m.apptId === activeChatApptId)
                .map((msg) => {
                  const isPatient = msg.sender === 'patient';
                  return (
                    <View 
                      key={msg.id} 
                      style={[
                        styles.messageBubbleContainer, 
                        isPatient ? styles.bubbleContainerRight : styles.bubbleContainerLeft
                      ]}
                    >
                      <View style={[
                        styles.messageBubble, 
                        isPatient ? styles.bubbleRight : styles.bubbleLeft
                      ]}>
                        <Text style={[
                          styles.messageText, 
                          isPatient ? styles.messageTextRight : styles.messageTextLeft
                        ]}>
                          {msg.text}
                        </Text>
                        <Text style={[
                          styles.messageTimeText, 
                          isPatient ? styles.messageTimeRight : styles.messageTimeLeft
                        ]}>
                          {msg.time}
                        </Text>
                      </View>
                    </View>
                  );
                })
              }
            </ScrollView>

            {/* Input Row */}
            <View style={styles.chatInputRow}>
              <TextInput
                placeholder="Type your message..."
                value={chatText}
                onChangeText={setChatText}
                style={styles.chatInputField}
                placeholderTextColor="#94A3B8"
              />
              <TouchableOpacity style={styles.chatSendBtn} onPress={handleSendChatMessage}>
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
    backgroundColor: COLORS.background 
  },
  header: { 
    backgroundColor: COLORS.primary,
    paddingTop: LAYOUT.statusBarHeight,
    height: LAYOUT.statusBarHeight + LAYOUT.headerHeight,
  },
  headerContent: {
    height: LAYOUT.headerHeight,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: SIZES.margin,
  },
  headerBrand: { 
    flexDirection: 'row', 
    alignItems: 'center' 
  },
  headerActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  actionButton: {
    padding: 4,
  },
  appTitle: { 
    color: '#FFFFFF', 
    fontSize: 22, 
    fontWeight: 'bold', 
    marginLeft: 10 
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
    borderColor: '#EAE8FC',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#0F2C59',
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
    fontWeight: 'bold',
    color: COLORS.primary,
  },
  calendarDayTextActive: {
    color: '#FFFFFF',
  },
  calendarWeekdayText: {
    fontSize: 10,
    color: '#94A3B8',
    marginTop: 4,
    fontWeight: '600',
  },
  calendarWeekdayTextActive: {
    color: '#EAE8FC',
  },
  sectionTitle: { 
    fontSize: 18, 
    fontWeight: 'bold', 
    color: COLORS.primary, 
    marginTop: 12,
    marginBottom: -4,
  },
  premiumCard: {
    backgroundColor: COLORS.surface,
    borderRadius: 20,
    padding: 16,
    borderWidth: 1,
    borderColor: '#EAE8FC',
    shadowColor: '#0F2C59',
    shadowOpacity: 0.04,
    shadowRadius: 10,
    elevation: 2,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  doctorBadge: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#EFF6FF',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  doctorBadgeText: {
    color: COLORS.primary,
    fontSize: 18,
    fontWeight: 'bold',
  },
  doctorMeta: {
    flex: 1,
  },
  doctorNameText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: COLORS.primary,
  },
  doctorSpecText: {
    fontSize: 13,
    color: '#64748B',
    marginTop: 2,
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  statusBadgeText: {
    fontSize: 11,
    fontWeight: 'bold',
  },
  statusConfirmed: {
    backgroundColor: '#F0FDF4',
  },
  statusPending: {
    backgroundColor: '#FFFBEB',
  },
  statusTextConfirmed: {
    color: COLORS.success,
  },
  statusTextPending: {
    color: '#D97706',
  },
  emptyContainer: {
    backgroundColor: COLORS.surface,
    borderWidth: 1,
    borderColor: '#EAE8FC',
    borderRadius: 20,
    padding: 30,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  emptyText: {
    color: '#64748B',
    fontSize: 14,
    fontWeight: '600',
  },
  cardDivider: {
    height: 1,
    backgroundColor: '#EAE8FC',
    marginVertical: 14,
  },
  infoRow: {
    gap: 8,
    marginBottom: 16,
  },
  infoCol: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  infoColText: {
    fontSize: 14,
    color: '#475569',
    fontWeight: '500',
  },
  actionRow: {
    flexDirection: 'row',
    gap: 12,
  },
  outlineActionBtn: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#CBD5E1',
    backgroundColor: '#FFFFFF',
  },
  outlineActionText: {
    color: '#64748B',
    fontSize: 14,
    fontWeight: 'bold',
  },
  primaryActionBtn: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    borderRadius: 12,
    backgroundColor: COLORS.primary,
  },
  primaryActionText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: 'bold',
  },
  ticketCard: { 
    backgroundColor: COLORS.surface, 
    borderRadius: SIZES.radius, 
    padding: 16, 
    flexDirection: 'row', 
    borderWidth: 1, 
    borderColor: COLORS.border, 
    shadowColor: '#000', 
    shadowOpacity: 0.02, 
    shadowRadius: 5, 
    elevation: 1,
  },
  dateBlock: { 
    backgroundColor: COLORS.primary, 
    borderRadius: 8, 
    padding: 15, 
    alignItems: 'center', 
    justifyContent: 'center', 
    marginRight: 15, 
    width: 75 
  },
  dateWeekday: { 
    fontSize: 12, 
    color: '#FFFFFF' 
  },
  dateDay: { 
    fontSize: 24, 
    fontWeight: 'bold', 
    color: '#FFFFFF', 
    marginVertical: 2 
  },
  dateMonth: { 
    fontSize: 12, 
    color: '#FFFFFF' 
  },
  detailsBlock: { 
    flex: 1, 
    justifyContent: 'center' 
  },
  clinicName: { 
    fontSize: 15, 
    fontWeight: 'bold', 
    color: COLORS.primary, 
    marginBottom: 8 
  },
  detailRow: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    marginBottom: 6 
  },
  detailIcon: { 
    marginRight: 8, 
    width: 16, 
    textAlign: 'center' 
  },
  detailText: { 
    fontSize: 13, 
    color: '#64748B' 
  },
  btnViewSummary: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
    gap: 4,
  },
  btnViewSummaryText: {
    color: COLORS.primary,
    fontSize: 12,
    fontWeight: '700',
  },
  expandedNoteCard: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#EAE8FC',
    borderTopWidth: 0,
    borderBottomLeftRadius: 16,
    borderBottomRightRadius: 16,
    padding: 14,
    marginTop: -4,
    gap: 6,
    shadowColor: '#0F2C59',
    shadowOpacity: 0.02,
    shadowRadius: 5,
    elevation: 1,
  },
  noteTitleLabel: {
    fontSize: 12,
    fontWeight: 'bold',
    color: COLORS.primary,
    letterSpacing: 0.5,
    marginBottom: 2,
  },
  noteBodyText: {
    fontSize: 12,
    color: '#475569',
    lineHeight: 16,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(15, 44, 89, 0.4)',
    justifyContent: 'flex-end',
  },
  chatModalContainer: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    height: '75%',
    paddingBottom: Platform.OS === 'ios' ? 24 : 12,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 18,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
  },
  modalTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: COLORS.primary,
  },
  modalSubtitle: {
    fontSize: 11,
    color: '#94A3B8',
    marginTop: 2,
    fontWeight: '500',
  },
  modalCloseBtn: {
    padding: 4,
  },
  chatMessageScroll: {
    padding: 16,
    gap: 12,
  },
  messageBubbleContainer: {
    flexDirection: 'row',
    width: '100%',
  },
  bubbleContainerLeft: {
    justifyContent: 'flex-start',
  },
  bubbleContainerRight: {
    justifyContent: 'flex-end',
  },
  messageBubble: {
    maxWidth: '75%',
    borderRadius: 16,
    paddingHorizontal: 14,
    paddingVertical: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 1,
    elevation: 1,
  },
  bubbleLeft: {
    backgroundColor: '#F1F5F9',
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
    color: '#FFFFFF',
  },
  messageTimeText: {
    fontSize: 9,
    marginTop: 4,
    fontWeight: '500',
    textAlign: 'right',
  },
  messageTimeLeft: {
    color: '#94A3B8',
  },
  messageTimeRight: {
    color: '#BFDBFE',
  },
  chatInputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: '#F1F5F9',
    gap: 8,
  },
  chatInputField: {
    flex: 1,
    backgroundColor: '#F8FAFC',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: 14,
    paddingHorizontal: 14,
    paddingVertical: Platform.OS === 'ios' ? 12 : 8,
    color: COLORS.primary,
    fontSize: 14,
  },
  chatSendBtn: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: COLORS.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

