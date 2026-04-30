import React, { useState, useEffect, useContext } from "react";
import { View, Text, FlatList, StyleSheet, ActivityIndicator } from "react-native";
import { AuthContext } from "../context/AuthContext";

const HistoryScreen = () => {
  const { userData } = useContext(AuthContext);
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const BASE_URL = "http://10.1.11.55:8081/api/presensi/history";

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const nim = userData?.mhsNim;
        
        if (!nim) {
          console.log("NIM tidak ditemukan di context");
          setLoading(false);
          return;
        }

        const response = await fetch(`${BASE_URL}/${nim}`);
        const data = await response.json();
        console.log("DATA HISTORY:", data);

        if (data && data.content) {
        setHistory(data.content);
          } else if (Array.isArray(data)) {
            setHistory(data);
          } else {
            setHistory([]);
          }
          } catch (error) {
            console.error("Gagal mengambil riwayat:", error);
          } finally {
            setLoading(false);
          }
        };

    fetchHistory();
  }, [userData]);

  if (loading) {
    return <ActivityIndicator size="large" color="#0056A0" style={{ flex: 1 }} />;
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={history}
        keyExtractor={(item) => item.id.toString()}
        ListEmptyComponent={<Text style={styles.emptyText}>Tidak ada riwayat absensi.</Text>}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <View>
              <Text style={styles.courseName}>{item.course}</Text>
              <Text style={styles.dateText}>{item.date} | {item.jamPresensi}</Text>
              <Text style={styles.roomText}>Ruangan: {item.ruangan}</Text>
            </View>
            <View style={styles.statusBadge}>
              <Text style={styles.statusText}>{item.status}</Text>
            </View>
          </View>
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#F5F5F5", padding: 15 },
  card: {
    backgroundColor: "white",
    padding: 15,
    borderRadius: 10,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 10,
    elevation: 2,
  },
  courseName: { fontSize: 16, fontWeight: "bold", color: "#333" },
  dateText: { fontSize: 13, color: "#666", marginTop: 2 },
  roomText: { fontSize: 12, color: "#888" },
  statusBadge: { backgroundColor: "#E8F5E9", padding: 6, borderRadius: 5 },
  statusText: { color: "#2E7D32", fontWeight: "bold", fontSize: 12 },
  emptyText: { textAlign: "center", marginTop: 50, color: "#999" },
});

export default HistoryScreen;