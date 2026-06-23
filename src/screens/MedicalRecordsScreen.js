import React from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { COLORS, SIZES, LAYOUT } from "../constants/theme";
import { useStateContext } from "../context/StateContext";

export default function MedicalRecordsScreen({ navigation }) {
  const { currentUser, patients = [] } = useStateContext();

  const patientRecord = patients.find(
    (p) => p.name?.toLowerCase() === currentUser?.name?.toLowerCase(),
  );

  const medicalNotes = patientRecord?.medicalNotes || [];

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color="#FFFFFF" />
        </TouchableOpacity>

        <Text style={styles.headerTitle}>Medical Records</Text>

        <View style={{ width: 24 }} />
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.summaryCard}>
          <Text style={styles.cardTitle}>Health Summary</Text>

          <Text style={styles.info}>
            Blood Type: {currentUser?.bloodType || "Not Added"}
          </Text>

          <Text style={styles.info}>
            Allergies: {currentUser?.allergies || "Not Added"}
          </Text>

          <Text style={styles.info}>
            Chronic Conditions: {currentUser?.chronicConditions || "Not Added"}
          </Text>

          <Text style={styles.info}>
            Emergency Contact: {currentUser?.emergencyContact || "Not Added"}
          </Text>
        </View>

        <View style={styles.summaryCard}>
          <Text style={styles.cardTitle}>Medical Aid</Text>

          <Text style={styles.info}>
            Provider: {currentUser?.medicalAidProvider || "Not Added"}
          </Text>

          <Text style={styles.info}>
            Number: {currentUser?.medicalAidNumber || "Not Added"}
          </Text>
        </View>

        <Text style={styles.sectionTitle}>Consultation History</Text>

        {medicalNotes.length === 0 ? (
          <View style={styles.emptyCard}>
            <Text style={styles.emptyText}>
              No consultation records available.
            </Text>
          </View>
        ) : (
          medicalNotes.map((note, index) => (
            <View key={index} style={styles.recordCard}>
              <Text style={styles.recordDate}>{note.date}</Text>

              <Text style={styles.recordLabel}>Diagnosis</Text>
              <Text style={styles.recordText}>
                {note.diagnosis || "Not provided"}
              </Text>

              <Text style={styles.recordLabel}>Treatment</Text>
              <Text style={styles.recordText}>
                {note.treatment || "Not provided"}
              </Text>

              {note.notes ? (
                <>
                  <Text style={styles.recordLabel}>Doctor Notes</Text>
                  <Text style={styles.recordText}>{note.notes}</Text>
                </>
              ) : null}
            </View>
          ))
        )}
      </ScrollView>
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
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: SIZES.margin,
  },
  headerTitle: {
    color: "#FFFFFF",
    fontSize: 18,
    fontWeight: "bold",
  },
  content: {
    padding: SIZES.margin,
    paddingBottom: 40,
  },
  summaryCard: {
    backgroundColor: COLORS.surface,
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: "#EAE8FC",
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: COLORS.primary,
    marginBottom: 12,
  },
  info: {
    fontSize: 14,
    color: "#475569",
    marginBottom: 8,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: COLORS.primary,
    marginBottom: 12,
  },
  emptyCard: {
    backgroundColor: COLORS.surface,
    borderRadius: 16,
    padding: 20,
    alignItems: "center",
  },
  emptyText: {
    color: "#64748B",
  },
  recordCard: {
    backgroundColor: COLORS.surface,
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: "#EAE8FC",
  },
  recordDate: {
    color: COLORS.primary,
    fontWeight: "bold",
    marginBottom: 10,
  },
  recordLabel: {
    fontWeight: "bold",
    color: COLORS.primary,
    marginTop: 6,
  },
  recordText: {
    color: "#475569",
    marginTop: 2,
  },
});
