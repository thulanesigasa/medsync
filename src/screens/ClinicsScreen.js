import React from 'react';
import { View, Text, StyleSheet, SafeAreaView, ScrollView, TouchableOpacity, TextInput } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export default function ClinicsScreen({ navigation }) {
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={{marginRight: 15}}>
          <Ionicons name="arrow-back" size={24} color="#FFFFFF" />
        </TouchableOpacity>
        <Text style={styles.appTitle}>Clinics Near Me</Text>
      </View>
      
      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.searchBar}>
          <Ionicons name="search" size={20} color="#94A3B8" />
          <TextInput placeholder="Search by name or specialty..." style={styles.searchInput} />
        </View>

        <TouchableOpacity style={styles.clinicCard} onPress={() => navigation.navigate('Booking')}>
          <View style={styles.clinicImagePlaceholder}>
            <Ionicons name="medical" size={32} color="#12418B" />
          </View>
          <View style={styles.clinicInfo}>
            <Text style={styles.clinicName}>Cape Town Family Clinic</Text>
            <Text style={styles.clinicType}>General Practice • 2.4 km</Text>
            <View style={styles.ratingRow}>
              <Ionicons name="star" size={14} color="#F59E0B" />
              <Text style={styles.ratingText}>4.8 (120 reviews)</Text>
            </View>
          </View>
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.clinicCard} onPress={() => navigation.navigate('Booking')}>
          <View style={styles.clinicImagePlaceholder}>
            <Ionicons name="heart" size={32} color="#12418B" />
          </View>
          <View style={styles.clinicInfo}>
            <Text style={styles.clinicName}>Dawn Park Dental</Text>
            <Text style={styles.clinicType}>Dentistry • 3.1 km</Text>
            <View style={styles.ratingRow}>
              <Ionicons name="star" size={14} color="#F59E0B" />
              <Text style={styles.ratingText}>4.9 (85 reviews)</Text>
            </View>
          </View>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F8FAFC' },
  header: { backgroundColor: '#12418B', flexDirection: 'row', alignItems: 'center', paddingHorizontal: 20, paddingVertical: 15 },
  appTitle: { color: '#FFFFFF', fontSize: 20, fontWeight: 'bold' },
  content: { padding: 20 },
  searchBar: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#FFFFFF', paddingHorizontal: 12, paddingVertical: 10, borderRadius: 8, borderWidth: 1, borderColor: '#E2E8F0', marginBottom: 20 },
  searchInput: { flex: 1, marginLeft: 10, fontSize: 15, color: '#162A4A', outlineStyle: 'none' },
  clinicCard: { flexDirection: 'row', backgroundColor: '#FFFFFF', borderRadius: 12, padding: 12, marginBottom: 15, borderWidth: 1, borderColor: '#E2E8F0', shadowColor: '#000', shadowOpacity: 0.05, shadowRadius: 5, elevation: 2 },
  clinicImagePlaceholder: { width: 80, height: 80, backgroundColor: '#EFF6FF', borderRadius: 8, alignItems: 'center', justifyContent: 'center', marginRight: 15 },
  clinicInfo: { flex: 1, justifyContent: 'center' },
  clinicName: { fontSize: 16, fontWeight: 'bold', color: '#162A4A', marginBottom: 4 },
  clinicType: { fontSize: 13, color: '#64748B', marginBottom: 6 },
  ratingRow: { flexDirection: 'row', alignItems: 'center' },
  ratingText: { fontSize: 12, color: '#64748B', marginLeft: 4, fontWeight: '500' }
});
