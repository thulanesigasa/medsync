import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Alert,
} from "react-native";
import { MaterialCommunityIcons, Ionicons } from "@expo/vector-icons";
import { COLORS, SIZES, LAYOUT } from "../constants/theme";
import BottomTabBar from "../components/BottomTabBar";
import { useStateContext } from "../context/StateContext";

export default function ProfileScreen({ navigation }) {
  const { currentUser, updateCurrentUser, logout } = useStateContext();

  const [isEditing, setIsEditing] = useState(false);

  const [form, setForm] = useState({
    name: currentUser?.name || "",
    email: currentUser?.email || "",
    phone: currentUser?.phone || "",
    emergencyContact: currentUser?.emergencyContact || "",
    medicalAidProvider: currentUser?.medicalAidProvider || "",
    medicalAidNumber: currentUser?.medicalAidNumber || "",
    bloodType: currentUser?.bloodType || "",
    allergies: currentUser?.allergies || "",
    chronicConditions: currentUser?.chronicConditions || "",
  });

  const updateField = (field, value) => {
    setForm((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSave = () => {
    updateCurrentUser(form);
    setIsEditing(false);
    Alert.alert("Profile Updated", "Your profile details have been saved.");
  };

  const handleLogout = () => {
    logout();
    navigation.replace("Login");
  };

  const renderField = (label, field, placeholder) => (
    <View style={styles.fieldGroup}>
      <Text style={styles.fieldLabel}>{label}</Text>
      {isEditing ? (
        <TextInput
          value={form[field]}
          onChangeText={(value) => updateField(field, value)}
          placeholder={placeholder}
          placeholderTextColor="#94A3B8"
          style={styles.input}
        />
      ) : (
        <Text style={styles.fieldValue}>{form[field] || "Not added yet"}</Text>
      )}
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.headerContent}>
          <View style={styles.headerBrand}>
            <MaterialCommunityIcons
              name="shield-plus"
              size={28}
              color="#FFFFFF"
            />
            <Text style={styles.appTitle}>MedSync</Text>
          </View>
        </View>
      </View>

      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.profileCard}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>
              {(form.name || "P").charAt(0).toUpperCase()}
            </Text>
          </View>

          <Text style={styles.profileName}>{form.name || "Patient Name"}</Text>
          <Text style={styles.profileEmail}>
            {form.email || "No email added"}
          </Text>

          <View style={styles.memberBadge}>
            <Ionicons name="heart-circle-outline" size={16} color="#D97706" />
            <Text style={styles.memberBadgeText}>Gold Care Member</Text>
          </View>

          <TouchableOpacity
            style={styles.editBtn}
            onPress={() => (isEditing ? handleSave() : setIsEditing(true))}
          >
            <Text style={styles.editBtnText}>
              {isEditing ? "Save Profile" : "Edit Profile Details"}
            </Text>
            <Ionicons
              name={isEditing ? "checkmark-outline" : "create-outline"}
              size={16}
              color={COLORS.primary}
            />
          </TouchableOpacity>
        </View>

        <Text style={styles.sectionHeader}>PERSONAL INFORMATION</Text>
        <View style={styles.sectionCard}>
          {renderField("Full Name", "name", "Enter full name")}
          {renderField("Email Address", "email", "Enter email address")}
          {renderField("Phone Number", "phone", "Enter phone number")}
          {renderField(
            "Emergency Contact",
            "emergencyContact",
            "Enter emergency contact",
          )}
        </View>

        <Text style={styles.sectionHeader}>MEDICAL INFORMATION</Text>
        <View style={styles.sectionCard}>
          {renderField(
            "Medical Aid Provider",
            "medicalAidProvider",
            "Enter medical aid provider",
          )}
          {renderField(
            "Medical Aid Number",
            "medicalAidNumber",
            "Enter medical aid number",
          )}
          {renderField("Blood Type", "bloodType", "Example: O+")}
          {renderField(
            "Allergies",
            "allergies",
            "Example: Penicillin, peanuts",
          )}
          {renderField(
            "Chronic Conditions",
            "chronicConditions",
            "Example: Asthma, diabetes",
          )}
        </View>

        <Text style={styles.sectionHeader}>PREFERENCES</Text>
        <View style={styles.sectionCard}>
          <View style={styles.infoRow}>
            <View style={styles.iconBox}>
              <Ionicons
                name="notifications-outline"
                size={20}
                color={COLORS.primary}
              />
            </View>
            <Text style={styles.infoText}>Push Notifications</Text>
            <Text style={styles.infoValue}>ON</Text>
          </View>

          <View style={styles.infoRow}>
            <View style={styles.iconBox}>
              <Ionicons
                name="language-outline"
                size={20}
                color={COLORS.primary}
              />
            </View>
            <Text style={styles.infoText}>Language</Text>
            <Text style={styles.infoValue}>English (SA)</Text>
          </View>
        </View>

        <Text style={styles.sectionHeader}>HELP & SUPPORT</Text>
        <View style={styles.sectionCard}>
          <TouchableOpacity style={styles.infoRow}>
            <View style={styles.iconBox}>
              <Ionicons
                name="help-circle-outline"
                size={20}
                color={COLORS.primary}
              />
            </View>
            <Text style={styles.infoText}>Help Center & FAQ</Text>
            <Ionicons name="chevron-forward" size={18} color="#94A3B8" />
          </TouchableOpacity>

          <TouchableOpacity style={styles.infoRow}>
            <View style={styles.iconBox}>
              <Ionicons
                name="document-text-outline"
                size={20}
                color={COLORS.primary}
              />
            </View>
            <Text style={styles.infoText}>Terms & Privacy Policy</Text>
            <Ionicons name="chevron-forward" size={18} color="#94A3B8" />
          </TouchableOpacity>
        </View>

        <TouchableOpacity style={styles.logoutBtn} onPress={handleLogout}>
          <Ionicons name="log-out-outline" size={20} color="#EF4444" />
          <Text style={styles.logoutText}>Log Out</Text>
        </TouchableOpacity>
      </ScrollView>

      <BottomTabBar navigation={navigation} activeTab="Profile" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  header: {
    backgroundColor: COLORS.primary,
    paddingTop: LAYOUT.statusBarHeight,
    height: LAYOUT.statusBarHeight + LAYOUT.headerHeight,
  },
  headerContent: {
    height: LAYOUT.headerHeight,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: SIZES.margin,
  },
  headerBrand: {
    flexDirection: "row",
    alignItems: "center",
  },
  appTitle: {
    color: "#FFFFFF",
    fontSize: 22,
    fontWeight: "bold",
    marginLeft: 10,
  },
  content: {
    padding: SIZES.margin,
    paddingBottom: 120,
    gap: 12,
  },
  profileCard: {
    backgroundColor: COLORS.surface,
    borderRadius: 20,
    padding: 18,
    borderWidth: 1,
    borderColor: "#EAE8FC",
    alignItems: "center",
    shadowColor: "#0F2C59",
    shadowOpacity: 0.04,
    shadowRadius: 10,
    elevation: 2,
  },
  avatar: {
    width: 74,
    height: 74,
    borderRadius: 37,
    backgroundColor: COLORS.primary,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 10,
  },
  avatarText: {
    fontSize: 30,
    fontWeight: "bold",
    color: "#FFFFFF",
  },
  profileName: {
    fontSize: 20,
    fontWeight: "bold",
    color: COLORS.primary,
  },
  profileEmail: {
    fontSize: 13,
    color: "#64748B",
    marginTop: 3,
  },
  memberBadge: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FEF3C7",
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 8,
    marginTop: 10,
    gap: 4,
  },
  memberBadgeText: {
    color: "#D97706",
    fontSize: 12,
    fontWeight: "bold",
  },
  editBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#EFF6FF",
    paddingVertical: 11,
    paddingHorizontal: 16,
    borderRadius: 12,
    gap: 6,
    marginTop: 14,
    width: "100%",
  },
  editBtnText: {
    color: COLORS.primary,
    fontSize: 13,
    fontWeight: "bold",
  },
  sectionHeader: {
    fontSize: 11,
    fontWeight: "700",
    color: "#64748B",
    marginTop: 10,
    marginLeft: 4,
    letterSpacing: 0.8,
  },
  sectionCard: {
    backgroundColor: COLORS.surface,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "#EAE8FC",
    padding: 14,
    gap: 12,
    shadowColor: "#0F2C59",
    shadowOpacity: 0.02,
    shadowRadius: 5,
    elevation: 1,
  },
  fieldGroup: {
    borderBottomWidth: 1,
    borderBottomColor: "#F1F5F9",
    paddingBottom: 10,
  },
  fieldLabel: {
    fontSize: 12,
    color: "#64748B",
    fontWeight: "700",
    marginBottom: 5,
  },
  fieldValue: {
    fontSize: 15,
    color: COLORS.primary,
    fontWeight: "600",
  },
  input: {
    backgroundColor: "#F8FAFC",
    borderWidth: 1,
    borderColor: "#E2E8F0",
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 10,
    color: COLORS.primary,
    fontSize: 14,
  },
  infoRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 8,
    gap: 10,
  },
  iconBox: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: "#EFF6FF",
    alignItems: "center",
    justifyContent: "center",
  },
  infoText: {
    flex: 1,
    fontSize: 14,
    color: COLORS.primary,
    fontWeight: "600",
  },
  infoValue: {
    fontSize: 13,
    color: "#64748B",
    fontWeight: "600",
  },
  logoutBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#FEF2F2",
    paddingVertical: 14,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "#FECACA",
    marginTop: 16,
    gap: 8,
  },
  logoutText: {
    color: "#EF4444",
    fontSize: 15,
    fontWeight: "bold",
  },
});
