import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { MaterialCommunityIcons, Ionicons, FontAwesome5 } from '@expo/vector-icons';
import { COLORS, SIZES, LAYOUT } from '../constants/theme';
import BottomTabBar from '../components/BottomTabBar';

export default function RecordsScreen({ navigation }) {
  const [isDark, setIsDark] = useState(false);

  return (
    <View style={styles.container}>
      {/* Header with platform heights */}
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
        <View style={styles.searchBar}>
          <Ionicons name="search" size={20} color="#94A3B8" />
          <Text style={styles.searchText}>Search clinic updates...</Text>
        </View>

        <Text style={styles.sectionTitle}>Clinic Bulletins & News</Text>
        
        <View style={styles.updateCard}>
          <View style={[styles.iconBox, { backgroundColor: '#EFF6FF' }]}>
            <Ionicons name="time" size={22} color={COLORS.primary} />
          </View>
          <View style={styles.updateInfo}>
            <Text style={styles.updateTitle}>Dr. Smith's Saturday Shifts</Text>
            <Text style={styles.updateDesc}>General checkups will be available on Saturdays from 8:00 AM - 12:00 PM starting next week.</Text>
            <Text style={styles.updateDate}>Posted today • Scheduling</Text>
          </View>
        </View>

        <View style={styles.updateCard}>
          <View style={[styles.iconBox, { backgroundColor: '#F0FDF4' }]}>
            <Ionicons name="megaphone" size={22} color={COLORS.success} />
          </View>
          <View style={styles.updateInfo}>
            <Text style={styles.updateTitle}>New Pediatrics Wing Launch</Text>
            <Text style={styles.updateDesc}>Our brand new Pediatrics Department opens on June 1st, featuring state-of-the-art care for children.</Text>
            <Text style={styles.updateDate}>Posted yesterday • Announcement</Text>
          </View>
        </View>

        <View style={styles.updateCard}>
          <View style={[styles.iconBox, { backgroundColor: '#FFFBEB' }]}>
            <Ionicons name="shield-checkmark" size={22} color="#D97706" />
          </View>
          <View style={styles.updateInfo}>
            <Text style={styles.updateTitle}>Free Flu Vaccine Drive</Text>
            <Text style={styles.updateDesc}>Annual flu shots are now available for all clinic members. Walk-ins welcome daily between 9 AM and 4 PM.</Text>
            <Text style={styles.updateDate}>Posted 3 days ago • Campaign</Text>
          </View>
        </View>

        <View style={styles.updateCard}>
          <View style={[styles.iconBox, { backgroundColor: '#FEF2F2' }]}>
            <Ionicons name="warning" size={22} color="#EF4444" />
          </View>
          <View style={styles.updateInfo}>
            <Text style={styles.updateTitle}>Cardiology Clinic Adjustments</Text>
            <Text style={styles.updateDesc}>Dr. Chris Nkwanyana will be away attending a medical summit from May 28 to June 2. Normal schedules resume June 3.</Text>
            <Text style={styles.updateDate}>Posted 4 days ago • Clinic Notice</Text>
          </View>
        </View>
        
      </ScrollView>
      
      <BottomTabBar navigation={navigation} activeTab="Records" />
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
  searchBar: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    backgroundColor: COLORS.surface, 
    padding: 12, 
    borderRadius: SIZES.radius, 
    borderWidth: 1, 
    borderColor: COLORS.border,
  },
  searchText: { 
    marginLeft: 10, 
    color: '#94A3B8', 
    fontSize: 15 
  },
  sectionTitle: { 
    fontSize: 18, 
    fontWeight: 'bold', 
    color: COLORS.primary, 
    marginTop: 8,
    marginBottom: -4,
  },
  updateCard: { 
    flexDirection: 'row', 
    backgroundColor: COLORS.surface, 
    padding: 16, 
    borderRadius: SIZES.radius, 
    borderWidth: 1, 
    borderColor: COLORS.border,
    shadowColor: '#000',
    shadowOpacity: 0.02,
    shadowRadius: 5,
    elevation: 1,
    alignItems: 'flex-start',
  },
  iconBox: { 
    width: 48, 
    height: 48, 
    borderRadius: 8, 
    alignItems: 'center', 
    justifyContent: 'center', 
    marginRight: 15 
  },
  updateInfo: { 
    flex: 1 
  },
  updateTitle: { 
    fontSize: 16, 
    fontWeight: '600', 
    color: COLORS.primary, 
    marginBottom: 4 
  },
  updateDesc: { 
    fontSize: 14, 
    color: '#475569',
    lineHeight: 20,
    marginBottom: 6,
  },
  updateDate: { 
    fontSize: 12, 
    color: '#94A3B8',
    fontWeight: '500',
  }
});


