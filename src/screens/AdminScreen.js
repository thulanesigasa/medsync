import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput, Alert, Platform } from 'react-native';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { COLORS, SIZES, LAYOUT } from '../constants/theme';
import { useStateContext } from '../context/StateContext';

export default function AdminScreen({ navigation }) {
  const { currentUser, appointments, updates, updateAppointmentStatus, addUpdate, deleteUpdate, logout } = useStateContext();
  const [activeTab, setActiveTab] = useState('bookings'); // 'bookings' or 'updates'
  const [bookingFilter, setBookingFilter] = useState('Pending'); // 'Pending' or 'Confirmed'
  
  // Announcement form state
  const [title, setTitle] = useState('');
  const [desc, setDesc] = useState('');
  const [category, setCategory] = useState('Schedules'); // 'Schedules', 'Vaccines', 'Campaign', 'Notice'
  const [showCategoryDropdown, setShowCategoryDropdown] = useState(false);

  const categories = ['Schedules', 'Vaccines', 'Campaign', 'Notice'];

  // Handle case where user is not logged in as admin
  const clinicName = currentUser?.clinic || 'Dawn Park Clinic';

  // Filter appointments for the admin's clinic
  const clinicAppointments = appointments.filter(
    appt => appt.clinicName.toLowerCase().includes(clinicName.toLowerCase())
  );

  // Filter updates for the admin's clinic
  const clinicUpdates = updates.filter(
    up => up.clinic.toLowerCase().includes(clinicName.toLowerCase())
  );

  const filteredAppointments = clinicAppointments.filter(
    appt => appt.status === bookingFilter
  );

  const handleLogout = () => {
    logout();
    navigation.replace('Login');
  };

  const handleAcceptAppointment = (id) => {
    updateAppointmentStatus(id, 'Confirmed');
    Alert.alert('Success', 'Appointment has been accepted and confirmed.');
  };

  const handleDeclineAppointment = (id) => {
    Alert.alert(
      'Decline Booking',
      'Are you sure you want to decline this appointment?',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Decline', 
          style: 'destructive',
          onPress: () => {
            updateAppointmentStatus(id, 'Declined');
          }
        }
      ]
    );
  };

  const handlePublishUpdate = () => {
    if (!title.trim()) {
      alert('Please enter an announcement title');
      return;
    }
    if (!desc.trim()) {
      alert('Please enter announcement details');
      return;
    }

    addUpdate({
      title,
      desc,
      clinic: clinicName,
      category
    });

    setTitle('');
    setDesc('');
    setCategory('Schedules');
    Alert.alert('Published', 'Announcement has been successfully published to patients.');
  };

  const handleDeleteUpdate = (id) => {
    Alert.alert(
      'Delete Announcement',
      'Are you sure you want to delete this bulletin?',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Delete', 
          style: 'destructive',
          onPress: () => deleteUpdate(id)
        }
      ]
    );
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerContent}>
          <View style={styles.headerBrand}>
            <MaterialCommunityIcons name="shield-account" size={30} color="#FFFFFF" />
            <View style={{ marginLeft: 10 }}>
              <Text style={styles.appTitle}>{clinicName}</Text>
              <Text style={styles.appSubtitle}>Clinic Management Portal</Text>
            </View>
          </View>
          <TouchableOpacity style={styles.logoutBtn} onPress={handleLogout}>
            <Ionicons name="log-out-outline" size={24} color="#FFFFFF" />
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Stats Section */}
        <View style={styles.statsContainer}>
          <View style={styles.statCard}>
            <Text style={styles.statValue}>{clinicAppointments.length}</Text>
            <Text style={styles.statLabel}>Total Bookings</Text>
          </View>
          <View style={[styles.statCard, { borderLeftWidth: 1, borderRightWidth: 1, borderColor: '#EAE8FC' }]}>
            <Text style={[styles.statValue, { color: '#E28743' }]}>
              {clinicAppointments.filter(a => a.status === 'Pending').length}
            </Text>
            <Text style={styles.statLabel}>Pending</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={[styles.statValue, { color: COLORS.success }]}>
              {clinicAppointments.filter(a => a.status === 'Confirmed').length}
            </Text>
            <Text style={styles.statLabel}>Confirmed</Text>
          </View>
        </View>

        {/* Tab Selection */}
        <View style={styles.tabContainer}>
          <TouchableOpacity 
            style={[styles.tabButton, activeTab === 'bookings' && styles.tabButtonActive]}
            onPress={() => setActiveTab('bookings')}
          >
            <Ionicons 
              name="calendar" 
              size={18} 
              color={activeTab === 'bookings' ? '#FFFFFF' : COLORS.primary} 
              style={{ marginRight: 6 }} 
            />
            <Text style={[styles.tabText, activeTab === 'bookings' && styles.tabTextActive]}>
              Bookings
            </Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={[styles.tabButton, activeTab === 'updates' && styles.tabButtonActive]}
            onPress={() => setActiveTab('updates')}
          >
            <Ionicons 
              name="megaphone" 
              size={18} 
              color={activeTab === 'updates' ? '#FFFFFF' : COLORS.primary} 
              style={{ marginRight: 6 }} 
            />
            <Text style={[styles.tabText, activeTab === 'updates' && styles.tabTextActive]}>
              Publish Updates
            </Text>
          </TouchableOpacity>
        </View>

        {/* Bookings Mode View */}
        {activeTab === 'bookings' && (
          <View>
            {/* Inner Filters */}
            <View style={styles.filterRow}>
              <TouchableOpacity 
                style={[styles.filterBtn, bookingFilter === 'Pending' && styles.filterBtnActive]}
                onPress={() => setBookingFilter('Pending')}
              >
                <Text style={[styles.filterBtnText, bookingFilter === 'Pending' && styles.filterBtnTextActive]}>
                  Pending ({clinicAppointments.filter(a => a.status === 'Pending').length})
                </Text>
              </TouchableOpacity>
              
              <TouchableOpacity 
                style={[styles.filterBtn, bookingFilter === 'Confirmed' && styles.filterBtnActive]}
                onPress={() => setBookingFilter('Confirmed')}
              >
                <Text style={[styles.filterBtnText, bookingFilter === 'Confirmed' && styles.filterBtnTextActive]}>
                  Confirmed ({clinicAppointments.filter(a => a.status === 'Confirmed').length})
                </Text>
              </TouchableOpacity>
            </View>

            {/* Bookings List */}
            {filteredAppointments.length === 0 ? (
              <View style={styles.emptyContainer}>
                <Ionicons name="calendar-outline" size={48} color="#94A3B8" />
                <Text style={styles.emptyText}>No {bookingFilter.toLowerCase()} appointments found</Text>
              </View>
            ) : (
              <View style={styles.listContainer}>
                {filteredAppointments.map((appt) => (
                  <View key={appt.id} style={styles.bookingCard}>
                    <View style={styles.bookingHeader}>
                      <View style={styles.avatarMini}>
                        <Text style={styles.avatarMiniText}>{appt.patientName.charAt(0)}</Text>
                      </View>
                      <View style={{ flex: 1 }}>
                        <Text style={styles.patientName}>{appt.patientName}</Text>
                        <Text style={styles.doctorName}>{appt.doctorName} • {appt.type}</Text>
                      </View>
                      <View style={[
                        styles.statusBadge, 
                        appt.status === 'Confirmed' ? styles.statusConfirmed : styles.statusPending
                      ]}>
                        <Text style={[
                          styles.statusText, 
                          appt.status === 'Confirmed' ? styles.statusTextConfirmed : styles.statusTextPending
                        ]}>{appt.status}</Text>
                      </View>
                    </View>

                    <View style={styles.cardDivider} />

                    <View style={styles.timeRow}>
                      <View style={styles.timeCol}>
                        <Ionicons name="calendar-clear-outline" size={16} color={COLORS.primary} />
                        <Text style={styles.timeColText}>{appt.date}</Text>
                      </View>
                      <View style={styles.timeCol}>
                        <Ionicons name="time-outline" size={16} color={COLORS.primary} />
                        <Text style={styles.timeColText}>{appt.time}</Text>
                      </View>
                    </View>

                    {appt.status === 'Pending' && (
                      <View style={styles.actionRow}>
                        <TouchableOpacity 
                          style={styles.declineButton}
                          onPress={() => handleDeclineAppointment(appt.id)}
                        >
                          <Text style={styles.declineButtonText}>Decline</Text>
                        </TouchableOpacity>
                        
                        <TouchableOpacity 
                          style={styles.acceptButton}
                          onPress={() => handleAcceptAppointment(appt.id)}
                        >
                          <Text style={styles.acceptButtonText}>Confirm & Accept</Text>
                        </TouchableOpacity>
                      </View>
                    )}
                  </View>
                ))}
              </View>
            )}
          </View>
        )}

        {/* Updates Mode View */}
        {activeTab === 'updates' && (
          <View style={styles.updatesContainer}>
            {/* Post Bulletin Form */}
            <View style={styles.formCard}>
              <Text style={styles.formTitle}>Publish Announcement</Text>
              
              <Text style={styles.fieldLabel}>Announcement Title</Text>
              <TextInput 
                placeholder="e.g. Flu Vaccination Clinic Hours"
                value={title}
                onChangeText={setTitle}
                style={styles.formInput}
                placeholderTextColor="#94A3B8"
              />

              <Text style={styles.fieldLabel}>Category</Text>
              <TouchableOpacity 
                style={styles.formInputContainer} 
                onPress={() => setShowCategoryDropdown(!showCategoryDropdown)}
              >
                <Text style={{ fontSize: 15, color: COLORS.primary }}>{category}</Text>
                <Ionicons name="chevron-down" size={20} color="#94A3B8" />
              </TouchableOpacity>

              {showCategoryDropdown && (
                <View style={styles.categoryDropdown}>
                  {categories.map((cat, index) => (
                    <TouchableOpacity 
                      key={index} 
                      style={styles.dropdownItem}
                      onPress={() => {
                        setCategory(cat);
                        setShowCategoryDropdown(false);
                      }}
                    >
                      <Text style={styles.dropdownItemText}>{cat}</Text>
                    </TouchableOpacity>
                  ))}
                </View>
              )}

              <Text style={styles.fieldLabel}>Announcement Description</Text>
              <TextInput 
                placeholder="Write detailed announcements here..."
                value={desc}
                onChangeText={setDesc}
                multiline
                numberOfLines={4}
                style={[styles.formInput, { height: 100, textAlignVertical: 'top', paddingTop: 12 }]}
                placeholderTextColor="#94A3B8"
              />

              <TouchableOpacity style={styles.publishBtn} onPress={handlePublishUpdate}>
                <Ionicons name="paper-plane" size={16} color="#FFFFFF" style={{ marginRight: 6 }} />
                <Text style={styles.publishBtnText}>Publish Bulletin</Text>
              </TouchableOpacity>
            </View>

            {/* Published Bulletins Feed */}
            <Text style={styles.sectionHeader}>Announcements by {clinicName}</Text>
            {clinicUpdates.length === 0 ? (
              <View style={styles.emptyContainer}>
                <Ionicons name="newspaper-outline" size={40} color="#94A3B8" />
                <Text style={styles.emptyText}>No bulletins posted yet by your clinic</Text>
              </View>
            ) : (
              <View style={{ gap: 12 }}>
                {clinicUpdates.map((item) => (
                  <View key={item.id} style={styles.updateCard}>
                    <View style={styles.updateHeader}>
                      <View style={styles.iconCircle}>
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
                        <Text style={styles.updateCardTitle}>{item.title}</Text>
                        <Text style={styles.updateCardMeta}>{item.category} • {item.date}</Text>
                      </View>
                      <TouchableOpacity onPress={() => handleDeleteUpdate(item.id)}>
                        <Ionicons name="trash-outline" size={20} color="#EF4444" />
                      </TouchableOpacity>
                    </View>
                    <Text style={styles.updateCardDesc}>{item.desc}</Text>
                  </View>
                ))}
              </View>
            )}
          </View>
        )}
      </ScrollView>
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
    fontSize: 18,
    fontWeight: 'bold',
  },
  appSubtitle: {
    color: '#BFDBFE',
    fontSize: 11,
    fontWeight: '500',
  },
  logoutBtn: {
    padding: 8,
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    borderRadius: 12,
  },
  scrollContent: {
    padding: SIZES.margin,
    paddingBottom: 40,
    gap: 16,
  },
  statsContainer: {
    flexDirection: 'row',
    backgroundColor: COLORS.surface,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#EAE8FC',
    paddingVertical: 14,
    shadowColor: '#0F2C59',
    shadowOpacity: 0.03,
    shadowRadius: 10,
    elevation: 2,
  },
  statCard: {
    flex: 1,
    alignItems: 'center',
  },
  statValue: {
    fontSize: 22,
    fontWeight: 'bold',
    color: COLORS.primary,
  },
  statLabel: {
    fontSize: 11,
    color: '#64748B',
    marginTop: 4,
    fontWeight: '600',
  },
  tabContainer: {
    flexDirection: 'row',
    backgroundColor: '#F1F5F9',
    borderRadius: 16,
    padding: 4,
  },
  tabButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    borderRadius: 12,
  },
  tabButtonActive: {
    backgroundColor: COLORS.primary,
  },
  tabText: {
    fontSize: 13,
    fontWeight: '600',
    color: COLORS.primary,
  },
  tabTextActive: {
    color: '#FFFFFF',
  },
  filterRow: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 12,
  },
  filterBtn: {
    flex: 1,
    paddingVertical: 8,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#EAE8FC',
    borderRadius: 12,
    alignItems: 'center',
  },
  filterBtnActive: {
    backgroundColor: '#EFF6FF',
    borderColor: '#BFDBFE',
  },
  filterBtnText: {
    fontSize: 12,
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
  },
  emptyText: {
    color: '#64748B',
    fontSize: 14,
    fontWeight: '600',
    textAlign: 'center',
  },
  listContainer: {
    gap: 12,
  },
  bookingCard: {
    backgroundColor: COLORS.surface,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#EAE8FC',
    padding: 16,
    shadowColor: '#0F2C59',
    shadowOpacity: 0.03,
    shadowRadius: 5,
    elevation: 1,
  },
  bookingHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  avatarMini: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#EFF6FF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarMiniText: {
    color: COLORS.primary,
    fontSize: 16,
    fontWeight: 'bold',
  },
  patientName: {
    fontSize: 15,
    fontWeight: 'bold',
    color: COLORS.primary,
  },
  doctorName: {
    fontSize: 12,
    color: '#64748B',
    marginTop: 2,
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  statusPending: {
    backgroundColor: '#FFFBEB',
  },
  statusConfirmed: {
    backgroundColor: '#F0FDF4',
  },
  statusText: {
    fontSize: 11,
    fontWeight: 'bold',
  },
  statusTextPending: {
    color: '#D97706',
  },
  statusTextConfirmed: {
    color: COLORS.success,
  },
  cardDivider: {
    height: 1,
    backgroundColor: '#F1F5F9',
    marginVertical: 12,
  },
  timeRow: {
    flexDirection: 'row',
    gap: 20,
    marginBottom: 4,
  },
  timeCol: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  timeColText: {
    fontSize: 13,
    color: '#475569',
    fontWeight: '500',
  },
  actionRow: {
    flexDirection: 'row',
    gap: 10,
    marginTop: 14,
  },
  declineButton: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#CBD5E1',
    borderRadius: 12,
    paddingVertical: 10,
    alignItems: 'center',
  },
  declineButtonText: {
    color: '#64748B',
    fontSize: 13,
    fontWeight: 'bold',
  },
  acceptButton: {
    flex: 2,
    backgroundColor: COLORS.primary,
    borderRadius: 12,
    paddingVertical: 10,
    alignItems: 'center',
  },
  acceptButtonText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: 'bold',
  },
  updatesContainer: {
    gap: 16,
  },
  formCard: {
    backgroundColor: COLORS.surface,
    borderWidth: 1,
    borderColor: '#EAE8FC',
    borderRadius: 20,
    padding: 16,
  },
  formTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: COLORS.primary,
    marginBottom: 14,
  },
  fieldLabel: {
    fontSize: 12,
    fontWeight: '700',
    color: '#64748B',
    marginBottom: 6,
    marginLeft: 4,
  },
  formInput: {
    backgroundColor: '#F8FAFC',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: 12,
    paddingVertical: 10,
    paddingHorizontal: 12,
    color: COLORS.primary,
    fontSize: 14,
    marginBottom: 14,
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
  categoryDropdown: {
    position: 'absolute',
    top: 155,
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
  dropdownItem: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
  },
  dropdownItemText: {
    color: COLORS.primary,
    fontSize: 14,
    fontWeight: '500',
  },
  publishBtn: {
    backgroundColor: COLORS.primary,
    borderRadius: 12,
    paddingVertical: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 6,
  },
  publishBtnText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: 'bold',
  },
  sectionHeader: {
    fontSize: 14,
    fontWeight: 'bold',
    color: COLORS.primary,
    marginTop: 8,
    marginBottom: 4,
  },
  updateCard: {
    backgroundColor: COLORS.surface,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#EAE8FC',
    padding: 16,
  },
  updateHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 10,
  },
  iconCircle: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#EFF6FF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  updateCardTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: COLORS.primary,
  },
  updateCardMeta: {
    fontSize: 11,
    color: '#94A3B8',
    marginTop: 2,
    fontWeight: '500',
  },
  updateCardDesc: {
    fontSize: 13,
    color: '#475569',
    lineHeight: 18,
  },
});
