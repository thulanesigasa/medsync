import React, { createContext, useState, useContext, useEffect } from "react";
import { supabase } from '../config/supabase';
import { useAuth } from './AuthContext';

const ChatContext = createContext();

export const ChatProvider = ({ children }) => {
  const { currentUser, isAuthLoaded } = useAuth();
  
  const [messages, setMessages] = useState([
    {
      id: "msg-1",
      clinicName: "Dawn Park Clinic",
      patientName: "Kiddo",
      apptId: "appt-1",
      sender: "admin",
      text: "Hello Kiddo! How are you feeling after your dentist appointment?",
      time: "09:00 AM",
    },
    {
      id: "msg-2",
      clinicName: "Dawn Park Clinic",
      patientName: "Kiddo",
      apptId: "appt-1",
      sender: "patient",
      text: "Much better, thank you! The pain has subsided.",
      time: "09:15 AM",
    },
    {
      id: "msg-3",
      clinicName: "Unjani Clinic Germiston",
      patientName: "Kiddo",
      apptId: "appt-2",
      sender: "admin",
      text: "Hi Kiddo, this is regarding your upcoming checkup.",
      time: "10:30 AM",
    },
    {
      id: "msg-4",
      clinicName: "Dawn Park Clinic",
      patientName: "Thabo Mokoena",
      apptId: null,
      sender: "admin",
      text: "Mr. Mokoena, please remember to bring your latest X-rays.",
      time: "11:00 AM",
    },
  ]);
  
  // Local state for admin notifications until Phase 2 Push Notifications are implemented
  const [adminNotifications, setAdminNotifications] = useState([
    {
      id: "alert-1",
      title: "New Booking Request",
      body: "Thabo Mokoena requested an appointment with Dr. Nkwanyana.",
      time: "2 mins ago",
      read: false,
    },
    {
      id: "alert-2",
      title: "Message Received",
      body: "Kiddo sent a new message regarding their recent checkup.",
      time: "1 hour ago",
      read: false,
    },
  ]);

  useEffect(() => {
    if (isAuthLoaded && currentUser && !currentUser.isMock) {
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

      if (error) {
         if (error.message.includes('URL') || error.message.includes('fetch')) throw new Error('FallbackToMock');
         throw error;
      }

      if (data && data.length > 0) {
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
      }
    } catch (error) {
      console.log('Error fetching messages (falling back to mock):', error.message);
    }
  };

  const sendMessage = async (clinicName, patientName, sender, text, apptId = null) => {
    if (!currentUser?.isMock) {
      try {
        const { error } = await supabase
          .from('messages')
          .insert([{
            sender_id: currentUser.id,
            text_content: text
          }]);

        if (!error) {
          fetchMessages();
          return;
        }
      } catch (error) {}
    }

    // Fallback Mock Logic
    const time = new Date().toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });

    setMessages((prev) => [
      ...prev,
      {
        id: `msg-${Date.now()}`,
        clinicName,
        patientName,
        apptId,
        sender,
        text,
        time,
      },
    ]);
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
