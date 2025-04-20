import React from "react";
import { TouchableOpacity, StyleSheet, View } from "react-native";
import { COLORS } from "../../styles/theme";

const IconButton = ({
  icon: Icon, // Your custom SVG icon component
  iconSize = 24, // Default icon size
  buttonSize = 48, // Default button size (height & width)
  onPress, // Handle on press event
  style, // Custom styles
  iconColor = COLORS.neutral[200], // Custom styles for the icon
}) => {
  return (
    <TouchableOpacity
      style={[styles.button, { width: buttonSize, height: buttonSize }, style]}
      onPress={onPress}
    >
      <View style={styles.iconContainer}>
        <Icon size={iconSize} stroke={iconColor} />
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 9999,
    backgroundColor: COLORS.primaryNeutral[800],
  },
  iconContainer: {
    justifyContent: "center",
    alignItems: "center",
  },
});

export default IconButton;
