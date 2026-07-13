import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput, Platform } from 'react-native';
import { MaterialCommunityIcons, Ionicons, FontAwesome5 } from '@expo/vector-icons';
import { COLORS, SIZES, LAYOUT } from '../constants/theme';
import BottomTabBar from '../components/BottomTabBar';
import { useClinic } from '../context/ClinicContext';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { useTheme } from '../context/ThemeContext';
import { ActivityIndicator } from 'react-native';

export default function RecordsScreen({ navigation }) {
  const { updates, patients } = useClinic();
  const { currentUser } = useAuth();
  const { showToast } = useToast();
  const { theme, isDark } = useTheme();
  const [activeCategory, setActiveCategory] = useState('All');
  const [downloadingId, setDownloadingId] = useState(null);
  const [refillingId, setRefillingId] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');

  const categories = ['All', 'Schedules', 'Vaccines', 'Campaigns'];

  const currentUserData = patients?.find(p => p.name.toLowerCase() === currentUser?.name?.toLowerCase());
  const myRecords = currentUserData?.medicalNotes || [];

  const handleDownload = (recordId) => {
    setDownloadingId(recordId);
    setTimeout(() => {
      setDownloadingId(null);
      showToast("Medical Record downloaded successfully!", "success", "Download Complete");
    }, 1500);
  };

  const handleRefill = (prescId) => {
    setRefillingId(prescId);
    setTimeout(() => {
      setRefillingId(null);
      showToast("Refill request sent to clinic pharmacy.", "success", "Request Sent");
    }, 1500);
  };



  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerContent}>
          <View style={styles.headerBrand}>
            <MaterialCommunityIcons name="shield-plus" size={28} color="#FFFFFF" />
            <Text style={styles.appTitle}>MedSync</Text>
          </View>
          <View style={styles.headerActions}>
            <TouchableOpacity
              style={styles.bellIconContainer}
              onPress={() => navigation.navigate("Notifications")}
            >
              <Ionicons name="notifications-outline" size={24} color="#FFFFFF" />
              <View style={styles.badge} />
            </TouchableOpacity>
          </View>
        </View>
      </View>
      
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <View style={[styles.searchBar, { backgroundColor: theme.surface, borderColor: theme.border }]}>
          <Ionicons name="search" size={20} color="#94A3B8" />
          <TextInput
            style={{ color: theme.text, flex: 1, marginLeft: 10, paddingVertical: Platform.OS === 'ios' ? 8 : 4, fontSize: 15 }}
            placeholder="Search clinic updates..."
            placeholderTextColor="#94A3B8"
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
        </View>



        {/* Categories Scroll */}
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.categoriesScroll}>
          {categories.map((cat, index) => {
            const isActive = activeCategory === cat;
            return (
              <TouchableOpacity 
                key={index} 
                style={[styles.categoryBtn, { backgroundColor: theme.surface, borderColor: theme.border }, isActive && styles.categoryBtnActive]}
                onPress={() => setActiveCategory(cat)}
              >
                <Text style={[styles.categoryBtnText, { color: theme.subtext }, isActive && styles.categoryBtnTextActive]}>
                  {cat}
                </Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>

        <Text style={[styles.sectionTitle, { color: theme.text }]}>Local Clinic Bulletins</Text>

        {updates.length === 0 ? (
          <View style={[styles.emptyBulletinsCard, { backgroundColor: theme.surface, borderColor: theme.border }]}>
            <Ionicons name="megaphone-outline" size={36} color="#94A3B8" style={{ marginBottom: 10 }} />
            <Text style={[styles.emptyBulletinsTitle, { color: theme.text }]}>No Bulletins Yet</Text>
            <Text style={[styles.emptyBulletinsDesc, { color: theme.subtext }]}>
              Clinic announcements, schedule changes, and health campaigns will appear here once published by your clinic.
            </Text>
          </View>
        ) : (
          <View style={styles.bulletinsContainer}>
            {updates
              .filter(item => {
                const matchesCategory = activeCategory === 'All' ||
                  (activeCategory === 'Campaigns' && item.category === 'Campaign') ||
                  item.category.toLowerCase() === activeCategory.toLowerCase();
                const matchesSearch = !searchQuery.trim() ||
                  item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                  item.desc.toLowerCase().includes(searchQuery.toLowerCase()) ||
                  item.clinic.toLowerCase().includes(searchQuery.toLowerCase());
                return matchesCategory && matchesSearch;
              })
              .map((item) => (
                <View key={item.id} style={[styles.updateCard, { backgroundColor: theme.surface, borderColor: theme.border }]}>
                  <View style={styles.iconBox}>
                    <Ionicons
                      name={
                        item.category === 'Schedules' ? 'time' :
                        item.category === 'Vaccines' ? 'medical' :
                        item.category === 'Notice' ? 'pulse' : 'megaphone'
                      }
                      size={22}
                      color={COLORS.primary}
                    />
                  </View>
                  <View style={styles.updateInfo}>
                    <Text style={[styles.updateTitle, { color: theme.text }]}>{item.title}</Text>
                    <Text style={[styles.updateDesc, { color: theme.subtext }]}>{item.desc}</Text>
                    <Text style={[styles.updateDate, { color: theme.subtext }]}>{item.date} • {item.clinic}</Text>
                  </View>
                </View>
              ))}
          </View>
        )}

        {myRecords.length > 0 && (
          <>
            <Text style={[styles.sectionTitle, { marginTop: 20, color: theme.text }]}>My Medical Records</Text>
            <View style={styles.bulletinsContainer}>
              {myRecords.map((record, index) => (
                <View key={index} style={[styles.updateCard, { backgroundColor: theme.surface, borderColor: theme.border }]}>
                  <View style={[styles.iconBox, { backgroundColor: '#F0FDF4' }]}>
                    <Ionicons name="document-text" size={22} color="#10B981" />
                  </View>
                  <View style={styles.updateInfo}>
                    <Text style={[styles.updateTitle, { color: theme.text }]}>{record.diagnosis}</Text>
                    <Text style={[styles.updateDesc, { color: theme.subtext }]}>Dr. {record.doctorName} • {record.clinicName}</Text>
                    <Text style={[styles.updateDate, { color: theme.subtext }]}>{record.date}</Text>
                  </View>
                  <TouchableOpacity 
                    style={styles.downloadBtn} 
                    onPress={() => handleDownload(index)}
                    disabled={downloadingId === index}
                  >
                    {downloadingId === index ? (
                      <ActivityIndicator size="small" color={COLORS.primary} />
                    ) : (
                      <Ionicons name="download-outline" size={24} color={COLORS.primary} />
                    )}
                  </TouchableOpacity>
                </View>
              ))}
            </View>

            <Text style={[styles.sectionTitle, { marginTop: 20, color: theme.text }]}>Active Prescriptions</Text>
            <View style={styles.bulletinsContainer}>
              {activePrescriptions.map((presc) => (
                <View key={presc.id} style={[styles.updateCard, { backgroundColor: theme.surface, borderColor: theme.border }]}>
                  <View style={[styles.iconBox, { backgroundColor: '#EFF6FF' }]}>
                    <Ionicons name="medical" size={22} color="#3B82F6" />
                  </View>
                  <View style={styles.updateInfo}>
                    <Text style={[styles.updateTitle, { color: theme.text }]}>{presc.name}</Text>
                    <Text style={[styles.updateDesc, { color: theme.subtext }]}>{presc.dosage}</Text>
                    <Text style={[styles.updateDate, { color: '#F59E0B' }]}>{presc.remaining}</Text>
                  </View>
                  <TouchableOpacity 
                    style={[styles.downloadBtn, { backgroundColor: '#3B82F6', width: 'auto', paddingHorizontal: 12, borderRadius: 20 }]} 
                    onPress={() => handleRefill(presc.id)}
                    disabled={refillingId === presc.id}
                  >
                    {refillingId === presc.id ? (
                      <ActivityIndicator size="small" color="#fff" />
                    ) : (
                      <Text style={{ color: '#fff', fontSize: 12, fontWeight: 'bold' }}>Refill</Text>
                    )}
                  </TouchableOpacity>
                </View>
              ))}
            </View>
          </>
        )}
        
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
  },
  bellIconContainer: {
    position: 'relative',
    padding: 4,
  },
  badge: {
    position: 'absolute',
    top: 4,
    right: 4,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#EF4444',
    borderWidth: 1,
    borderColor: COLORS.primary,
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
  featuredCard: {
    backgroundColor: COLORS.primary,
    borderRadius: 20,
    padding: 16,
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 4,
  },
  featuredBadge: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
    alignSelf: 'flex-start',
    marginBottom: 10,
  },
  featuredBadgeText: {
    color: '#FFFFFF',
    fontSize: 11,
    fontWeight: 'bold',
  },
  featuredTitle: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 6,
  },
  featuredDesc: {
    color: '#EAE8FC',
    fontSize: 13,
    lineHeight: 18,
    marginBottom: 14,
  },
  featuredBtn: {
    backgroundColor: '#FFFFFF',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 12,
    alignSelf: 'flex-start',
    gap: 6,
  },
  featuredBtnText: {
    color: COLORS.primary,
    fontSize: 12,
    fontWeight: 'bold',
  },
  categoriesScroll: {
    paddingVertical: 4,
    gap: 8,
  },
  categoryBtn: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 16,
    backgroundColor: COLORS.surface,
    borderWidth: 1,
    borderColor: '#EAE8FC',
  },
  categoryBtnActive: {
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primary,
  },
  categoryBtnText: {
    color: COLORS.primary,
    fontSize: 12,
    fontWeight: '600',
  },
  categoryBtnTextActive: {
    color: '#FFFFFF',
  },
  sectionTitle: { 
    fontSize: 18, 
    fontWeight: 'bold', 
    color: COLORS.primary, 
    marginTop: 8,
    marginBottom: -4,
  },
  bulletinsContainer: {
    gap: 12,
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
    borderRadius: 24, 
    backgroundColor: '#EFF6FF', 
    alignItems: 'center', 
    justifyContent: 'center', 
    marginRight: 15 
  },
  updateInfo: { 
    flex: 1 
  },
  updateTitle: { 
    fontSize: 15, 
    fontWeight: 'bold', 
    color: COLORS.primary, 
    marginBottom: 4 
  },
  updateDesc: { 
    fontSize: 13, 
    color: '#475569',
    lineHeight: 18,
    marginBottom: 6,
  },
  updateDate: { 
    fontSize: 11, 
    color: '#94A3B8',
    fontWeight: '500',
  },
  downloadBtn: {
    padding: 10,
    backgroundColor: '#F8FAFC',
    borderRadius: 12,
    marginLeft: 10,
  },
  emptyBulletinsCard: {
    borderRadius: SIZES.radius,
    borderWidth: 1,
    padding: 28,
    alignItems: 'center',
    marginTop: 4,
  },
  emptyBulletinsTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 8,
    textAlign: 'center',
  },
  emptyBulletinsDesc: {
    fontSize: 13,
    lineHeight: 20,
    textAlign: 'center',
    color: '#94A3B8',
  },
});
