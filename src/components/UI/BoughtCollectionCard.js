import React from "react";
import { View, Text, Image, StyleSheet, TouchableOpacity } from "react-native";
import FastImage from "react-native-fast-image";

// Import Styles
import { COLORS } from "../../styles/theme";
import { globalStyles } from "../../styles/global";

// Import Icons
import CheckIcon from "../icons/CheckIcon";
import ClockIcon from "../icons/ClockIcon";

// Import Components
import Badge from "./Badge";

const ArtistCollectionCard = ({
  id,
  imageUrl,
  title,
  creator,
  timeLeft,
  category,
  onPress,
  style,
}) => {
  const imageSource =
    typeof imageUrl === "string" ? { uri: imageUrl } : imageUrl;

  return (
    <TouchableOpacity
      activeOpacity={0.8}
      style={[styles.card, style]}
      onPress={() => onPress(id)}
    >
      {/* Image with Badge Overlay */}
      <View style={styles.imageContainer}>
        {/* <Image source={imageSource} style={styles.image} /> */}
        <FastImage style={styles.image} source={imageSource} />
        <View style={styles.badgeContainer}>
          <Badge
            size="small"
            shape="rounded"
            type="primary"
            styleType="filled"
            text={category} // "Tour" or "Exposition"
          />
        </View>
        <View style={styles.checkContainer}>
          <CheckIcon size={12} stroke={COLORS.success[600]} strokeWidth="3" />
        </View>
      </View>

      {/* Title & Status */}
      <View style={styles.textContainer}>
        <Text
          style={[globalStyles.bodyMediumBold, styles.title]}
          numberOfLines={1} // Limits title to one line
          ellipsizeMode="tail" // Adds "..." if truncated
        >
          {title}
        </Text>
        <Text
          style={[globalStyles.bodySmallRegular, styles.creator]}
          numberOfLines={1} // Limits title to one line
          ellipsizeMode="tail" // Adds "..." if truncated
        >
          {creator}
        </Text>
      </View>
      <View style={styles.timeLeft}>
        <ClockIcon size={12} stroke={COLORS.neutral[400]} />
        <Text
          style={[globalStyles.bodySmallRegular, styles.timeLeft]}
          numberOfLines={1} // Limits title to one line
          ellipsizeMode="tail" // Adds "..." if truncated
        >
          {timeLeft}
        </Text>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    gap: 4,
  },

  imageContainer: {
    position: "relative",
    borderRadius: 8,
    overflow: "hidden",
    width: "100%",
    aspectRatio: 1,
  },

  image: {
    width: "100%",
    height: "100%",
    // resizeMode: "cover",
  },

  badgeContainer: {
    position: "absolute",
    top: 8,
    left: 8,
  },
  checkContainer: {
    position: "absolute",
    top: 8,
    right: 8,
    backgroundColor: COLORS.primary["500-20"],
    padding: 4,
    borderRadius: 9999,
  },

  textContainer: {},

  title: {
    color: COLORS.neutral[50],
  },

  creator: {
    color: COLORS.neutral[50],
  },

  timeLeft: {
    color: COLORS.neutral[400],
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
});

export default ArtistCollectionCard;
