import React, { createContext, useState, useContext, useEffect } from "react";
import { supabase } from '../config/supabase';
import { useAuth } from './AuthContext';
import { useChat } from "./ChatContext";

const AppointmentContext = createContext();

export const AppointmentProvider = ({ children }) => {
  const { currentUser, isAuthLoaded } = useAuth();
  const { addAdminNotification } = useChat();
  const [appointments, setAppointments] = useState([]);

  useEffect(() => {
    if (isAuthLoaded && currentUser) {
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

      if (error) throw error;

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
    } catch (error) {
      console.log('Error fetching appointments:', error);
    }
  };

  const addAppointment = async (newAppt) => {
    try {
      const { data, error } = await supabase
        .from('appointments')
        .insert([{
          patient_id: currentUser.id,
          doctor_id: newAppt.doctorId, // Assuming doctorId is passed now instead of just name
          clinic_id: newAppt.clinicId, // Assuming clinicId is passed
          appointment_date: newAppt.date,
          appointment_time: newAppt.time,
          type: newAppt.type || 'In-person',
          status: 'Pending'
        }]);

      if (error) throw error;

      fetchAppointments();

      if (addAdminNotification) {
        addAdminNotification({
          title: "New Booking Request",
          body: `New appointment requested with ${newAppt.doctorName}.`,
          time: "Just now",
        });
      }
    } catch (error) {
      console.log('Error adding appointment:', error);
    }
  };

  const updateAppointmentStatus = async (id, status) => {
    try {
      const { error } = await supabase
        .from('appointments')
        .update({ status })
        .eq('id', id);

      if (error) throw error;

      fetchAppointments();

      const targetAppt = appointments.find((a) => a.id === id);
      if (targetAppt && addAdminNotification) {
        addAdminNotification({
          title: `Appointment ${status}`,
          body: `Booking for ${targetAppt.patientName} with ${targetAppt.doctorName} is now ${status.toLowerCase()}.`,
          time: "Just now",
        });
      }
    } catch (error) {
      console.log('Error updating appointment:', error);
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
