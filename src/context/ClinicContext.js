import React, { createContext, useState, useContext, useEffect } from "react";
import { supabase } from '../config/supabase';
import { useAuth } from './AuthContext';

const ClinicContext = createContext();

export const ClinicProvider = ({ children }) => {
  const { currentUser, isAuthLoaded } = useAuth();
  
  const [clinics, setClinics] = useState([]);
  const [doctors, setDoctors] = useState([]);
  const [patients, setPatients] = useState([]);
  const [updates, setUpdates] = useState([]);

  useEffect(() => {
    if (isAuthLoaded && currentUser) {
      fetchClinics();
      fetchDoctors();
      fetchPatients();
    }
  }, [isAuthLoaded, currentUser]);

  const fetchClinics = async () => {
    try {
      const { data, error } = await supabase.from('clinics').select('*').eq('is_active', true);
      if (error) throw error;
      if (data) setClinics(data);
    } catch (error) {
      console.log('Error fetching clinics:', error.message);
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
      
      if (data) {
        const formattedDoctors = data.map(d => ({
          id: d.id,
          name: d.profiles?.full_name || 'Unknown Doctor',
          specialty: d.title,
          clinic: d.clinics?.name,
          avatarText: (d.profiles?.full_name || 'D').replace("Dr. ", "").charAt(0),
          rating: d.rating,
          reviews: d.reviews_count,
          shifts: { Mon: true, Tue: true, Wed: true, Thu: true, Fri: true, Sat: false, Sun: false }
        }));
        setDoctors(formattedDoctors);
      }
    } catch (error) {
      console.log('Error fetching doctors:', error.message);
    }
  };

  const fetchPatients = async () => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select(`
          id,
          full_name,
          email,
          phone_number,
          medical_records (
            id,
            title,
            description,
            date_issued
          )
        `)
        .eq('role', 'patient');
      if (error) throw error;
      
      if (data) {
        const formattedPatients = data.map(p => ({
          id: p.id,
          name: p.full_name,
          email: p.email,
          phone: p.phone_number,
          medicalNotes: (p.medical_records || [])
            .filter(r => r !== null && r !== undefined)
            .map(r => ({
              id: r.id,
              date: r.date_issued,
              doctorName: 'Doctor',
              diagnosis: r.title,
              treatment: r.description ? (r.description.split('\nNotes:')[0]?.replace('Treatment: ', '') || '') : '',
              notes: r.description ? (r.description.split('\nNotes:')[1]?.trim() || '') : ''
            }))
        }));
        setPatients(formattedPatients);
      }
    } catch (error) {
      console.log('Error fetching patients:', error.message);
    }
  };

  const addPatient = async (patient) => {
    fetchPatients();
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
    try {
      const { data: profile } = await supabase
        .from('profiles')
        .select('id')
        .eq('role', 'doctor')
        .ilike('full_name', `%${newDoc.name}%`)
        .limit(1);

      let doctorProfileId = profile && profile.length > 0 ? profile[0].id : null;

      if (!doctorProfileId) {
         console.log("Could not find registered profile for doctor name. They must sign up first.");
         return;
      }

      const { data: clinic } = await supabase
        .from('clinics')
        .select('id')
        .ilike('name', `%${newDoc.clinic}%`)
        .limit(1);
      
      const clinicId = clinic && clinic.length > 0 ? clinic[0].id : null;

      if (clinicId && doctorProfileId) {
        const { error } = await supabase
          .from('clinic_staff')
          .insert([{
            profile_id: doctorProfileId,
            clinic_id: clinicId,
            title: newDoc.specialty
          }]);
        if (!error) {
          fetchDoctors();
        }
      }
    } catch (error) {
      console.log("Error adding doctor staff:", error.message);
    }
  };

  const updateDoctorShift = (id, day, value) => {
    setDoctors((prev) =>
      prev.map((doc) =>
        doc.id === id ? { ...doc, shifts: { ...doc.shifts, [day]: value } } : doc,
      ),
    );
  };

  const updateClinicSettings = async (clinicName, updatedFields) => {
    try {
      const { error } = await supabase
        .from('clinics')
        .update(updatedFields)
        .eq('name', clinicName);
      if (!error) {
        fetchClinics();
      }
    } catch (error) {
      console.log("Error updating clinic settings:", error.message);
    }
  };

  const addMedicalNote = async (patientName, noteFields) => {
    try {
      const { data: patient } = await supabase
        .from('profiles')
        .select('id')
        .eq('role', 'patient')
        .ilike('full_name', `%${patientName}%`)
        .limit(1);

      const patientId = patient && patient.length > 0 ? patient[0].id : null;

      if (patientId) {
        const { error } = await supabase
          .from('medical_records')
          .insert([{
            patient_id: patientId,
            record_type: 'Diagnosis',
            title: noteFields.diagnosis,
            description: `Treatment: ${noteFields.treatment}\nNotes: ${noteFields.notes || ''}`
          }]);
        if (!error) {
          fetchPatients();
        } else {
          throw error;
        }
      }
    } catch (error) {
      console.log("Error saving medical record:", error.message);
    }
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
