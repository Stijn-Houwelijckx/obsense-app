import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import {
  COLORS,
  FONT_SIZES,
  LINE_HEIGHT,
  LETTER_SPACING,
} from "../../styles/theme";
import { globalStyles } from "../../styles/global";

const NumberSelector = ({ number, isActive, onPress, style }) => {
  return (
    <TouchableOpacity
      style={[
        styles.cardContainer,
        style,
        isActive && { backgroundColor: COLORS.primary[500] },
      ]}
      onPress={onPress} // Handle press event
    >
      <Text
        style={[
          globalStyles.headingH6Bold,
          styles.number,
          isActive && { color: COLORS.neutral[950] },
        ]}
      >
        {number}
      </Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  cardContainer: {
    height: 60,
    padding: 8,
    borderRadius: 10,
    overflow: "hidden",
    backgroundColor: COLORS.primary["500-20"],
    borderWidth: 2,
    borderColor: COLORS.primary[500],
    justifyContent: "center",
    alignItems: "center",
  },
  number: {
    color: COLORS.neutral[50],
  },
});

export default NumberSelector;
