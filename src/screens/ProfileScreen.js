import React, { useState, useRef, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Animated, Platform, Modal } from 'react-native';
import { MaterialCommunityIcons, Ionicons } from '@expo/vector-icons';
import { COLORS, SIZES, LAYOUT } from '../constants/theme';
import BottomTabBar from '../components/BottomTabBar';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { useToast } from '../context/ToastContext';
import { TextInput, KeyboardAvoidingView } from 'react-native';

const CustomSwitch = ({ value, onValueChange }) => {
  const animatedValue = useRef(new Animated.Value(value ? 1 : 0)).current;

  useEffect(() => {
    Animated.spring(animatedValue, {
      toValue: value ? 1 : 0,
      friction: 8,
      tension: 55,
      useNativeDriver: false,
    }).start();
  }, [value]);

  const translateX = animatedValue.interpolate({
    inputRange: [0, 1],
    outputRange: [2, 20] // adjusted to fit track width 44 and thumb width 20 inside 1px borders
  });

  const backgroundColor = animatedValue.interpolate({
    inputRange: [0, 1],
    outputRange: ['#F1F5F9', '#EFF6FF']
  });

  const thumbColor = animatedValue.interpolate({
    inputRange: [0, 1],
    outputRange: ['#94A3B8', COLORS.primary]
  });

  const borderColor = animatedValue.interpolate({
    inputRange: [0, 1],
    outputRange: ['#CBD5E1', '#D3E2F2']
  });

  return (
    <TouchableOpacity 
      activeOpacity={0.9} 
      onPress={() => onValueChange(!value)}
      style={styles.switchContainer}
    >
      <Animated.View style={[styles.switchTrack, { backgroundColor, borderColor, borderWidth: 1 }]}>
        <Animated.View style={[styles.switchThumb, { transform: [{ translateX }], backgroundColor: thumbColor }]} />
      </Animated.View>
    </TouchableOpacity>
  );
};

