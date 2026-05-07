import React from "react";
import { View, Text, SafeAreaView, StyleSheet, ScrollView } from 'react-native';

export default function DetailScreen({ route }) {
  const { dataPresensi } = route.params;

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView>
        <View style={styles.card}>
          <Text style={styles.title}>
            {dataPresensi.course || dataPresensi.kodeMk || "Detail Presensi"}
          </Text>

          <View style={styles.row}>
            <Text style={styles.label}>Kode Matkul:</Text>
            <Text style={styles.value}>{dataPresensi.kodeMk}</Text>
          </View>

          <View style={styles.row}>
            <Text style={styles.label}>Tanggal:</Text>
            <Text style={styles.value}>{dataPresensi.date}</Text>
          </View>

          <View style={styles.row}>
            <Text style={styles.label}>Jam:</Text>
            <Text style={styles.value}>{dataPresensi.jamPresensi}</Text>
          </View>

          <View style={styles.row}>
            <Text style={styles.label}>Status:</Text>
            <Text style={[styles.value, dataPresensi.status === "Present" ? styles.present : styles.absent]}>
              {dataPresensi.status}
            </Text>
          </View>

          <View style={styles.row}>
            <Text style={styles.label}>Ruangan:</Text>
            <Text style={styles.value}>{dataPresensi.ruangan || "-"}</Text>
          </View>

          <View style={styles.row}>
            <Text style={styles.label}>Dosen:</Text>
            <Text style={styles.value}>{dataPresensi.dosenPengampu || "-"}</Text>
          </View>

          <View style={styles.row}>
            <Text style={styles.label}>Pertemuan Ke:</Text>
            <Text style={styles.value}>{dataPresensi.pertemuanKe}</Text>
          </View>
          
          {dataPresensi.catatan && (
            <View style={styles.row}>
              <Text style={styles.label}>Catatan:</Text>
              <Text style={styles.value}>{dataPresensi.catatan}</Text>
            </View>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#F5F5F5", padding: 15 },
  card: { backgroundColor: "white", padding: 20, borderRadius: 10, elevation: 3 },
  title: { 
    fontSize: 20, 
    fontWeight: "bold", 
    borderBottomWidth: 1,
    borderBottomColor: '#eee', 
    paddingBottom: 15, 
    marginBottom: 15,
    color: "#0056A0"
  },
  row: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 15 },
  label: { fontSize: 14, color: "gray", flex: 1 },
  value: { fontSize: 14, fontWeight: "bold", color: "#333", flex: 2, textAlign: 'right' },
  present: { color: "green" },
  absent: { color: "red" }
});