import React from "react";
import { View, Text, Button } from "react-native";

const Settings = ({ navigation }) => (
  <View>
    <Text>Settings</Text>
    <Button
      title="Go to Account Settings"
      onPress={() => navigation.navigate("AccountSettings")}
    />
  </View>
);

export default Settings;