export default function ProfileScreen({ navigation }) {
  const { currentUser, logout, updateProfile } = useAuth();
  const { isDark, toggleTheme, theme } = useTheme();
  const { showToast } = useToast();
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  
  const [isEditModalVisible, setEditModalVisible] = useState(false);
  const [isHelpModalVisible, setHelpModalVisible] = useState(false);
  const [isTermsModalVisible, setTermsModalVisible] = useState(false);
  const [activeFaq, setActiveFaq] = useState(null);
  const [editName, setEditName] = useState('');
  const [editEmail, setEditEmail] = useState('');
  const [editPhone, setEditPhone] = useState('');

  useEffect(() => {
    if (currentUser) {
      setEditName(currentUser.name || '');
      setEditEmail(currentUser.email || '');
      setEditPhone(currentUser.phone || '');
    }
  }, [currentUser]);

  const handleLogout = () => {
    logout();
    navigation.replace('Login');
  };

  const handleSaveProfile = async () => {
    if (!editName.trim()) {
      showToast("Name cannot be empty.", "error");
      return;
    }
    const result = await updateProfile({
      full_name: editName.trim(),
      email: editEmail.trim(),
      phone_number: editPhone.trim()
    });
    if (result && result.success) {
      setEditModalVisible(false);
      showToast("Profile details updated successfully!", "success", "Profile Saved");
    } else {
      showToast(result?.message || "Failed to update profile details.", "error");
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerContent}>
          <View style={styles.headerBrand}>
            <MaterialCommunityIcons name="shield-plus" size={28} color="#FFFFFF" />
            <Text style={styles.appTitle}>MedSync</Text>
          </View>
          <View style={styles.headerActions}>
            <TouchableOpacity
              style={styles.bellIconContainer}
              onPress={() => navigation.navigate("Notifications")}
            >
              <Ionicons name="notifications-outline" size={24} color="#FFFFFF" />
              <View style={styles.badge} />
            </TouchableOpacity>
          </View>
        </View>
      </View>

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        
        {/* Premium Profile Card */}
        <View style={[styles.premiumProfileCard, { backgroundColor: theme.surface, borderColor: theme.border }]}>
          <View style={styles.cardTopRow}>
            <View style={styles.avatarContainer}>
              <View style={styles.avatar}>
                <Text style={styles.avatarText}>
                  {(currentUser?.name || currentUser?.email?.split('@')[0] || 'U').charAt(0).toUpperCase()}
                </Text>
              </View>
              <View style={styles.verifiedBadge}>
                <Ionicons name="checkmark" size={12} color="#FFFFFF" />
              </View>
            </View>
            
            <View style={styles.profileMeta}>
              <Text style={[styles.profileName, { color: theme.text }]}>{currentUser?.name || currentUser?.email?.split('@')[0] || 'User'}</Text>
              <Text style={[styles.profileEmail, { color: theme.subtext }]}>{currentUser?.email || ''}</Text>
              
              <View style={styles.goldBadge}>
                <Ionicons name="ribbon" size={13} color="#D97706" style={{ marginRight: 4 }} />
                <Text style={styles.goldBadgeText}>
                  {currentUser?.role === 'admin' ? 'Clinic Partner' : 'Gold Care Member'}
                </Text>
              </View>
            </View>
          </View>

          <TouchableOpacity style={styles.editBtn} onPress={() => setEditModalVisible(true)}>
            <Text style={styles.editBtnText}>Edit Profile Details</Text>
            <Ionicons name="create-outline" size={16} color={COLORS.primary} />
          </TouchableOpacity>
        </View>

        {/* Section 1: Account Settings */}
        <Text style={[styles.sectionHeader, { color: theme.text }]}>ACCOUNT SETTINGS</Text>
        <View style={[styles.menuSection, { backgroundColor: theme.surface, borderColor: theme.border }]}>
          <TouchableOpacity 
            style={[styles.menuItem, { borderBottomWidth: 0, borderBottomColor: theme.border }]}
            onPress={() => setEditModalVisible(true)}
          >
            <View style={styles.menuIconBox}>
              <Ionicons name="person-outline" size={20} color={COLORS.primary} />
            </View>
            <Text style={[styles.menuText, { color: theme.text }]}>Personal Information</Text>
            <Ionicons name="chevron-forward" size={18} color="#94A3B8" />
          </TouchableOpacity>
        </View>

        {/* Section 2: Preferences */}
        <Text style={[styles.sectionHeader, { color: theme.text }]}>PREFERENCES</Text>
        <View style={[styles.menuSection, { backgroundColor: theme.surface, borderColor: theme.border }]}>
          <View style={[styles.menuItemNonClickable, { borderBottomColor: theme.border }]}>
            <View style={styles.menuIconBox}>
              <Ionicons name="notifications-outline" size={20} color={COLORS.primary} />
            </View>
            <Text style={[styles.menuText, { color: theme.text }]}>Push Notifications</Text>
            <CustomSwitch 
              value={notificationsEnabled} 
              onValueChange={setNotificationsEnabled} 
            />
          </View>
          
          <TouchableOpacity style={[styles.menuItem, { borderBottomColor: theme.border }]}>
            <View style={styles.menuIconBox}>
              <Ionicons name="globe-outline" size={20} color={COLORS.primary} />
            </View>
            <Text style={[styles.menuText, { color: theme.text }]}>Language</Text>
            <View style={styles.rightValueContainer}>
              <Text style={styles.rightValueText}>English (SA)</Text>
              <Ionicons name="chevron-forward" size={18} color="#94A3B8" />
            </View>
          </TouchableOpacity>

          <TouchableOpacity style={[styles.menuItem, { borderBottomWidth: 0, borderBottomColor: theme.border }]} onPress={toggleTheme}>
            <View style={styles.menuIconBox}>
              <Ionicons name={isDark ? "sunny-outline" : "moon-outline"} size={20} color={COLORS.primary} />
            </View>
            <Text style={[styles.menuText, { color: theme.text }]}>Dark Mode</Text>
            <Text style={styles.rightValueText}>{isDark ? 'ON' : 'OFF'}</Text>
          </TouchableOpacity>
        </View>

        {/* Section 3: Support */}
        <Text style={[styles.sectionHeader, { color: theme.text }]}>HELP & SUPPORT</Text>
        <View style={[styles.menuSection, { backgroundColor: theme.surface, borderColor: theme.border }]}>
          <TouchableOpacity 
            style={[styles.menuItem, { borderBottomColor: theme.border }]}
            onPress={() => setHelpModalVisible(true)}
          >
            <View style={styles.menuIconBox}>
              <Ionicons name="help-circle-outline" size={20} color={COLORS.primary} />
            </View>
            <Text style={[styles.menuText, { color: theme.text }]}>Help Center & FAQ</Text>
            <Ionicons name="chevron-forward" size={18} color="#94A3B8" />
          </TouchableOpacity>

          <TouchableOpacity 
            style={[styles.menuItem, { borderBottomWidth: 0, borderBottomColor: theme.border }]}
            onPress={() => setTermsModalVisible(true)}
          >
            <View style={styles.menuIconBox}>
              <Ionicons name="document-text-outline" size={20} color={COLORS.primary} />
            </View>
            <Text style={[styles.menuText, { color: theme.text }]}>Terms of Service & Privacy Policy</Text>
            <Ionicons name="chevron-forward" size={18} color="#94A3B8" />
          </TouchableOpacity>
        </View>

        {/* Logout Button */}
        <TouchableOpacity style={styles.logoutBtn} onPress={handleLogout}>
          <Ionicons name="log-out-outline" size={20} color="#EF4444" />
          <Text style={styles.logoutText}>Log Out</Text>
        </TouchableOpacity>

      </ScrollView>
      
      <BottomTabBar navigation={navigation} activeTab="Profile" />

      {/* Edit Profile Modal */}
      <Modal
        visible={isEditModalVisible}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setEditModalVisible(false)}
      >
        <KeyboardAvoidingView
          style={{ flex: 1 }}
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        >
          <TouchableOpacity
            style={{ flex: 1, backgroundColor: 'rgba(15, 23, 42, 0.6)' }}
            activeOpacity={1}
            onPress={() => setEditModalVisible(false)}
          />
          <View style={styles.modalContent}>
            <View style={styles.modalHandle} />
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Personal Information</Text>
              <TouchableOpacity onPress={() => setEditModalVisible(false)}>
                <Ionicons name="close" size={24} color="#64748B" />
              </TouchableOpacity>
            </View>

            <ScrollView
              keyboardShouldPersistTaps="handled"
              showsVerticalScrollIndicator={false}
            >
              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Full Name</Text>
                <TextInput
                  style={styles.modalInput}
                  value={editName}
                  onChangeText={setEditName}
                  placeholder="Enter full name"
                  placeholderTextColor="#94A3B8"
                  returnKeyType="next"
                />
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Email Address</Text>
                <TextInput
                  style={styles.modalInput}
                  value={editEmail}
                  onChangeText={setEditEmail}
                  keyboardType="email-address"
                  autoCapitalize="none"
                  placeholder="Enter email address"
                  placeholderTextColor="#94A3B8"
                  returnKeyType="next"
                />
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Phone Number</Text>
                <TextInput
                  style={styles.modalInput}
                  value={editPhone}
                  onChangeText={setEditPhone}
                  keyboardType="phone-pad"
                  placeholder="Enter phone number"
                  placeholderTextColor="#94A3B8"
                  returnKeyType="done"
                />
              </View>

              <TouchableOpacity style={styles.saveModalBtn} onPress={handleSaveProfile}>
                <Text style={styles.saveModalBtnText}>Save Changes</Text>
              </TouchableOpacity>
            </ScrollView>
          </View>
        </KeyboardAvoidingView>
      </Modal>

      {/* Help Center & FAQ Modal */}
      <Modal
        visible={isHelpModalVisible}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setHelpModalVisible(false)}
      >
        <View style={{ flex: 1, backgroundColor: 'rgba(15, 23, 42, 0.6)' }}>
          <TouchableOpacity
            style={{ flex: 1 }}
            activeOpacity={1}
            onPress={() => setHelpModalVisible(false)}
          />
          <View style={styles.modalContent}>
            <View style={styles.modalHandle} />
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Help Center & FAQ</Text>
              <TouchableOpacity onPress={() => setHelpModalVisible(false)}>
                <Ionicons name="close" size={24} color="#64748B" />
              </TouchableOpacity>
            </View>

            <ScrollView showsVerticalScrollIndicator={false}>
              {/* Contact Support Info Card */}
              <View style={styles.supportCard}>
                <Ionicons name="mail" size={24} color={COLORS.primary} style={{ marginRight: 12 }} />
                <View style={{ flex: 1 }}>
                  <Text style={styles.supportCardTitle}>Need Support?</Text>
                  <Text style={styles.supportCardDesc}>Our technical team is here to assist. Email us at:</Text>
                  <Text style={styles.supportCardEmail}>support@hokmatech.com</Text>
                </View>
              </View>

              {/* FAQs Accordion */}
              <Text style={styles.modalSubheading}>Frequently Asked Questions</Text>

              {[
                {
                  q: "How do I book an appointment?",
                  a: "Go to the Home tab, search/select your preferred doctor, choose the associated clinic, select a date and time slot, and tap 'Confirm Booking'."
                },
                {
                  q: "Can I cancel or reschedule my appointment?",
                  a: "Yes. You can view all bookings in the 'Appointments' tab and cancel them directly. To reschedule, simply cancel the current slot and book a new one."
                },
                {
                  q: "What is Telehealth and how does it work?",
                  a: "Telehealth lets you consult with your doctor via a secure video call. If your appointment type is virtual, a 'Join Call' button will appear under the appointment on the schedule tab when it is time."
                },
                {
                  q: "How do I view my medical records and updates?",
                  a: "Go to the 'Records' tab. There you will find your secure medical records, active prescriptions, and updates/bulletins posted by your clinics."
                },
                {
                  q: "Is my medical and personal data secure?",
                  a: "Yes. MedSync complies fully with national health privacy regulations (POPIA and HIPAA) using row-level security policy encryption for all database records."
                }
              ].map((faq, index) => {
                const isOpen = activeFaq === index;
                return (
                  <View key={index} style={styles.faqItem}>
                    <TouchableOpacity 
                      style={styles.faqQuestionRow} 
                      onPress={() => setActiveFaq(isOpen ? null : index)}
                    >
                      <Text style={styles.faqQuestionText}>{faq.q}</Text>
                      <Ionicons 
                        name={isOpen ? "chevron-up" : "chevron-down"} 
                        size={18} 
                        color={COLORS.primary} 
                      />
                    </TouchableOpacity>
                    {isOpen && (
                      <View style={styles.faqAnswerContainer}>
                        <Text style={styles.faqAnswerText}>{faq.a}</Text>
                      </View>
                    )}
                  </View>
                );
              })}
              
              <View style={{ height: 20 }} />
            </ScrollView>
          </View>
        </View>
      </Modal>

      {/* Terms of Service & Privacy Policy Modal */}
      <Modal
        visible={isTermsModalVisible}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setTermsModalVisible(false)}
      >
        <View style={{ flex: 1, backgroundColor: 'rgba(15, 23, 42, 0.6)' }}>
          <TouchableOpacity
            style={{ flex: 1 }}
            activeOpacity={1}
            onPress={() => setTermsModalVisible(false)}
          />
          <View style={styles.modalContent}>
            <View style={styles.modalHandle} />
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Terms & Privacy Policy</Text>
              <TouchableOpacity onPress={() => setTermsModalVisible(false)}>
                <Ionicons name="close" size={24} color="#64748B" />
              </TouchableOpacity>
            </View>

            <ScrollView showsVerticalScrollIndicator={false}>
              <Text style={styles.policyTitle}>1. Terms of Service</Text>
              <Text style={styles.policySectionHeader}>Acceptance of Terms</Text>
              <Text style={styles.policyText}>
                By accessing or using the MedSync application, you agree to comply with and be bound by these terms. If you do not agree, please do not use the service.
              </Text>
              
              <Text style={styles.policySectionHeader}>Medical Disclaimer</Text>
              <Text style={styles.policyText}>
                MedSync is a platform designed to facilitate bookings, telehealth consulting, and health record organization. MedSync is NOT a medical care provider. In the event of a medical emergency, please dial emergency services immediately.
              </Text>
              
              <Text style={styles.policySectionHeader}>Account Responsibility</Text>
              <Text style={styles.policyText}>
                You are responsible for keeping your login credentials confidential and secure. All activities occurring under your account are your sole responsibility.
              </Text>

              <Text style={[styles.policyTitle, { marginTop: 24 }]}>2. Privacy Policy</Text>
              <Text style={styles.policySectionHeader}>Data Collection</Text>
              <Text style={styles.policyText}>
                We collect personal registration details (name, email address, phone number) and medical information uploaded by authorized healthcare clinic personnel to link appointments and manage records.
              </Text>
              
              <Text style={styles.policySectionHeader}>How We Use Data</Text>
              <Text style={styles.policyText}>
                Your data is exclusively used to facilitate healthcare services, video telehealth consultations, notifications, and appointment management. We do not sell, distribute, or expose your data to third parties.
              </Text>
              
              <Text style={styles.policySectionHeader}>POPIA Compliance (South Africa)</Text>
              <Text style={styles.policyText}>
                MedSync is designed in full compliance with the Protection of Personal Information Act (POPIA). Your information is stored securely in encrypted databases, and you retain full rights to request correction or removal of your details.
              </Text>

              <View style={{ height: 20 }} />
            </ScrollView>
          </View>
        </View>
      </Modal>
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
  bellIconContainer: {
    position: 'relative',
    padding: 4,
  },
  badge: {
    position: 'absolute',
    top: 4,
    right: 4,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#EF4444',
    borderWidth: 1,
    borderColor: COLORS.primary,
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
    gap: 12,
  },
  premiumProfileCard: {
    backgroundColor: COLORS.surface,
    borderRadius: 20,
    padding: 16,
    borderWidth: 1,
    borderColor: '#EAE8FC',
    shadowColor: '#0F2C59',
    shadowOpacity: 0.04,
    shadowRadius: 10,
    elevation: 2,
    marginBottom: 8,
  },
  cardTopRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  avatarContainer: {
    position: 'relative',
    marginRight: 16,
  },
  avatar: { 
    width: 68, 
    height: 68, 
    borderRadius: 34, 
    backgroundColor: COLORS.primary, 
    alignItems: 'center', 
    justifyContent: 'center', 
  },
  avatarText: { 
    fontSize: 26, 
    fontWeight: 'bold', 
    color: '#FFFFFF' 
  },
  verifiedBadge: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: COLORS.success,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: '#FFFFFF',
  },
  profileMeta: {
    flex: 1,
  },
  profileName: { 
    fontSize: 18, 
    fontWeight: 'bold', 
    color: COLORS.primary, 
    marginBottom: 2 
  },
  profileEmail: { 
    fontSize: 13, 
    color: '#64748B', 
    marginBottom: 6 
  },
  goldBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FEF3C7',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
    alignSelf: 'flex-start',
  },
  goldBadgeText: {
    color: '#D97706',
    fontSize: 11,
    fontWeight: 'bold',
  },
  editBtn: { 
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#EFF6FF', 
    paddingVertical: 10,
    borderRadius: 12,
    gap: 6,
  },
  editBtnText: { 
    color: COLORS.primary, 
    fontSize: 13,
    fontWeight: 'bold' 
  },
  sectionHeader: {
    fontSize: 11,
    fontWeight: '700',
    color: '#64748B',
    marginTop: 10,
    marginBottom: 4,
    marginLeft: 4,
    letterSpacing: 0.8,
  },
  menuSection: { 
    backgroundColor: COLORS.surface, 
    borderRadius: 16, 
    borderWidth: 1, 
    borderColor: '#EAE8FC', 
    paddingVertical: 4, 
    shadowColor: '#0F2C59',
    shadowOpacity: 0.02,
    shadowRadius: 5,
    elevation: 1,
  },
  menuItem: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderBottomWidth: 1, 
    borderBottomColor: '#F1F5F9' 
  },
  menuItemNonClickable: {
    flexDirection: 'row', 
    alignItems: 'center', 
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderBottomWidth: 1, 
    borderBottomColor: '#F1F5F9'
  },
  menuIconBox: { 
    width: 36, 
    height: 36, 
    borderRadius: 18, 
    backgroundColor: '#EFF6FF',
    alignItems: 'center', 
    justifyContent: 'center', 
    marginRight: 12 
  },
  menuText: { 
    flex: 1, 
    fontSize: 14, 
    color: COLORS.primary, 
    fontWeight: '600' 
  },
  rightValueContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  rightValueText: {
    fontSize: 13,
    color: '#64748B',
    marginRight: 2,
  },
  logoutBtn: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    justifyContent: 'center', 
    backgroundColor: '#FEF2F2', 
    paddingVertical: 14, 
    borderRadius: 16, 
    borderWidth: 1, 
    borderColor: '#FECACA',
    marginTop: 16,
    gap: 8,
  },
  logoutText: { 
    color: '#EF4444', 
    fontSize: 15, 
    fontWeight: 'bold', 
  },
  switchContainer: {
    width: 44,
    height: 24,
    justifyContent: 'center',
  },
  switchTrack: {
    width: 44,
    height: 24,
    borderRadius: 12,
    justifyContent: 'center',
  },
  switchThumb: {
    width: 20,
    height: 20,
    borderRadius: 10,
    shadowColor: '#0F2C59',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  modalOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(15, 23, 42, 0.6)',
    justifyContent: 'flex-end',
    zIndex: 100,
  },
  modalContent: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 24,
    paddingTop: 12,
    paddingBottom: Platform.OS === 'ios' ? 40 : 28,
    maxHeight: '90%',
  },
  modalHandle: {
    width: 40,
    height: 4,
    backgroundColor: '#E2E8F0',
    borderRadius: 2,
    alignSelf: 'center',
    marginBottom: 16,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: COLORS.primary,
  },
  inputGroup: {
    marginBottom: 16,
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#64748B',
    marginBottom: 8,
  },
  modalInput: {
    backgroundColor: '#F8FAFC',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: 12,
    padding: 14,
    fontSize: 16,
    color: COLORS.primary,
  },
  saveModalBtn: {
    backgroundColor: COLORS.primary,
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 8,
  },
  saveModalBtnText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  supportCard: {
    backgroundColor: '#F8FAFC',
    borderRadius: 16,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 24,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  supportCardTitle: {
    fontSize: 15,
    fontWeight: 'bold',
    color: COLORS.primary,
    marginBottom: 4,
  },
  supportCardDesc: {
    fontSize: 13,
    color: '#64748B',
    lineHeight: 18,
  },
  supportCardEmail: {
    fontSize: 14,
    fontWeight: 'bold',
    color: COLORS.primary,
    marginTop: 4,
  },
  modalSubheading: {
    fontSize: 16,
    fontWeight: 'bold',
    color: COLORS.primary,
    marginBottom: 12,
  },
  faqItem: {
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
    paddingVertical: 14,
  },
  faqQuestionRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  faqQuestionText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1E293B',
    flex: 1,
    marginRight: 12,
  },
  faqAnswerContainer: {
    marginTop: 10,
    backgroundColor: '#F8FAFC',
    borderRadius: 8,
    padding: 12,
  },
  faqAnswerText: {
    fontSize: 13,
    lineHeight: 20,
    color: '#475569',
  },
  policyTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: COLORS.primary,
    marginBottom: 12,
  },
  policySectionHeader: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#334155',
    marginTop: 12,
    marginBottom: 6,
  },
  policyText: {
    fontSize: 13,
    lineHeight: 20,
    color: '#64748B',
    marginBottom: 10,
  },
});
