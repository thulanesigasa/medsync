import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, SIZES, LAYOUT } from '../constants/theme';
import { useClinic } from '../context/ClinicContext';
import { useTheme } from '../context/ThemeContext';
import MapView, { Marker } from 'react-native-maps';

export default function ClinicsScreen({ navigation }) {
  const { clinics, doctors } = useClinic();
  const { theme } = useTheme();
  const [activeFilter, setActiveFilter] = useState('All');
  
  const filters = ['All', 'Top Rated', 'Closest Distance', 'Open Now'];

  const getSortedClinics = () => {
    let sorted = [...clinics];
    if (activeFilter === 'Top Rated') {
      sorted.reverse(); // Just mock sorting for now
    } else if (activeFilter === 'Closest Distance') {
      sorted = [sorted[1], sorted[0], ...sorted.slice(2)];
    } else if (activeFilter === 'Open Now') {
      sorted = sorted.filter(c => c.hours.includes('24/7') || c.hours.includes('Mon-Sat'));
    }
    return sorted;
  };

  const displayedClinics = getSortedClinics();

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerContent}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
            <Ionicons name="arrow-back" size={24} color="#FFFFFF" />
          </TouchableOpacity>
          <Text style={styles.appTitle}>Clinics Near Me</Text>
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
      
      <ScrollView contentContainerStyle={styles.content}>
        <View style={[styles.searchBar, { backgroundColor: theme.surface, borderColor: theme.border }]}>
          <Ionicons name="search" size={20} color="#94A3B8" />
          <TextInput placeholder="Search by name or specialty..." style={[styles.searchInput, { color: theme.text }]} placeholderTextColor="#94A3B8" />
        </View>

        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.filterChipsContainer}>
          {filters.map(filter => (
            <TouchableOpacity 
              key={filter} 
              style={[styles.filterChip, { backgroundColor: theme.surface, borderColor: theme.border }, activeFilter === filter && styles.filterChipActive]}
              onPress={() => setActiveFilter(filter)}
            >
              <Text style={[styles.filterChipText, { color: theme.subtext }, activeFilter === filter && styles.filterChipTextActive]}>
                {filter}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        <View style={styles.mapContainer}>
          <MapView 
            style={styles.map}
            initialRegion={{
              latitude: -26.1906,
              longitude: 28.2612,
              latitudeDelta: 0.1,
              longitudeDelta: 0.1,
            }}
          >
            {clinics.map((clinic, index) => {
              const coords = [
                { latitude: -26.182, longitude: 28.243 },
                { latitude: -26.191, longitude: 28.312 },
                { latitude: -26.205, longitude: 28.256 },
                { latitude: -26.180, longitude: 28.280 },
              ];
              const coord = coords[index % coords.length];
              return (
                <Marker
                  key={clinic.id}
                  coordinate={coord}
                  title={clinic.name}
                  description={clinic.address}
                />
              );
            })}
          </MapView>
        </View>

        {displayedClinics.map((clinic, index) => {
          const isDental = clinic.name.toLowerCase().includes('benoni');
          const isHeart = clinic.name.toLowerCase().includes('unjani');
          const iconName = isDental ? "heart" : (isHeart ? "pulse" : "medical");
          const ratingText = index === 0 ? '4.8 (120 reviews)' : (index === 1 ? '4.9 (85 reviews)' : '4.7 (95 reviews)');
          return (
            <TouchableOpacity 
              key={clinic.id} 
              style={[styles.clinicCard, { backgroundColor: theme.surface, borderColor: theme.border }]} 
              onPress={() => {
                const clinicDoc = doctors?.find(d => d.clinic === clinic.name) || doctors?.[0];
                navigation.navigate('Booking', { doctor: clinicDoc });
              }}
            >
              <View style={styles.clinicImagePlaceholder}>
                <Ionicons name={iconName} size={32} color={COLORS.primary} />
              </View>
              <View style={styles.clinicInfo}>
                <Text style={[styles.clinicName, { color: theme.text }]}>{clinic.name}</Text>
                <Text style={[styles.clinicType, { color: theme.subtext }]}>{clinic.address} • Hours: {clinic.hours}</Text>
                <View style={styles.ratingRow}>
                  <Ionicons name="star" size={14} color="#F59E0B" />
                  <Text style={styles.ratingText}>{ratingText}</Text>
                </View>
              </View>
            </TouchableOpacity>
          );
        })}
      </ScrollView>
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
    fontFamily: "System",
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
  backButton: {
    padding: 4,
  },
  appTitle: { 
    color: '#FFFFFF', 
    fontSize: 20, 
    fontWeight: 'bold' 
  },
  content: { 
    padding: SIZES.margin,
    gap: SIZES.gutter,
  },
  searchBar: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    backgroundColor: COLORS.surface, 
    paddingHorizontal: 12, 
    paddingVertical: 10, 
    borderRadius: SIZES.radius, 
    borderWidth: 1, 
    borderColor: COLORS.border, 
  },
  mapContainer: {
    height: 200,
    borderRadius: SIZES.radius,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  map: {
    flex: 1,
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
    backgroundColor: COLORS.surface,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  filterChipActive: {
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primary,
  },
  filterChipText: {
    color: '#64748B',
    fontSize: 14,
    fontWeight: '500',
  },
  filterChipTextActive: {
    color: '#FFFFFF',
  },
  searchInput: { 
    flex: 1, 
    marginLeft: 10, 
    fontSize: 15, 
    color: COLORS.primary, 
    outlineStyle: 'none' 
  },
  clinicCard: { 
    flexDirection: 'row', 
    backgroundColor: COLORS.surface, 
    borderRadius: SIZES.radius, 
    padding: 12, 
    borderWidth: 1, 
    borderColor: COLORS.border, 
    shadowColor: '#000', 
    shadowOpacity: 0.03, 
    shadowRadius: 5, 
    elevation: 1 
  },
  clinicImagePlaceholder: { 
    width: 80, 
    height: 80, 
    backgroundColor: '#EFF6FF', 
    borderRadius: 8, 
    alignItems: 'center', 
    justifyContent: 'center', 
    marginRight: 15 
  },
  clinicInfo: { 
    flex: 1, 
    justifyContent: 'center' 
  },
  clinicName: { 
    fontSize: 16, 
    fontWeight: 'bold', 
    color: COLORS.primary, 
    marginBottom: 4 
  },
  clinicType: { 
    fontSize: 13, 
    color: '#64748B', 
    marginBottom: 6 
  },
  ratingRow: { 
    flexDirection: 'row', 
    alignItems: 'center' 
  },
  ratingText: { 
    fontSize: 12, 
    color: '#64748B', 
    marginLeft: 4, 
    fontWeight: '500' 
  }
});

