import React, { createContext, useState, useContext, useEffect } from "react";
import { supabase } from '../config/supabase';
import { useAuth } from './AuthContext';

const ChatContext = createContext();

export const ChatProvider = ({ children }) => {
  const { currentUser, isAuthLoaded } = useAuth();
  
  const [messages, setMessages] = useState([]);
  const [adminNotifications, setAdminNotifications] = useState([]);

  useEffect(() => {
    if (isAuthLoaded && currentUser) {
      fetchMessages();
      
      // Subscribe to real-time chat updates
      const channel = supabase
        .channel('public:messages')
        .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'messages' }, payload => {
          fetchMessages();
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
          sender:profiles!sender_id (id, full_name, role),
          receiver:profiles!receiver_id (id, full_name, role),
          clinics (name)
        `)
        .order('created_at', { ascending: true });

      if (error) throw error;

      if (data) {
        const formatted = data.map(m => {
          const isSenderAdmin = m.sender?.role === 'admin' || m.sender?.role === 'doctor' || m.sender?.role === 'receptionist' || m.sender?.role === 'hr';
          const patientName = isSenderAdmin ? m.receiver?.full_name : m.sender?.full_name;
          return {
            id: m.id,
            clinicName: m.clinics?.name,
            patientName: patientName || 'Patient',
            sender: isSenderAdmin ? 'admin' : 'patient',
            text: m.text_content,
            time: new Date(m.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          };
        });
        setMessages(formatted);
      }
    } catch (error) {
      console.log('Error fetching messages:', error.message);
    }
  };

  const sendMessage = async (clinicName, patientName, sender, text, apptId = null) => {
    if (!currentUser) {
      console.log('Cannot send message: No user is logged in.');
      return;
    }
    try {
      let clinicId = null;
      let receiverId = null;

      // Resolve clinicId
      if (clinicName) {
        const { data: clinic } = await supabase
          .from('clinics')
          .select('id')
          .ilike('name', `%${clinicName}%`)
          .limit(1);
        if (clinic && clinic.length > 0) {
          clinicId = clinic[0].id;
        }
      }

      // Resolve receiverId (patient) if sender is admin
      if (sender === 'admin' && patientName) {
        const { data: patientProfile } = await supabase
          .from('profiles')
          .select('id')
          .eq('role', 'patient')
          .ilike('full_name', `%${patientName}%`)
          .limit(1);
        if (patientProfile && patientProfile.length > 0) {
          receiverId = patientProfile[0].id;
        }
      }

      const { error } = await supabase
        .from('messages')
        .insert([{
          sender_id: currentUser.id,
          receiver_id: receiverId,
          clinic_id: clinicId,
          text_content: text
        }]);

      if (error) throw error;
      fetchMessages();
    } catch (error) {
      console.log('SendMessage error:', error.message);
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
