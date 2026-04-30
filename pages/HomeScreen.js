import React, { useState, useEffect, useMemo, useRef, useContext } from "react";
import {
  View,
  Text,
  SafeAreaView,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Alert,
  TextInput,
  ActivityIndicator,
} from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { AuthContext } from "../context/AuthContext";

const HomeScreen = ({ navigation }) => {
  const { userData, logout } = useContext(AuthContext);
  const [isCheckedIn, setIsCheckedIn] = useState(false);
  const [currentTime, setCurrentTime] = useState("Memuat jam...");
  const [note, setNote] = useState("");
  const [isPosting, setIsPosting] = useState(false); 
  const noteInputRef = useRef(null);
  const BASE_URL = "http://10.1.11.55:8081/api/presensi";

  useEffect(() => {
  const fetchStatusAbsen = async () => {
    const response = await fetch(`${BASE_URL}/status/${userData.mhsNim}`);
    const result = await response.json();

    if (result?.alreadyPresent === true) {
      setIsCheckedIn(true);
    } else {
      setIsCheckedIn(false);
    }
  };

    if (userData?.mhsNim) {
      fetchStatusAbsen();
    }
  }, [userData]);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date().toLocaleTimeString("id-ID", { hour12: false }));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const attendanceStats = useMemo(() => {
    return { totalPresent: 12, totalAbsent: 2 };
  }, []);

  const handleCheckIn = async () => {
    if (isCheckedIn) return Alert.alert("Perhatian", "Anda sudah Check In.");
    if (note.trim() === "") {
      Alert.alert("Peringatan", "Catatan kehadiran wajib diisi!");
      noteInputRef.current.focus();
      return;
    }

    setIsPosting(true);
    const now = new Date();
    const payload = {
      kodeMk: "TRPL205",
      course: "Mobile Programming",
      status: "Present",
      nimMhs: userData.mhsNim,
      pertemuanKe: 5,
      date: now.toISOString().split("T")[0],
      jamPresensi: now.toLocaleTimeString("id-ID", { hour12: false }),
      kode_qr: "AUTH-TRPL205-W5-XYZ987",
      ruangan: "Lab Komputer 3",
      dosenPengampu: "Tim Dosen TRPL",
      catatan: note 
    };

    try {
      const response = await fetch(BASE_URL, {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
  body: JSON.stringify(payload),
});

const text = await response.text();
console.log("RAW RESPONSE:", text);
try {
  const json = JSON.parse(text);
  console.log("JSON RESPONSE:", json);
} catch (e) {
  console.log("INI BUKAN JSON ❌");
}

      if (response.ok) {
        setIsCheckedIn(true); 
        Alert.alert("Berhasil!", "Presensi masuk ke Database.", [
          { text: "Lihat Riwayat", onPress: () => navigation.navigate("History") },
        ]);
      } else {
        Alert.alert("Gagal", "Terjadi kesalahan di server.");
      }
    } catch (error) {
      Alert.alert("Error Jaringan", "Cek koneksi internet/server.");
    } finally {
      setIsPosting(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.headerRow}>
          <Text style={styles.title}>Attendance App</Text>
          <Text style={styles.clockText}>{currentTime}</Text>
          <TouchableOpacity onPress={logout} style={styles.logoutButton}>
            <Text style={styles.logoutText}>Logout</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.card}>
          <View style={styles.icon}>
            <MaterialIcons name="person" size={40} color="#555" />
          </View>
          <View>
            <Text style={styles.name}>{userData?.nama || "Danisha Akhmadiani"}</Text>
            <Text>NIM : {userData?.mhsNim  || "0320240017"}</Text>
            <Text>Class : Informatika-2A</Text>
          </View>
        </View>

        <View style={styles.classCard}>
          <Text style={styles.subtitle}>Today's Class</Text>
          <Text>Mobile Programming (TRPL205)</Text>
          <Text>08:00 - 10:00</Text>
          <Text>Lab 3</Text>

          {!isCheckedIn && (
            <TextInput
              ref={noteInputRef}
              style={styles.inputCatatan}
              placeholder="Tulis catatan (Contoh: Hadir)"
              value={note}
              onChangeText={setNote}
            />
          )}

          {isPosting ? (
            <ActivityIndicator size="large" color="#0056A0" style={{ marginTop: 15 }} />
          ) : (
            <TouchableOpacity
              style={[styles.button, isCheckedIn ? styles.buttonDisabled : styles.buttonActive]}
              onPress={handleCheckIn}
              disabled={isCheckedIn}
            >
              <Text style={styles.buttonText}>
                {isCheckedIn ? "CHECKED IN" : "CHECK IN SEKARANG"}
              </Text>
            </TouchableOpacity>
          )}
        </View>

        <View style={styles.statsCard}>
          <View style={styles.statBox}>
            <Text style={styles.statNumber}>{attendanceStats.totalPresent}</Text>
            <Text style={styles.statLabel}>Total Present</Text>
          </View>
          <View style={styles.statBox}>
            <Text style={[styles.statNumber, { color: "red" }]}>
              {attendanceStats.totalAbsent}
            </Text>
            <Text style={styles.statLabel}>Total Absent</Text>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#F5F5F5" },
  content: { padding: 20 },
  headerRow: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 20 },
  title: { fontSize: 24, fontWeight: "bold", color: "#0056A0" },
  clockText: { fontSize: 16, color: "#666", fontWeight: "500" },
  logoutButton: { marginLeft: 12, backgroundColor: "#d9534f", paddingVertical: 4, paddingHorizontal: 10, borderRadius: 6 },
  logoutText: { color: "#fff", fontWeight: "bold", fontSize: 12 },
  card: { backgroundColor: "white", padding: 20, borderRadius: 12, flexDirection: "row", alignItems: "center", marginBottom: 20, elevation: 3 },
  icon: { marginRight: 15, backgroundColor: "#F0F0F0", padding: 10, borderRadius: 30 },
  name: { fontSize: 18, fontWeight: "bold", color: "#333" },
  classCard: { backgroundColor: "white", padding: 20, borderRadius: 12, marginBottom: 20, elevation: 3 },
  subtitle: { fontSize: 18, fontWeight: "bold", marginBottom: 10, color: "#333" },
  inputCatatan: { borderWidth: 1, borderColor: "#DDD", borderRadius: 8, padding: 10, marginTop: 15, marginBottom: 15 },
  button: { padding: 15, borderRadius: 8, alignItems: "center", marginTop: 10 },
  buttonActive: { backgroundColor: "#0056A0" },
  buttonDisabled: { backgroundColor: "#CCC" },
  buttonText: { color: "white", fontWeight: "bold", fontSize: 16 },
  statsCard: { flexDirection: "row", justifyContent: "space-between", marginBottom: 30 },
  statBox: { backgroundColor: "white", padding: 20, borderRadius: 12, alignItems: "center", width: "48%", elevation: 2 },
  statNumber: { fontSize: 24, fontWeight: "bold", color: "green" },
  statLabel: { fontSize: 12, color: "#777", marginTop: 5 },
});

export default HomeScreen;