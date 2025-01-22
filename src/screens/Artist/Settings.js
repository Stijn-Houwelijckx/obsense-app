import React from "react";
import { View, Text, Button } from "react-native";

const Settings = ({ navigation }) => (
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
  </View>
);

export default Settings;
