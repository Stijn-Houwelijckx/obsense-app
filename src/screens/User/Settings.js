import React from "react";
import { View, Text, Button } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";

const Settings = ({ navigation, handleAuthChangeSuccess }) => {
  const handleLogout = async () => {
    try {
      // Remove user-related data from AsyncStorage
      await AsyncStorage.removeItem("userToken");
      await AsyncStorage.removeItem("userId");
      await AsyncStorage.removeItem("isArtist");

      // Trigger re-check in AppNavigator
      handleAuthChangeSuccess(); // This will notify AppNavigator to update
    } catch (error) {
      console.error("Logout failed:", error.message);
    }
  };

  return (
    <View>
      <Text>Settings</Text>
      <Button
        title="Go to Account Settings"
        onPress={() => navigation.navigate("AccountSettings")}
      />

      <Button
        title="Go to Change Password"
        onPress={() => navigation.navigate("ChangePassword")}
      />

      <Button
        title="Go to Notifications"
        onPress={() => navigation.navigate("Notification")}
      />

      {/* Logout Button */}
      <Button title="Logout" onPress={handleLogout} />
    </View>
  );
};

export default Settings;
