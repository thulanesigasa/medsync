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
        // Fetch user profile from public.profiles table or just use metadata
        const metadata = session.user.user_metadata || {};
        setCurrentUser({
          id: session.user.id,
          email: session.user.email,
          name: metadata.name || session.user.email,
          role: metadata.role || 'patient',
          clinic: metadata.clinic || '',
          phone: metadata.phone || '',
        });
      }
      setIsAuthLoaded(true);
    });

    // Listen for auth changes
    const { data: authListener } = supabase.auth.onAuthStateChange(
      (event, session) => {
        if (session?.user) {
          const metadata = session.user.user_metadata || {};
          setCurrentUser({
            id: session.user.id,
            email: session.user.email,
            name: metadata.name || session.user.email,
            role: metadata.role || 'patient',
            clinic: metadata.clinic || '',
            phone: metadata.phone || '',
          });
        } else {
          setCurrentUser(null);
        }
      }
    );

    return () => {
      authListener.subscription.unsubscribe();
    };
  }, []);

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
      
      if (role === 'admin' && userMeta.clinic && userMeta.clinic !== clinic) {
        await supabase.auth.signOut();
        return { success: false, message: "Incorrect clinic selected for this admin account." };
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
            name: role === "admin" ? `${clinic} Admin` : name,
            role: role,
            clinic: role === "admin" ? clinic : "",
            phone: phone,
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
    // Note: Supabase reset password flow usually involves sending an email link.
    // For this implementation, we will use updateUser if logged in, otherwise return an error instructing them to use an email link.
    return { success: false, message: "Password reset via email link is required in Supabase." };
  };

  const logout = async () => {
    await supabase.auth.signOut();
    setCurrentUser(null);
  };

  return (
    <AuthContext.Provider value={{ currentUser, isAuthLoaded, login, signup, resetPassword, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
