import React, { createContext, useState, useContext, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { supabase } from '../config/supabase';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [isAuthLoaded, setIsAuthLoaded] = useState(false);

  useEffect(() => {
    // Check active session on mount
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) {
        fetchUserProfile(session.user);
      } else {
        setIsAuthLoaded(true);
      }
    });

    // Listen for auth changes
    const { data: authListener } = supabase.auth.onAuthStateChange(
      (event, session) => {
        if (session?.user) {
          fetchUserProfile(session.user);
        } else {
          setCurrentUser(null);
        }
      }
    );

    return () => {
      authListener.subscription.unsubscribe();
    };
  }, []);

  const fetchUserProfile = async (user) => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();

      if (error) throw error;

      setCurrentUser({
        id: user.id,
        email: user.email,
        name: data.full_name || user.email,
        role: data.role || 'patient',
        clinic: '', // You would join with clinic_staff if role is admin/doctor
        phone: data.phone_number || '',
      });
    } catch (error) {
      console.log('Error fetching user profile:', error.message);
      // Fallback to metadata if profile doesn't exist yet
      const metadata = user.user_metadata || {};
      setCurrentUser({
        id: user.id,
        email: user.email,
        name: metadata.full_name || user.email,
        role: metadata.role || 'patient',
      });
    } finally {
      setIsAuthLoaded(true);
    }
  };

  const isValidEmail = (email) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  const login = async (email, password, role, clinic = "") => {
    const cleanEmail = email.trim().toLowerCase();
    if (!isValidEmail(cleanEmail)) {
      return { success: false, message: "Please enter a valid email address." };
    }

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: cleanEmail,
        password: password,
      });

      if (error) throw error;
      
      const userMeta = data.user?.user_metadata || {};
      
      // Role checking
      if (userMeta.role && userMeta.role !== role) {
        await supabase.auth.signOut();
        return { success: false, message: `Account is not registered as a ${role}.` };
      }

      return { success: true, user: data.user };
    } catch (error) {
      console.log("Login Error:", error);
      return { success: false, message: error.message };
    }
  };

  const signup = async (name, email, phone, password, role, clinic = "") => {
    const cleanEmail = email.trim().toLowerCase();
    if (!isValidEmail(cleanEmail)) {
      return { success: false, message: "Please enter a valid email address." };
    }
    if (!password || password.length < 6) {
      return { success: false, message: "Password must be at least 6 characters long." };
    }

    try {
      const { data, error } = await supabase.auth.signUp({
        email: cleanEmail,
        password: password,
        options: {
          data: {
            full_name: role === "admin" ? `${clinic} Admin` : name,
            role: role,
            phone_number: phone,
          }
        }
      });

      if (error) throw error;

      return { success: true, user: data.user };
    } catch (error) {
      console.log("Signup Error:", error);
      return { success: false, message: error.message };
    }
  };

  const resetPassword = async (email, newPassword, role) => {
    return { success: false, message: "Password reset via email link is required in Supabase." };
  };

  const logout = async () => {
    try {
      await supabase.auth.signOut();
    } catch (e) {
      console.log("Supabase logout error", e);
    }
    setCurrentUser(null);
  };

  return (
    <AuthContext.Provider value={{ currentUser, isAuthLoaded, login, signup, resetPassword, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
