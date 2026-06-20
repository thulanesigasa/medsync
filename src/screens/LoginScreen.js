import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, Image, ScrollView, Platform, KeyboardAvoidingView, ActivityIndicator } from 'react-native';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { COLORS, SIZES, LAYOUT } from '../constants/theme';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';

export default function LoginScreen({ navigation }) {
  const { login, resetPassword } = useAuth();
  const [role, setRole] = useState('patient'); // 'patient' or 'admin'
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [selectedClinic, setSelectedClinic] = useState('Dawn Park Clinic');
  const [showClinicDropdown, setShowClinicDropdown] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { showToast } = useToast();

  const clinics = [
    'Dawn Park Clinic',
    'Benoni Health Centre',
    'Unjani Clinic Germiston'
  ];

  const handleLogin = async () => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email || !emailRegex.test(email)) {
      showToast("Please enter a valid email address", 'error');
      return;
    }

    if (!password || password.length < 6) {
      showToast("Password must be at least 6 characters long", 'error');
      return;
    }

    setIsLoading(true);
    
    const result = await login(
      email,
      password,
      role,
      role === "admin" ? selectedClinic : "",
    );

    setIsLoading(false);

    if (!result.success) {
      showToast(result.message, 'error');
      return;
    }

    showToast("Login successful!", 'success');
    
    if (result.role === "admin" || result.role === "receptionist" || result.role === "hr") {
      navigation.replace("Admin");
    } else {
      navigation.replace("Home");
    }
  };
  const handleQuickFillPatient = () => {
    setRole('patient');
    setEmail('patient@medsync.co.za');
    setPassword('password123');
  };

  const handleQuickFillAdmin = () => {
    setRole('admin');
    setEmail('admin@dawnpark.co.za');
    setPassword('admin123');
    setSelectedClinic('Dawn Park Clinic');
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={styles.container}
    >
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* App Logo & Branding */}
        <View style={styles.brandContainer}>
          <View style={styles.logoFrame}>
            <Image
              source={require("../images/icon.jpeg")}
              style={styles.logoImage}
              resizeMode="cover"
            />
          </View>
          <Text style={styles.appName}>MedSync</Text>
          <Text style={styles.appSubtitle}>
            South African Clinic Booking System
          </Text>
        </View>

        {/* Premium Card */}
        <View style={styles.card}>
          {/* Segmented Role Tabs */}
          <View style={styles.tabContainer}>
            <TouchableOpacity
              style={[
                styles.tabButton,
                role === "patient" && styles.tabButtonActive,
              ]}
              onPress={() => {
                setRole("patient");
                setShowClinicDropdown(false);
              }}
            >
              <Ionicons
                name="people"
                size={18}
                color={role === "patient" ? "#FFFFFF" : COLORS.primary}
                style={{ marginRight: 6 }}
              />
              <Text
                style={[
                  styles.tabText,
                  role === "patient" && styles.tabTextActive,
                ]}
              >
                Patient
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.tabButton,
                role === "admin" && styles.tabButtonActive,
              ]}
              onPress={() => setRole("admin")}
            >
              <Ionicons
                name="shield-half"
                size={18}
                color={role === "admin" ? "#FFFFFF" : COLORS.primary}
                style={{ marginRight: 6 }}
              />
              <Text
                style={[
                  styles.tabText,
                  role === "admin" && styles.tabTextActive,
                ]}
              >
                Clinic Admin
              </Text>
            </TouchableOpacity>
          </View>

          <Text style={styles.sectionTitle}>
            {role === "patient" ? "Patient Portal" : "Clinic Dashboard Portal"}
          </Text>

          {/* Email Input */}
          <View style={styles.inputContainer}>
            <Ionicons
              name="mail-outline"
              size={20}
              color="#94A3B8"
              style={styles.inputIcon}
            />
            <TextInput
              placeholder="Email Address"
              value={email}
              onChangeText={setEmail}
              style={styles.input}
              placeholderTextColor="#94A3B8"
              keyboardType="email-address"
              autoCapitalize="none"
            />
          </View>

          {/* Password Input */}
          <View style={styles.inputContainer}>
            <Ionicons
              name="lock-closed-outline"
              size={20}
              color="#94A3B8"
              style={styles.inputIcon}
            />
            <TextInput
              placeholder="Password"
              value={password}
              onChangeText={setPassword}
              secureTextEntry={!showPassword}
              style={styles.input}
              placeholderTextColor="#94A3B8"
              autoCapitalize="none"
            />
            <TouchableOpacity
              onPress={() => setShowPassword(!showPassword)}
              style={styles.eyeIcon}
            >
              <Ionicons
                name={showPassword ? "eye-off-outline" : "eye-outline"}
                size={20}
                color="#94A3B8"
              />
            </TouchableOpacity>
          </View>

          {/* Clinic Selector Dropdown (Admin Only) */}
          {role === "admin" && (
            <View style={{ position: "relative", zIndex: 10 }}>
              <TouchableOpacity
                style={styles.inputContainer}
                onPress={() => setShowClinicDropdown(!showClinicDropdown)}
              >
                <Ionicons
                  name="business-outline"
                  size={20}
                  color="#94A3B8"
                  style={styles.inputIcon}
                />
                <Text
                  style={[
                    styles.input,
                    { color: COLORS.primary, paddingVertical: 12 },
                  ]}
                >
                  {selectedClinic}
                </Text>
                <Ionicons
                  name="chevron-down"
                  size={20}
                  color="#94A3B8"
                  style={{ marginRight: 4 }}
                />
              </TouchableOpacity>

              {showClinicDropdown && (
                <View style={styles.dropdown}>
                  {clinics.map((clinic, index) => (
                    <TouchableOpacity
                      key={index}
                      style={styles.dropdownItem}
                      onPress={() => {
                        setSelectedClinic(clinic);
                        setShowClinicDropdown(false);
                      }}
                    >
                      <Text style={styles.dropdownItemText}>{clinic}</Text>
                    </TouchableOpacity>
                  ))}
                </View>
              )}
            </View>
          )}

          {/* Forgot Password */}
          <TouchableOpacity
            style={styles.forgotBtn}
            onPress={() => {
              if (!email) {
                showToast("Please enter your email first.", 'error');
                return;
              }

              const newPassword = prompt("Enter your new password");

              if (!newPassword) {
                return;
              }

              const result = resetPassword(email, newPassword, role);

              showToast(result.message, result.success ? 'success' : 'error');
            }}
          >
            <Text style={styles.forgotText}>Forgot Password?</Text>
          </TouchableOpacity>

          {/* Login Action Button */}
          <TouchableOpacity 
            style={styles.loginBtn} 
            onPress={handleLogin}
            disabled={isLoading}
          >
            {isLoading ? (
              <ActivityIndicator color="#FFFFFF" size="small" />
            ) : (
              <Text style={styles.loginBtnText}>LOG IN</Text>
            )}
          </TouchableOpacity>

          {/* Sign Up Navigation Link */}
          <View style={styles.signupPrompt}>
            <Text style={styles.signupPromptText}>Don't have an account? </Text>
            <TouchableOpacity
              onPress={() =>
                navigation.navigate("Signup", { defaultRole: role })
              }
            >
              <Text style={styles.signupLinkText}>Sign Up</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Quick Fill Demo Section */}
        <View style={styles.demoSection}>
          <Text style={styles.demoTitle}>Developer Demo Quick-Fills</Text>
          <View style={styles.demoBtnRow}>
            <TouchableOpacity
              style={styles.demoBtn}
              onPress={handleQuickFillPatient}
            >
              <Ionicons
                name="person"
                size={14}
                color={COLORS.primary}
                style={{ marginRight: 4 }}
              />
              <Text style={styles.demoBtnText}>Patient Demo</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.demoBtn}
              onPress={handleQuickFillAdmin}
            >
              <Ionicons
                name="shield"
                size={14}
                color={COLORS.primary}
                style={{ marginRight: 4 }}
              />
              <Text style={styles.demoBtnText}>Admin Demo</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Footer */}
        <Text style={styles.footerText}>Powered by Hokma Tech</Text>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  scrollContent: {
    padding: SIZES.margin,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: '100%',
    paddingBottom: 40,
  },
  brandContainer: {
    alignItems: 'center',
    marginTop: Platform.OS === 'ios' ? 40 : 20,
    marginBottom: 20,
  },
  logoFrame: {
    width: 80,
    height: 80,
    borderRadius: 20,
    overflow: 'hidden',
    borderWidth: 1.5,
    borderColor: '#EAE8FC',
    backgroundColor: '#FFFFFF',
    shadowColor: '#0F2C59',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
    justifyContent: 'center',
    alignItems: 'center',
  },
  logoImage: {
    width: '100%',
    height: '100%',
  },
  appName: {
    fontSize: 28,
    fontWeight: 'bold',
    color: COLORS.primary,
    marginTop: 12,
  },
  appSubtitle: {
    fontSize: 12,
    color: '#64748B',
    marginTop: 4,
    fontWeight: '600',
    letterSpacing: 0.5,
  },
  card: {
    backgroundColor: COLORS.surface,
    width: '100%',
    borderRadius: 24,
    padding: 20,
    borderWidth: 1,
    borderColor: '#EAE8FC',
    shadowColor: '#0F2C59',
    shadowOpacity: 0.05,
    shadowRadius: 16,
    elevation: 4,
    marginBottom: 20,
  },
  tabContainer: {
    flexDirection: 'row',
    backgroundColor: '#F1F5F9',
    borderRadius: 16,
    padding: 4,
    marginBottom: 20,
  },
  tabButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
    borderRadius: 12,
  },
  tabButtonActive: {
    backgroundColor: COLORS.primary,
  },
  tabText: {
    fontSize: 13,
    fontWeight: '600',
    color: COLORS.primary,
  },
  tabTextActive: {
    color: '#FFFFFF',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.primary,
    marginBottom: 16,
    textAlign: 'center',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F8FAFC',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: 14,
    paddingHorizontal: 12,
    marginBottom: 14,
  },
  inputIcon: {
    marginRight: 10,
  },
  input: {
    flex: 1,
    fontSize: 15,
    color: COLORS.primary,
    paddingVertical: Platform.OS === 'ios' ? 14 : 10,
  },
  eyeIcon: {
    padding: 4,
  },
  dropdown: {
    position: 'absolute',
    top: 55,
    left: 0,
    right: 0,
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    shadowColor: '#0F2C59',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 5,
    zIndex: 100,
  },
  dropdownItem: {
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
  },
  dropdownItemText: {
    color: COLORS.primary,
    fontSize: 15,
    fontWeight: '500',
  },
  forgotBtn: {
    alignSelf: 'flex-end',
    marginBottom: 16,
  },
  forgotText: {
    color: COLORS.accent,
    fontSize: 13,
    fontWeight: '600',
  },
  loginBtn: {
    backgroundColor: COLORS.primary,
    borderRadius: 14,
    paddingVertical: 14,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 10,
    elevation: 3,
  },
  loginBtnText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: 'bold',
    letterSpacing: 0.5,
  },
  signupPrompt: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  signupPromptText: {
    color: '#64748B',
    fontSize: 13,
  },
  signupLinkText: {
    color: COLORS.primary,
    fontWeight: 'bold',
    fontSize: 13,
  },
  demoSection: {
    backgroundColor: '#EFF6FF',
    borderRadius: 16,
    padding: 14,
    width: '100%',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#D3E2F2',
    marginBottom: 20,
  },
  demoTitle: {
    fontSize: 12,
    fontWeight: '700',
    color: COLORS.primary,
    marginBottom: 10,
    letterSpacing: 0.5,
  },
  demoBtnRow: {
    flexDirection: 'row',
    gap: 12,
    width: '100%',
  },
  demoBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#BFDBFE',
    borderRadius: 10,
    paddingVertical: 8,
  },
  demoBtnText: {
    color: COLORS.primary,
    fontSize: 11,
    fontWeight: 'bold',
  },
  footerText: {
    fontSize: 12,
    color: '#94A3B8',
    marginTop: 10,
  },
});
