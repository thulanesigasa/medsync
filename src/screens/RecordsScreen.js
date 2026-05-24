import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { MaterialCommunityIcons, Ionicons, FontAwesome5 } from '@expo/vector-icons';
import { COLORS, SIZES, LAYOUT } from '../constants/theme';
import BottomTabBar from '../components/BottomTabBar';
import { useStateContext } from '../context/StateContext';

export default function RecordsScreen({ navigation }) {
  const { updates } = useStateContext();
  const [isDark, setIsDark] = useState(false);
  const [activeCategory, setActiveCategory] = useState('All');

  const categories = ['All', 'Schedules', 'Vaccines', 'Campaigns'];

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
        <View style={styles.searchBar}>
          <Ionicons name="search" size={20} color="#94A3B8" />
          <Text style={styles.searchText}>Search clinic updates...</Text>
        </View>

        {/* Featured Announcement Card */}
        <View style={styles.featuredCard}>
          <View style={styles.featuredBadge}>
            <Text style={styles.featuredBadgeText}>Featured</Text>
          </View>
          <Text style={styles.featuredTitle}>Free Flu Vaccine Drive 2026</Text>
          <Text style={styles.featuredDesc}>
            Walk-ins are now welcome at Unjani Clinic Germiston for the annual influenza vaccine. Protect your family this winter season.
          </Text>
          <TouchableOpacity style={styles.featuredBtn}>
            <Text style={styles.featuredBtnText}>Learn More</Text>
            <Ionicons name="arrow-forward" size={16} color={COLORS.primary} />
          </TouchableOpacity>
        </View>

        {/* Categories Scroll */}
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.categoriesScroll}>
          {categories.map((cat, index) => {
            const isActive = activeCategory === cat;
            return (
              <TouchableOpacity 
                key={index} 
                style={[styles.categoryBtn, isActive && styles.categoryBtnActive]}
                onPress={() => setActiveCategory(cat)}
              >
                <Text style={[styles.categoryBtnText, isActive && styles.categoryBtnTextActive]}>
                  {cat}
                </Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>

        <Text style={styles.sectionTitle}>Local Clinic Bulletins</Text>
        
        <View style={styles.bulletinsContainer}>
          {updates
            .filter(item => {
              if (activeCategory === 'All') return true;
              if (activeCategory === 'Campaigns') return item.category === 'Campaign';
              return item.category.toLowerCase() === activeCategory.toLowerCase();
            })
            .map((item) => (
              <View key={item.id} style={styles.updateCard}>
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
                  <Text style={styles.updateTitle}>{item.title}</Text>
                  <Text style={styles.updateDesc}>{item.desc}</Text>
                  <Text style={styles.updateDate}>{item.date} • {item.clinic}</Text>
                </View>
              </View>
            ))
          }
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
  }
});
