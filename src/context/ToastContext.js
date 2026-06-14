import React, { createContext, useState, useContext, useEffect, useRef } from 'react';
import { View, Text, Animated, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '../constants/theme';

const ToastContext = createContext();

export const ToastProvider = ({ children }) => {
  const [toast, setToast] = useState(null);
  const translateY = useRef(new Animated.Value(-100)).current;

  const showToast = (message, type = 'success') => {
    setToast({ message, type });
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

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      {toast && (
        <Animated.View
          style={[
            styles.toastContainer,
            { transform: [{ translateY }] },
            toast.type === 'error' ? styles.errorBg : styles.successBg
          ]}
        >
          <Ionicons 
            name={toast.type === 'error' ? 'alert-circle' : 'checkmark-circle'} 
            size={24} 
            color="#fff" 
          />
          <Text style={styles.toastText}>{toast.message}</Text>
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
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 10,
    elevation: 5,
    zIndex: 9999,
  },
  successBg: {
    backgroundColor: COLORS.success || '#10B981',
  },
  errorBg: {
    backgroundColor: '#EF4444',
  },
  toastText: {
    color: '#fff',
    fontSize: 15,
    fontWeight: 'bold',
    marginLeft: 10,
  }
});
