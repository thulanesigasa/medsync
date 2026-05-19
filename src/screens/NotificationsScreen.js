import React from 'react';
import { View, Text, StyleSheet, SafeAreaView, ScrollView, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export default function NotificationsScreen({ navigation }) {
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={{marginRight: 15}}>
          <Ionicons name="arrow-back" size={24} color="#FFFFFF" />
        </TouchableOpacity>
        <Text style={styles.appTitle}>Notifications</Text>
      </View>
      
      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.notificationCard}>
          <View style={styles.unreadDot} />
          <View style={[styles.iconBox, { backgroundColor: '#EFF6FF' }]}>
            <Ionicons name="calendar" size={20} color="#12418B" />
          </View>
          <View style={styles.textContainer}>
            <Text style={styles.notifTitle}>Appointment Reminder</Text>
            <Text style={styles.notifDesc}>You have a dentist appointment tomorrow at 10:00 AM.</Text>
            <Text style={styles.notifTime}>2 hours ago</Text>
          </View>
        </View>

        <View style={styles.notificationCard}>
          <View style={[styles.iconBox, { backgroundColor: '#F0FDF4' }]}>
            <Ionicons name="document-text" size={20} color="#22C55E" />
          </View>
          <View style={styles.textContainer}>
            <Text style={styles.notifTitle}>Lab Results Ready</Text>
            <Text style={styles.notifDesc}>Your blood test results from May 10 are now available.</Text>
            <Text style={styles.notifTime}>Yesterday</Text>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F8FAFC' },
  header: { backgroundColor: '#12418B', flexDirection: 'row', alignItems: 'center', paddingHorizontal: 20, paddingVertical: 15 },
  appTitle: { color: '#FFFFFF', fontSize: 20, fontWeight: 'bold' },
  content: { padding: 20 },
  notificationCard: { flexDirection: 'row', backgroundColor: '#FFFFFF', borderRadius: 12, padding: 15, marginBottom: 12, borderWidth: 1, borderColor: '#E2E8F0', alignItems: 'flex-start' },
  unreadDot: { width: 8, height: 8, borderRadius: 4, backgroundColor: '#EF4444', position: 'absolute', top: 15, left: 10 },
  iconBox: { width: 40, height: 40, borderRadius: 20, alignItems: 'center', justifyContent: 'center', marginRight: 15, marginLeft: 5 },
  textContainer: { flex: 1 },
  notifTitle: { fontSize: 15, fontWeight: 'bold', color: '#162A4A', marginBottom: 4 },
  notifDesc: { fontSize: 13, color: '#64748B', lineHeight: 18, marginBottom: 6 },
  notifTime: { fontSize: 11, color: '#94A3B8', fontWeight: '500' }
});
