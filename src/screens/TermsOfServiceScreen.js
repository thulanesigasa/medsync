import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, SIZES, LAYOUT } from '../constants/theme';
import { useTheme } from '../context/ThemeContext';

export default function TermsOfServiceScreen({ navigation }) {
  const { theme } = useTheme();

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerContent}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
            <Ionicons name="arrow-back" size={24} color="#FFFFFF" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Terms of Service</Text>
          <View style={{ width: 32 }} />
        </View>
      </View>

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <View style={[styles.card, { backgroundColor: theme.surface, borderColor: theme.border }]}>
          <Text style={[styles.lastUpdatedText, { color: theme.subtext }]}>Last Updated: July 2026</Text>

          <Text style={[styles.sectionHeader, { color: theme.text }]}>1. Introduction</Text>
          <Text style={[styles.sectionText, { color: theme.subtext }]}>
            Welcome to MedSync. By downloading, installing, accessing, or using the MedSync mobile application ("Service"), you signify that you have read, understood, and agree to be bound by this Terms of Service Agreement ("Agreement"). If you do not agree to these terms, you are prohibited from using the Service.
          </Text>

          <Text style={[styles.sectionHeader, { color: theme.text }]}>2. Medical Disclaimer</Text>
          <Text style={[styles.sectionText, { color: theme.subtext }]}>
            MedSync is a software platform designed to facilitate appointment booking, telehealth consultations, secure clinic-patient messaging, and health record management between patients and healthcare professionals. MedSync is NOT a licensed healthcare provider, medical clinic, or emergency response service. The software does not provide medical diagnoses, treatment, or advice.
          </Text>
          <Text style={[styles.warningText, { color: '#B45309', backgroundColor: '#FEF3C7', borderColor: '#F59E0B' }]}>
            <Ionicons name="warning" size={16} color="#D97706" style={{ marginRight: 6 }} />
            IN THE EVENT OF A MEDICAL EMERGENCY, DO NOT USE MEDSYNC. IMMEDIATELY CALL YOUR LOCAL EMERGENCY SERVICES HOTLINE OR VISIT THE NEAREST CLINIC/EMERGENCY ROOM.
          </Text>

          <Text style={[styles.sectionHeader, { color: theme.text }]}>3. User Accounts & Security</Text>
          <Text style={[styles.sectionText, { color: theme.subtext }]}>
            To access features, you must register for an account. You agree to provide accurate, current, and complete registration details (including first name, surname, email, and phone). You are entirely responsible for maintaining the confidentiality of your password. Any unauthorized use of your account must be reported immediately to support@hokmatech.com.
          </Text>

          <Text style={[styles.sectionHeader, { color: theme.text }]}>4. Code of Conduct & Permitted Use</Text>
          <Text style={[styles.sectionText, { color: theme.subtext }]}>
            You agree to use the Service only for lawful purposes. You are prohibited from:
            {"\n"}• Uploading or transmitting false information, malware, or spam.
            {"\n"}• Harassing, abusing, or insulting clinic staff or other users.
            {"\n"}• Attempting to reverse engineer, hack, or exploit vulnerabilities.
            {"\n"}• Violating national health record and privacy laws.
            {"\n\n"}Violation of user conduct terms will result in immediate account termination.
          </Text>

          <Text style={[styles.sectionHeader, { color: theme.text }]}>5. Limitation of Liability</Text>
          <Text style={[styles.sectionText, { color: theme.subtext }]}>
            To the maximum extent permitted by applicable law, MedSync and its developers (Hokmatech) shall not be liable for any indirect, incidental, special, consequential, or punitive damages, or any loss of profits or data, arising out of or related to your use of or inability to use the Service.
          </Text>

          <Text style={[styles.sectionHeader, { color: theme.text }]}>6. Changes to Terms</Text>
          <Text style={[styles.sectionText, { color: theme.subtext }]}>
            We reserve the right, at our sole discretion, to modify or replace these Terms at any time. If a revision is material, we will provide notification through the app before any new terms take effect. Continuing to access or use our Service after those revisions become effective constitutes acceptance of the new terms.
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
    marginBottom: 10,
  },
  warningText: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    fontSize: 13,
    fontWeight: '600',
    lineHeight: 18,
    marginVertical: 12,
  },
});
