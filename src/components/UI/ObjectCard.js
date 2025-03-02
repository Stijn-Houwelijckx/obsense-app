import React from "react";
import { View, Text, StyleSheet } from "react-native";

// Import Styles
import { globalStyles } from "../../styles/global";
import { COLORS } from "../../styles/theme";

// Import Components
import Badge from "./Badge";

const ObjectCard = ({ title, isPlaced, style }) => {
  return (
    <View style={[styles.card, style]}>
      <Text style={[globalStyles.bodyMediumBold, styles.title]}>{title}</Text>
      <Badge
        size="small"
        shape="rounded"
        type={isPlaced ? "success" : "error"}
        styleType="filled"
        text={isPlaced ? "Placed" : "Not Placed"}
        style={styles.badge}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: COLORS.primaryNeutral[800],
    width: "100%",
    padding: 8,
    borderRadius: 8,
    gap: 8,
  },
  title: {
    color: COLORS.neutral[50],
  },
  badge: {
    alignSelf: "flex-start",
  },
});

export default ObjectCard;
