import React from "react";
import { View, Text, Button, StyleSheet } from "react-native";

const LandingPage = ({ navigation }) => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Welcome to Obsense</Text>
      <Button
        title="Login"
        onPress={() => navigation.navigate("Login")} // Navigate to Login screen
      />
      <Button
        title="Sign Up"
        onPress={() => navigation.navigate("SignUp")} // Navigate to Signup screen
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  title: {
    fontSize: 24,
    marginBottom: 40,
  },
});

export default LandingPage;
