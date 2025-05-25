import React from "react";
import { View, Text, StyleSheet } from "react-native";
import FastImage from "react-native-fast-image";

// Import Styles
import { globalStyles } from "../../styles/global";
import { COLORS } from "../../styles/theme";

// Import Components
import Badge from "./Badge";

const ObjectCard = ({ title, imageUrl, isPlaced, style }) => {
  const imageSource =
    typeof imageUrl === "string" ? { uri: imageUrl } : imageUrl;

  return (
    <View style={[styles.card, style]}>
      <FastImage style={styles.image} source={imageSource} />
      <View style={styles.container}>
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
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: COLORS.primaryNeutral[800],
    width: "100%",
    padding: 8,
    borderRadius: 8,
    gap: 12,
  },
  image: {
    width: 75,
    aspectRatio: 1,
    borderRadius: 8,
    resizeMode: "cover",
  },
  container: {
    justifyContent: "space-between",
    height: 75,
    paddingTop: 8,
    paddingBottom: 12,
  },
  title: {
    color: COLORS.neutral[50],
  },
  badge: {
    alignSelf: "flex-start",
  },
});

export default ObjectCard;
