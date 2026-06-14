import React, { createContext, useState, useContext, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [isAuthLoaded, setIsAuthLoaded] = useState(false);

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
    loadCurrentUser();
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

  const loadCurrentUser = async () => {
    try {
      const storedUser = await AsyncStorage.getItem("currentUser");
      if (storedUser) {
        setCurrentUser(JSON.parse(storedUser));
      }
    } catch (error) {
      console.log("Error loading current user:", error);
    } finally {
      setIsAuthLoaded(true);
    }
  };

  const saveUserAccounts = async () => {
    try {
      await AsyncStorage.setItem("userAccounts", JSON.stringify(userAccounts));
    } catch (error) {
      console.log("Error saving user accounts:", error);
    }
  };

  const isValidEmail = (email) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  const login = (email, password, role, clinic = "") => {
    const cleanEmail = email.trim().toLowerCase();
    if (!isValidEmail(cleanEmail)) {
      return { success: false, message: "Please enter a valid email address." };
    }
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
    };
    setCurrentUser(loggedInUser);
    AsyncStorage.setItem("currentUser", JSON.stringify(loggedInUser));
    return { success: true, user };
  };

  const signup = (name, email, phone, password, role, clinic = "") => {
    const cleanEmail = email.trim().toLowerCase();
    if (!isValidEmail(cleanEmail)) {
      return { success: false, message: "Please enter a valid email address." };
    }
    if (!password || password.length < 6) {
      return { success: false, message: "Password must be at least 6 characters long." };
    }
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
    };
    setCurrentUser(loggedInUser);
    AsyncStorage.setItem("currentUser", JSON.stringify(loggedInUser));
    return { success: true, user: newUser };
  };

  const resetPassword = (email, newPassword, role) => {
    const cleanEmail = email.trim().toLowerCase();
    if (!isValidEmail(cleanEmail)) {
      return { success: false, message: "Please enter a valid email address." };
    }
    if (!newPassword || newPassword.length < 6) {
      return { success: false, message: "New password must be at least 6 characters long." };
    }
    const userExists = userAccounts.find(
      (account) => account.email.toLowerCase() === cleanEmail && account.role === role,
    );
    if (!userExists) {
      return { success: false, message: "No account found with this email." };
    }
    setUserAccounts((prev) =>
      prev.map((account) =>
        account.email.toLowerCase() === cleanEmail && account.role === role
          ? { ...account, password: newPassword }
          : account,
      ),
    );
    return { success: true, message: "Password reset successful." };
  };

  const logout = async () => {
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
