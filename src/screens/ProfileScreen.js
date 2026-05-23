import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { MaterialCommunityIcons, Ionicons } from '@expo/vector-icons';
import { COLORS, SIZES, LAYOUT } from '../constants/theme';
import BottomTabBar from '../components/BottomTabBar';

export default function ProfileScreen({ navigation }) {
  const [isDark, setIsDark] = useState(false);

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerContent}>
          <View style={styles.headerBrand}>
            <MaterialCommunityIcons name="shield-plus" size={28} color="#FFFFFF" />
            <Text style={styles.appTitle}>MedSync</Text>
          </View>
          <View style={styles.headerActions}>
            <TouchableOpacity onPress={() => setIsDark(!isDark)} style={styles.actionButton}>
              <Ionicons name={isDark ? "sunny-outline" : "moon-outline"} size={24} color="#FFFFFF" />
            </TouchableOpacity>
          </View>
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
              <Ionicons name="person-outline" size={20} color={COLORS.primary} />
            </View>
            <Text style={styles.menuText}>Personal Information</Text>
            <Ionicons name="chevron-forward" size={20} color="#CBD5E1" />
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.menuItem}>
            <View style={[styles.menuIconBox, { backgroundColor: '#EFF6FF' }]}>
              <Ionicons name="card-outline" size={20} color={COLORS.primary} />
            </View>
            <Text style={styles.menuText}>Payment Methods</Text>
            <Ionicons name="chevron-forward" size={20} color="#CBD5E1" />
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.menuItem}>
            <View style={[styles.menuIconBox, { backgroundColor: '#EFF6FF' }]}>
              <Ionicons name="shield-checkmark-outline" size={20} color={COLORS.primary} />
            </View>
            <Text style={styles.menuText}>Insurance Details</Text>
            <Ionicons name="chevron-forward" size={20} color="#CBD5E1" />
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.menuItem}>
            <View style={[styles.menuIconBox, { backgroundColor: '#EFF6FF' }]}>
              <Ionicons name="settings-outline" size={20} color={COLORS.primary} />
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
    paddingBottom: 110,
    gap: SIZES.gutter,
  },
  profileHeader: { 
    alignItems: 'center', 
    marginBottom: 10, 
    marginTop: 10 
  },
  avatar: { 
    width: 90, 
    height: 90, 
    borderRadius: 45, 
    backgroundColor: COLORS.primary, 
    alignItems: 'center', 
    justifyContent: 'center', 
    marginBottom: 15 
  },
  avatarText: { 
    fontSize: 32, 
    fontWeight: 'bold', 
    color: '#FFFFFF' 
  },
  profileName: { 
    fontSize: 22, 
    fontWeight: 'bold', 
    color: COLORS.primary, 
    marginBottom: 5 
  },
  profileEmail: { 
    fontSize: 15, 
    color: '#64748B', 
    marginBottom: 15 
  },
  editBtn: { 
    backgroundColor: '#EFF6FF', 
    paddingHorizontal: 20, 
    paddingVertical: 8, 
    borderRadius: 20 
  },
  editBtnText: { 
    color: COLORS.primary, 
    fontWeight: '600' 
  },
  menuSection: { 
    backgroundColor: COLORS.surface, 
    borderRadius: SIZES.radius, 
    borderWidth: 1, 
    borderColor: COLORS.border, 
    paddingVertical: 5, 
  },
  menuItem: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    padding: 15, 
    borderBottomWidth: 1, 
    borderBottomColor: '#F1F5F9' 
  },
  menuIconBox: { 
    width: 36, 
    height: 36, 
    borderRadius: 8, 
    alignItems: 'center', 
    justifyContent: 'center', 
    marginRight: 15 
  },
  menuText: { 
    flex: 1, 
    fontSize: 16, 
    color: COLORS.primary, 
    fontWeight: '500' 
  },
  logoutBtn: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    justifyContent: 'center', 
    backgroundColor: '#FEF2F2', 
    padding: 16, 
    borderRadius: SIZES.radius, 
    borderWidth: 1, 
    borderColor: '#FECACA' 
  },
  logoutText: { 
    color: '#EF4444', 
    fontSize: 16, 
    fontWeight: 'bold', 
    marginLeft: 10 
  }
});

