import React, { createContext, useState, useContext } from "react";

const ClinicContext = createContext();

export const ClinicProvider = ({ children }) => {
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
      shifts: { Mon: true, Tue: true, Wed: true, Thu: true, Fri: true, Sat: false, Sun: false },
    },
    {
      id: "doc-2",
      name: "Dr. Lerato Mokoena",
      specialty: "General Practitioner",
      clinic: "Dawn Park Clinic",
      avatarText: "L",
      rating: "4.9",
      reviews: "110",
      shifts: { Mon: true, Tue: true, Wed: true, Thu: true, Fri: true, Sat: true, Sun: false },
    },
    {
      id: "doc-3",
      name: "Dr. Pieter Naude",
      specialty: "Senior Surgeon",
      clinic: "Benoni Health Centre",
      avatarText: "P",
      rating: "5.0",
      reviews: "95",
      shifts: { Mon: true, Tue: false, Wed: true, Thu: false, Fri: true, Sat: false, Sun: false },
    },
    {
      id: "doc-4",
      name: "Dr. Sipho Gumede",
      specialty: "Senior Cardiologist",
      clinic: "Unjani Clinic Germiston",
      avatarText: "S",
      rating: "5.0",
      reviews: "120",
      shifts: { Mon: true, Tue: true, Wed: true, Thu: true, Fri: true, Sat: false, Sun: false },
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
          treatment: "Prescribed Paracetamol & Cough Syrup. Recommended 3 days rest.",
          notes: "Patient was showing mild dehydration. Advised to increase fluid intake.",
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

  const addPatient = (patient) => {
    setPatients(prev => [
      ...prev,
      {
        id: `pat-${Date.now()}`,
        medicalNotes: [],
        ...patient,
      }
    ]);
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

  const addDoctor = (newDoc) => {
    setDoctors((prev) => [
      {
        id: `doc-${Date.now()}`,
        avatarText: newDoc.name.replace("Dr. ", "").charAt(0),
        rating: "5.0",
        reviews: "0",
        shifts: { Mon: true, Tue: true, Wed: true, Thu: true, Fri: true, Sat: false, Sun: false },
        ...newDoc,
      },
      ...prev,
    ]);
  };

  const updateDoctorShift = (id, day, value) => {
    setDoctors((prev) =>
      prev.map((doc) =>
        doc.id === id ? { ...doc, shifts: { ...doc.shifts, [day]: value } } : doc,
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
