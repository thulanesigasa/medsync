import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, SIZES, LAYOUT } from '../constants/theme';
import { useTheme } from '../context/ThemeContext';

export default function PrivacyPolicyScreen({ navigation }) {
  const { theme } = useTheme();

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerContent}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
            <Ionicons name="arrow-back" size={24} color="#FFFFFF" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Privacy Policy</Text>
          <View style={{ width: 32 }} />
        </View>
      </View>

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <View style={[styles.card, { backgroundColor: theme.surface, borderColor: theme.border }]}>
          <Text style={[styles.lastUpdatedText, { color: theme.subtext }]}>Last Updated: July 2026</Text>

          <Text style={[styles.sectionHeader, { color: theme.text }]}>1. Information We Collect</Text>
          <Text style={[styles.sectionText, { color: theme.subtext }]}>
            We collect personal registration details (first name, surname, email address, phone number) and appointment metadata when you register or make a booking.
            {"\n\n"}
            We also store medical records, diagnoses, treatments, and prescriptions uploaded on your behalf by authorized medical clinic personnel to link appointments and manage records.
            {"\n\n"}
            Technical device information (IP address, operating system, and push notification tokens) may be collected to ensure application performance and deliver notifications.
          </Text>

          <Text style={[styles.sectionHeader, { color: theme.text }]}>2. How We Use Collected Data</Text>
          <Text style={[styles.sectionText, { color: theme.subtext }]}>
            Your data is exclusively used to:
            {"\n"}• Facilitate bookings and confirm appointment schedules.
            {"\n"}• Provide secure video/audio telehealth consultations.
            {"\n"}• Process prescription refills through your clinic's pharmacy.
            {"\n"}• Send push notifications and SMS/Email reminders for upcoming visits.
            {"\n"}• Authenticate your profile and prevent fraudulent usage.
            {"\n\n"}
            We do not sell, distribute, license, or expose your data to third-party advertising companies.
          </Text>

          <Text style={[styles.sectionHeader, { color: theme.text }]}>3. Data Security & Encryption</Text>
          <Text style={[styles.sectionText, { color: theme.subtext }]}>
            We employ industry-standard encryption protocols (AES-256) for data storage and transport layer security (SSL/TLS) for data in transit. 
            {"\n\n"}
            Database access is protected by strict Row-Level Security (RLS) policies, ensuring that patients can only view their own records, and clinic staff can only access records for patients registered at their clinic.
          </Text>

          <Text style={[styles.sectionHeader, { color: theme.text }]}>4. Information Sharing & Disclosure</Text>
          <Text style={[styles.sectionText, { color: theme.subtext }]}>
            Your information is kept strictly private. It is only accessible by:
            {"\n"}1. Yourself (the logged-in patient).
            {"\n"}2. The specific doctors, clinic owners, or receptionist staff whom you book appointments with or consult through the app.
            {"\n\n"}
            We do not share your medical records with insurance providers or any other external entities unless explicitly authorized by you or required by a valid legal subpoena.
          </Text>

          <Text style={[styles.sectionHeader, { color: theme.text }]}>5. POPIA & HIPAA Compliance</Text>
          <Text style={[styles.sectionText, { color: theme.subtext }]}>
            MedSync is designed to comply with the Protection of Personal Information Act (POPIA) in South Africa and adheres to general international HIPAA security guidelines.
            {"\n\n"}
            Under POPIA, you have the right to request access to all personal data we hold about you, ask for corrections, or request deletion of your account. To exercise any of these rights, contact us at privacy@hokmatech.com.
          </Text>
        </View>
      </ScrollView>
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
  content: {
    padding: SIZES.margin,
  },
  card: {
    borderRadius: SIZES.radius,
    padding: 20,
    borderWidth: 1,
    shadowColor: '#000',
    shadowOpacity: 0.02,
    shadowRadius: 5,
    elevation: 1,
  },
  lastUpdatedText: {
    fontSize: 12,
    fontWeight: '600',
    marginBottom: 20,
  },
  sectionHeader: {
    fontSize: 16,
    fontWeight: 'bold',
    marginTop: 18,
    marginBottom: 8,
  },
  sectionText: {
    fontSize: 14,
    lineHeight: 22,
  },
});
