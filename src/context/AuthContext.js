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
      // 1. Attempt Supabase Login
      const { data, error } = await supabase.auth.signInWithPassword({
        email: cleanEmail,
        password: password,
      });

      if (error) {
        // If supabase URL is not set or network fails, fallback to Mock Data
        if (error.message.includes('URL') || error.message.includes('fetch')) {
          throw new Error('FallbackToMock');
        }
        throw error;
      }
      
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
      if (error.message === 'FallbackToMock' || String(error).includes('URL')) {
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
          name: user.name,
          email: user.email,
          role: user.role,
          clinic: user.clinic || "",
          phone: user.phone || "",
          isMock: true
        };
        setCurrentUser(loggedInUser);
        AsyncStorage.setItem("currentUser", JSON.stringify(loggedInUser));
        return { success: true, user };
      }

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

      if (error) {
        if (error.message.includes('URL') || error.message.includes('fetch')) {
          throw new Error('FallbackToMock');
        }
        throw error;
      }

      return { success: true, user: data.user };
    } catch (error) {
      if (error.message === 'FallbackToMock' || String(error).includes('URL')) {
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

  const resetPassword = async (email, newPassword, role) => {
    // Note: Supabase reset password flow usually involves sending an email link.
    // For this implementation, we will use updateUser if logged in, otherwise return an error instructing them to use an email link.
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
    <AuthContext.Provider value={{ currentUser, isAuthLoaded, userAccounts, login, signup, resetPassword, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
