import React, { createContext, useState, useContext } from 'react';

const StateContext = createContext();

export const StateProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);

  // Seed initial appointments matching the required South African clinics and doctors
  const [appointments, setAppointments] = useState([
    {
      id: 'appt-1',
      patientName: 'Kiddo',
      doctorName: 'Dr. Chris Nkwanyana',
      doctorTitle: 'Dentist Specialist',
      clinicName: 'Dawn Park Clinic',
      date: '2026-05-27',
      time: '10:00 AM',
      type: 'Dentist Appointment',
      status: 'Confirmed'
    },
    {
      id: 'appt-2',
      patientName: 'Kiddo',
      doctorName: 'Dr. Lerato Mokoena',
      doctorTitle: 'General Practitioner',
      clinicName: 'Unjani Clinic Germiston',
      date: '2026-04-12',
      time: '02:30 PM',
      type: 'General Checkup',
      status: 'Confirmed'
    }
  ]);

  // Seed initial bulletins/updates feed matching Boksburg, Benoni, Germiston
  const [updates, setUpdates] = useState([
    {
      id: 'updt-1',
      title: "Dr. Lerato Mokoena's Saturday Shift",
      desc: "GP checkups will be available on Saturdays from 8:00 AM - 12:00 PM at Dawn Park Clinic, Boksburg.",
      date: "Posted today",
      clinic: "Dawn Park Clinic",
      category: "Schedules"
    },
    {
      id: 'updt-2',
      title: "Benoni Health Centre Dental Wing",
      desc: "Our expanded dental wing opens next Monday. Specialized care for all family members at 54 Harpur Ave, Benoni.",
      date: "Posted yesterday",
      clinic: "Benoni Health Centre",
      category: "Campaign"
    },
    {
      id: 'updt-3',
      title: "Dr. Sipho Gumede Summit Notice",
      desc: "Dr. Gumede will be away at the South African Cardiology Summit (28 May - 2 Jun). Appointments during this period will be rescheduled.",
      date: "Posted 4 days ago",
      clinic: "Unjani Clinic Germiston",
      category: "Notice"
    },
    {
      id: 'updt-4',
      title: "Germiston Vaccine Drive Extended",
      desc: "Free winter immunization drive at Unjani Clinic Germiston is extended until the end of next week. Walk-ins welcome.",
      date: "Posted 5 days ago",
      clinic: "Unjani Clinic Germiston",
      category: "Vaccines"
    }
  ]);

  const addAppointment = (newAppt) => {
    setAppointments(prev => [
      {
        id: `appt-${Date.now()}`,
        status: 'Pending',
        ...newAppt
      },
      ...prev
    ]);
  };

  const updateAppointmentStatus = (id, status) => {
    setAppointments(prev =>
      prev.map(appt => appt.id === id ? { ...appt, status } : appt)
    );
  };

  const addUpdate = (newUpdate) => {
    setUpdates(prev => [
      {
        id: `updt-${Date.now()}`,
        date: 'Posted just now',
        ...newUpdate
      },
      ...prev
    ]);
  };

  const deleteUpdate = (id) => {
    setUpdates(prev => prev.filter(up => up.id !== id));
  };

  const login = (email, password, role, clinic = '') => {
    // Simple mock authentication
    if (role === 'admin') {
      const name = `${clinic} Admin`;
      setCurrentUser({
        name,
        email,
        role: 'admin',
        clinic
      });
      return true;
    } else {
      const name = email.split('@')[0];
      const displayName = name.charAt(0).toUpperCase() + name.slice(1);
      setCurrentUser({
        name: displayName === 'Patient' ? 'Kiddo' : displayName,
        email,
        role: 'patient'
      });
      return true;
    }
  };

  const signup = (name, email, phone, password, role, clinic = '') => {
    if (role === 'admin') {
      setCurrentUser({
        name: `${clinic} Admin`,
        email,
        role: 'admin',
        clinic,
        phone
      });
    } else {
      setCurrentUser({
        name,
        email,
        role: 'patient',
        phone
      });
    }
    return true;
  };

  const logout = () => {
    setCurrentUser(null);
  };

  return (
    <StateContext.Provider value={{
      currentUser,
      appointments,
      updates,
      addAppointment,
      updateAppointmentStatus,
      addUpdate,
      deleteUpdate,
      login,
      signup,
      logout
    }}>
      {children}
    </StateContext.Provider>
  );
};

export const useStateContext = () => {
  const context = useContext(StateContext);
  if (!context) {
    throw new Error('useStateContext must be used within a StateProvider');
  }
  return context;
};
