import React from "react";
import { TouchableOpacity, Text, StyleSheet } from "react-native";
import {
  COLORS,
  FONT_SIZES,
  LINE_HEIGHT,
  LETTER_SPACING,
} from "../../styles/theme";

const CustomButton = ({
  variant = "filled",
  size = "large",
  title,
  onPress,
}) => {
  return (
    <TouchableOpacity
      style={[styles.base, styles[variant], styles[size]]}
      onPress={onPress}
    >
      <Text
        style={[styles.text, styles[`text_${variant}`], styles[`text_${size}`]]}
      >
        {title}
      </Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  base: {
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 14,
  },
  // Filled Button Styles
  filled: {
    backgroundColor: COLORS.primary[500],
  },
  text_filled: {
    color: COLORS.neutral[950],
  },

  // Outlined Button Styles
  outlined: {
    borderWidth: 1,
    borderColor: COLORS.primary[500],
    backgroundColor: "transparent",
  },
  text_outlined: {
    color: COLORS.primary[500],
  },

  // Text Button Styles
  text: {
    backgroundColor: "transparent",
  },
  text_text: {
    color: COLORS.primary[500],
  },

  // Error Button Styles
  error: {
    borderWidth: 1,
    borderColor: COLORS.error[600],
    backgroundColor: COLORS.error[300],
  },
  text_error: {
    color: COLORS.error[500],
  },

  // Button Size Styles
  large: {
    paddingHorizontal: 20,
    paddingVertical: 14,
  },
  medium: {
    paddingHorizontal: 16,
    paddingVertical: 10,
  },
  small: {
    paddingHorizontal: 12,
    paddingVertical: 8,
  },

  // Text Size Styles
  text_large: {
    fontSize: FONT_SIZES.label.lg,
    lineHeight: LINE_HEIGHT.label.lg,
    letterSpacing: LETTER_SPACING.label.lg,
    fontFamily: "Nunito-Bold",
  },
  text_medium: {
    fontSize: FONT_SIZES.label.md,
    lineHeight: LINE_HEIGHT.label.md,
    letterSpacing: LETTER_SPACING.label.md,
    fontFamily: "Nunito-Bold",
  },
  text_small: {
    fontSize: FONT_SIZES.label.sm,
    lineHeight: LINE_HEIGHT.label.sm,
    letterSpacing: LETTER_SPACING.label.sm,
    fontFamily: "Nunito-Bold",
  },
});

export default CustomButton;
