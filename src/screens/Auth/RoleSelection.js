import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";

const RoleSelection = ({ navigation, handleAuthChangeSuccess }) => {
  const handleSelectRole = async (role) => {
    await AsyncStorage.setItem("selectedRole", role);
    handleAuthChangeSuccess(); // Trigger re-check in AppNavigator
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Choose Your Role</Text>
      <TouchableOpacity
        style={styles.button}
        onPress={() => handleSelectRole("artist")}
      >
        <Text style={styles.buttonText}>Continue as Artist</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.button}
        onPress={() => handleSelectRole("user")}
      >
        <Text style={styles.buttonText}>Continue as User</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: "center", alignItems: "center" },
  title: { fontSize: 22, fontWeight: "bold", marginBottom: 20 },
  button: {
    backgroundColor: "#007AFF",
    padding: 12,
    borderRadius: 8,
    marginVertical: 10,
    width: 200,
    alignItems: "center",
  },
  buttonText: { color: "#fff", fontSize: 16, fontWeight: "bold" },
});

export default RoleSelection;
