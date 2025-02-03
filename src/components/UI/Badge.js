import React from "react";
import { View, Text, StyleSheet } from "react-native";
import {
  COLORS,
  FONT_SIZES,
  LINE_HEIGHT,
  LETTER_SPACING,
} from "../../styles/theme";

const Badge = ({
  size = "large",
  shape = "round",
  type = "primary",
  styleType = "filled",
  text,
  leadingIcon,
  trailingIcon,
  style,
}) => {
  const badgeStyle = [
    styles.base,
    styles[size],
    styles[shape],
    styles[`${type}_${styleType}`],
    style,
  ];

  const textColor =
    styles[`text_${type}_${styleType}`]?.color || COLORS.neutral[950];
  const iconSize = size === "small" ? 12 : 16;

  return (
    <View style={[badgeStyle]}>
      {leadingIcon &&
        React.createElement(leadingIcon, { size: iconSize, stroke: textColor })}
      <Text
        style={[
          styles.text,
          styles[`text_${type}_${styleType}`],
          styles[`text_${size}`],
        ]}
      >
        {text}
      </Text>
      {trailingIcon &&
        React.createElement(trailingIcon, {
          size: iconSize,
          stroke: textColor,
        })}
    </View>
  );
};

const styles = StyleSheet.create({
  base: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 12,
    paddingVertical: 6,
    gap: 8,
    borderWidth: 1, // Default for outlined styles
  },

  // Badge Types & Styles

  // Primary
  primary_filled: {
    backgroundColor: COLORS.primary[500],
    borderColor: COLORS.primary[500],
  },
  text_primary_filled: { color: COLORS.neutral[950] },

  primary_accent: {
    backgroundColor: COLORS.primary["500-20"],
    borderColor: COLORS.primary["500-20"],
  },
  text_primary_accent: { color: COLORS.neutral[50] },

  primary_outlined: {
    backgroundColor: "transparent",
    borderColor: COLORS.primary[500],
  },
  text_primary_outlined: { color: COLORS.primary[500] },

  // Neutral
  neutral_filled: {
    backgroundColor: COLORS.neutral[950],
    borderColor: COLORS.neutral[950],
  },
  text_neutral_filled: { color: COLORS.neutral[50] },

  neutral_accent: {
    backgroundColor: COLORS.neutral[100],
    borderColor: COLORS.neutral[100],
  },
  text_neutral_accent: { color: COLORS.neutral[700] },

  neutral_outlined: {
    backgroundColor: "transparent",
    borderColor: COLORS.neutral[200],
  },
  text_neutral_outlined: { color: COLORS.neutral[100] },

  // Success
  success_filled: {
    backgroundColor: COLORS.success[500],
    borderColor: COLORS.success[500],
  },
  text_success_filled: { color: COLORS.neutral[50] },

  success_accent: {
    backgroundColor: COLORS.success[50],
    borderColor: COLORS.success[50],
  },
  text_success_accent: { color: COLORS.success[500] },

  success_outlined: {
    backgroundColor: "transparent",
    borderColor: COLORS.success[500],
  },
  text_success_outlined: { color: COLORS.success[500] },

  // Error
  error_filled: {
    backgroundColor: COLORS.error[500],
    borderColor: COLORS.error[500],
  },
  text_error_filled: { color: COLORS.neutral[50] },

  error_accent: {
    backgroundColor: COLORS.error[50],
    borderColor: COLORS.error[50],
  },
  text_error_accent: { color: COLORS.error[500] },

  error_outlined: {
    backgroundColor: "transparent",
    borderColor: COLORS.error[500],
  },
  text_error_outlined: { color: COLORS.error[500] },

  // Shapes
  rounded: { borderRadius: 8 },
  round: { borderRadius: 9999 },

  // Sizes
  large: { paddingHorizontal: 12, paddingVertical: 6 },
  medium: { paddingHorizontal: 8, paddingVertical: 4 },
  small: { paddingHorizontal: 6, paddingVertical: 2 },

  // Text Sizes
  text_large: {
    fontSize: FONT_SIZES.label.md,
    lineHeight: LINE_HEIGHT.label.md,
    letterSpacing: LETTER_SPACING.label.md,
    fontFamily: "Nunito-Medium",
  },
  text_medium: {
    fontSize: FONT_SIZES.label.md,
    lineHeight: LINE_HEIGHT.label.md,
    letterSpacing: LETTER_SPACING.label.md,
    fontFamily: "Nunito-Medium",
  },
  text_small: {
    fontSize: FONT_SIZES.label.sm,
    lineHeight: LINE_HEIGHT.label.sm,
    letterSpacing: LETTER_SPACING.label.sm,
    fontFamily: "Nunito-Medium",
  },
});

export default Badge;
