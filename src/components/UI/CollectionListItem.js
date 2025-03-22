import React from "react";
import { View, Text, Image, StyleSheet, TouchableOpacity } from "react-native";
import FastImage from "react-native-fast-image";

// Import Styles
import { COLORS } from "../../styles/theme";
import { globalStyles } from "../../styles/global";

// Import Icons
import ArrowRightIcon from "../icons/ArrowRightIcon";

// Import Components
import CustomButton from "./CustomButton";
import Badge from "./Badge";

const CollectionListItem = ({
  id,
  imageUrl,
  title,
  creator,
  category,
  onPress,
  style,
}) => {
  const imageSource =
    typeof imageUrl === "string" ? { uri: imageUrl } : imageUrl;

  return (
    <View style={[styles.container, style]}>
      <View style={styles.contentContainer}>
        {/* Collection Image */}
        <FastImage style={styles.image} source={imageSource} />
        {/* Collection Details */}
        <View style={styles.details}>
          <View style={styles.detailsText}>
            <Text
              style={[globalStyles.bodyMediumBold, styles.title]}
              numberOfLines={1}
              ellipsizeMode="tail"
            >
              {title}
            </Text>
            <Text
              style={[globalStyles.bodyXSmallMedium, styles.creator]}
              numberOfLines={1}
              ellipsizeMode="tail"
            >
              {creator}
            </Text>
          </View>
          <Badge
            size="small"
            shape="round"
            type="primary"
            styleType="filled"
            text={category}
            style={styles.badge}
          />
        </View>
      </View>

      {/* View Button */}
      <CustomButton
        variant="filled"
        size="small"
        title="View"
        trailingIcon={ArrowRightIcon}
        onPress={() => onPress(id)}
        style={{ alignSelf: "center" }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    padding: 8,
    backgroundColor: COLORS.primaryNeutral[800],
    borderRadius: 8,
    gap: 12,

    maxHeight: 91,
  },
  contentContainer: {
    flexDirection: "row",
    gap: 12,
  },
  image: {
    width: 75,
    height: 75,
    borderRadius: 8,
  },
  details: {
    justifyContent: "space-between",
    width: 100,
  },
  title: {
    color: COLORS.neutral[50],
  },
  creator: {
    color: COLORS.neutral[50],
  },
  badge: {
    alignSelf: "flex-start",
  },
});

export default CollectionListItem;
