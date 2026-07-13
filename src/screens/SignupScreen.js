
import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Platform,
  KeyboardAvoidingView,
  ActivityIndicator,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, SIZES } from '../constants/theme';
import { useAuth } from '../context/AuthContext';
import { useClinic } from '../context/ClinicContext';
import { useToast } from '../context/ToastContext';
export default function SignupScreen({ navigation, route }) {
  const { signup } = useAuth();
  const { addPatient } = useClinic();
  const defaultRole = route.params?.defaultRole || 'patient';
  const [role, setRole] = useState(defaultRole);
  const [firstName, setFirstName] = useState('');
  const [surname, setSurname] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [selectedClinic, setSelectedClinic] = useState('Dawn Park Clinic');
  const [showClinicDropdown, setShowClinicDropdown] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { showToast } = useToast();
  const clinics = [
    'Dawn Park Clinic',
    'Benoni Health Centre',
    'Unjani Clinic Germiston',
  ];

  const getPasswordStrength = (pass) => {
    if (!pass) return { score: 0, label: '', color: '#E2E8F0' };
    if (pass.length < 6) return { score: 1, label: 'Too Short (Min 6 characters)', color: '#EF4444' };
    
    let strength = 0;
    if (/[a-z]/.test(pass)) strength += 1;
    if (/[A-Z]/.test(pass)) strength += 1;
    if (/[0-9]/.test(pass)) strength += 1;
    if (/[^a-zA-Z0-9]/.test(pass)) strength += 1;

    if (strength <= 1) return { score: 2, label: 'Weak', color: '#F97316' };
    if (strength === 2) return { score: 3, label: 'Medium', color: '#EAB308' };
    if (strength === 3) return { score: 4, label: 'Strong', color: '#10B981' };
    return { score: 5, label: 'Very Strong', color: '#059669' };
  };

  const handleSignup = async () => {
    if (role === 'patient') {
      if (!firstName.trim()) {
        showToast('Please enter your name', 'error');
        return;
      }
      if (!surname.trim()) {
        showToast('Please enter your surname', 'error');
        return;
      }
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email || !emailRegex.test(email)) {
      showToast('Please enter a valid email address', 'error');
      return;
    }
    if (!phone || phone.length < 10) {
      showToast('Please enter a valid phone number (min 10 digits)', 'error');
      return;
    }
    if (!password || password.length < 6) {
      showToast('Password must be at least 6 characters long', 'error');
      return;
    }
    
    setIsLoading(true);

    const fullName = role === 'patient' ? `${firstName.trim()} ${surname.trim()}` : `${selectedClinic} Admin`;

    const result = await signup(
      fullName,
      email,
      phone,
      password,
      role,
      role === 'admin' ? selectedClinic : ''
    );
    
    setIsLoading(false);

    if (!result.success) {
      showToast(result.message, 'error');
      return;
    }
    
    showToast('Signup successful!', 'success');
    
    if (role === 'patient') {
      addPatient({ name: fullName, email, phone });
    }
    if (role === 'admin') {
      navigation.replace('Admin');
    } else {
      navigation.replace('Home');
    }
  };
  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
    >
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Back Button */}
        <TouchableOpacity
          style={styles.backBtn}
          onPress={() => navigation.goBack()}
        >
          <Ionicons
            name="arrow-back"
            size={24}
            color={COLORS.primary}
          />
        </TouchableOpacity>
        {/* Branding */}
        <View style={styles.brandContainer}>
          <Text style={styles.title}>Create Account</Text>
          <Text style={styles.subtitle}>
            Join MedSync Local Clinic Care
          </Text>
        </View>
        {/* Card */}
        <View style={styles.card}>
          {/* Role Tabs */}
          <View style={styles.tabContainer}>
            <TouchableOpacity
              style={[
                styles.tabButton,
                role === 'patient' && styles.tabButtonActive,
              ]}
              onPress={() => {
                setRole('patient');
                setShowClinicDropdown(false);
              }}
            >
              <Text
                style={[
                  styles.tabText,
                  role === 'patient' && styles.tabTextActive,
                ]}
              >
                Patient
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.tabButton,
                role === 'admin' && styles.tabButtonActive,
              ]}
              onPress={() => setRole('admin')}
            >
              <Text
                style={[
                  styles.tabText,
                  role === 'admin' && styles.tabTextActive,
                ]}
              >
                Clinic Admin
              </Text>
            </TouchableOpacity>
          </View>
          {/* Name & Surname Fields */}
          {role === 'patient' && (
            <>
              <View style={styles.inputContainer}>
                <Ionicons
                  name="person-outline"
                  size={20}
                  color="#94A3B8"
                  style={styles.inputIcon}
                />
                <TextInput
                  placeholder="First Name"
                  value={firstName}
                  onChangeText={setFirstName}
                  style={styles.input}
                  placeholderTextColor="#94A3B8"
                />
              </View>
              <View style={styles.inputContainer}>
                <Ionicons
                  name="person-outline"
                  size={20}
                  color="#94A3B8"
                  style={styles.inputIcon}
                />
                <TextInput
                  placeholder="Surname"
                  value={surname}
                  onChangeText={setSurname}
                  style={styles.input}
                  placeholderTextColor="#94A3B8"
                />
              </View>
            </>
          )}
          {/* Email */}
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
          {/* Phone */}
          <View style={styles.inputContainer}>
            <Ionicons
              name="phone-portrait-outline"
              size={20}
              color="#94A3B8"
              style={styles.inputIcon}
            />
            <TextInput
              placeholder="Phone Number"
              value={phone}
              onChangeText={setPhone}
              style={styles.input}
              placeholderTextColor="#94A3B8"
              keyboardType="phone-pad"
            />
          </View>
          {/* Password */}
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
            />
            <TouchableOpacity onPress={() => setShowPassword(!showPassword)} style={{ padding: 4 }}>
              <Ionicons
                name={showPassword ? "eye-outline" : "eye-off-outline"}
                size={20}
                color="#94A3B8"
              />
            </TouchableOpacity>
          </View>
          
          {/* Password Strength Progress Bar */}
          {password.length > 0 && (
            <View style={styles.strengthContainer}>
              <View style={styles.strengthBarRow}>
                {[1, 2, 3, 4].map((index) => {
                  const strengthInfo = getPasswordStrength(password);
                  let isFilled = false;
                  if (strengthInfo.score === 1 && index === 1) isFilled = true; // Too short: 1 red segment
                  else if (strengthInfo.score >= 2 && index <= (strengthInfo.score - 1)) isFilled = true;
                  
                  return (
                    <View 
                      key={index} 
                      style={[
                        styles.strengthSegment, 
                        { backgroundColor: isFilled ? strengthInfo.color : '#E2E8F0' }
                      ]} 
                    />
                  );
                })}
              </View>
              <Text style={[styles.strengthText, { color: getPasswordStrength(password).color }]}>
                {getPasswordStrength(password).label}
              </Text>
            </View>
          )}
          {/* Clinic Dropdown */}
          {role === 'admin' && (
            <View style={{ position: 'relative', zIndex: 10 }}>
              <Text style={styles.fieldLabel}>
                Select Associated Clinic
              </Text>
              <TouchableOpacity
                style={styles.inputContainer}
                onPress={() =>
                  setShowClinicDropdown(!showClinicDropdown)
                }
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
                    {
                      color: COLORS.primary,
                      paddingVertical: 12,
                    },
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
                      <Text style={styles.dropdownItemText}>
                        {clinic}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              )}
            </View>
          )}
          {/* Signup Button */}
          <TouchableOpacity
            style={styles.signupBtn}
            onPress={handleSignup}
            disabled={isLoading}
          >
            {isLoading ? (
              <ActivityIndicator color="#FFFFFF" size="small" />
            ) : (
              <Text style={styles.signupBtnText}>
                SIGN UP
              </Text>
            )}
          </TouchableOpacity>
          {/* Login Redirect */}
          <View style={styles.loginPrompt}>
            <Text style={styles.loginPromptText}>
              Already have an account?
            </Text>
            <TouchableOpacity
              onPress={() => navigation.navigate('Login')}
            >
              <Text style={styles.loginLinkText}>
                {' '}Log In
              </Text>
            </TouchableOpacity>
          </View>
        </View>
        <Text style={styles.footerText}>
          Powered by Hokma Tech
        </Text>
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
    paddingTop: Platform.OS === 'ios' ? 50 : 30,
    paddingBottom: 40,
    minHeight: '100%',
  },
  backBtn: {
    alignSelf: 'flex-start',
    padding: 8,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#EAE8FC',
    marginBottom: 20,
  },
  brandContainer: {
    marginBottom: 24,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: COLORS.primary,
  },
  subtitle: {
    fontSize: 14,
    color: '#64748B',
    marginTop: 4,
    fontWeight: '600',
  },
  card: {
    backgroundColor: COLORS.surface,
    borderRadius: 24,
    padding: 20,
    borderWidth: 1,
    borderColor: '#EAE8FC',
    marginBottom: 24,
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
  fieldLabel: {
    fontSize: 13,
    fontWeight: '700',
    color: '#64748B',
    marginBottom: 6,
    marginLeft: 4,
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
  signupBtn: {
    backgroundColor: COLORS.primary,
    borderRadius: 14,
    paddingVertical: 14,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 10,
    marginBottom: 16,
  },
  signupBtnText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: 'bold',
    letterSpacing: 0.5,
  },
  loginPrompt: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  loginPromptText: {
    color: '#64748B',
    fontSize: 13,
  },
  loginLinkText: {
    color: COLORS.primary,
    fontWeight: 'bold',
    fontSize: 13,
  },
  footerText: {
    fontSize: 12,
    color: '#94A3B8',
    textAlign: 'center',
    marginTop: 10,
  },
  strengthContainer: {
    marginTop: -4,
    marginBottom: 14,
    paddingHorizontal: 4,
  },
  strengthBarRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 6,
    marginBottom: 6,
  },
  strengthSegment: {
    flex: 1,
    height: 4,
    borderRadius: 2,
  },
  strengthText: {
    fontSize: 12,
    fontWeight: '600',
    textAlign: 'right',
  },
});