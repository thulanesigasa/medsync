import React, { createContext, useState, useContext, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { COLORS } from "../constants/theme";

const StateContext = createContext();

export const StateProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);

  const [isDark, setIsDark] = useState(false);

  const theme = isDark
    ? {
        background: "#0F172A",

        surface: "#1E293B",

        text: "#F8FAFC",

        subtext: "#CBD5E1",

        border: "#334155",

        primary: COLORS.primary,
      }
    : {
        background: COLORS.background,

        surface: COLORS.surface,

        text: COLORS.primary,

        subtext: "#64748B",

        border: "#EAE8FC",

        primary: COLORS.primary,
      };

  const toggleTheme = () => {
    setIsDark((prev) => !prev);
  };

  const [userAccounts, setUserAccounts] = useState([
    {
      name: "Kiddo",
      email: "patient@medsync.co.za",
      password: "password123",
      role: "patient",
      phone: "071 234 5678",
    },
    {
      name: "Dawn Park Clinic Admin",
      email: "admin@dawnpark.co.za",
      password: "admin123",
      role: "admin",
      clinic: "Dawn Park Clinic",
    },
  ]);
  useEffect(() => {
    loadUserAccounts();
  }, []);

  useEffect(() => {
    saveUserAccounts();
  }, [userAccounts]);

  const loadUserAccounts = async () => {
    try {
      const storedAccounts = await AsyncStorage.getItem("userAccounts");

      if (storedAccounts) {
        setUserAccounts(JSON.parse(storedAccounts));
      }
    } catch (error) {
      console.log("Error loading user accounts:", error);
    }
  };

  const saveUserAccounts = async () => {
    try {
      await AsyncStorage.setItem("userAccounts", JSON.stringify(userAccounts));
    } catch (error) {
      console.log("Error saving user accounts:", error);
    }
  };

  const [clinics, setClinics] = useState([
    {
      id: "clinic-1",
      name: "Dawn Park Clinic",
      address: "Cason Road Boksburg 1459",
      phone: "011 862 1007",
      hours: "08:00 - 17:00",
      website: "www.dawnparkclinic.co.za",
      slotDuration: 30,
    },
    {
      id: "clinic-2",
      name: "Benoni Health Centre",
      address: "54 Harpur Avenue Benoni 1501",
      phone: "011 845 3564",
      hours: "08:30 - 17:00",
      website: "https://benonihealth.co.za",
      slotDuration: 30,
    },
    {
      id: "clinic-3",
      name: "Unjani Clinic Germiston",
      address: "250 Victoria Street Germiston 1401",
      phone: "011 776 9151",
      hours: "08:00 - 17:00",
      website: "http://www.unjaniclinic.co.za",
      slotDuration: 30,
    },
  ]);

  const [doctors, setDoctors] = useState([
    {
      id: "doc-1",
      name: "Dr. Chris Nkwanyana",
      specialty: "Dentist Specialist",
      clinic: "Dawn Park Clinic",
      avatarText: "C",
      rating: "4.8",
      reviews: "64",
      shifts: {
        Mon: true,
        Tue: true,
        Wed: true,
        Thu: true,
        Fri: true,
        Sat: false,
        Sun: false,
      },
    },
    {
      id: "doc-2",
      name: "Dr. Lerato Mokoena",
      specialty: "General Practitioner",
      clinic: "Dawn Park Clinic",
      avatarText: "L",
      rating: "4.9",
      reviews: "110",
      shifts: {
        Mon: true,
        Tue: true,
        Wed: true,
        Thu: true,
        Fri: true,
        Sat: true,
        Sun: false,
      },
    },
    {
      id: "doc-3",
      name: "Dr. Pieter Naude",
      specialty: "Senior Surgeon",
      clinic: "Benoni Health Centre",
      avatarText: "P",
      rating: "5.0",
      reviews: "95",
      shifts: {
        Mon: true,
        Tue: false,
        Wed: true,
        Thu: false,
        Fri: true,
        Sat: false,
        Sun: false,
      },
    },
    {
      id: "doc-4",
      name: "Dr. Sipho Gumede",
      specialty: "Senior Cardiologist",
      clinic: "Unjani Clinic Germiston",
      avatarText: "S",
      rating: "5.0",
      reviews: "120",
      shifts: {
        Mon: true,
        Tue: true,
        Wed: true,
        Thu: true,
        Fri: true,
        Sat: false,
        Sun: false,
      },
    },
  ]);

  const [patients, setPatients] = useState([
    {
      id: "pat-1",
      name: "Kiddo",
      email: "patient@medsync.co.za",
      phone: "071 234 5678",
      medicalNotes: [
        {
          id: "note-mock-1",
          date: "2026-04-12",
          doctorName: "Dr. Lerato Mokoena",
          clinicName: "Unjani Clinic Germiston",
          diagnosis: "Acute Seasonal Influenza",
          treatment:
            "Prescribed Paracetamol & Cough Syrup. Recommended 3 days rest.",
          notes:
            "Patient was showing mild dehydration. Advised to increase fluid intake.",
        },
      ],
    },
    {
      id: "pat-2",
      name: "Thabo Mokoena",
      email: "thabo@gmail.com",
      phone: "083 456 7890",
      medicalNotes: [],
    },
    {
      id: "pat-3",
      name: "Pieter van der Merwe",
      email: "pieter@webmail.co.za",
      phone: "072 987 6543",
      medicalNotes: [],
    },
  ]);

  const [appointments, setAppointments] = useState([
    {
      id: "appt-1",
      patientName: "Kiddo",
      doctorName: "Dr. Chris Nkwanyana",
      doctorTitle: "Dentist Specialist",
      clinicName: "Dawn Park Clinic",
      date: "2026-05-28",
      time: "10:00 AM",
      type: "Dentist Appointment",
      status: "Confirmed",
    },
    {
      id: "appt-2",
      patientName: "Kiddo",
      doctorName: "Dr. Lerato Mokoena",
      doctorTitle: "General Practitioner",
      clinicName: "Unjani Clinic Germiston",
      date: "2026-04-12",
      time: "02:30 PM",
      type: "General Checkup",
      status: "Confirmed",
    },
  ]);

  const [updates, setUpdates] = useState([
    {
      id: "updt-1",
      title: "Dr. Lerato Mokoena's Saturday Shift",
      desc: "GP checkups will be available on Saturdays from 8:00 AM - 12:00 PM at Dawn Park Clinic, Boksburg.",
      date: "Posted today",
      clinic: "Dawn Park Clinic",
      category: "Schedules",
    },
    {
      id: "updt-2",
      title: "Benoni Health Centre Dental Wing",
      desc: "Our expanded dental wing opens next Monday. Specialized care for all family members at 54 Harpur Ave, Benoni.",
      date: "Posted yesterday",
      clinic: "Benoni Health Centre",
      category: "Campaign",
    },
    {
      id: "updt-3",
      title: "Dr. Sipho Gumede Summit Notice",
      desc: "Dr. Gumede will be away at the South African Cardiology Summit (28 May - 2 Jun). Appointments during this period will be rescheduled.",
      date: "Posted 4 days ago",
      clinic: "Unjani Clinic Germiston",
      category: "Notice",
    },
    {
      id: "updt-4",
      title: "Germiston Vaccine Drive Extended",
      desc: "Free winter immunization drive at Unjani Clinic Germiston is extended until the end of next week. Walk-ins welcome.",
      date: "Posted 5 days ago",
      clinic: "Unjani Clinic Germiston",
      category: "Vaccines",
    },
  ]);

  const [messages, setMessages] = useState([
    {
      id: "msg-1",
      clinicName: "Dawn Park Clinic",
      patientName: "Kiddo",
      apptId: "appt-1",
      sender: "admin",
      text: "Hello Kiddo, please note that for your teeth extraction check, you need to arrive 10 minutes early.",
      time: "09:00 AM",
    },
    {
      id: "msg-2",
      clinicName: "Benoni Health Centre",
      patientName: "Kiddo",
      apptId: null,
      sender: "admin",
      text: "Welcome to Benoni Health Centre chat support. Let us know how we can assist you.",
      time: "08:30 AM",
    },
    {
      id: "msg-3",
      clinicName: "Unjani Clinic Germiston",
      patientName: "Kiddo",
      apptId: null,
      sender: "admin",
      text: "Hello Kiddo, thank you for reaching out to Unjani Clinic Germiston support.",
      time: "10:15 AM",
    },
  ]);

  const [adminNotifications, setAdminNotifications] = useState([
    {
      id: "alert-1",
      title: "Welcome Admin!",
      body: "Dawn Park Clinic management portal is fully online.",
      time: "Just now",
      read: false,
    },
  ]);

  const isValidEmail = (email) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  const addAppointment = (newAppt) => {
    const id = `appt-${Date.now()}`;
    const newAppointment = {
      id,
      status: "Pending",
      ...newAppt,
    };

    setAppointments((prev) => [newAppointment, ...prev]);

    addAdminNotification({
      title: "New Booking Request",
      body: `${newAppt.patientName} requested an appointment with ${newAppt.doctorName}.`,
      time: "Just now",
    });
  };

  const updateAppointmentStatus = (id, status) => {
    setAppointments((prev) =>
      prev.map((appt) => (appt.id === id ? { ...appt, status } : appt)),
    );

    const targetAppt = appointments.find((a) => a.id === id);

    if (targetAppt) {
      addAdminNotification({
        title: `Appointment ${status}`,
        body: `Booking for ${targetAppt.patientName} with ${
          targetAppt.doctorName
        } is now ${status.toLowerCase()}.`,
        time: "Just now",
      });
    }
  };

  const addUpdate = (newUpdate) => {
    setUpdates((prev) => [
      {
        id: `updt-${Date.now()}`,
        date: "Posted just now",
        ...newUpdate,
      },
      ...prev,
    ]);
  };

  const deleteUpdate = (id) => {
    setUpdates((prev) => prev.filter((up) => up.id !== id));
  };

  const addDoctor = (newDoc) => {
    setDoctors((prev) => [
      {
        id: `doc-${Date.now()}`,
        avatarText: newDoc.name.replace("Dr. ", "").charAt(0),
        rating: "5.0",
        reviews: "0",
        shifts: {
          Mon: true,
          Tue: true,
          Wed: true,
          Thu: true,
          Fri: true,
          Sat: false,
          Sun: false,
        },
        ...newDoc,
      },
      ...prev,
    ]);
  };

  const updateDoctorShift = (id, day, value) => {
    setDoctors((prev) =>
      prev.map((doc) =>
        doc.id === id
          ? {
              ...doc,
              shifts: {
                ...doc.shifts,
                [day]: value,
              },
            }
          : doc,
      ),
    );
  };

  const updateClinicSettings = (clinicName, updatedFields) => {
    setClinics((prev) =>
      prev.map((clinic) =>
        clinic.name === clinicName ? { ...clinic, ...updatedFields } : clinic,
      ),
    );
  };

  const addMedicalNote = (patientName, noteFields) => {
    setPatients((prev) =>
      prev.map((pat) =>
        pat.name.toLowerCase() === patientName.toLowerCase()
          ? {
              ...pat,
              medicalNotes: [
                {
                  id: `note-${Date.now()}`,
                  date: new Date().toISOString().split("T")[0],
                  ...noteFields,
                },
                ...pat.medicalNotes,
              ],
            }
          : pat,
      ),
    );
  };

  const sendMessage = (
    clinicName,
    patientName,
    sender,
    text,
    apptId = null,
  ) => {
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

  const login = (email, password, role, clinic = "") => {
    const cleanEmail = email.trim().toLowerCase();

    if (!isValidEmail(cleanEmail)) {
      return {
        success: false,
        message: "Please enter a valid email address.",
      };
    }

    const user = userAccounts.find(
      (account) =>
        account.email.toLowerCase() === cleanEmail && account.role === role,
    );

    if (!user) {
      return {
        success: false,
        message: "Account not found. Please sign up first.",
      };
    }

    if (user.password !== password) {
      return {
        success: false,
        message: "Incorrect password.",
      };
    }

    if (role === "admin" && user.clinic !== clinic) {
      return {
        success: false,
        message: "Incorrect clinic selected for this admin account.",
      };
    }

    setCurrentUser({
      name: user.name,
      email: user.email,
      role: user.role,
      clinic: user.clinic || "",
      phone: user.phone || "",
    });

    return {
      success: true,
      user,
    };
  };

  const signup = (name, email, phone, password, role, clinic = "") => {
    const cleanEmail = email.trim().toLowerCase();

    if (!isValidEmail(cleanEmail)) {
      return {
        success: false,
        message: "Please enter a valid email address.",
      };
    }

    if (!password || password.length < 6) {
      return {
        success: false,
        message: "Password must be at least 6 characters long.",
      };
    }

    const existingUser = userAccounts.find(
      (account) => account.email.toLowerCase() === cleanEmail,
    );

    if (existingUser) {
      return {
        success: false,
        message: "An account with this email already exists.",
      };
    }

    const newUser = {
      name: role === "admin" ? `${clinic} Admin` : name,
      email: cleanEmail,
      password,
      role,
      clinic: role === "admin" ? clinic : "",
      phone,
    };

    setUserAccounts((prev) => [...prev, newUser]);

    if (role === "patient") {
      setPatients((prev) => [
        ...prev,
        {
          id: `pat-${Date.now()}`,
          name,
          email: cleanEmail,
          phone,
          medicalNotes: [],
        },
      ]);
    }

    setCurrentUser({
      name: newUser.name,
      email: newUser.email,
      role: newUser.role,
      clinic: newUser.clinic,
      phone: newUser.phone,
    });

    return {
      success: true,
      user: newUser,
    };
  };

  const resetPassword = (email, newPassword, role) => {
    const cleanEmail = email.trim().toLowerCase();

    if (!isValidEmail(cleanEmail)) {
      return {
        success: false,
        message: "Please enter a valid email address.",
      };
    }

    if (!newPassword || newPassword.length < 6) {
      return {
        success: false,
        message: "New password must be at least 6 characters long.",
      };
    }

    const userExists = userAccounts.find(
      (account) =>
        account.email.toLowerCase() === cleanEmail && account.role === role,
    );

    if (!userExists) {
      return {
        success: false,
        message: "No account found with this email.",
      };
    }

    setUserAccounts((prev) =>
      prev.map((account) =>
        account.email.toLowerCase() === cleanEmail && account.role === role
          ? { ...account, password: newPassword }
          : account,
      ),
    );

    return {
      success: true,
      message: "Password reset successful.",
    };
  };
  const updateCurrentUser = (updatedFields) => {
    setCurrentUser((prev) => ({
      ...prev,
      ...updatedFields,
    }));
  };
  const logout = () => {
    setCurrentUser(null);
  };

  return (
    <StateContext.Provider
      value={{
        currentUser,
        userAccounts,
        clinics,
        doctors,
        patients,
        appointments,
        updates,
        messages,
        adminNotifications,
        addAppointment,
        updateAppointmentStatus,
        addUpdate,
        deleteUpdate,
        addDoctor,
        updateDoctorShift,
        updateClinicSettings,
        addMedicalNote,
        sendMessage,
        addAdminNotification,
        clearNotifications,
        login,
        signup,
        resetPassword,
        logout,
        isDark,
        theme,
        toggleTheme,
        updateCurrentUser,
      }}
    >
      {children}
    </StateContext.Provider>
  );
};

export const useStateContext = () => {
  const context = useContext(StateContext);

  if (!context) {
    throw new Error("useStateContext must be used within a StateProvider");
  }

  return context;
};
