import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, SIZES, LAYOUT } from '../constants/theme';
import { useClinic } from '../context/ClinicContext';

export default function ClinicsScreen({ navigation }) {
  const { clinics, doctors } = useClinic();
  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerContent}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
            <Ionicons name="arrow-back" size={24} color="#FFFFFF" />
          </TouchableOpacity>
          <Text style={styles.appTitle}>Clinics Near Me</Text>
          <View style={{ width: 24 }} />
        </View>
      </View>
      
      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.searchBar}>
          <Ionicons name="search" size={20} color="#94A3B8" />
          <TextInput placeholder="Search by name or specialty..." style={styles.searchInput} placeholderTextColor="#94A3B8" />
        </View>

        {clinics.map((clinic, index) => {
          const isDental = clinic.name.toLowerCase().includes('benoni');
          const isHeart = clinic.name.toLowerCase().includes('unjani');
          const iconName = isDental ? "heart" : (isHeart ? "pulse" : "medical");
          const ratingText = index === 0 ? '4.8 (120 reviews)' : (index === 1 ? '4.9 (85 reviews)' : '4.7 (95 reviews)');
          return (
            <TouchableOpacity 
              key={clinic.id} 
              style={styles.clinicCard} 
              onPress={() => {
                const clinicDoc = doctors?.find(d => d.clinic === clinic.name) || doctors?.[0];
                navigation.navigate('Booking', { doctor: clinicDoc });
              }}
            >
              <View style={styles.clinicImagePlaceholder}>
                <Ionicons name={iconName} size={32} color={COLORS.primary} />
              </View>
              <View style={styles.clinicInfo}>
                <Text style={styles.clinicName}>{clinic.name}</Text>
                <Text style={styles.clinicType}>{clinic.address} • Hours: {clinic.hours}</Text>
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

