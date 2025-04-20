import React from "react";
import { View, StyleSheet } from "react-native";
import {
  COLORS,
  FONT_SIZES,
  LINE_HEIGHT,
  LETTER_SPACING,
} from "../../styles/theme";

const NavList = ({ children, style }) => {
  const items = React.Children.toArray(children);

  return (
    <View style={[styles.listContainer, style]}>
      {items.map((child, index) => {
        const isLast = index === items.length - 1;
        return (
          <View key={index} style={!isLast ? styles.withBorder : undefined}>
            {child}
          </View>
        );
      })}
    </View>
  );
};

const styles = StyleSheet.create({
  listContainer: {
    borderRadius: 16,
    overflow: "hidden",
  },
  withBorder: {
    borderBottomWidth: 1,
    borderBottomColor: COLORS.primary[500],
  },
});

export default NavList;
