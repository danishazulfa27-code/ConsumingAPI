import React, { useState, useContext } from "react";
import { View, TextInput, Button, Alert } from "react-native";
import axios from "axios";
import { AuthContext } from "../context/AuthContext";

const BASE_URL = "http://10.1.11.55:8081/api/user";

export default function LoginScreen() {
  const { login } = useContext(AuthContext);
  const [nim, setNim] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async () => {
    console.log("--- Mencoba Login ---");
    console.log("NIM:", nim);
    console.log("Password:", password);

    try {
      const res = await axios.post(
        BASE_URL + "/login",
        { nim, password },
        {
          headers: {
            authcode: "astratech@123",
          },
        }
      );

      console.log("Respon Server:", res.data);

      if (res.data.code === 200 && res.data.data) {
        console.log("Login Berhasil! Data user disimpan.");
        login(res.data.data);
      } else {
        console.log("Login Gagal:", res.data.message);
        Alert.alert("Login Gagal", res.data.message || "Username/Password salah");
      }
    } catch (err) {
      console.error("Error Detail:", err);
      
      if (err.response) {
        console.log("Error Response Data:", err.response.data);
        console.log("Error Status:", err.response.status);
      } else if (err.request) {
        console.log("Tidak ada respon dari server. Cek IP & Backend!");
      }

      Alert.alert("Error", "Tidak bisa konek ke server. Cek console log!");
    }
  };

  return (
    <View style={{ padding: 20 }}>
      <TextInput
        placeholder="NIM"
        value={nim}
        onChangeText={setNim}
        style={{ borderWidth: 1, marginBottom: 10, padding: 8 }}
      />
      <TextInput
        placeholder="Password"
        value={password}
        secureTextEntry
        onChangeText={setPassword}
        style={{ borderWidth: 1, marginBottom: 10, padding: 8 }}
      />
      <Button title="Login" onPress={handleLogin} />
    </View>
  );
}