import React from 'react';
import { View, Text, StyleSheet, SafeAreaView, ScrollView, TouchableOpacity } from 'react-native';
import { MaterialCommunityIcons, Ionicons } from '@expo/vector-icons';
import BottomTabBar from '../components/BottomTabBar';

export default function ProfileScreen({ navigation }) {
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <View style={styles.headerBrand}>
          <MaterialCommunityIcons name="shield-plus" size={28} color="#FFFFFF" />
          <Text style={styles.appTitle}>MedSync</Text>
        </View>
      </View>
      
      <ScrollView contentContainerStyle={styles.content}>
        
        <View style={styles.profileHeader}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>K</Text>
          </View>
          <Text style={styles.profileName}>Kiddo</Text>
          <Text style={styles.profileEmail}>kiddo@hokmatech.com</Text>
          <TouchableOpacity style={styles.editBtn}>
            <Text style={styles.editBtnText}>Edit Profile</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.menuSection}>
          <TouchableOpacity style={styles.menuItem}>
            <View style={[styles.menuIconBox, { backgroundColor: '#EFF6FF' }]}>
              <Ionicons name="person-outline" size={20} color="#12418B" />
            </View>
            <Text style={styles.menuText}>Personal Information</Text>
            <Ionicons name="chevron-forward" size={20} color="#CBD5E1" />
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.menuItem}>
            <View style={[styles.menuIconBox, { backgroundColor: '#F0FDF4' }]}>
              <Ionicons name="card-outline" size={20} color="#22C55E" />
            </View>
            <Text style={styles.menuText}>Payment Methods</Text>
            <Ionicons name="chevron-forward" size={20} color="#CBD5E1" />
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.menuItem}>
            <View style={[styles.menuIconBox, { backgroundColor: '#FEF2F2' }]}>
              <Ionicons name="shield-checkmark-outline" size={20} color="#EF4444" />
            </View>
            <Text style={styles.menuText}>Insurance Details</Text>
            <Ionicons name="chevron-forward" size={20} color="#CBD5E1" />
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.menuItem}>
            <View style={[styles.menuIconBox, { backgroundColor: '#F8FAFC' }]}>
              <Ionicons name="settings-outline" size={20} color="#64748B" />
            </View>
            <Text style={styles.menuText}>Settings</Text>
            <Ionicons name="chevron-forward" size={20} color="#CBD5E1" />
          </TouchableOpacity>
        </View>

        <TouchableOpacity style={styles.logoutBtn}>
          <Ionicons name="log-out-outline" size={20} color="#EF4444" />
          <Text style={styles.logoutText}>Log Out</Text>
        </TouchableOpacity>

      </ScrollView>
      
      <BottomTabBar navigation={navigation} activeTab="Profile" />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F8FAFC' },
  header: { backgroundColor: '#12418B', flexDirection: 'row', alignItems: 'center', paddingHorizontal: 20, paddingVertical: 15 },
  headerBrand: { flexDirection: 'row', alignItems: 'center' },
  appTitle: { color: '#FFFFFF', fontSize: 22, fontWeight: 'bold', marginLeft: 10 },
  content: { padding: 20 },
  profileHeader: { alignItems: 'center', marginBottom: 30, marginTop: 10 },
  avatar: { width: 90, height: 90, borderRadius: 45, backgroundColor: '#12418B', alignItems: 'center', justifyContent: 'center', marginBottom: 15 },
  avatarText: { fontSize: 32, fontWeight: 'bold', color: '#FFFFFF' },
  profileName: { fontSize: 22, fontWeight: 'bold', color: '#162A4A', marginBottom: 5 },
  profileEmail: { fontSize: 15, color: '#64748B', marginBottom: 15 },
  editBtn: { backgroundColor: '#EFF6FF', paddingHorizontal: 20, paddingVertical: 8, borderRadius: 20 },
  editBtnText: { color: '#12418B', fontWeight: '600' },
  menuSection: { backgroundColor: '#FFFFFF', borderRadius: 12, borderWidth: 1, borderColor: '#E2E8F0', paddingVertical: 5, marginBottom: 30 },
  menuItem: { flexDirection: 'row', alignItems: 'center', padding: 15, borderBottomWidth: 1, borderBottomColor: '#F1F5F9' },
  menuIconBox: { width: 36, height: 36, borderRadius: 8, alignItems: 'center', justifyContent: 'center', marginRight: 15 },
  menuText: { flex: 1, fontSize: 16, color: '#162A4A', fontWeight: '500' },
  logoutBtn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', backgroundColor: '#FEF2F2', padding: 16, borderRadius: 12, borderWidth: 1, borderColor: '#FECACA' },
  logoutText: { color: '#EF4444', fontSize: 16, fontWeight: 'bold', marginLeft: 10 }
});
