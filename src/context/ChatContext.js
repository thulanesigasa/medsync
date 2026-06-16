import React, { createContext, useState, useContext, useEffect } from "react";
import { supabase } from '../config/supabase';
import { useAuth } from './AuthContext';

const ChatContext = createContext();

export const ChatProvider = ({ children }) => {
  const { currentUser, isAuthLoaded } = useAuth();
  const [messages, setMessages] = useState([]);
  
  // Local state for admin notifications until Phase 2 Push Notifications are implemented
  const [adminNotifications, setAdminNotifications] = useState([]);

  useEffect(() => {
    if (isAuthLoaded && currentUser) {
      fetchMessages();
      
      // Subscribe to real-time chat updates
      const channel = supabase
        .channel('public:messages')
        .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'messages' }, payload => {
          fetchMessages(); // Simple refetch or optimistic append
        })
        .subscribe();

      return () => {
        supabase.removeChannel(channel);
      };
    }
  }, [isAuthLoaded, currentUser]);

  const fetchMessages = async () => {
    try {
      const { data, error } = await supabase
        .from('messages')
        .select(`
          id,
          text_content,
          created_at,
          profiles!sender_id (id, full_name, role),
          clinics (name)
        `)
        .order('created_at', { ascending: true });

      if (error) throw error;

      const formatted = data.map(m => {
        const isSenderAdmin = m.profiles.role === 'admin' || m.profiles.role === 'doctor';
        return {
          id: m.id,
          clinicName: m.clinics?.name,
          patientName: m.profiles?.full_name, // If admin sent it, this is admin name. In real app we'd join receiver_id too.
          sender: isSenderAdmin ? 'admin' : 'patient',
          text: m.text_content,
          time: new Date(m.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        };
      });

      setMessages(formatted);
    } catch (error) {
      console.log('Error fetching messages:', error);
    }
  };

  const sendMessage = async (clinicName, patientName, sender, text, apptId = null) => {
    // We would need the exact clinic UUID here instead of name in a full implementation,
    // for this mockup context rewrite we just send the text.
    try {
      const { error } = await supabase
        .from('messages')
        .insert([{
          sender_id: currentUser.id,
          // clinic_id: clinic_id,
          // receiver_id: receiver_id,
          text_content: text
        }]);

      if (error) throw error;
      fetchMessages();
    } catch (error) {
      console.log('Error sending message:', error);
    }
  };

  const addAdminNotification = (notif) => {
    setAdminNotifications((prev) => [
      {
        id: `alert-${Date.now()}`,
        read: false,
        ...notif,
      },
      ...prev,
    ]);
  };

  const clearNotifications = () => {
    setAdminNotifications([]);
  };

  return (
    <ChatContext.Provider
      value={{
        messages,
        sendMessage,
        adminNotifications,
        addAdminNotification,
        clearNotifications,
      }}
    >
      {children}
    </ChatContext.Provider>
  );
};

export const useChat = () => useContext(ChatContext);
