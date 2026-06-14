import React, { createContext, useState, useContext } from "react";

const ChatContext = createContext();

export const ChatProvider = ({ children }) => {
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

  const sendMessage = (clinicName, patientName, sender, text, apptId = null) => {
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
