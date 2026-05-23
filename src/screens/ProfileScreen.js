import React, { useState, useRef, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Animated, Platform } from 'react-native';
import { MaterialCommunityIcons, Ionicons } from '@expo/vector-icons';
import { COLORS, SIZES, LAYOUT } from '../constants/theme';
import BottomTabBar from '../components/BottomTabBar';

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
  const [isDark, setIsDark] = useState(false);
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);

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

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        
        {/* Premium Profile Card */}
        <View style={styles.premiumProfileCard}>
          <View style={styles.cardTopRow}>
            <View style={styles.avatarContainer}>
              <View style={styles.avatar}>
                <Text style={styles.avatarText}>K</Text>
              </View>
              <View style={styles.verifiedBadge}>
                <Ionicons name="checkmark" size={12} color="#FFFFFF" />
              </View>
            </View>
            
            <View style={styles.profileMeta}>
              <Text style={styles.profileName}>Kiddo</Text>
              <Text style={styles.profileEmail}>kiddo@hokmatech.com</Text>
              
              <View style={styles.goldBadge}>
                <Ionicons name="ribbon" size={13} color="#D97706" style={{ marginRight: 4 }} />
                <Text style={styles.goldBadgeText}>Gold Care Member</Text>
              </View>
            </View>
          </View>

          <TouchableOpacity style={styles.editBtn}>
            <Text style={styles.editBtnText}>Edit Profile Details</Text>
            <Ionicons name="create-outline" size={16} color={COLORS.primary} />
          </TouchableOpacity>
        </View>

        {/* Section 1: Account Settings */}
        <Text style={styles.sectionHeader}>ACCOUNT SETTINGS</Text>
        <View style={styles.menuSection}>
          <TouchableOpacity style={styles.menuItem}>
            <View style={styles.menuIconBox}>
              <Ionicons name="person-outline" size={20} color={COLORS.primary} />
            </View>
            <Text style={styles.menuText}>Personal Information</Text>
            <Ionicons name="chevron-forward" size={18} color="#94A3B8" />
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.menuItem}>
            <View style={styles.menuIconBox}>
              <Ionicons name="card-outline" size={20} color={COLORS.primary} />
            </View>
            <Text style={styles.menuText}>Payment Methods</Text>
            <Ionicons name="chevron-forward" size={18} color="#94A3B8" />
          </TouchableOpacity>
          
          <TouchableOpacity style={[styles.menuItem, { borderBottomWidth: 0 }]}>
            <View style={styles.menuIconBox}>
              <Ionicons name="shield-checkmark-outline" size={20} color={COLORS.primary} />
            </View>
            <Text style={styles.menuText}>Insurance Details</Text>
            <Ionicons name="chevron-forward" size={18} color="#94A3B8" />
          </TouchableOpacity>
        </View>

        {/* Section 2: Preferences */}
        <Text style={styles.sectionHeader}>PREFERENCES</Text>
        <View style={styles.menuSection}>
          <View style={styles.menuItemNonClickable}>
            <View style={styles.menuIconBox}>
              <Ionicons name="notifications-outline" size={20} color={COLORS.primary} />
            </View>
            <Text style={styles.menuText}>Push Notifications</Text>
            <CustomSwitch 
              value={notificationsEnabled} 
              onValueChange={setNotificationsEnabled} 
            />
          </View>
          
          <TouchableOpacity style={styles.menuItem}>
            <View style={styles.menuIconBox}>
              <Ionicons name="globe-outline" size={20} color={COLORS.primary} />
            </View>
            <Text style={styles.menuText}>Language</Text>
            <View style={styles.rightValueContainer}>
              <Text style={styles.rightValueText}>English (SA)</Text>
              <Ionicons name="chevron-forward" size={18} color="#94A3B8" />
            </View>
          </TouchableOpacity>

          <TouchableOpacity style={[styles.menuItem, { borderBottomWidth: 0 }]} onPress={() => setIsDark(!isDark)}>
            <View style={styles.menuIconBox}>
              <Ionicons name={isDark ? "sunny-outline" : "moon-outline"} size={20} color={COLORS.primary} />
            </View>
            <Text style={styles.menuText}>Dark Mode (Visual Mock)</Text>
            <Text style={styles.rightValueText}>{isDark ? 'ON' : 'OFF'}</Text>
          </TouchableOpacity>
        </View>

        {/* Section 3: Support */}
        <Text style={styles.sectionHeader}>HELP & SUPPORT</Text>
        <View style={styles.menuSection}>
          <TouchableOpacity style={styles.menuItem}>
            <View style={styles.menuIconBox}>
              <Ionicons name="help-circle-outline" size={20} color={COLORS.primary} />
            </View>
            <Text style={styles.menuText}>Help Center & FAQ</Text>
            <Ionicons name="chevron-forward" size={18} color="#94A3B8" />
          </TouchableOpacity>

          <TouchableOpacity style={[styles.menuItem, { borderBottomWidth: 0 }]}>
            <View style={styles.menuIconBox}>
              <Ionicons name="document-text-outline" size={20} color={COLORS.primary} />
            </View>
            <Text style={styles.menuText}>Terms of Service & Privacy Policy</Text>
            <Ionicons name="chevron-forward" size={18} color="#94A3B8" />
          </TouchableOpacity>
        </View>

        {/* Logout Button */}
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
  }
});
