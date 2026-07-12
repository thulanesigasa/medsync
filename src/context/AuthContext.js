import React, { createContext, useState, useContext, useEffect } from "react";
import { supabase } from '../config/supabase';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [isAuthLoaded, setIsAuthLoaded] = useState(false);

  useEffect(() => {
    const initAuth = async () => {
      try {
        const { data: { session }, error } = await supabase.auth.getSession();
        
        if (error) throw error;

        if (session?.user) {
          await fetchUserProfile(session.user);
        } else {
          setCurrentUser(null);
          setIsAuthLoaded(true);
        }
      } catch (e) {
        console.log("Error loading session:", e.message);
        setCurrentUser(null);
        setIsAuthLoaded(true);
      }
    };

    initAuth();

    // Listen for auth changes
    let authListener;
    try {
      const { data } = supabase.auth.onAuthStateChange(
        (event, session) => {
          if (session?.user) {
            fetchUserProfile(session.user);
          } else {
            setCurrentUser(null);
          }
        }
      );
      authListener = data;
    } catch(e) {
      console.log("Supabase listener error:", e.message);
    }

    return () => {
      if (authListener) authListener.subscription.unsubscribe();
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
        isMock: false
      });
    } catch (error) {
      console.log('Error fetching user profile:', error.message);
      const metadata = user.user_metadata || {};
      setCurrentUser({
        id: user.id,
        email: user.email,
        name: metadata.full_name || user.email,
        role: metadata.role || 'patient',
        isMock: false
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
      
      const { data: profile } = await supabase.from('profiles').select('role').eq('id', data.user.id).single();
      const actualRole = profile?.role || 'patient';

      return { success: true, user: data.user, role: actualRole };
    } catch (error) {
      console.log('Login error:', error.message);
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
      console.log("Signup Error:", error.message);
      return { success: false, message: error.message };
    }
  };

  const updateProfile = async (updates) => {
    try {
      const { error } = await supabase
        .from('profiles')
        .update(updates)
        .eq('id', currentUser.id);

      if (error) throw error;
      
      const updatedUser = { ...currentUser, ...updates };
      if (updates.full_name) updatedUser.name = updates.full_name;
      setCurrentUser(updatedUser);
      return { success: true };
    } catch (error) {
      console.log('Update profile error:', error.message);
      return { success: false, message: error.message };
    }
  };

  const grantStaffAccess = async (targetEmail, targetRole) => {
    try {
      const { data, error } = await supabase.rpc('grant_staff_role', {
        target_email: targetEmail.trim().toLowerCase(),
        new_role: targetRole
      });
      
      if (error) throw error;
      return { success: true, message: `Successfully granted ${targetRole} access to ${targetEmail}!` };
    } catch (error) {
      console.log('Grant staff access error:', error.message);
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
      console.log("Supabase logout error:", e.message);
    }
    setCurrentUser(null);
  };

  return (
    <AuthContext.Provider value={{ currentUser, isAuthLoaded, userAccounts: [], login, signup, resetPassword, logout, updateProfile, grantStaffAccess }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
