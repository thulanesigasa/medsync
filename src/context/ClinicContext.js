import React, { createContext, useState, useContext, useEffect } from "react";
import { supabase } from '../config/supabase';
import { useAuth } from './AuthContext';

const ClinicContext = createContext();

export const ClinicProvider = ({ children }) => {
  const { currentUser, isAuthLoaded } = useAuth();
  
  const [clinics, setClinics] = useState([]);
  const [doctors, setDoctors] = useState([]);
  const [patients, setPatients] = useState([]);
  const [updates, setUpdates] = useState([]); // This could be mapped from a 'bulletins' table if created, or kept empty
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (isAuthLoaded) {
      fetchClinics();
      fetchDoctors();
      if (currentUser?.role === 'admin' || currentUser?.role === 'doctor') {
        fetchPatients();
      }
    }
  }, [isAuthLoaded, currentUser]);

  const fetchClinics = async () => {
    try {
      const { data, error } = await supabase.from('clinics').select('*').eq('is_active', true);
      if (error) throw error;
      setClinics(data || []);
    } catch (error) {
      console.log('Error fetching clinics:', error);
    }
  };

  const fetchDoctors = async () => {
    try {
      const { data, error } = await supabase
        .from('clinic_staff')
        .select(`
          id,
          title,
          rating,
          reviews_count,
          clinics (name),
          profiles (full_name, avatar_url)
        `);
      if (error) throw error;
      
      const formattedDoctors = data.map(d => ({
        id: d.id,
        name: d.profiles?.full_name || 'Unknown Doctor',
        specialty: d.title,
        clinic: d.clinics?.name,
        avatarText: (d.profiles?.full_name || 'D').replace("Dr. ", "").charAt(0),
        rating: d.rating,
        reviews: d.reviews_count,
        shifts: { Mon: true, Tue: true, Wed: true, Thu: true, Fri: true, Sat: false, Sun: false } // Mocked until shift table exists
      }));
      setDoctors(formattedDoctors);
    } catch (error) {
      console.log('Error fetching doctors:', error);
    }
  };

  const fetchPatients = async () => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('id, full_name, email, phone_number')
        .eq('role', 'patient');
      if (error) throw error;
      
      const formattedPatients = data.map(p => ({
        id: p.id,
        name: p.full_name,
        email: p.email,
        phone: p.phone_number,
        medicalNotes: [] // Fetch these on-demand or with another query
      }));
      setPatients(formattedPatients);
    } catch (error) {
      console.log('Error fetching patients:', error);
    }
  };

  const addPatient = async (patient) => {
    // In Supabase, patients are just users in profiles. This would usually go through an invite or sign up flow.
    console.log("Adding patient to Supabase not fully implemented in Context wrapper.");
  };

  const addUpdate = (newUpdate) => {
    setUpdates((prev) => [
      { id: `updt-${Date.now()}`, date: "Posted just now", ...newUpdate },
      ...prev,
    ]);
  };

  const deleteUpdate = (id) => {
    setUpdates((prev) => prev.filter((up) => up.id !== id));
  };

  const addDoctor = async (newDoc) => {
    console.log("Adding doctor requires Supabase Auth Signup + clinic_staff insert");
  };

  const updateDoctorShift = (id, day, value) => {
    console.log("Shift update requires new schema table");
  };

  const updateClinicSettings = async (clinicName, updatedFields) => {
    try {
      const { error } = await supabase
        .from('clinics')
        .update(updatedFields)
        .eq('name', clinicName);
      if (error) throw error;
      fetchClinics();
    } catch (error) {
      console.log("Error updating clinic settings:", error);
    }
  };

  const addMedicalNote = async (patientName, noteFields) => {
    console.log("Adding medical notes should use medical_records table directly");
  };

  return (
    <ClinicContext.Provider
      value={{
        clinics,
        doctors,
        patients,
        updates,
        addPatient,
        addDoctor,
        updateDoctorShift,
        updateClinicSettings,
        addMedicalNote,
        addUpdate,
        deleteUpdate,
      }}
    >
      {children}
    </ClinicContext.Provider>
  );
};

export const useClinic = () => useContext(ClinicContext);
