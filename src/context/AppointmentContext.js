import React, { createContext, useState, useContext, useEffect } from "react";
import { supabase } from '../config/supabase';
import { useAuth } from './AuthContext';

const AppointmentContext = createContext();

export const AppointmentProvider = ({ children }) => {
  const { currentUser, isAuthLoaded } = useAuth();
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

      if (data) {
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
      console.log('Error fetching appointments:', error.message);
    }
  };

  const addAppointment = async (newAppt) => {
    try {
      let clinicId = null;
      let doctorId = null;

      // 1. Resolve clinicId
      if (newAppt.clinicName) {
        const { data: clinic } = await supabase
          .from('clinics')
          .select('id')
          .ilike('name', `%${newAppt.clinicName}%`)
          .limit(1);
        if (clinic && clinic.length > 0) {
          clinicId = clinic[0].id;
        }
      }

      // 2. Resolve doctorId (clinic_staff.id)
      if (newAppt.doctorName) {
        const { data: profile } = await supabase
          .from('profiles')
          .select('id')
          .ilike('full_name', `%${newAppt.doctorName}%`)
          .limit(1);
        if (profile && profile.length > 0) {
          const { data: staff } = await supabase
            .from('clinic_staff')
            .select('id')
            .eq('profile_id', profile[0].id)
            .limit(1);
          if (staff && staff.length > 0) {
            doctorId = staff[0].id;
          }
        }
      }

      if (!clinicId || !doctorId) {
        console.log("Could not resolve clinic or doctor ID for appointment insertion.");
        return;
      }

      const { error } = await supabase
        .from('appointments')
        .insert([{
          patient_id: currentUser.id,
          doctor_id: doctorId,
          clinic_id: clinicId,
          appointment_date: newAppt.date,
          appointment_time: newAppt.time,
          type: newAppt.type || 'In-person',
          status: 'Pending'
        }]);

      if (error) throw error;
      fetchAppointments();
    } catch (error) {
      console.log("Error inserting appointment:", error.message);
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
    } catch (error) {
      console.log("Error updating appointment status:", error.message);
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
