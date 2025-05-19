import React from "react";
import { TouchableOpacity, Text, StyleSheet, View } from "react-native";

// Import Styles
import { COLORS } from "../../styles/theme";
import { globalStyles } from "../../styles/global";

// Icon components
import { AppleIcon, GoogleIcon, FacebookIcon } from "../icons";

const ICONS = {
  apple: <AppleIcon size={24} fill="black" />,
  google: <GoogleIcon size={24} />,
  facebook: <FacebookIcon size={24} fColor="white" bgColor="#0866FF" />,
};

const SocialButton = ({
  provider, // 'apple' | 'google' | 'facebook'
  onPress,
  showText = false, // Determines if text is included
  backgroundColor, // Custom background color
  borderColor, // Custom border color
  textColor, // Custom text color
  style, // Allows external styling (e.g., width)
}) => {
  const buttonStyle = [
    styles.button,
    styles[provider], // Default provider style
    backgroundColor && { backgroundColor }, // Custom background color
    borderColor && { borderColor, borderWidth: 1 }, // Custom border color
    style, // Allows external width, height, etc.
  ];

  const textStyle = [
    styles.text,
    globalStyles.labelSmallMedium,
    styles[`text_${provider}`], // Default text color per provider
    textColor && { color: textColor }, // Custom text color
  ];

  return (
    <TouchableOpacity style={buttonStyle} onPress={onPress}>
      {ICONS[provider]}
      {showText && (
        <Text style={textStyle}>Sign in with {capitalize(provider)}</Text>
      )}
    </TouchableOpacity>
  );
};

// Helper function to capitalize first letter
const capitalize = (str) => str.charAt(0).toUpperCase() + str.slice(1);

const styles = StyleSheet.create({
  button: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 8,
    paddingHorizontal: 12,
    height: 36,
    gap: 8, // Space between icon and text
  },
  apple: {
    backgroundColor: "#000",
  },
  google: {
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: COLORS.primary[50],
  },
  facebook: {
    backgroundColor: "#1877F2",
  },
  text: {},
  text_apple: {
    color: "#fff",
  },
  text_google: {
    color: "#000",
  },
  text_facebook: {
    color: "#fff",
  },
});

export default SocialButton;
