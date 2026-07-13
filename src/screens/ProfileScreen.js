import React, { useState, useRef, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  TouchableOpacity, 
  Animated, 
  Platform, 
  Modal, 
  TextInput, 
  KeyboardAvoidingView 
} from 'react-native';
import { MaterialCommunityIcons, Ionicons } from '@expo/vector-icons';
import { COLORS, SIZES, LAYOUT } from '../constants/theme';
import BottomTabBar from '../components/BottomTabBar';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { useToast } from '../context/ToastContext';

const CustomSwitch = ({ value, onValueChange }) => {
  const animatedValue = useRef(new Animated.Value(value ? 1 : 0)).current;
  const { theme } = useTheme();

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
    outputRange: [2, 20]
  });

  const backgroundColor = animatedValue.interpolate({
    inputRange: [0, 1],
    outputRange: [theme.background, '#EFF6FF']
  });

  const thumbColor = animatedValue.interpolate({
    inputRange: [0, 1],
    outputRange: ['#94A3B8', COLORS.primary]
  });

  const borderColor = animatedValue.interpolate({
    inputRange: [0, 1],
    outputRange: [theme.border, '#D3E2F2']
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
  const [isQrModalVisible, setQrModalVisible] = useState(false);
  
  const [editName, setEditName] = useState('');
  const [editEmail, setEditEmail] = useState('');
  const [editPhone, setEditPhone] = useState('');

  const displayUsername = currentUser?.email ? `@${currentUser.email.split('@')[0]}` : '@user';

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

  // Cohesive icon background and text colors based on current theme
  const iconBg = isDark ? '#334155' : '#EFF6FF';
  const iconColor = isDark ? '#F8FAFC' : COLORS.primary;

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerContent}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
            <Ionicons name="arrow-back" size={24} color="#FFFFFF" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Settings</Text>
          <View style={styles.headerActions}>
            <TouchableOpacity 
              style={styles.headerIconBtn} 
              onPress={() => showToast("Search features are available in the directory and chat logs.", "info")}
            >
              <Ionicons name="search-outline" size={22} color="#FFFFFF" />
            </TouchableOpacity>
            <TouchableOpacity 
              style={styles.headerIconBtn} 
              onPress={() => setEditModalVisible(true)}
            >
              <Ionicons name="pencil-outline" size={22} color="#FFFFFF" />
            </TouchableOpacity>
            <TouchableOpacity 
              style={styles.headerIconBtn} 
              onPress={() => setQrModalVisible(true)}
            >
              <Ionicons name="qr-code-outline" size={22} color="#FFFFFF" />
            </TouchableOpacity>
          </View>
        </View>
      </View>

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        
        {/* Profile Card Section */}
        <View style={styles.profileSectionContainer}>
          {/* Status Bubble */}
          <View style={[styles.statusBubble, { backgroundColor: theme.surface, borderColor: theme.border }]}>
            <Text style={[styles.statusBubbleText, { color: theme.text }]}>How's your morning?</Text>
            <View style={[styles.statusBubbleArrow, { borderTopColor: theme.surface }]} />
          </View>

          {/* Large Avatar */}
          <View style={styles.avatarWrapper}>
            <View style={[styles.avatarMain, { backgroundColor: COLORS.primary }]}>
              <Text style={styles.avatarMainText}>
                {(currentUser?.name || currentUser?.email?.split('@')[0] || 'U').charAt(0).toUpperCase()}
              </Text>
            </View>
            <View style={styles.verifiedIndicator}>
              <Ionicons name="checkmark-circle" size={24} color="#10B981" />
            </View>
          </View>

          {/* Name & Handle */}
          <Text style={[styles.profileMainName, { color: theme.text }]}>
            {currentUser?.name || currentUser?.email?.split('@')[0] || 'User'}
          </Text>
          <Text style={[styles.profileSubHandle, { color: theme.subtext }]}>
            {displayUsername}
          </Text>
        </View>

        {/* All settings under one unified card category */}
        <View style={[styles.listCard, { backgroundColor: theme.surface, borderColor: theme.border }]}>
          
          {/* Account */}
          <TouchableOpacity 
            style={[styles.menuRow, { borderBottomColor: theme.border }]} 
            onPress={() => setEditModalVisible(true)}
          >
            <View style={[styles.menuIconContainer, { backgroundColor: iconBg }]}>
              <Ionicons name="key" size={20} color={iconColor} />
            </View>
            <View style={styles.menuTextContainer}>
              <Text style={[styles.menuTitleText, { color: theme.text }]}>Account</Text>
              <Text style={[styles.menuSubtextText, { color: theme.subtext }]}>Personal details, phone number, password updates</Text>
            </View>
            <Ionicons name="chevron-forward" size={18} color="#94A3B8" />
          </TouchableOpacity>

          {/* Privacy */}
          <TouchableOpacity 
            style={[styles.menuRow, { borderBottomColor: theme.border }]} 
            onPress={() => navigation.navigate("PrivacyPolicy")}
          >
            <View style={[styles.menuIconContainer, { backgroundColor: iconBg }]}>
              <Ionicons name="lock-closed" size={20} color={iconColor} />
            </View>
            <View style={styles.menuTextContainer}>
              <Text style={[styles.menuTitleText, { color: theme.text }]}>Privacy</Text>
              <Text style={[styles.menuSubtextText, { color: theme.subtext }]}>Secure medical records, HIPAA policy options</Text>
            </View>
            <Ionicons name="chevron-forward" size={18} color="#94A3B8" />
          </TouchableOpacity>

          {/* Appointments */}
          <TouchableOpacity 
            style={[styles.menuRow, { borderBottomColor: theme.border }]} 
            onPress={() => navigation.navigate("Appointments")}
          >
            <View style={[styles.menuIconContainer, { backgroundColor: iconBg }]}>
              <Ionicons name="calendar" size={20} color={iconColor} />
            </View>
            <View style={styles.menuTextContainer}>
              <Text style={[styles.menuTitleText, { color: theme.text }]}>Appointments</Text>
              <Text style={[styles.menuSubtextText, { color: theme.subtext }]}>Active bookings, past histories, date alignments</Text>
            </View>
            <Ionicons name="chevron-forward" size={18} color="#94A3B8" />
          </TouchableOpacity>

          {/* Chats */}
          <TouchableOpacity 
            style={[styles.menuRow, { borderBottomColor: theme.border }]} 
            onPress={() => navigation.navigate("Chats")}
          >
            <View style={[styles.menuIconContainer, { backgroundColor: iconBg }]}>
              <Ionicons name="chatbubble-ellipses" size={20} color={iconColor} />
            </View>
            <View style={styles.menuTextContainer}>
              <Text style={[styles.menuTitleText, { color: theme.text }]}>Chats</Text>
              <Text style={[styles.menuSubtextText, { color: theme.subtext }]}>Active consultation chats, history storage</Text>
            </View>
            <Ionicons name="chevron-forward" size={18} color="#94A3B8" />
          </TouchableOpacity>

          {/* Notifications */}
          <View style={[styles.menuRow, { borderBottomColor: theme.border }]}>
            <View style={[styles.menuIconContainer, { backgroundColor: iconBg }]}>
              <Ionicons name="notifications" size={20} color={iconColor} />
            </View>
            <View style={styles.menuTextContainer}>
              <Text style={[styles.menuTitleText, { color: theme.text }]}>Notifications</Text>
              <Text style={[styles.menuSubtextText, { color: theme.subtext }]}>Clinic updates, doctor messages, status alarms</Text>
            </View>
            <CustomSwitch 
              value={notificationsEnabled} 
              onValueChange={setNotificationsEnabled} 
            />
          </View>

          {/* Dark Mode - Unified in one card list */}
          <TouchableOpacity 
            style={[styles.menuRow, { borderBottomColor: theme.border }]}
            onPress={toggleTheme}
          >
            <View style={[styles.menuIconContainer, { backgroundColor: iconBg }]}>
              <Ionicons name={isDark ? "sunny" : "moon"} size={20} color={iconColor} />
            </View>
            <View style={styles.menuTextContainer}>
              <Text style={[styles.menuTitleText, { color: theme.text }]}>Dark Mode</Text>
              <Text style={[styles.menuSubtextText, { color: theme.subtext }]}>Toggle dark slate/light theme preference</Text>
            </View>
            <Text style={[styles.themeStateValue, { color: theme.text }]}>
              {isDark ? 'ON' : 'OFF'}
            </Text>
          </TouchableOpacity>

          {/* App Language */}
          <View style={[styles.menuRow, { borderBottomColor: theme.border }]}>
            <View style={[styles.menuIconContainer, { backgroundColor: iconBg }]}>
              <Ionicons name="earth" size={20} color={iconColor} />
            </View>
            <View style={styles.menuTextContainer}>
              <Text style={[styles.menuTitleText, { color: theme.text }]}>App Language</Text>
              <Text style={[styles.menuSubtextText, { color: theme.subtext }]}>English (device's language)</Text>
            </View>
            <Text style={[styles.languageValueText, { color: theme.subtext }]}>English (SA)</Text>
          </View>

          {/* Help Center & FAQ */}
          <TouchableOpacity 
            style={[styles.menuRow, { borderBottomColor: theme.border }]} 
            onPress={() => navigation.navigate("HelpCenter")}
          >
            <View style={[styles.menuIconContainer, { backgroundColor: iconBg }]}>
              <Ionicons name="help-circle" size={20} color={iconColor} />
            </View>
            <View style={styles.menuTextContainer}>
              <Text style={[styles.menuTitleText, { color: theme.text }]}>Help and Feedback</Text>
              <Text style={[styles.menuSubtextText, { color: theme.subtext }]}>FAQs, technical support email, support desk</Text>
            </View>
            <Ionicons name="chevron-forward" size={18} color="#94A3B8" />
          </TouchableOpacity>

          {/* Terms of Service */}
          <TouchableOpacity 
            style={[styles.menuRow, { borderBottomColor: theme.border }]} 
            onPress={() => navigation.navigate("TermsOfService")}
          >
            <View style={[styles.menuIconContainer, { backgroundColor: iconBg }]}>
              <Ionicons name="document-text" size={20} color={iconColor} />
            </View>
            <View style={styles.menuTextContainer}>
              <Text style={[styles.menuTitleText, { color: theme.text }]}>Terms of Service</Text>
              <Text style={[styles.menuSubtextText, { color: theme.subtext }]}>Patient consent forms, platform agreements</Text>
            </View>
            <Ionicons name="chevron-forward" size={18} color="#94A3B8" />
          </TouchableOpacity>

          {/* Privacy Policy Link - Separate Row */}
          <TouchableOpacity 
            style={[styles.menuRow, { borderBottomColor: theme.border }]} 
            onPress={() => navigation.navigate("PrivacyPolicy")}
          >
            <View style={[styles.menuIconContainer, { backgroundColor: iconBg }]}>
              <Ionicons name="shield-checkmark" size={20} color={iconColor} />
            </View>
            <View style={styles.menuTextContainer}>
              <Text style={[styles.menuTitleText, { color: theme.text }]}>Privacy Policy</Text>
              <Text style={[styles.menuSubtextText, { color: theme.subtext }]}>POPIA declarations, security controls</Text>
            </View>
            <Ionicons name="chevron-forward" size={18} color="#94A3B8" />
          </TouchableOpacity>

          {/* App Updates */}
          <TouchableOpacity 
            style={[styles.menuRow, { borderBottomColor: theme.border }]} 
            onPress={() => showToast("MedSync is up to date with the latest preview build!", "success")}
          >
            <View style={[styles.menuIconContainer, { backgroundColor: iconBg }]}>
              <Ionicons name="cloud-download" size={20} color={iconColor} />
            </View>
            <View style={styles.menuTextContainer}>
              <Text style={[styles.menuTitleText, { color: theme.text }]}>App Updates</Text>
              <Text style={[styles.menuSubtextText, { color: theme.subtext }]}>Check OTA engine updates, updates list</Text>
            </View>
            <Ionicons name="chevron-forward" size={18} color="#94A3B8" />
          </TouchableOpacity>

          {/* Log Out - Unified at the bottom of settings category */}
          <TouchableOpacity 
            style={styles.menuRow} 
            onPress={handleLogout}
          >
            <View style={[styles.menuIconContainer, { backgroundColor: isDark ? '#451A1A' : '#FEF2F2' }]}>
              <Ionicons name="log-out" size={20} color="#EF4444" />
            </View>
            <View style={styles.menuTextContainer}>
              <Text style={[styles.menuTitleText, { color: '#EF4444' }]}>Log Out</Text>
              <Text style={[styles.menuSubtextText, { color: '#F87171' }]}>Sign out of your MedSync account securely</Text>
            </View>
            <Ionicons name="chevron-forward" size={18} color="#F87171" />
          </TouchableOpacity>
        </View>

        {/* Also from Hokmatech */}
        <View style={styles.metaBrandingSection}>
          <Text style={[styles.metaSectionTitle, { color: theme.subtext }]}>Also from Hokmatech</Text>
          <View style={styles.metaIconRow}>
            {['logo-instagram', 'logo-facebook', 'at', 'globe-outline'].map((iconName, idx) => (
              <TouchableOpacity 
                key={iconName} 
                style={[styles.metaSocialBtn, { backgroundColor: theme.surface, borderColor: theme.border }]}
                onPress={() => {
                  const destinations = ["Instagram", "Facebook", "Threads", "Hokmatech Official"];
                  showToast(`Opening MedSync ${destinations[idx]} page...`, "info");
                }}
              >
                <Ionicons name={iconName} size={20} color={theme.text} />
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <View style={{ height: 20 }} />
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
            style={styles.modalOverlay}
            activeOpacity={1}
            onPress={() => setEditModalVisible(false)}
          />
          <View style={[styles.modalContent, { backgroundColor: theme.surface }]}>
            <View style={styles.modalHandle} />
            <View style={styles.modalHeader}>
              <Text style={[styles.modalTitle, { color: theme.text }]}>Edit Profile Details</Text>
              <TouchableOpacity onPress={() => setEditModalVisible(false)}>
                <Ionicons name="close" size={24} color={theme.subtext} />
              </TouchableOpacity>
            </View>

            <ScrollView showsVerticalScrollIndicator={false}>
              <View style={styles.inputGroup}>
                <Text style={[styles.inputLabel, { color: theme.subtext }]}>Full Name</Text>
                <TextInput
                  style={[styles.modalInput, { color: theme.text, backgroundColor: theme.background, borderColor: theme.border }]}
                  value={editName}
                  onChangeText={setEditName}
                  placeholder="Enter your name"
                  placeholderTextColor="#94A3B8"
                />
              </View>

              <View style={styles.inputGroup}>
                <Text style={[styles.inputLabel, { color: theme.subtext }]}>Email Address</Text>
                <TextInput
                  style={[styles.modalInput, { color: theme.text, backgroundColor: theme.background, borderColor: theme.border }]}
                  value={editEmail}
                  onChangeText={setEditEmail}
                  keyboardType="email-address"
                  placeholder="Enter email address"
                  placeholderTextColor="#94A3B8"
                />
              </View>

              <View style={styles.inputGroup}>
                <Text style={[styles.inputLabel, { color: theme.subtext }]}>Phone Number</Text>
                <TextInput
                  style={[styles.modalInput, { color: theme.text, backgroundColor: theme.background, borderColor: theme.border }]}
                  value={editPhone}
                  onChangeText={setEditPhone}
                  keyboardType="phone-pad"
                  placeholder="Enter phone number"
                  placeholderTextColor="#94A3B8"
                />
              </View>

              <TouchableOpacity style={styles.saveModalBtn} onPress={handleSaveProfile}>
                <Text style={styles.saveModalBtnText}>Save Changes</Text>
              </TouchableOpacity>
            </ScrollView>
          </View>
        </KeyboardAvoidingView>
      </Modal>

      {/* QR Code Modal */}
      <Modal
        visible={isQrModalVisible}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setQrModalVisible(false)}
      >
        <TouchableOpacity
          style={styles.modalOverlay}
          activeOpacity={1}
          onPress={() => setQrModalVisible(false)}
        >
          <View style={[styles.qrModalContainer, { backgroundColor: theme.surface, borderColor: theme.border }]}>
            <View style={styles.qrHeader}>
              <Text style={[styles.qrTitle, { color: theme.text }]}>Patient QR Pass</Text>
              <TouchableOpacity onPress={() => setQrModalVisible(false)}>
                <Ionicons name="close" size={24} color={theme.subtext} />
              </TouchableOpacity>
            </View>

            {/* QR Scanner Mock Card */}
            <View style={styles.qrCardBody}>
              <View style={styles.qrIconWrapper}>
                <MaterialCommunityIcons name="qrcode-scan" size={160} color="#0F2C59" />
              </View>
              <Text style={[styles.qrPatientName, { color: theme.text }]}>
                {currentUser?.name || 'User'}
              </Text>
              <Text style={[styles.qrPatientLabel, { color: theme.subtext }]}>
                MedSync Verified Account
              </Text>
              <View style={[styles.qrScanBadge, { backgroundColor: '#F0FDF4' }]}>
                <Ionicons name="checkmark-circle" size={16} color="#10B981" />
                <Text style={styles.qrScanBadgeText}>Scan at Reception Desk</Text>
              </View>
            </View>
          </View>
        </TouchableOpacity>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
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
  backButton: {
    padding: 4,
  },
  headerTitle: {
    color: '#FFFFFF',
    fontSize: 20,
    fontWeight: 'bold',
  },
  headerActions: {
    flexDirection: 'row',
    gap: 16,
  },
  headerIconBtn: {
    padding: 4,
  },
  content: {
    padding: SIZES.margin,
    gap: 16,
  },
  profileSectionContainer: {
    alignItems: 'center',
    marginVertical: 10,
  },
  statusBubble: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 16,
    borderWidth: 1,
    position: 'relative',
    marginBottom: 12,
    shadowColor: '#000',
    shadowOpacity: 0.01,
    shadowRadius: 3,
    elevation: 1,
  },
  statusBubbleText: {
    fontSize: 13,
    fontWeight: '500',
  },
  statusBubbleArrow: {
    width: 0,
    height: 0,
    borderLeftWidth: 8,
    borderLeftColor: 'transparent',
    borderRightWidth: 8,
    borderRightColor: 'transparent',
    borderTopWidth: 8,
    position: 'absolute',
    bottom: -8,
    left: '50%',
    marginLeft: -8,
  },
  avatarWrapper: {
    position: 'relative',
    marginBottom: 14,
  },
  avatarMain: {
    width: 96,
    height: 96,
    borderRadius: 48,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarMainText: {
    color: '#FFFFFF',
    fontSize: 42,
    fontWeight: 'bold',
  },
  verifiedIndicator: {
    position: 'absolute',
    bottom: 2,
    right: 2,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    width: 24,
    height: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  profileMainName: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  profileSubHandle: {
    fontSize: 14,
    fontWeight: '500',
  },
  listCard: {
    borderRadius: SIZES.radius,
    borderWidth: 1,
    paddingVertical: 4,
    shadowColor: '#000',
    shadowOpacity: 0.02,
    shadowRadius: 5,
    elevation: 1,
  },
  menuRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
  },
  menuIconContainer: {
    width: 38,
    height: 38,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 14,
  },
  menuTextContainer: {
    flex: 1,
    paddingRight: 8,
  },
  menuTitleText: {
    fontSize: 15,
    fontWeight: 'bold',
    marginBottom: 2,
  },
  menuSubtextText: {
    fontSize: 12,
    lineHeight: 16,
  },
  languageValueText: {
    fontSize: 13,
    fontWeight: '500',
    marginRight: 4,
  },
  themeToggleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
    paddingHorizontal: 16,
  },
  themeStateValue: {
    fontSize: 13,
    fontWeight: 'bold',
    marginRight: 4,
  },
  metaBrandingSection: {
    alignItems: 'center',
    marginTop: 12,
    marginBottom: 4,
  },
  metaSectionTitle: {
    fontSize: 12,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 0.8,
    marginBottom: 12,
  },
  metaIconRow: {
    flexDirection: 'row',
    gap: 16,
  },
  metaSocialBtn: {
    width: 44,
    height: 44,
    borderRadius: 22,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.01,
    shadowRadius: 3,
    elevation: 1,
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
    flex: 1,
    backgroundColor: 'rgba(15, 23, 42, 0.6)',
    justifyContent: 'flex-end',
  },
  modalContent: {
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
  },
  inputGroup: {
    marginBottom: 16,
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 8,
  },
  modalInput: {
    borderWidth: 1,
    borderRadius: 12,
    padding: 14,
    fontSize: 16,
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
  qrModalContainer: {
    margin: 32,
    borderRadius: 24,
    borderWidth: 1,
    padding: 24,
    alignSelf: 'center',
    width: '85%',
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 20,
    elevation: 5,
    marginTop: '30%',
  },
  qrHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  qrTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  qrCardBody: {
    alignItems: 'center',
    gap: 12,
  },
  qrIconWrapper: {
    backgroundColor: '#FFFFFF',
    padding: 16,
    borderRadius: 16,
    shadowColor: '#000',
    shadowOpacity: 0.03,
    shadowRadius: 10,
    elevation: 2,
    marginBottom: 8,
  },
  qrPatientName: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  qrPatientLabel: {
    fontSize: 13,
    fontWeight: '500',
  },
  qrScanBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
    marginTop: 4,
  },
  qrScanBadgeText: {
    fontSize: 12,
    color: '#10B981',
    fontWeight: '700',
  },
});
