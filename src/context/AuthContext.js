import React, { createContext, useState, useContext, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { supabase } from '../config/supabase';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [isAuthLoaded, setIsAuthLoaded] = useState(false);

  // MOCK FALLBACK DATA
  const [userAccounts, setUserAccounts] = useState([
    {
      name: "Kiddo",
      email: "patient@medsync.co.za",
      password: "password123",
      role: "patient",
      phone: "071 234 5678",
    },
    {
      name: "Dawn Park Clinic Admin",
      email: "admin@dawnpark.co.za",
      password: "admin123",
      role: "admin",
      clinic: "Dawn Park Clinic",
    },
  ]);

  useEffect(() => {
    loadUserAccounts();
  }, []);

  useEffect(() => {
    saveUserAccounts();
  }, [userAccounts]);

  const loadUserAccounts = async () => {
    try {
      const storedAccounts = await AsyncStorage.getItem("userAccounts");
      if (storedAccounts) {
        setUserAccounts(JSON.parse(storedAccounts));
      }
    } catch (error) {
      console.log("Error loading user accounts:", error);
    }
  };

  const saveUserAccounts = async () => {
    try {
      await AsyncStorage.setItem("userAccounts", JSON.stringify(userAccounts));
    } catch (error) {
      console.log("Error saving user accounts:", error);
    }
  };

  useEffect(() => {
    const initAuth = async () => {
      try {
        const { data: { session }, error } = await supabase.auth.getSession();
        
        if (error) {
          if (error.message.includes('URL') || error.message.includes('Network request failed') || error.message.includes('fetch')) {
             throw new Error('FallbackToMock');
          }
          throw error;
        }

        if (session?.user) {
          await fetchUserProfile(session.user);
        } else {
          checkMockSession();
        }
      } catch (e) {
        checkMockSession();
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
            // Let logout handle state clearing to avoid overriding mock state
          }
        }
      );
      authListener = data;
    } catch(e) {
      console.log("Supabase listener failed, running in offline mock mode.");
    }

    return () => {
      if (authListener) authListener.subscription.unsubscribe();
    };
  }, []);

  const checkMockSession = async () => {
    try {
      const mockSession = await AsyncStorage.getItem("currentUser");
      if (mockSession) {
        setCurrentUser(JSON.parse(mockSession));
      }
    } catch(e) {}
    setIsAuthLoaded(true);
  };

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
      // Fallback to metadata if profile doesn't exist yet
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
      // Attempt Supabase Login
      const { data, error } = await supabase.auth.signInWithPassword({
        email: cleanEmail,
        password: password,
      });

      if (error) {
        if (error.message.includes('URL') || error.message.includes('fetch') || error.message.includes('Network request failed')) {
          throw new Error('FallbackToMock');
        }
        throw error;
      }
      
      const userMeta = data.user?.user_metadata || {};
      
      // Fetch the actual role from profiles table
      const { data: profile } = await supabase.from('profiles').select('role').eq('id', data.user.id).single();
      const actualRole = profile?.role || 'patient';

      return { success: true, user: data.user, role: actualRole };
    } catch (error) {
      const isFallback = error.message === 'FallbackToMock' || 
                         String(error).includes('URL') || 
                         String(error).includes('Network request failed') ||
                         String(error).includes('Failed to fetch');
                         
      if (isFallback) {
        console.log("Supabase failed/unconfigured. Falling back to mock login.");
        const user = userAccounts.find(
          (account) => account.email.toLowerCase() === cleanEmail && account.role === role,
        );
        if (!user) {
          return { success: false, message: "Account not found. Please sign up first." };
        }
        if (user.password !== password) {
          return { success: false, message: "Incorrect password." };
        }
        if (role === "admin" && user.clinic !== clinic) {
          return { success: false, message: "Incorrect clinic selected for this admin account." };
        }
        const loggedInUser = {
          id: `mock-${Date.now()}`,
          name: user.name,
          email: user.email,
          role: user.role,
          clinic: user.clinic || "",
          name: userAccount.name,
          email: userAccount.email,
          role: userAccount.role,
          clinic: userAccount.clinic || "",
          phone: userAccount.phone || "",
          isMock: true
        };
        setCurrentUser(loggedInUser);
        AsyncStorage.setItem("currentUser", JSON.stringify(loggedInUser));
        return { success: true, user: userAccount, role: userAccount.role };
      }

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

      if (error) {
        if (error.message.includes('URL') || error.message.includes('fetch') || error.message.includes('Network request failed')) {
          throw new Error('FallbackToMock');
        }
        throw error;
      }

      return { success: true, user: data.user };
    } catch (error) {
      const isFallback = error.message === 'FallbackToMock' || 
                         String(error).includes('URL') || 
                         String(error).includes('Network request failed') ||
                         String(error).includes('Failed to fetch');

      if (isFallback) {
        console.log("Supabase failed/unconfigured. Falling back to mock signup.");
        const existingUser = userAccounts.find(
          (account) => account.email.toLowerCase() === cleanEmail,
        );
        if (existingUser) {
          return { success: false, message: "An account with this email already exists." };
        }
        const newUser = {
          name: role === "admin" ? `${clinic} Admin` : name,
          email: cleanEmail,
          password,
          role,
          clinic: role === "admin" ? clinic : "",
          phone,
        };
        setUserAccounts((prev) => [...prev, newUser]);
        
        const loggedInUser = {
          id: `mock-${Date.now()}`,
          name: newUser.name,
          email: newUser.email,
          role: newUser.role,
          clinic: newUser.clinic,
          phone: newUser.phone,
          isMock: true
        };
        setCurrentUser(loggedInUser);
        AsyncStorage.setItem("currentUser", JSON.stringify(loggedInUser));
        return { success: true, user: newUser };
      }

      console.log("Signup Error:", error);
      return { success: false, message: error.message };
    }
  };

  const updateProfile = async (updates) => {
    // Check if user is mock
    if (currentUser?.isMock) {
      const updatedUser = { ...currentUser, ...updates };
      setCurrentUser(updatedUser);
      AsyncStorage.setItem("currentUser", JSON.stringify(updatedUser));
      return { success: true };
    }

    try {
      const { error } = await supabase
        .from('profiles')
        .update(updates)
        .eq('id', currentUser.id);

      if (error) throw error;
      
      const updatedUser = { ...currentUser, ...updates };
      setCurrentUser(updatedUser);
      return { success: true };
    } catch (error) {
      console.log('Update profile error:', error.message);
      return { success: false, message: error.message };
    }
  };

  const grantStaffAccess = async (targetEmail, targetRole) => {
    if (currentUser?.isMock) {
      return { success: true, message: `(Mock) Granted ${targetRole} access to ${targetEmail}` };
    }
    
    try {
      // Call our secure RPC function created via rbac_upgrade.sql
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
      console.log("Supabase logout skipped (mock mode)");
    }
    setCurrentUser(null);
    await AsyncStorage.removeItem("currentUser");
  };

  return (
    <AuthContext.Provider value={{ currentUser, isAuthLoaded, userAccounts, login, signup, resetPassword, logout, updateProfile, grantStaffAccess }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
