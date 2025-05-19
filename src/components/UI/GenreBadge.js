import React from "react";
import { View, Text, StyleSheet } from "react-native";

// Import Styles
import { globalStyles } from "../../styles/global";
import { COLORS } from "../../styles/theme";

const GenreBadge = ({ title, style }) => {
  return (
    <View style={[styles.container, style]}>
      <Text style={[globalStyles.labelSmallBold, styles.title]}>{title}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: COLORS.primaryNeutral[600],
    paddingHorizontal: 20,
    paddingVertical: 8,
    borderRadius: 8,
    alignSelf: "flex-start",
  },
  title: {
    color: COLORS.neutral[50],
  },
});

export default GenreBadge;
