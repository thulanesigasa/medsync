import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, SIZES, LAYOUT } from '../constants/theme';
import { useClinic } from '../context/ClinicContext';
import { useTheme } from '../context/ThemeContext';

export default function AllDoctorsScreen({ navigation, route }) {
  const { doctors } = useClinic();
  const { theme } = useTheme();
  
  const initialSpecialty = route?.params?.selectedSpecialty || 'All';
  const [activeSpecialty, setActiveSpecialty] = useState(initialSpecialty);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    if (route?.params?.selectedSpecialty) {
      setActiveSpecialty(route.params.selectedSpecialty);
    }
  }, [route?.params?.selectedSpecialty]);

  // Extract unique specialties from doctors
  const specialties = ['All', ...new Set(doctors.map(d => d.specialty).filter(Boolean))];

  const filteredDoctors = doctors.filter(doctor => {
    const matchesSearch = 
      doctor.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      doctor.specialty?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      doctor.clinic?.toLowerCase().includes(searchQuery.toLowerCase());
      
    const matchesSpecialty = 
      activeSpecialty === 'All' || 
      doctor.specialty?.toLowerCase() === activeSpecialty.toLowerCase();

    return matchesSearch && matchesSpecialty;
  });

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerContent}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
            <Ionicons name="arrow-back" size={24} color="#FFFFFF" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>All Doctors</Text>
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
        {/* Search Bar */}
        <View style={[styles.searchBar, { backgroundColor: theme.surface, borderColor: theme.border }]}>
          <Ionicons name="search" size={20} color="#94A3B8" />
          <TextInput 
            placeholder="Search by doctor, clinic, or specialty..." 
            style={[styles.searchInput, { color: theme.text }]} 
            placeholderTextColor="#94A3B8"
            value={searchQuery}
            onChangeText={setSearchQuery}
            autoCapitalize="none"
            autoCorrect={false}
          />
          {searchQuery.length > 0 && (
            <TouchableOpacity onPress={() => setSearchQuery('')}>
              <Ionicons name="close-circle" size={18} color="#94A3B8" />
            </TouchableOpacity>
          )}
        </View>

        {/* Specialty Filter Chips */}
        <View>
          <Text style={[styles.sectionSubtitle, { color: theme.subtext }]}>Filter by Specialty</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.filterChipsContainer}>
            {specialties.map(spec => (
              <TouchableOpacity 
                key={spec} 
                style={[
                  styles.filterChip, 
                  { backgroundColor: theme.surface, borderColor: theme.border }, 
                  activeSpecialty === spec && styles.filterChipActive
                ]}
                onPress={() => setActiveSpecialty(spec)}
              >
                <Text style={[
                  styles.filterChipText, 
                  { color: theme.subtext }, 
                  activeSpecialty === spec && styles.filterChipTextActive
                ]}>
                  {spec}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        {/* Doctors List */}
        <View style={styles.doctorsContainer}>
          <Text style={[styles.resultCountText, { color: theme.subtext }]}>
            Showing {filteredDoctors.length} doctor{filteredDoctors.length !== 1 ? 's' : ''}
          </Text>

          {filteredDoctors.length > 0 ? (
            filteredDoctors.map((doctor) => (
              <TouchableOpacity 
                key={doctor.id} 
                style={[styles.doctorCard, { backgroundColor: theme.surface, borderColor: theme.border }]}
                onPress={() => navigation.navigate("DoctorProfile", { doctor })}
              >
                <View style={styles.avatarContainer}>
                  <Text style={styles.avatarText}>{doctor.avatarText || 'D'}</Text>
                </View>
                <View style={styles.doctorInfo}>
                  <Text style={[styles.doctorName, { color: theme.text }]}>{doctor.name}</Text>
                  <Text style={[styles.doctorSpecialty, { color: theme.subtext }]}>{doctor.specialty}</Text>
                  
                  <View style={styles.ratingRow}>
                    <Ionicons name="star" size={14} color="#F59E0B" />
                    <Text style={[styles.ratingText, { color: theme.subtext }]}>
                      {doctor.rating} ({doctor.reviews} reviews)
                    </Text>
                  </View>

                  <Text style={[styles.doctorClinic, { color: theme.subtext }]}>{doctor.clinic}</Text>
                </View>

                <View style={styles.actionContainer}>
                  <TouchableOpacity 
                    style={styles.bookBtn}
                    onPress={() => navigation.navigate("Booking", { doctor })}
                  >
                    <Text style={styles.bookBtnText}>Book</Text>
                  </TouchableOpacity>
                </View>
              </TouchableOpacity>
            ))
          ) : (
            <View style={styles.emptyState}>
              <Ionicons name="people-outline" size={60} color="#94A3B8" />
              <Text style={[styles.emptyText, { color: theme.subtext }]}>No doctors found matching filters</Text>
            </View>
          )}
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
  content: {
    padding: SIZES.margin,
    gap: 20,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    height: 50,
    borderRadius: SIZES.radius,
    borderWidth: 1,
  },
  searchInput: {
    flex: 1,
    marginLeft: 10,
    fontSize: 15,
  },
  sectionSubtitle: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 8,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  filterChipsContainer: {
    flexDirection: 'row',
    gap: 8,
    paddingVertical: 4,
  },
  filterChip: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
  },
  filterChipActive: {
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primary,
  },
  filterChipText: {
    fontSize: 14,
    fontWeight: '500',
  },
  filterChipTextActive: {
    color: '#FFFFFF',
  },
  doctorsContainer: {
    gap: 12,
  },
  resultCountText: {
    fontSize: 13,
    fontWeight: '500',
    marginBottom: 4,
  },
  doctorCard: {
    flexDirection: 'row',
    borderRadius: SIZES.radius,
    padding: 12,
    borderWidth: 1,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.02,
    shadowRadius: 5,
    elevation: 1,
  },
  avatarContainer: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#E0E7FF',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  avatarText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: COLORS.primary,
  },
  doctorInfo: {
    flex: 1,
    justifyContent: 'center',
  },
  doctorName: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 2,
  },
  doctorSpecialty: {
    fontSize: 13,
    marginBottom: 4,
  },
  ratingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  ratingText: {
    fontSize: 12,
    marginLeft: 4,
    fontWeight: '500',
  },
  doctorClinic: {
    fontSize: 12,
  },
  actionContainer: {
    justifyContent: 'center',
  },
  bookBtn: {
    backgroundColor: COLORS.primary,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
  },
  bookBtnText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: 'bold',
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 40,
    gap: 12,
  },
  emptyText: {
    fontSize: 14,
    fontWeight: '500',
  },
});
