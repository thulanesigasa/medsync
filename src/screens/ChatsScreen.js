import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput, Modal, KeyboardAvoidingView, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, SIZES, LAYOUT } from '../constants/theme';
import BottomTabBar from '../components/BottomTabBar';
import { useStateContext } from '../context/StateContext';

export default function ChatsScreen({ navigation }) {
  const { currentUser, clinics, messages, sendMessage } = useStateContext();
  const [activeClinicName, setActiveClinicName] = useState(null);
  const [chatText, setChatText] = useState('');
  const [isDark, setIsDark] = useState(false);

  const patientName = currentUser?.name || 'Kiddo';

  const handleSendChatMessage = () => {
    if (!chatText.trim() || !activeClinicName) return;
    sendMessage(activeClinicName, patientName, 'patient', chatText.trim(), null);
    setChatText('');
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerContent}>
          <View style={styles.headerBrand}>
            <Ionicons name="chatbubbles" size={28} color="#FFFFFF" />
            <Text style={styles.appTitle}>My Chats</Text>
          </View>
          <TouchableOpacity onPress={() => setIsDark(!isDark)} style={styles.actionButton}>
            <Ionicons name={isDark ? "sunny-outline" : "moon-outline"} size={24} color="#FFFFFF" />
          </TouchableOpacity>
        </View>
      </View>

      {/* Main Content Area */}
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <Text style={styles.sectionTitle}>Clinic Support Channels</Text>
        <Text style={styles.sectionSubtitle}>Start a conversation with any of our branches for support.</Text>

        <View style={styles.channelsList}>
          {clinics.map((clinic) => {
            // Filter messages for this clinic and patient
            const clinicMsgs = messages.filter(
              m => m.clinicName.toLowerCase().includes(clinic.name.toLowerCase()) && 
                   m.patientName.toLowerCase() === patientName.toLowerCase()
            );
            const lastMsg = clinicMsgs[clinicMsgs.length - 1];

            // Get clinic icon name based on specialty keywords
            const nameLower = clinic.name.toLowerCase();
            const isDental = nameLower.includes('benoni');
            const isHeart = nameLower.includes('unjani');
            const iconName = isDental ? "heart" : (isHeart ? "pulse" : "medical");

            return (
              <TouchableOpacity 
                key={clinic.id} 
                style={styles.channelCard}
                onPress={() => setActiveClinicName(clinic.name)}
              >
                <View style={styles.channelIconContainer}>
                  <Ionicons name={iconName} size={24} color={COLORS.primary} />
                </View>
                
                <View style={styles.channelInfo}>
                  <View style={styles.channelHeaderRow}>
                    <Text style={styles.clinicName} numberOfLines={1}>{clinic.name}</Text>
                    {lastMsg ? (
                      <Text style={styles.messageTime}>{lastMsg.time}</Text>
                    ) : null}
                  </View>
                  
                  <Text style={styles.messageSnippet} numberOfLines={1}>
                    {lastMsg ? lastMsg.text : "No messages yet. Tap to start chatting."}
                  </Text>
                </View>
                
                <Ionicons name="chevron-forward" size={18} color="#94A3B8" style={styles.chevron} />
              </TouchableOpacity>
            );
          })}
        </View>
      </ScrollView>

      {/* -------------------- DETAIL CHAT MODAL -------------------- */}
      <Modal
        visible={activeClinicName !== null}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setActiveClinicName(null)}
      >
        <View style={styles.modalOverlay}>
          <KeyboardAvoidingView 
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            style={styles.chatModalContainer}
          >
            {/* Modal Header */}
            <View style={styles.modalHeader}>
              <TouchableOpacity 
                style={styles.modalBackBtn}
                onPress={() => setActiveClinicName(null)}
              >
                <Ionicons name="chevron-back" size={24} color={COLORS.primary} />
              </TouchableOpacity>
              <View style={styles.modalHeaderTitleBox}>
                <Text style={styles.modalTitle} numberOfLines={1}>{activeClinicName}</Text>
                <Text style={styles.modalSubtitle}>Support Live Chat</Text>
              </View>
              <TouchableOpacity style={styles.phoneBtn}>
                <Ionicons name="call-outline" size={20} color={COLORS.primary} />
              </TouchableOpacity>
            </View>

            {/* Message logs */}
            <ScrollView 
              contentContainerStyle={styles.chatMessageScroll}
              showsVerticalScrollIndicator={false}
              ref={ref => { if (ref) ref.scrollToEnd({ animated: true }); }}
            >
              {activeClinicName && messages
                .filter(
                  m => m.clinicName.toLowerCase().includes(activeClinicName.toLowerCase()) && 
                       m.patientName.toLowerCase() === patientName.toLowerCase()
                )
                .map((msg) => {
                  const isPatient = msg.sender === 'patient';
                  return (
                    <View 
                      key={msg.id} 
                      style={[
                        styles.messageBubbleContainer, 
                        isPatient ? styles.bubbleContainerRight : styles.bubbleContainerLeft
                      ]}
                    >
                      <View style={[
                        styles.messageBubble, 
                        isPatient ? styles.bubbleRight : styles.bubbleLeft
                      ]}>
                        <Text style={[
                          styles.messageText, 
                          isPatient ? styles.messageTextRight : styles.messageTextLeft
                        ]}>
                          {msg.text}
                        </Text>
                        <Text style={[
                          styles.messageTimeText, 
                          isPatient ? styles.messageTimeRight : styles.messageTimeLeft
                        ]}>
                          {msg.time}
                        </Text>
                      </View>
                    </View>
                  );
                })
              }
            </ScrollView>

            {/* Input Row */}
            <View style={styles.chatInputRow}>
              <TextInput
                placeholder="Type your message..."
                value={chatText}
                onChangeText={setChatText}
                style={styles.chatInputField}
                placeholderTextColor="#94A3B8"
              />
              <TouchableOpacity accessibilityLabel="send-button" style={styles.chatSendBtn} onPress={handleSendChatMessage}>
                <Ionicons name="send" size={18} color="#FFFFFF" />
              </TouchableOpacity>
            </View>
          </KeyboardAvoidingView>
        </View>
      </Modal>

      {/* Tab bar */}
      <BottomTabBar navigation={navigation} activeTab="Chats" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
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
    alignItems: 'center',
    gap: 10,
  },
  appTitle: {
    color: '#FFFFFF',
    fontSize: 22,
    fontWeight: 'bold',
  },
  actionButton: {
    padding: 4,
  },
  content: {
    padding: SIZES.margin,
    paddingBottom: 120, // Accommodate bottom floating tab bar
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: COLORS.primary,
    marginTop: 8,
  },
  sectionSubtitle: {
    fontSize: 13,
    color: '#64748B',
    marginTop: 4,
    marginBottom: 20,
  },
  channelsList: {
    gap: 12,
  },
  channelCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.surface,
    borderRadius: 20,
    padding: 16,
    borderWidth: 1,
    borderColor: '#EAE8FC',
    shadowColor: '#0F2C59',
    shadowOpacity: 0.03,
    shadowRadius: 10,
    elevation: 2,
  },
  channelIconContainer: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#EFF6FF',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  channelInfo: {
    flex: 1,
    gap: 4,
  },
  channelHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingRight: 8,
  },
  clinicName: {
    fontSize: 15,
    fontWeight: 'bold',
    color: COLORS.primary,
    maxWidth: '75%',
  },
  messageTime: {
    fontSize: 10,
    color: '#94A3B8',
    fontWeight: '500',
  },
  messageSnippet: {
    fontSize: 13,
    color: '#64748B',
  },
  chevron: {
    marginLeft: 4,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(15, 44, 89, 0.4)',
    justifyContent: 'flex-end',
  },
  chatModalContainer: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    height: '85%',
    paddingBottom: Platform.OS === 'ios' ? 24 : 12,
  },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
  },
  modalBackBtn: {
    padding: 4,
    marginRight: 10,
  },
  modalHeaderTitleBox: {
    flex: 1,
  },
  modalTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: COLORS.primary,
  },
  modalSubtitle: {
    fontSize: 11,
    color: '#94A3B8',
    marginTop: 2,
    fontWeight: '500',
  },
  phoneBtn: {
    padding: 8,
    borderRadius: 20,
    backgroundColor: '#F1F5F9',
  },
  chatMessageScroll: {
    padding: 16,
    gap: 12,
  },
  messageBubbleContainer: {
    flexDirection: 'row',
    width: '100%',
  },
  bubbleContainerLeft: {
    justifyContent: 'flex-start',
  },
  bubbleContainerRight: {
    justifyContent: 'flex-end',
  },
  messageBubble: {
    maxWidth: '75%',
    borderRadius: 16,
    paddingHorizontal: 14,
    paddingVertical: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 1,
    elevation: 1,
  },
  bubbleLeft: {
    backgroundColor: '#F1F5F9',
    borderTopLeftRadius: 4,
  },
  bubbleRight: {
    backgroundColor: COLORS.primary,
    borderTopRightRadius: 4,
  },
  messageText: {
    fontSize: 14,
    lineHeight: 18,
  },
  messageTextLeft: {
    color: COLORS.primary,
  },
  messageTextRight: {
    color: '#FFFFFF',
  },
  messageTimeText: {
    fontSize: 9,
    marginTop: 4,
    fontWeight: '500',
    textAlign: 'right',
  },
  messageTimeLeft: {
    color: '#94A3B8',
  },
  messageTimeRight: {
    color: '#BFDBFE',
  },
  chatInputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: '#F1F5F9',
    gap: 8,
  },
  chatInputField: {
    flex: 1,
    backgroundColor: '#F8FAFC',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: 14,
    paddingHorizontal: 14,
    paddingVertical: Platform.OS === 'ios' ? 12 : 8,
    color: COLORS.primary,
    fontSize: 14,
  },
  chatSendBtn: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: COLORS.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
