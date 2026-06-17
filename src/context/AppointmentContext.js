import React, { createContext, useState, useContext, useEffect } from "react";
import { supabase } from '../config/supabase';
import { useAuth } from './AuthContext';
import { useChat } from "./ChatContext";

const AppointmentContext = createContext();

export const AppointmentProvider = ({ children }) => {
  const { currentUser, isAuthLoaded } = useAuth();
  const { addAdminNotification } = useChat();
  
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

  useEffect(() => {
    if (isAuthLoaded && currentUser && !currentUser.isMock) {
      fetchAppointments();
    }
  }, [isAuthLoaded, currentUser]);

  const fetchAppointments = async () => {
    try {
      const { data, error } = await supabase
        .from('appointments')
        .select(`
          id,
          appointment_date,
          appointment_time,
          status,
          type,
          reason_for_visit,
          profiles (full_name),
          clinic_staff (title, profiles (full_name)),
          clinics (name)
        `);

      if (error) {
         if (error.message.includes('URL') || error.message.includes('fetch')) throw new Error('FallbackToMock');
         throw error;
      }

      if (data && data.length > 0) {
        const formatted = data.map(appt => ({
          id: appt.id,
          patientName: appt.profiles?.full_name || 'Patient',
          doctorName: appt.clinic_staff?.profiles?.full_name || 'Doctor',
          doctorTitle: appt.clinic_staff?.title || 'Specialist',
          clinicName: appt.clinics?.name || 'Clinic',
          date: appt.appointment_date,
          time: appt.appointment_time,
          type: appt.type,
          status: appt.status,
        }));
        setAppointments(formatted);
      }
    } catch (error) {
      console.log('Error fetching appointments (falling back to mock):', error.message);
    }
  };

  const addAppointment = async (newAppt) => {
    if (!currentUser?.isMock) {
      try {
        const { error } = await supabase
          .from('appointments')
          .insert([{
            patient_id: currentUser.id,
            doctor_id: newAppt.doctorId || null,
            clinic_id: newAppt.clinicId || null,
            appointment_date: newAppt.date,
            appointment_time: newAppt.time,
            type: newAppt.type || 'In-person',
            status: 'Pending'
          }]);

        if (!error) {
          fetchAppointments();
          return;
        }
      } catch (error) {}
    }

    // Fallback Mock Logic
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

  const updateAppointmentStatus = async (id, status) => {
    if (!currentUser?.isMock && !id.startsWith('appt-')) {
      try {
        const { error } = await supabase
          .from('appointments')
          .update({ status })
          .eq('id', id);

        if (!error) {
          fetchAppointments();
          return;
        }
      } catch (error) {}
    }

    // Fallback Mock Logic
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
        fetchAppointments,
        addAppointment,
        updateAppointmentStatus,
      }}
    >
      {children}
    </AppointmentContext.Provider>
  );
};

export const useAppointment = () => useContext(AppointmentContext);
