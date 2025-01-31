import React from "react";
import { View, Text, TouchableOpacity, Image, StyleSheet } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";

// Import Styles
import { COLORS } from "../../styles/theme";
import { globalStyles } from "../../styles/global";

const RoleSelection = ({ navigation, handleAuthChangeSuccess }) => {
  const handleSelectRole = async (role) => {
    await AsyncStorage.setItem("selectedRole", role);
    handleAuthChangeSuccess(); // Trigger re-check in AppNavigator
  };

  return (
    <View style={[globalStyles.container, styles.container]}>
      <TouchableOpacity
        style={styles.button}
        onPress={() => handleSelectRole("user")}
      >
        <Text style={[globalStyles.headingH6Bold, styles.text]}>
          Continue as Normal User
        </Text>
        <Image
          source={require("../../../assets/images/UserLoginImage.png")}
          style={styles.image}
        />
      </TouchableOpacity>
      <Text style={[globalStyles.headingH6Bold, styles.text]}>OR</Text>
      <TouchableOpacity
        style={styles.button}
        onPress={() => handleSelectRole("artist")}
      >
        <Text style={[globalStyles.headingH6Bold, styles.text]}>
          Continue as Artist
        </Text>
        <Image
          source={require("../../../assets/images/ArtistLoginImage.png")}
          style={styles.image}
        />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "space-between",
    alignItems: "center",
  },
  image: {
    width: "75%",
    height: "75%",
  },
  button: {
    backgroundColor: COLORS.primaryNeutral[800],
    padding: 12,
    borderWidth: 4,
    borderRadius: 32,
    borderColor: COLORS.primary[500],
    paddingHorizontal: 14,
    paddingVertical: 14,
    width: "83%",
    aspectRatio: 1,
    // height: 268,
    alignItems: "center",
    justifyContent: "center",
    gap: 16,
  },
  text: {
    color: COLORS.neutral[50],
  },
});

export default RoleSelection;
