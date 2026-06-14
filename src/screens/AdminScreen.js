import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput, Alert, Platform, KeyboardAvoidingView, Switch, Modal } from 'react-native';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { COLORS, SIZES, LAYOUT } from '../constants/theme';
import { useStateContext } from '../context/StateContext';

export default function AdminScreen({ navigation }) {
  const { 
    currentUser, 
    clinics,
    doctors,
    patients,
    appointments, 
    updates, 
    messages,
    adminNotifications,
    updateAppointmentStatus, 
    addUpdate, 
    deleteUpdate, 
    addDoctor,
    updateDoctorShift,
    updateClinicSettings,
    addMedicalNote,
    sendMessage,
    clearNotifications,
    logout 
  } = useStateContext();

  const [activeTab, setActiveTab] = useState('overview'); // 'overview', 'bookings', 'doctors', 'patients', 'updates', 'settings'
  const [bookingFilter, setBookingFilter] = useState('Pending'); // 'Pending' or 'Confirmed'
  const [patientSearch, setPatientSearch] = useState('');
  const [selectedPatientId, setSelectedPatientId] = useState(null);
  
  // Announcement Form State
  const [announcementTitle, setAnnouncementTitle] = useState('');
  const [announcementDesc, setAnnouncementDesc] = useState('');
  const [announcementCategory, setAnnouncementCategory] = useState('Schedules');
  const [showCategoryDropdown, setShowCategoryDropdown] = useState(false);

  // Doctor Form State
  const [docName, setDocName] = useState('');
  const [docSpecialty, setDocSpecialty] = useState('');
  const [selectedDoctorIdForShifts, setSelectedDoctorIdForShifts] = useState(null);

  // Consultation EHR Form State
  const [diagnosis, setDiagnosis] = useState('');
  const [treatment, setTreatment] = useState('');
  const [consultNotes, setConsultNotes] = useState('');

  // Active Chat State
  const [activeChatApptId, setActiveChatApptId] = useState(null);
  const [chatText, setChatText] = useState('');
  const [selectedChatPatientName, setSelectedChatPatientName] = useState(null);
  const [adminChatText, setAdminChatText] = useState('');

  // Clinic Association Details
  const clinicName = currentUser?.clinic || 'Dawn Park Clinic';
  const activeClinicInfo = clinics.find(c => c.name.toLowerCase().includes(clinicName.toLowerCase())) || clinics[0];

  // Form State for Settings Editor
  const [settingsAddress, setSettingsAddress] = useState(activeClinicInfo.address);
  const [settingsPhone, setSettingsPhone] = useState(activeClinicInfo.phone);
  const [settingsHours, setSettingsHours] = useState(activeClinicInfo.hours);
  const [settingsWebsite, setSettingsWebsite] = useState(activeClinicInfo.website);
  const [settingsSlot, setSettingsSlot] = useState(activeClinicInfo.slotDuration.toString());

  // Filter lists for current clinic
  const clinicAppointments = appointments.filter(
    appt => appt.clinicName.toLowerCase().includes(clinicName.toLowerCase())
  );

  const clinicDoctors = doctors.filter(
    doc => doc.clinic.toLowerCase().includes(clinicName.toLowerCase())
  );

  const clinicUpdates = updates.filter(
    up => up.clinic.toLowerCase().includes(clinicName.toLowerCase())
  );

  const handleLogout = () => {
    logout();
    navigation.replace('Login');
  };

  const handleSaveSettings = () => {
    updateClinicSettings(activeClinicInfo.name, {
      address: settingsAddress,
      phone: settingsPhone,
      hours: settingsHours,
      website: settingsWebsite,
      slotDuration: parseInt(settingsSlot, 10) || 30
    });
    Alert.alert('Settings Saved', 'Clinic settings have been dynamically updated.');
  };

  const handleAddNewDoctor = () => {
    if (!docName.trim()) {
      alert('Please enter doctor name');
      return;
    }
    if (!docSpecialty.trim()) {
      alert('Please enter doctor specialty');
      return;
    }
    addDoctor({
      name: docName.startsWith('Dr. ') ? docName.trim() : `Dr. ${docName.trim()}`,
      specialty: docSpecialty.trim(),
      clinic: activeClinicInfo.name
    });
    setDocName('');
    setDocSpecialty('');
    Alert.alert('Success', 'New doctor added to directories.');
  };

  const handleSaveConsultation = (patientName) => {
    if (!diagnosis.trim()) {
      alert('Please enter diagnosis');
      return;
    }
    addMedicalNote(patientName, {
      doctorName: clinicDoctors[0]?.name || 'Dr. Chris Nkwanyana',
      clinicName: activeClinicInfo.name,
      diagnosis: diagnosis.trim(),
      treatment: treatment.trim(),
      notes: consultNotes.trim()
    });
    setDiagnosis('');
    setTreatment('');
    setConsultNotes('');
    Alert.alert('Consultation Saved', 'Record added to Patient EHR Dossier.');
  };

  const handleSendChatMessage = () => {
    if (!chatText.trim() || !activeChatApptId) return;
    const targetAppt = appointments.find(a => a.id === activeChatApptId);
    if (!targetAppt) return;
    sendMessage(targetAppt.clinicName, targetAppt.patientName, 'admin', chatText.trim(), activeChatApptId);
    setChatText('');
  };

  const handleSendAdminChatMessage = () => {
    if (!adminChatText.trim() || !selectedChatPatientName) return;
    sendMessage(activeClinicInfo.name, selectedChatPatientName, 'admin', adminChatText.trim(), null);
    setAdminChatText('');
  };

  const handlePublishUpdate = () => {
    if (!announcementTitle.trim()) {
      alert('Please enter title');
      return;
    }
    if (!announcementDesc.trim()) {
      alert('Please enter announcement description');
      return;
    }
    addUpdate({
      title: announcementTitle.trim(),
      category: announcementCategory,
      desc: announcementDesc.trim(),
      clinic: clinicName
    });
    setAnnouncementTitle('');
    setAnnouncementDesc('');
    setAnnouncementCategory('Schedules');
    Alert.alert('Success', 'Bulletin published successfully.');
  };

  // Mock Bar Chart Values (Height representation)
  const monthlyMetrics = [
    { month: 'Jan', count: 42, height: 60 },
    { month: 'Feb', count: 56, height: 80 },
    { month: 'Mar', count: 68, height: 95 },
    { month: 'Apr', count: 48, height: 68 },
    { month: 'May', count: 72, height: 110 }
  ];

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerContent}>
          <View style={styles.headerBrand}>
            <MaterialCommunityIcons name="shield-account" size={32} color="#FFFFFF" />
            <View style={{ marginLeft: 10 }}>
              <Text style={styles.appTitle}>{activeClinicInfo.name}</Text>
              <Text style={styles.appSubtitle}>Clinic Management Console</Text>
            </View>
          </View>
          <TouchableOpacity style={styles.logoutHeaderBtn} onPress={handleLogout}>
            <Ionicons name="log-out-outline" size={22} color="#FFFFFF" />
          </TouchableOpacity>
        </View>
      </View>

      {/* Horizontally Scrollable Tabs Segment */}
      <View style={styles.tabScrollContainer}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.tabScroll}>
          {[
            { id: 'overview', label: 'Overview', icon: 'analytics' },
            { id: 'bookings', label: 'Bookings', icon: 'calendar' },
            { id: 'chats', label: 'Chats', icon: 'chatbubbles' },
            { id: 'doctors', label: 'Doctors', icon: 'people' },
            { id: 'patients', label: 'Patients (EHR)', icon: 'medical' },
            { id: 'updates', label: 'Bulletins', icon: 'megaphone' },
            { id: 'settings', label: 'Settings', icon: 'settings' }
          ].map((tab) => {
            const isActive = activeTab === tab.id;
            return (
              <TouchableOpacity 
                key={tab.id} 
                style={[styles.tabButton, isActive && styles.tabButtonActive]}
                onPress={() => setActiveTab(tab.id)}
              >
                <Ionicons 
                  name={tab.icon} 
                  size={16} 
                  color={isActive ? '#FFFFFF' : COLORS.primary} 
                  style={{ marginRight: 6 }} 
                />
                <Text style={[styles.tabText, isActive && styles.tabTextActive]}>{tab.label}</Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>

        {/* -------------------- 1. OVERVIEW TAB -------------------- */}
        {activeTab === 'overview' && (
          <View style={styles.sectionGap}>
            {/* Stats Ratios grid */}
            <View style={styles.grid}>
              <View style={styles.gridItem}>
                <Text style={styles.gridValue}>{clinicAppointments.length}</Text>
                <Text style={styles.gridLabel}>Bookings</Text>
              </View>
              <View style={styles.gridItem}>
                <Text style={[styles.gridValue, { color: '#E28743' }]}>
                  {clinicAppointments.filter(a => a.status === 'Pending').length}
                </Text>
                <Text style={styles.gridLabel}>Pending</Text>
              </View>
              <View style={styles.gridItem}>
                <Text style={[styles.gridValue, { color: COLORS.success }]}>
                  {clinicAppointments.filter(a => a.status === 'Confirmed').length}
                </Text>
                <Text style={styles.gridLabel}>Confirmed</Text>
              </View>
              <View style={styles.gridItem}>
                <Text style={[styles.gridValue, { color: '#F59E0B' }]}>4.9★</Text>
                <Text style={styles.gridLabel}>Rating</Text>
              </View>
            </View>

            {/* Performance Bar Chart */}
            <View style={styles.card}>
              <Text style={styles.cardHeaderTitle}>Monthly Traffic Analytics</Text>
              <View style={styles.chartContainer}>
                {monthlyMetrics.map((item, index) => (
                  <View key={index} style={styles.chartCol}>
                    <Text style={styles.chartValText}>{item.count}</Text>
                    <View style={[styles.chartBar, { height: item.height }]} />
                    <Text style={styles.chartLabelText}>{item.month}</Text>
                  </View>
                ))}
              </View>
            </View>

            {/* Admin Alerts Notifications Feed */}
            <View style={styles.card}>
              <View style={styles.cardTopHeader}>
                <Text style={styles.cardHeaderTitle}>Alerts Center</Text>
                <TouchableOpacity onPress={clearNotifications}>
                  <Text style={styles.clearAlertsText}>Clear All</Text>
                </TouchableOpacity>
              </View>
              
              {adminNotifications.length === 0 ? (
                <View style={styles.emptyCardAlerts}>
                  <Ionicons name="notifications-off-outline" size={28} color="#94A3B8" />
                  <Text style={styles.emptyAlertsText}>No new activity alerts</Text>
                </View>
              ) : (
                <View style={styles.alertsFeed}>
                  {adminNotifications.map((notif) => (
                    <View key={notif.id} style={styles.alertItem}>
                      <View style={styles.alertStatusDot} />
                      <View style={{ flex: 1 }}>
                        <Text style={styles.alertTitle}>{notif.title}</Text>
                        <Text style={styles.alertBody}>{notif.body}</Text>
                        <Text style={styles.alertTime}>{notif.time}</Text>
                      </View>
                    </View>
                  ))}
                </View>
              )}
            </View>
          </View>
        )}

        {/* -------------------- 2. BOOKINGS TAB -------------------- */}
        {activeTab === 'bookings' && (
          <View style={styles.sectionGap}>
            <View style={styles.filterRow}>
              {['Pending', 'Confirmed'].map((filter) => {
                const count = clinicAppointments.filter(a => a.status === filter).length;
                return (
                  <TouchableOpacity
                    key={filter}
                    style={[styles.filterBtn, bookingFilter === filter && styles.filterBtnActive]}
                    onPress={() => setBookingFilter(filter)}
                  >
                    <Text style={[styles.filterBtnText, bookingFilter === filter && styles.filterBtnTextActive]}>
                      {filter} ({count})
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>

            {clinicAppointments.filter(a => a.status === bookingFilter).length === 0 ? (
              <View style={styles.emptyContainer}>
                <Ionicons name="calendar-outline" size={40} color="#94A3B8" />
                <Text style={styles.emptyText}>No {bookingFilter.toLowerCase()} appointments</Text>
              </View>
            ) : (
              <View style={{ gap: 12 }}>
                {clinicAppointments.filter(a => a.status === bookingFilter).map((appt) => (
                  <View key={appt.id} style={styles.bookingCard}>
                    <View style={styles.bookingCardHeader}>
                      <View style={styles.avatarCircle}>
                        <Text style={styles.avatarCircleText}>{appt.patientName.charAt(0)}</Text>
                      </View>
                      <View style={{ flex: 1 }}>
                        <Text style={styles.bookingPatientName}>{appt.patientName}</Text>
                        <Text style={styles.bookingDoctorName}>{appt.doctorName} • {appt.type}</Text>
                      </View>
                      <TouchableOpacity 
                        style={styles.chatButtonToggle}
                        onPress={() => setActiveChatApptId(appt.id)}
                      >
                        <Ionicons name="chatbubble-ellipses" size={20} color={COLORS.primary} />
                      </TouchableOpacity>
                    </View>

                    <View style={styles.divider} />

                    <View style={styles.bookingTimeRow}>
                      <View style={styles.bookingTimeCol}>
                        <Ionicons name="calendar-outline" size={15} color={COLORS.primary} />
                        <Text style={styles.bookingTimeColText}>{appt.date}</Text>
                      </View>
                      <View style={styles.bookingTimeCol}>
                        <Ionicons name="time-outline" size={15} color={COLORS.primary} />
                        <Text style={styles.bookingTimeColText}>{appt.time}</Text>
                      </View>
                    </View>

                    {appt.status === 'Pending' && (
                      <View style={styles.bookingActionRow}>
                        <TouchableOpacity 
                          style={styles.btnDecline}
                          onPress={() => updateAppointmentStatus(appt.id, 'Declined')}
                        >
                          <Text style={styles.btnDeclineText}>Decline</Text>
                        </TouchableOpacity>
                        
                        <TouchableOpacity 
                          style={styles.btnAccept}
                          onPress={() => updateAppointmentStatus(appt.id, 'Confirmed')}
                        >
                          <Text style={styles.btnAcceptText}>Accept & Confirm</Text>
                        </TouchableOpacity>
                      </View>
                    )}
                  </View>
                ))}
              </View>
            )}
          </View>
        )}

        {/* -------------------- 3. CHATS TAB -------------------- */}
        {activeTab === 'chats' && (
          <View style={styles.sectionGap}>
            <View style={styles.card}>
              <Text style={styles.cardHeaderTitle}>Live Patient Conversations</Text>
              <Text style={styles.cardDesc}>Select a patient to view messages and reply in real time.</Text>
              
              {(() => {
                const clinicMessages = messages.filter(
                  m => m.clinicName === activeClinicInfo.name
                );
                const activePatients = Array.from(new Set(clinicMessages.map(m => m.patientName)));

                if (activePatients.length === 0) {
                  return (
                    <View style={styles.emptyContainer}>
                      <Ionicons name="chatbubbles-outline" size={40} color="#94A3B8" />
                      <Text style={styles.emptyText}>No active patient conversations</Text>
                    </View>
                  );
                }

                return (
                  <View style={styles.chatDashboardLayout}>
                    <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.patientTabsScroll}>
                      {activePatients.map((patName) => {
                        const isSelected = selectedChatPatientName === patName;
                        const patientMsgs = clinicMessages.filter(m => m.patientName === patName);
                        const lastMsg = patientMsgs[patientMsgs.length - 1];
                        return (
                          <TouchableOpacity 
                            key={patName}
                            style={[styles.patientChatTab, isSelected && styles.patientChatTabActive]}
                            onPress={() => setSelectedChatPatientName(patName)}
                          >
                            <View style={styles.patientTabAvatar}>
                              <Text style={styles.patientTabAvatarText}>{patName.charAt(0)}</Text>
                            </View>
                            <View style={{ marginLeft: 8, maxWidth: 120 }}>
                              <Text style={[styles.patientTabName, isSelected && styles.patientTabNameActive]} numberOfLines={1}>
                                {patName}
                              </Text>
                              <Text style={[styles.patientTabSnippet, isSelected && styles.patientTabSnippetActive]} numberOfLines={1}>
                                {lastMsg ? lastMsg.text : "No messages"}
                              </Text>
                            </View>
                          </TouchableOpacity>
                        );
                      })}
                    </ScrollView>

                    {selectedChatPatientName ? (
                      <View style={styles.adminConversationBox}>
                        <View style={styles.adminChatHeader}>
                          <Text style={styles.adminChatHeaderTitle}>Chatting with {selectedChatPatientName}</Text>
                          <TouchableOpacity onPress={() => setSelectedChatPatientName(null)}>
                            <Text style={styles.closeChatText}>Close Thread</Text>
                          </TouchableOpacity>
                        </View>
                        
                        <ScrollView 
                          style={styles.adminChatFeedScroll}
                          contentContainerStyle={{ gap: 10, paddingVertical: 10 }}
                          ref={ref => { if (ref) ref.scrollToEnd({ animated: true }); }}
                          showsVerticalScrollIndicator={false}
                        >
                          {clinicMessages
                            .filter(m => m.patientName === selectedChatPatientName)
                            .map((msg) => {
                              const isAdmin = msg.sender === 'admin';
                              return (
                                <View 
                                  key={msg.id}
                                  style={[
                                    styles.messageBubbleContainer,
                                    isAdmin ? styles.bubbleContainerRight : styles.bubbleContainerLeft
                                  ]}
                                >
                                  <View style={[
                                    styles.messageBubble,
                                    isAdmin ? styles.bubbleRight : styles.bubbleLeft
                                  ]}>
                                    <Text style={[
                                      styles.messageText,
                                      isAdmin ? styles.messageTextRight : styles.messageTextLeft
                                    ]}>
                                      {msg.text}
                                    </Text>
                                    <Text style={[
                                      styles.messageTimeText,
                                      isAdmin ? styles.messageTimeRight : styles.messageTimeLeft
                                    ]}>
                                      {msg.time}
                                    </Text>
                                  </View>
                                </View>
                              );
                            })
                          }
                        </ScrollView>

                        <View style={styles.adminChatInputRow}>
                          <TextInput
                            placeholder={`Reply to ${selectedChatPatientName}...`}
                            value={adminChatText}
                            onChangeText={setAdminChatText}
                            style={styles.adminChatInputField}
                            placeholderTextColor="#94A3B8"
                          />
                          <TouchableOpacity accessibilityLabel="admin-send-button" style={styles.adminChatSendBtn} onPress={handleSendAdminChatMessage}>
                            <Ionicons name="send" size={16} color="#FFFFFF" />
                          </TouchableOpacity>
                        </View>
                      </View>
                    ) : (
                      <View style={styles.selectPromptCard}>
                        <Ionicons name="chatbubbles-outline" size={24} color="#94A3B8" />
                        <Text style={styles.selectPromptText}>Select a patient conversation above to start replying</Text>
                      </View>
                    )}
                  </View>
                );
              })()}
            </View>
          </View>
        )}

        {/* -------------------- 4. DOCTORS TAB -------------------- */}
        {activeTab === 'doctors' && (
          <View style={styles.sectionGap}>
            <View style={styles.card}>
              <Text style={styles.cardHeaderTitle}>Doctors Directory & Shifts</Text>
              <Text style={styles.cardDesc}>Select a doctor to edit scheduling weekday availability.</Text>
              
              <View style={{ gap: 10, marginTop: 12 }}>
                {clinicDoctors.map((doc) => {
                  const isEditingShifts = selectedDoctorIdForShifts === doc.id;
                  return (
                    <View key={doc.id} style={styles.docItemCard}>
                      <TouchableOpacity 
                        style={styles.docItemHeader}
                        onPress={() => setSelectedDoctorIdForShifts(isEditingShifts ? null : doc.id)}
                      >
                        <View style={styles.docIconCircle}>
                          <Text style={styles.docIconCircleText}>{doc.avatarText}</Text>
                        </View>
                        <View style={{ flex: 1 }}>
                          <Text style={styles.docCardName}>{doc.name}</Text>
                          <Text style={styles.docCardSpec}>{doc.specialty}</Text>
                        </View>
                        <Ionicons 
                          name={isEditingShifts ? "chevron-up" : "chevron-down"} 
                          size={18} 
                          color="#94A3B8" 
                        />
                      </TouchableOpacity>

                      {isEditingShifts && (
                        <View style={styles.shiftEditor}>
                          <Text style={styles.shiftEditorTitle}>Configure Active Shift Days</Text>
                          {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((day) => (
                            <View key={day} style={styles.shiftRow}>
                              <Text style={styles.shiftDayText}>{day}day availability</Text>
                              <Switch
                                value={doc.shifts[day]}
                                onValueChange={(val) => updateDoctorShift(doc.id, day, val)}
                                trackColor={{ false: '#CBD5E1', true: '#BFDBFE' }}
                                thumbColor={doc.shifts[day] ? COLORS.primary : '#F1F5F9'}
                              />
                            </View>
                          ))}
                        </View>
                      )}
                    </View>
                  );
                })}
              </View>
            </View>

            {/* Add New Doctor Form */}
            <View style={styles.card}>
              <Text style={styles.cardHeaderTitle}>Add Doctor to Practice</Text>
              <TextInput 
                placeholder="Doctor Full Name (e.g. Dr. Pieter Naude)"
                value={docName}
                onChangeText={setDocName}
                style={styles.textInputStyle}
                placeholderTextColor="#94A3B8"
              />
              <TextInput 
                placeholder="Specialty (e.g. Cardiologist, Dentist)"
                value={docSpecialty}
                onChangeText={setDocSpecialty}
                style={styles.textInputStyle}
                placeholderTextColor="#94A3B8"
              />
              <TouchableOpacity style={styles.btnSaveForm} onPress={handleAddNewDoctor}>
                <Ionicons name="add-circle" size={16} color="#FFFFFF" style={{ marginRight: 6 }} />
                <Text style={styles.btnSaveFormText}>Save Doctor Profile</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}

        {/* -------------------- 4. PATIENTS TAB -------------------- */}
        {activeTab === 'patients' && (
          <View style={styles.sectionGap}>
            <View style={styles.searchBar}>
              <Ionicons name="search" size={18} color="#94A3B8" />
              <TextInput 
                placeholder="Search registered patients..."
                value={patientSearch}
                onChangeText={setPatientSearch}
                style={styles.searchInput}
                placeholderTextColor="#94A3B8"
              />
            </View>

            <View style={styles.card}>
              <Text style={styles.cardHeaderTitle}>Patient Dossier Index</Text>
              <Text style={styles.cardDesc}>Select a patient to review appointment charts and append consultation summaries.</Text>
              
              <View style={{ gap: 10, marginTop: 12 }}>
                {patients
                  .filter(p => p.name.toLowerCase().includes(patientSearch.toLowerCase()))
                  .map((pat) => {
                    const isSelected = selectedPatientId === pat.id;
                    return (
                      <View key={pat.id} style={styles.patientListItem}>
                        <TouchableOpacity 
                          style={styles.patientItemHeader}
                          onPress={() => setSelectedPatientId(isSelected ? null : pat.id)}
                        >
                          <View style={styles.patientAvatarBox}>
                            <Text style={styles.patientAvatarBoxText}>{pat.name.charAt(0)}</Text>
                          </View>
                          <View style={{ flex: 1 }}>
                            <Text style={styles.patientListName}>{pat.name}</Text>
                            <Text style={styles.patientListMeta}>{pat.email} • {pat.phone}</Text>
                          </View>
                          <Ionicons 
                            name={isSelected ? "eye-off" : "eye"} 
                            size={18} 
                            color={COLORS.primary} 
                          />
                        </TouchableOpacity>

                        {isSelected && (
                          <View style={styles.dossierContainer}>
                            {/* Consultation Summary EHR Writer */}
                            <Text style={styles.dossierSubHeader}>EHR consultation writer</Text>
                            <TextInput 
                              placeholder="Diagnosis (e.g. Wisdom Tooth extraction check)"
                              value={diagnosis}
                              onChangeText={setDiagnosis}
                              style={styles.formInput}
                              placeholderTextColor="#94A3B8"
                            />
                            <TextInput 
                              placeholder="Prescription/Treatment (e.g. Paracetamol, stitches)"
                              value={treatment}
                              onChangeText={setTreatment}
                              style={styles.formInput}
                              placeholderTextColor="#94A3B8"
                            />
                            <TextInput 
                              placeholder="Clinical Practitioner Notes"
                              value={consultNotes}
                              onChangeText={setConsultNotes}
                              multiline
                              numberOfLines={3}
                              style={[styles.formInput, { height: 70, textAlignVertical: 'top', paddingTop: 8 }]}
                              placeholderTextColor="#94A3B8"
                            />
                            <TouchableOpacity 
                              style={styles.btnSaveConsult}
                              onPress={() => handleSaveConsultation(pat.name)}
                            >
                              <Text style={styles.btnSaveConsultText}>Save Consultation Summary</Text>
                            </TouchableOpacity>

                            {/* Medical Notes Log */}
                            <Text style={[styles.dossierSubHeader, { marginTop: 16 }]}>Past Visit Records</Text>
                            {pat.medicalNotes.length === 0 ? (
                              <Text style={styles.emptyDossierText}>No consultation records on file.</Text>
                            ) : (
                              pat.medicalNotes.map((note) => (
                                <View key={note.id} style={styles.noteRecord}>
                                  <Text style={styles.noteHeader}>{note.date} • {note.doctorName}</Text>
                                  <Text style={styles.noteDiagText}><Text style={{ fontWeight: 'bold' }}>Diagnosis: </Text>{note.diagnosis}</Text>
                                  <Text style={styles.noteBodyText}><Text style={{ fontWeight: 'bold' }}>Treatment: </Text>{note.treatment}</Text>
                                  {note.notes ? <Text style={styles.noteBodyText}><Text style={{ fontWeight: 'bold' }}>Notes: </Text>{note.notes}</Text> : null}
                                </View>
                              ))
                            )}
                          </View>
                        )}
                      </View>
                    );
                  })
                }
              </View>
            </View>
          </View>
        )}

        {/* -------------------- 5. BULLETINS TAB -------------------- */}
        {activeTab === 'updates' && (
          <View style={styles.sectionGap}>
            <View style={styles.card}>
              <Text style={styles.cardHeaderTitle}>Post Clinic Bulletin</Text>
              
              <Text style={styles.formFieldLabel}>Announcement Title</Text>
              <TextInput 
                placeholder="e.g. Extended Dentistry Hours"
                value={announcementTitle}
                onChangeText={setAnnouncementTitle}
                style={styles.formInput}
                placeholderTextColor="#94A3B8"
              />

              <Text style={styles.formFieldLabel}>Category Type</Text>
              <TouchableOpacity 
                style={styles.formInputContainer} 
                onPress={() => setShowCategoryDropdown(!showCategoryDropdown)}
              >
                <Text style={{ fontSize: 15, color: COLORS.primary }}>{announcementCategory}</Text>
                <Ionicons name="chevron-down" size={18} color="#94A3B8" />
              </TouchableOpacity>

              {showCategoryDropdown && (
                <View style={styles.categoryDropdownMenu}>
                  {['Schedules', 'Vaccines', 'Campaign', 'Notice'].map((cat, index) => (
                    <TouchableOpacity 
                      key={index} 
                      style={styles.dropdownMenuItem}
                      onPress={() => {
                        setAnnouncementCategory(cat);
                        setShowCategoryDropdown(false);
                      }}
                    >
                      <Text style={styles.dropdownMenuItemText}>{cat}</Text>
                    </TouchableOpacity>
                  ))}
                </View>
              )}

              <Text style={styles.formFieldLabel}>Description</Text>
              <TextInput 
                placeholder="Compose announcement bulletin text here..."
                value={announcementDesc}
                onChangeText={setAnnouncementDesc}
                multiline
                numberOfLines={3}
                style={[styles.formInput, { height: 90, textAlignVertical: 'top', paddingTop: 8 }]}
                placeholderTextColor="#94A3B8"
              />

              <TouchableOpacity style={styles.publishButtonAction} onPress={handlePublishUpdate}>
                <Ionicons name="paper-plane" size={16} color="#FFFFFF" style={{ marginRight: 6 }} />
                <Text style={styles.publishButtonActionText}>Publish Bulletin</Text>
              </TouchableOpacity>
            </View>

            {/* Published Bulletins Log */}
            <Text style={styles.subTitleLabel}>Active announcements by {clinicName}</Text>
            {clinicUpdates.length === 0 ? (
              <View style={styles.emptyContainer}>
                <Text style={styles.emptyText}>No announcements posted by this clinic</Text>
              </View>
            ) : (
              <View style={{ gap: 12 }}>
                {clinicUpdates.map((item) => (
                  <View key={item.id} style={styles.updateItemCard}>
                    <View style={styles.updateItemHeader}>
                      <View style={styles.updateIconCircle}>
                        <Ionicons 
                          name={
                            item.category === 'Schedules' ? 'time' :
                            item.category === 'Vaccines' ? 'medical' :
                            item.category === 'Notice' ? 'pulse' : 'megaphone'
                          } 
                          size={18} 
                          color={COLORS.primary} 
                        />
                      </View>
                      <View style={{ flex: 1 }}>
                        <Text style={styles.updateItemCardTitle}>{item.title}</Text>
                        <Text style={styles.updateItemCardMeta}>{item.category} • {item.date}</Text>
                      </View>
                      <TouchableOpacity onPress={() => deleteUpdate(item.id)}>
                        <Ionicons name="trash" size={18} color="#EF4444" />
                      </TouchableOpacity>
                    </View>
                    <Text style={styles.updateItemCardDesc}>{item.desc}</Text>
                  </View>
                ))}
              </View>
            )}
          </View>
        )}

        {/* -------------------- 6. SETTINGS TAB -------------------- */}
        {activeTab === 'settings' && (
          <View style={styles.sectionGap}>
            <View style={styles.card}>
              <Text style={styles.cardHeaderTitle}>Clinic Configurations</Text>
              <Text style={styles.cardDesc}>Modify clinic profile values. Updates dynamically synchronize to patient listings.</Text>
              
              <View style={{ marginTop: 14 }}>
                <Text style={styles.formFieldLabel}>Clinic Name (Non-editable)</Text>
                <TextInput 
                  value={activeClinicInfo.name}
                  editable={false}
                  style={[styles.formInput, { backgroundColor: '#F1F5F9', color: '#64748B' }]}
                />

                <Text style={styles.formFieldLabel}>Clinic Location Address</Text>
                <TextInput 
                  value={settingsAddress}
                  onChangeText={setSettingsAddress}
                  style={styles.formInput}
                />

                <Text style={styles.formFieldLabel}>Contact Number</Text>
                <TextInput 
                  value={settingsPhone}
                  onChangeText={setSettingsPhone}
                  style={styles.formInput}
                />

                <Text style={styles.formFieldLabel}>Operating Hours</Text>
                <TextInput 
                  value={settingsHours}
                  onChangeText={setSettingsHours}
                  style={styles.formInput}
                />

                <Text style={styles.formFieldLabel}>Clinic Website Portal</Text>
                <TextInput 
                  value={settingsWebsite}
                  onChangeText={setSettingsWebsite}
                  style={styles.formInput}
                />

                <Text style={styles.formFieldLabel}>Booking Slot Duration (Minutes)</Text>
                <TextInput 
                  value={settingsSlot}
                  onChangeText={setSettingsSlot}
                  keyboardType="numeric"
                  style={styles.formInput}
                />

                <TouchableOpacity style={styles.btnSaveForm} onPress={handleSaveSettings}>
                  <Ionicons name="checkmark-done-circle" size={18} color="#FFFFFF" style={{ marginRight: 6 }} />
                  <Text style={styles.btnSaveFormText}>Save Configurations</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
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
                <Text style={styles.modalTitle}>Patient Live Chat Support</Text>
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
                  const isAdmin = msg.sender === 'admin';
                  return (
                    <View 
                      key={msg.id} 
                      style={[
                        styles.messageBubbleContainer, 
                        isAdmin ? styles.bubbleContainerRight : styles.bubbleContainerLeft
                      ]}
                    >
                      <View style={[
                        styles.messageBubble, 
                        isAdmin ? styles.bubbleRight : styles.bubbleLeft
                      ]}>
                        <Text style={[
                          styles.messageText, 
                          isAdmin ? styles.messageTextRight : styles.messageTextLeft
                        ]}>
                          {msg.text}
                        </Text>
                        <Text style={[
                          styles.messageTimeText, 
                          isAdmin ? styles.messageTimeRight : styles.messageTimeLeft
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
                placeholder="Type your reply message..."
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
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: SIZES.margin,
  },
  headerBrand: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  appTitle: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  appSubtitle: {
    color: '#BFDBFE',
    fontSize: 10,
    fontWeight: '500',
    marginTop: 2,
  },
  logoutHeaderBtn: {
    padding: 8,
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    borderRadius: 12,
  },
  tabScrollContainer: {
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#EAE8FC',
    paddingVertical: 10,
  },
  tabScroll: {
    paddingHorizontal: SIZES.margin,
    gap: 8,
  },
  tabButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 12,
    backgroundColor: '#F1F5F9',
  },
  tabButtonActive: {
    backgroundColor: COLORS.primary,
  },
  tabText: {
    fontSize: 12,
    fontWeight: '700',
    color: COLORS.primary,
  },
  tabTextActive: {
    color: '#FFFFFF',
  },
  scrollContent: {
    padding: SIZES.margin,
    paddingBottom: 40,
  },
  sectionGap: {
    gap: 16,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  gridItem: {
    flex: 1,
    minWidth: '45%',
    backgroundColor: COLORS.surface,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#EAE8FC',
    padding: 14,
    alignItems: 'center',
    shadowColor: '#0F2C59',
    shadowOpacity: 0.02,
    shadowRadius: 5,
    elevation: 1,
  },
  gridValue: {
    fontSize: 22,
    fontWeight: 'bold',
    color: COLORS.primary,
  },
  gridLabel: {
    fontSize: 11,
    color: '#64748B',
    fontWeight: '600',
    marginTop: 4,
  },
  card: {
    backgroundColor: COLORS.surface,
    borderWidth: 1,
    borderColor: '#EAE8FC',
    borderRadius: 20,
    padding: 16,
    shadowColor: '#0F2C59',
    shadowOpacity: 0.03,
    shadowRadius: 10,
    elevation: 2,
  },
  cardHeaderTitle: {
    fontSize: 15,
    fontWeight: 'bold',
    color: COLORS.primary,
  },
  cardTopHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  clearAlertsText: {
    fontSize: 12,
    color: COLORS.accent,
    fontWeight: '600',
  },
  cardDesc: {
    fontSize: 12,
    color: '#64748B',
    marginTop: 4,
    fontWeight: '500',
  },
  chartContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    height: 150,
    paddingTop: 10,
    paddingHorizontal: 8,
  },
  chartCol: {
    alignItems: 'center',
  },
  chartValText: {
    fontSize: 10,
    fontWeight: 'bold',
    color: '#64748B',
    marginBottom: 4,
  },
  chartBar: {
    width: 24,
    backgroundColor: COLORS.primary,
    borderRadius: 6,
  },
  chartLabelText: {
    fontSize: 11,
    color: COLORS.primary,
    fontWeight: '600',
    marginTop: 8,
  },
  emptyCardAlerts: {
    paddingVertical: 20,
    alignItems: 'center',
    gap: 6,
  },
  emptyAlertsText: {
    color: '#94A3B8',
    fontSize: 12,
    fontWeight: '600',
  },
  alertsFeed: {
    gap: 12,
    marginTop: 6,
  },
  alertItem: {
    flexDirection: 'row',
    gap: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
    paddingBottom: 10,
  },
  alertStatusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: COLORS.accent,
    marginTop: 6,
  },
  alertTitle: {
    fontSize: 13,
    fontWeight: 'bold',
    color: COLORS.primary,
  },
  alertBody: {
    fontSize: 12,
    color: '#475569',
    marginTop: 2,
    lineHeight: 16,
  },
  alertTime: {
    fontSize: 10,
    color: '#94A3B8',
    marginTop: 4,
    fontWeight: '500',
  },
  filterRow: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 4,
  },
  filterBtn: {
    flex: 1,
    paddingVertical: 10,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#EAE8FC',
    borderRadius: 14,
    alignItems: 'center',
  },
  filterBtnActive: {
    backgroundColor: '#EFF6FF',
    borderColor: '#BFDBFE',
  },
  filterBtnText: {
    fontSize: 13,
    color: '#64748B',
    fontWeight: '600',
  },
  filterBtnTextActive: {
    color: COLORS.primary,
  },
  emptyContainer: {
    backgroundColor: COLORS.surface,
    borderWidth: 1,
    borderColor: '#EAE8FC',
    borderRadius: 20,
    padding: 40,
    alignItems: 'center',
    gap: 8,
    marginTop: 8,
  },
  emptyText: {
    color: '#64748B',
    fontSize: 14,
    fontWeight: '600',
  },
  bookingCard: {
    backgroundColor: COLORS.surface,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#EAE8FC',
    padding: 16,
    shadowColor: '#0F2C59',
    shadowOpacity: 0.02,
    shadowRadius: 5,
    elevation: 1,
  },
  bookingCardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  avatarCircle: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#EFF6FF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarCircleText: {
    color: COLORS.primary,
    fontSize: 15,
    fontWeight: 'bold',
  },
  bookingPatientName: {
    fontSize: 14,
    fontWeight: 'bold',
    color: COLORS.primary,
  },
  bookingDoctorName: {
    fontSize: 11,
    color: '#64748B',
    marginTop: 2,
  },
  chatButtonToggle: {
    padding: 8,
    backgroundColor: '#EFF6FF',
    borderRadius: 10,
  },
  divider: {
    height: 1,
    backgroundColor: '#F1F5F9',
    marginVertical: 12,
  },
  bookingTimeRow: {
    flexDirection: 'row',
    gap: 20,
  },
  bookingTimeCol: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  bookingTimeColText: {
    fontSize: 13,
    color: '#475569',
    fontWeight: '500',
  },
  bookingActionRow: {
    flexDirection: 'row',
    gap: 10,
    marginTop: 14,
  },
  btnDecline: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#CBD5E1',
    borderRadius: 12,
    paddingVertical: 10,
    alignItems: 'center',
  },
  btnDeclineText: {
    color: '#64748B',
    fontSize: 13,
    fontWeight: 'bold',
  },
  btnAccept: {
    flex: 2,
    backgroundColor: COLORS.primary,
    borderRadius: 12,
    paddingVertical: 10,
    alignItems: 'center',
  },
  btnAcceptText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: 'bold',
  },
  docItemCard: {
    backgroundColor: '#F8FAFC',
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    overflow: 'hidden',
  },
  docItemHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    gap: 12,
  },
  docIconCircle: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#EFF6FF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  docIconCircleText: {
    color: COLORS.primary,
    fontSize: 15,
    fontWeight: 'bold',
  },
  docCardName: {
    fontSize: 14,
    fontWeight: 'bold',
    color: COLORS.primary,
  },
  docCardSpec: {
    fontSize: 11,
    color: '#64748B',
    marginTop: 2,
  },
  shiftEditor: {
    borderTopWidth: 1,
    borderTopColor: '#E2E8F0',
    padding: 12,
    backgroundColor: '#FFFFFF',
  },
  shiftEditorTitle: {
    fontSize: 12,
    fontWeight: 'bold',
    color: COLORS.primary,
    marginBottom: 8,
  },
  shiftRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 6,
    borderBottomWidth: 1,
    borderBottomColor: '#F8FAFC',
  },
  shiftDayText: {
    fontSize: 13,
    color: '#475569',
    fontWeight: '500',
  },
  textInputStyle: {
    backgroundColor: '#F8FAFC',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: 12,
    paddingVertical: 10,
    paddingHorizontal: 12,
    color: COLORS.primary,
    fontSize: 14,
    marginTop: 10,
  },
  btnSaveForm: {
    backgroundColor: COLORS.primary,
    borderRadius: 12,
    paddingVertical: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 14,
  },
  btnSaveFormText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: 'bold',
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.surface,
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#EAE8FC',
    marginBottom: 2,
  },
  patientListItem: {
    backgroundColor: '#F8FAFC',
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    overflow: 'hidden',
  },
  patientItemHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    gap: 12,
  },
  patientAvatarBox: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#EFF6FF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  patientAvatarBoxText: {
    color: COLORS.primary,
    fontSize: 15,
    fontWeight: 'bold',
  },
  patientListName: {
    fontSize: 14,
    fontWeight: 'bold',
    color: COLORS.primary,
  },
  patientListMeta: {
    fontSize: 11,
    color: '#64748B',
    marginTop: 2,
  },
  dossierContainer: {
    borderTopWidth: 1,
    borderTopColor: '#E2E8F0',
    padding: 12,
    backgroundColor: '#FFFFFF',
    gap: 10,
  },
  dossierSubHeader: {
    fontSize: 12,
    fontWeight: 'bold',
    color: COLORS.primary,
    letterSpacing: 0.5,
    marginBottom: 2,
  },
  formInput: {
    backgroundColor: '#F8FAFC',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: 10,
    paddingVertical: 8,
    paddingHorizontal: 12,
    color: COLORS.primary,
    fontSize: 13,
  },
  formInputContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#F8FAFC',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: 12,
    paddingVertical: 10,
    paddingHorizontal: 12,
    marginBottom: 14,
  },
  btnSaveConsult: {
    backgroundColor: COLORS.primary,
    borderRadius: 10,
    paddingVertical: 10,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 2,
  },
  btnSaveConsultText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: 'bold',
  },
  emptyDossierText: {
    fontSize: 12,
    color: '#94A3B8',
    fontStyle: 'italic',
    paddingVertical: 6,
  },
  noteRecord: {
    backgroundColor: '#F8FAFC',
    borderRadius: 10,
    padding: 10,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    gap: 4,
  },
  noteHeader: {
    fontSize: 11,
    fontWeight: '700',
    color: '#64748B',
  },
  noteDiagText: {
    fontSize: 13,
    color: COLORS.primary,
  },
  noteBodyText: {
    fontSize: 12,
    color: '#475569',
  },
  formFieldLabel: {
    fontSize: 12,
    fontWeight: '700',
    color: '#64748B',
    marginBottom: 6,
    marginLeft: 4,
    marginTop: 8,
  },
  categoryDropdownMenu: {
    position: 'absolute',
    top: 150,
    left: 16,
    right: 16,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    shadowColor: '#0F2C59',
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 4,
    zIndex: 100,
  },
  dropdownMenuItem: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
  },
  dropdownMenuItemText: {
    color: COLORS.primary,
    fontSize: 14,
    fontWeight: '500',
  },
  publishButtonAction: {
    backgroundColor: COLORS.primary,
    borderRadius: 12,
    paddingVertical: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 8,
  },
  publishButtonActionText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: 'bold',
  },
  subTitleLabel: {
    fontSize: 14,
    fontWeight: 'bold',
    color: COLORS.primary,
    marginTop: 8,
    marginBottom: 4,
  },
  updateItemCard: {
    backgroundColor: COLORS.surface,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#EAE8FC',
    padding: 16,
  },
  updateItemHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 10,
  },
  updateIconCircle: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#EFF6FF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  updateItemCardTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: COLORS.primary,
  },
  updateItemCardMeta: {
    fontSize: 11,
    color: '#94A3B8',
    marginTop: 2,
    fontWeight: '500',
  },
  updateItemCardDesc: {
    fontSize: 13,
    color: '#475569',
    lineHeight: 18,
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
  chatDashboardLayout: {
    marginTop: 10,
    gap: 16,
  },
  patientTabsScroll: {
    gap: 12,
    paddingBottom: 4,
  },
  patientChatTab: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F8FAFC',
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    paddingVertical: 10,
    paddingHorizontal: 12,
    minWidth: 160,
  },
  patientChatTabActive: {
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primary,
  },
  patientTabAvatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#EFF6FF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  patientTabAvatarText: {
    color: COLORS.primary,
    fontWeight: 'bold',
    fontSize: 13,
  },
  patientTabName: {
    fontSize: 13,
    fontWeight: 'bold',
    color: COLORS.primary,
  },
  patientTabNameActive: {
    color: '#FFFFFF',
  },
  patientTabSnippet: {
    fontSize: 11,
    color: '#64748B',
    marginTop: 2,
  },
  patientTabSnippetActive: {
    color: '#BFDBFE',
  },
  adminConversationBox: {
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: 16,
    backgroundColor: '#FFFFFF',
    overflow: 'hidden',
    marginTop: 6,
  },
  adminChatHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 14,
    backgroundColor: '#F8FAFC',
    borderBottomWidth: 1,
    borderBottomColor: '#E2E8F0',
  },
  adminChatHeaderTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: COLORS.primary,
  },
  closeChatText: {
    fontSize: 11,
    color: '#EF4444',
    fontWeight: '700',
  },
  adminChatFeedScroll: {
    height: 220,
    paddingHorizontal: 14,
  },
  adminChatInputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderTopWidth: 1,
    borderTopColor: '#E2E8F0',
    gap: 8,
    backgroundColor: '#FFFFFF',
  },
  adminChatInputField: {
    flex: 1,
    backgroundColor: '#F8FAFC',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: Platform.OS === 'ios' ? 10 : 6,
    color: COLORS.primary,
    fontSize: 13,
  },
  adminChatSendBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: COLORS.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  selectPromptCard: {
    backgroundColor: '#F8FAFC',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: 16,
    padding: 24,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    marginTop: 6,
  },
  selectPromptText: {
    color: '#64748B',
    fontSize: 12,
    fontWeight: '500',
    textAlign: 'center',
    lineHeight: 16,
  },
});
