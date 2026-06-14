import React, { createContext, useState, useContext } from "react";
import { COLORS } from "../constants/theme";

const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
  const [isDark, setIsDark] = useState(false);

  const theme = isDark
    ? {
        background: "#0F172A",
        surface: "#1E293B",
        text: "#F8FAFC",
        subtext: "#CBD5E1",
        border: "#334155",
        primary: COLORS.primary,
      }
    : {
        background: COLORS.background,
        surface: COLORS.surface,
        text: COLORS.primary,
        subtext: "#64748B",
        border: "#EAE8FC",
        primary: COLORS.primary,
      };

  const toggleTheme = () => {
    setIsDark((prev) => !prev);
  };

  return (
    <ThemeContext.Provider value={{ isDark, theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => useContext(ThemeContext);
