import React from "react";
import { View, Text, Image, StyleSheet, TouchableOpacity } from "react-native";

// Import Styles
import {
  COLORS,
  FONT_SIZES,
  LINE_HEIGHT,
  LETTER_SPACING,
} from "../../styles/theme";
import { globalStyles } from "../../styles/global";

// Import Components
import Badge from "./Badge";

const ArtistCard = ({
  id,
  imageUrl,
  title,
  published,
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
        <Image source={imageSource} style={styles.image} />
        <View style={styles.badgeContainer}>
          <Badge
            size="small"
            shape="rounded"
            type="primary"
            styleType="filled"
            text={category} // "Tour" or "Exposition"
          />
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
        <Text style={[globalStyles.bodySmallItalic, styles.status]}>
          {published ? "Published" : "Draft"}
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
    resizeMode: "cover",
  },

  badgeContainer: {
    position: "absolute",
    top: 8,
    left: 8,
  },

  textContainer: {
    // padding: 12,
    gap: 4,
  },

  title: {
    color: COLORS.neutral[50],
  },

  status: {
    color: COLORS.neutral[100],
  },
});

export default ArtistCard;
