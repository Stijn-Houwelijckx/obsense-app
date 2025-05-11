import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";

// Import Styles
import { globalStyles } from "../../styles/global";
import { COLORS } from "../../styles/theme";

const GenreItem = ({ id, title, style, onPress }) => {
  return (
    <TouchableOpacity
      activeOpacity={0.7}
      style={style}
      onPress={() => onPress(id)}
    >
      <View style={[styles.container, style]}>
        <Text style={[globalStyles.labelSmallBold, styles.title]}>{title}</Text>
      </View>
    </TouchableOpacity>
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

export default GenreItem;
