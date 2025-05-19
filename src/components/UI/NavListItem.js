import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import {
  COLORS,
  FONT_SIZES,
  LINE_HEIGHT,
  LETTER_SPACING,
} from "../../styles/theme";
import { globalStyles } from "../../styles/global";

// Import Icons
import { ChevronRightIcon } from "../icons";

const NavListItem = ({ title, icon, onPress, style }) => {
  return (
    <TouchableOpacity style={[styles.itemContainer, style]} onPress={onPress}>
      <View style={[styles.row]}>
        <View style={styles.titleContainer}>
          {icon &&
            React.createElement(icon, { size: 24, stroke: COLORS.neutral[50] })}
          <Text style={[globalStyles.bodyLargeMedium, styles.title]}>
            {title}
          </Text>
        </View>
        <ChevronRightIcon size={20} stroke={COLORS.neutral[50]} />
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  itemContainer: {
    paddingVertical: 20,
    paddingHorizontal: 32,
    backgroundColor: COLORS.primaryNeutral[800],
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  titleContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  title: {
    color: COLORS.neutral[50],
  },
});

export default NavListItem;
