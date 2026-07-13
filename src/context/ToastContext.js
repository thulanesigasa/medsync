import React, { createContext, useState, useContext, useEffect, useRef } from 'react';
import { View, Text, Animated, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '../constants/theme';
import { useTheme } from './ThemeContext';

const ToastContext = createContext();

export const ToastProvider = ({ children }) => {
  const [toast, setToast] = useState(null);
  const translateY = useRef(new Animated.Value(-100)).current;
  const { theme } = useTheme();

  const showToast = (message, type = 'success', title = null) => {
    setToast({ message, type, title });
  };

  useEffect(() => {
    if (toast) {
      Animated.sequence([
        Animated.timing(translateY, {
          toValue: 50,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.delay(3000),
        Animated.timing(translateY, {
          toValue: -100,
          duration: 300,
          useNativeDriver: true,
        }),
      ]).start(() => {
        setToast(null);
      });
    }
  }, [toast]);

  const typeColor = toast?.type === 'error' ? '#EF4444' : (toast?.type === 'info' ? '#3B82F6' : '#10B981');

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      {toast && (
        <Animated.View
          style={[
            styles.toastContainer,
            { 
              transform: [{ translateY }],
              backgroundColor: theme.surface,
              borderColor: theme.border,
              borderLeftColor: typeColor
            }
          ]}
        >
          <View style={styles.iconContainer}>
            <Ionicons 
              name={toast.type === 'error' ? 'alert-circle' : (toast.type === 'info' ? 'information-circle' : 'checkmark-circle')} 
              size={24} 
              color={typeColor} 
            />
          </View>
          <View style={styles.textContainer}>
            {toast.title && <Text style={[styles.toastTitle, { color: theme.text }]}>{toast.title}</Text>}
            <Text style={[styles.toastText, { color: theme.subtext }]}>{toast.message}</Text>
          </View>
        </Animated.View>
      )}
    </ToastContext.Provider>
  );
};

export const useToast = () => useContext(ToastContext);

const styles = StyleSheet.create({
  toastContainer: {
    position: 'absolute',
    top: 0,
    left: 20,
    right: 20,
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderLeftWidth: 6,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
    zIndex: 9999,
  },
  iconContainer: {
    marginRight: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  textContainer: {
    flex: 1,
  },
  toastTitle: {
    fontSize: 15,
    fontWeight: 'bold',
    marginBottom: 2,
  },
  toastText: {
    fontSize: 13,
    lineHeight: 18,
  }
});
