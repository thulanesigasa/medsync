import React, { createContext, useState, useContext } from "react";
import { useChat } from "./ChatContext"; // We'll need to call addAdminNotification from here or just decouple it. Wait, ChatContext handles adminNotifications. I should probably import useChat to get addAdminNotification.

const AppointmentContext = createContext();

export const AppointmentProvider = ({ children }) => {
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

  // We will expose a way to inject addAdminNotification if we don't want circular dependencies or hook issues inside Provider
  // Alternatively, just use another context hook here.
  const { addAdminNotification } = useChat();

  const addAppointment = (newAppt) => {
    const id = `appt-${Date.now()}`;
    const newAppointment = {
      id,
      status: "Pending",
      ...newAppt,
    };

    setAppointments((prev) => [newAppointment, ...prev]);

    if (addAdminNotification) {
      addAdminNotification({
        title: "New Booking Request",
        body: `${newAppt.patientName} requested an appointment with ${newAppt.doctorName}.`,
        time: "Just now",
      });
    }
  };

  const updateAppointmentStatus = (id, status) => {
    setAppointments((prev) =>
      prev.map((appt) => (appt.id === id ? { ...appt, status } : appt)),
    );

    const targetAppt = appointments.find((a) => a.id === id);

    if (targetAppt && addAdminNotification) {
      addAdminNotification({
        title: `Appointment ${status}`,
        body: `Booking for ${targetAppt.patientName} with ${
          targetAppt.doctorName
        } is now ${status.toLowerCase()}.`,
        time: "Just now",
      });
    }
  };

  return (
    <AppointmentContext.Provider
      value={{
        appointments,
        addAppointment,
        updateAppointmentStatus,
      }}
    >
      {children}
    </AppointmentContext.Provider>
  );
};

export const useAppointment = () => useContext(AppointmentContext);
