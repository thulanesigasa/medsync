import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, SafeAreaView, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation, useRoute } from '@react-navigation/native';

export default function TelehealthScreen() {
  const navigation = useNavigation();
  const route = useRoute();
  const doctorName = route.params?.doctorName || 'Doctor';
  
  const [isMuted, setIsMuted] = useState(false);
  const [isVideoOff, setIsVideoOff] = useState(false);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="chevron-down" size={32} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>End-to-end Encrypted</Text>
        <View style={{ width: 32 }} />
      </View>

      <View style={styles.videoContainer}>
        {/* Doctor Video Mock */}
        <View style={styles.mainVideo}>
          <Ionicons name="person" size={120} color="#334155" />
          <View style={styles.doctorInfoLabel}>
            <Text style={styles.doctorName}>Dr. {doctorName}</Text>
          </View>
        </View>

        {/* Patient Video Mock (PiP) */}
        <View style={styles.pipVideo}>
          {isVideoOff ? (
            <Ionicons name="videocam-off" size={40} color="#94A3B8" />
          ) : (
            <Image 
              source={{ uri: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=200&q=80' }} 
              style={styles.pipImage} 
            />
          )}
        </View>
      </View>

      <View style={styles.controlsContainer}>
        <TouchableOpacity 
          style={[styles.controlButton, isMuted && styles.controlButtonActive]}
          onPress={() => setIsMuted(!isMuted)}
        >
          <Ionicons name={isMuted ? "mic-off" : "mic"} size={28} color={isMuted ? "#3B82F6" : "#fff"} />
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={[styles.controlButton, isVideoOff && styles.controlButtonActive]}
          onPress={() => setIsVideoOff(!isVideoOff)}
        >
          <Ionicons name={isVideoOff ? "videocam-off" : "videocam"} size={28} color={isVideoOff ? "#3B82F6" : "#fff"} />
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={[styles.controlButton, { backgroundColor: '#EF4444' }]}
          onPress={() => navigation.goBack()}
        >
          <Ionicons name="call" size={28} color="#fff" />
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0F172A',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 10,
  },
  headerTitle: {
    color: '#10B981',
    fontSize: 14,
    fontWeight: '600',
  },
  videoContainer: {
    flex: 1,
    position: 'relative',
    margin: 16,
    borderRadius: 24,
    overflow: 'hidden',
    backgroundColor: '#1E293B',
  },
  mainVideo: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  doctorInfoLabel: {
    position: 'absolute',
    bottom: 20,
    left: 20,
    backgroundColor: 'rgba(0,0,0,0.6)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
  },
  doctorName: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  pipVideo: {
    position: 'absolute',
    top: 20,
    right: 20,
    width: 100,
    height: 140,
    backgroundColor: '#334155',
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#3B82F6',
    overflow: 'hidden',
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
  },
  pipImage: {
    width: '100%',
    height: '100%',
  },
  controlsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    alignItems: 'center',
    paddingVertical: 30,
    paddingHorizontal: 20,
  },
  controlButton: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: '#334155',
    justifyContent: 'center',
    alignItems: 'center',
  },
  controlButtonActive: {
    backgroundColor: '#EFF6FF',
  }
});
