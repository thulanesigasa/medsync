import React from 'react';
import { View, Text, StyleSheet, SafeAreaView, ScrollView, TouchableOpacity } from 'react-native';
import { MaterialCommunityIcons, Ionicons, FontAwesome5 } from '@expo/vector-icons';
import BottomTabBar from '../components/BottomTabBar';

export default function RecordsScreen({ navigation }) {
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <View style={styles.headerBrand}>
          <MaterialCommunityIcons name="shield-plus" size={28} color="#FFFFFF" />
          <Text style={styles.appTitle}>MedSync</Text>
        </View>
      </View>
      
      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.searchBar}>
          <Ionicons name="search" size={20} color="#94A3B8" />
          <Text style={styles.searchText}>Search records...</Text>
        </View>

        <Text style={styles.sectionTitle}>Recent Lab Results</Text>
        
        <TouchableOpacity style={styles.recordCard}>
          <View style={styles.iconBox}>
            <FontAwesome5 name="file-medical-alt" size={20} color="#12418B" />
          </View>
          <View style={styles.recordInfo}>
            <Text style={styles.recordTitle}>Complete Blood Count</Text>
            <Text style={styles.recordDate}>May 10, 2026 • PathCare Labs</Text>
          </View>
          <Ionicons name="download-outline" size={24} color="#12418B" />
        </TouchableOpacity>

        <TouchableOpacity style={styles.recordCard}>
          <View style={styles.iconBox}>
            <FontAwesome5 name="x-ray" size={18} color="#12418B" />
          </View>
          <View style={styles.recordInfo}>
            <Text style={styles.recordTitle}>Chest X-Ray</Text>
            <Text style={styles.recordDate}>Feb 14, 2026 • City Hospital</Text>
          </View>
          <Ionicons name="download-outline" size={24} color="#12418B" />
        </TouchableOpacity>
        
        <Text style={styles.sectionTitle}>Prescriptions</Text>
        
        <TouchableOpacity style={styles.recordCard}>
          <View style={[styles.iconBox, { backgroundColor: '#FEF2F2' }]}>
            <MaterialCommunityIcons name="pill" size={24} color="#EF4444" />
          </View>
          <View style={styles.recordInfo}>
            <Text style={styles.recordTitle}>Amoxicillin 500mg</Text>
            <Text style={styles.recordDate}>Valid until Jun 01, 2026</Text>
          </View>
          <Ionicons name="chevron-forward" size={24} color="#CBD5E1" />
        </TouchableOpacity>
        
      </ScrollView>
      
      <BottomTabBar navigation={navigation} activeTab="Records" />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F8FAFC' },
  header: { backgroundColor: '#12418B', flexDirection: 'row', alignItems: 'center', paddingHorizontal: 20, paddingVertical: 15 },
  headerBrand: { flexDirection: 'row', alignItems: 'center' },
  appTitle: { color: '#FFFFFF', fontSize: 22, fontWeight: 'bold', marginLeft: 10 },
  content: { padding: 20 },
  searchBar: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#FFFFFF', padding: 12, borderRadius: 8, borderWidth: 1, borderColor: '#E2E8F0', marginBottom: 20 },
  searchText: { marginLeft: 10, color: '#94A3B8', fontSize: 15 },
  sectionTitle: { fontSize: 18, fontWeight: 'bold', color: '#162A4A', marginBottom: 15, marginTop: 10 },
  recordCard: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#FFFFFF', padding: 16, borderRadius: 12, borderWidth: 1, borderColor: '#E2E8F0', marginBottom: 12 },
  iconBox: { width: 48, height: 48, borderRadius: 8, backgroundColor: '#EFF6FF', alignItems: 'center', justifyContent: 'center', marginRight: 15 },
  recordInfo: { flex: 1 },
  recordTitle: { fontSize: 16, fontWeight: '600', color: '#162A4A', marginBottom: 4 },
  recordDate: { fontSize: 13, color: '#64748B' }
});
