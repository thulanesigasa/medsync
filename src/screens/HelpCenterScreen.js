import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  TouchableOpacity, 
  Platform, 
  UIManager 
} from 'react-native';
import { LayoutAnimation } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, SIZES, LAYOUT } from '../constants/theme';
import { useTheme } from '../context/ThemeContext';

// Enable LayoutAnimation for Android
if (Platform.OS === 'android' && UIManager.setLayoutAnimationEnabledExperimental) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

export default function HelpCenterScreen({ navigation }) {
  const { theme } = useTheme();
  const [activeFaq, setActiveFaq] = useState(null);

  const faqs = [
    {
      q: "How do I book an appointment?",
      a: "Go to the Home tab, search or select your preferred doctor, choose the associated clinic, select an available date and time slot from the calendar, and tap 'Confirm Booking'. Your request will be sent to the clinic administrative staff for review and confirmation."
    },
    {
      q: "Can I cancel or reschedule my appointment?",
      a: "Yes. You can view all your active bookings in the 'Appointments' tab. Tap 'Cancel' on the appointment card to cancel the slot. To reschedule, simply cancel the current slot and book a new one. We request cancellations to be made at least 2 hours in advance."
    },
    {
      q: "What is Telehealth and how do I join a call?",
      a: "Telehealth allows you to consult with your physician remotely via secure, end-to-end encrypted video and audio sessions. If your appointment is scheduled as a virtual consultation, a green 'Join Call' button will dynamically appear on your appointment card in the Appointments tab when the appointment time becomes active."
    },
    {
      q: "Who reviews and confirms my appointment request?",
      a: "When you submit an appointment booking request, it is set to 'Pending' status. The clinic's administrative staff, receptionist, or HR team reviews your request. Once confirmed, you will receive a notification and the status will update to 'Confirmed' in your Appointments tab."
    },
    {
      q: "How do I view my medical records?",
      a: "Go to the 'Records' tab in the bottom navigation. Your official diagnoses, physician visit details, and prescriptions uploaded by your clinic will be securely displayed. You can download individual records in PDF/text format by clicking the download icon."
    },
    {
      q: "How do I request a prescription refill?",
      a: "Under the 'Records' tab, locate the 'Active Prescriptions' section. Tap the 'Refill' button next to any prescription. A request will automatically be sent to your clinic's pharmacy department for verification and preparation. You will be notified when it is ready for collection."
    },
    {
      q: "Is my personal and medical data secure?",
      a: "Absolutely. MedSync utilizes rigorous Row-Level Security (RLS) policies on a fully encrypted database. Your medical history, personal information, and chat messages are encrypted and only accessible by yourself and authorized medical staff at the clinic you consult with."
    },
    {
      q: "What should I do if the app is throwing a network connection error?",
      a: "Ensure your device has an active internet connection (WiFi or mobile data). If you are on a restricted corporate WiFi network, certain database ports might be blocked—try switching to mobile data (LTE/5G). Also, check that your device's date and time are set to 'Automatic' to avoid secure connection handshake failures."
    },
    {
      q: "Can I update my phone number or email address?",
      a: "Yes. Go to the 'Profile' tab, scroll to 'Account Details,' and select 'Personal Information.' You can edit your full name, email, and phone number, then tap 'Save Changes' to sync the details with your database profile instantly."
    },
    {
      q: "How do I reset my account password?",
      a: "If you forget your password or need to reset it, log out of the application and click the 'Forgot Password' link on the Login screen. Enter your registered email, and reset instructions will be sent to you. If you encounter email rate limit errors, wait a few minutes or contact support at support@hokmatech.com."
    }
  ];

  const toggleFaq = (index) => {
    // Configure slide transition animation
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setActiveFaq(activeFaq === index ? null : index);
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerContent}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
            <Ionicons name="arrow-back" size={24} color="#FFFFFF" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Help Center & FAQ</Text>
          <View style={{ width: 32 }} /> {/* balance header title layout */}
        </View>
      </View>

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        {/* Support Contact Info Card */}
        <View style={[styles.supportCard, { backgroundColor: theme.surface, borderColor: theme.border }]}>
          <View style={styles.supportIconBox}>
            <Ionicons name="mail" size={28} color={COLORS.primary} />
          </View>
          <View style={{ flex: 1 }}>
            <Text style={[styles.supportCardTitle, { color: theme.text }]}>Need Technical Support?</Text>
            <Text style={[styles.supportCardDesc, { color: theme.subtext }]}>
              Our tech team is available 24/7. Send us an email at:
            </Text>
            <Text style={styles.supportCardEmail}>support@hokmatech.com</Text>
          </View>
        </View>

        {/* FAQs list */}
        <Text style={[styles.sectionSubtitle, { color: theme.text }]}>Frequently Asked Questions</Text>

        <View style={styles.faqList}>
          {faqs.map((faq, index) => {
            const isOpen = activeFaq === index;
            return (
              <View 
                key={index} 
                style={[
                  styles.faqItem, 
                  { backgroundColor: theme.surface, borderColor: theme.border }
                ]}
              >
                <TouchableOpacity 
                  style={styles.faqQuestionRow} 
                  onPress={() => toggleFaq(index)}
                  activeOpacity={0.7}
                >
                  <Text style={[styles.faqQuestionText, { color: theme.text }]}>{faq.q}</Text>
                  <Ionicons 
                    name={isOpen ? "chevron-up" : "chevron-down"} 
                    size={20} 
                    color={COLORS.primary} 
                  />
                </TouchableOpacity>
                {isOpen && (
                  <View style={[styles.faqAnswerContainer, { borderTopColor: theme.border }]}>
                    <Text style={[styles.faqAnswerText, { color: theme.subtext }]}>{faq.a}</Text>
                  </View>
                )}
              </View>
            );
          })}
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
    gap: 24,
  },
  supportCard: {
    flexDirection: 'row',
    borderRadius: SIZES.radius,
    padding: 16,
    borderWidth: 1,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.02,
    shadowRadius: 5,
    elevation: 1,
  },
  supportIconBox: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#EFF6FF',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  supportCardTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  supportCardDesc: {
    fontSize: 13,
    lineHeight: 18,
    marginBottom: 4,
  },
  supportCardEmail: {
    fontSize: 14,
    fontWeight: 'bold',
    color: COLORS.primary,
  },
  sectionSubtitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: -8,
  },
  faqList: {
    gap: 12,
  },
  faqItem: {
    borderRadius: SIZES.radius,
    borderWidth: 1,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOpacity: 0.01,
    shadowRadius: 5,
    elevation: 1,
  },
  faqQuestionRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 18,
  },
  faqQuestionText: {
    fontSize: 14,
    fontWeight: '600',
    flex: 1,
    paddingRight: 12,
    lineHeight: 20,
  },
  faqAnswerContainer: {
    borderTopWidth: 1,
    padding: 16,
    backgroundColor: '#FAF9FF',
  },
  faqAnswerText: {
    fontSize: 13,
    lineHeight: 22,
  },
});
