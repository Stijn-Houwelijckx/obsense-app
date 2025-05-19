import React from "react";
import { View, Text, Image, StyleSheet, TouchableOpacity } from "react-native";
import FastImage from "react-native-fast-image";

// Import Styles
import { COLORS } from "../../styles/theme";
import { globalStyles } from "../../styles/global";

// Import Icons
import { ArrowRightIcon } from "../icons";

// Import Components
import CustomButton from "./CustomButton";

const ArtistCard = ({
  id,
  imageUrl,
  username,
  numCollections,
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
          <Text
            style={[globalStyles.bodyMediumBold, styles.username]}
            numberOfLines={1}
            ellipsizeMode="tail"
          >
            {username}
          </Text>
          <Text
            style={[globalStyles.bodyXSmallRegular, styles.numCollections]}
            numberOfLines={1}
            ellipsizeMode="tail"
          >
            {numCollections} Collections
          </Text>
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
    justifyContent: "space-between",
    padding: 8,
    backgroundColor: COLORS.primaryNeutral[800],
    borderRadius: 8,
    // gap: 12,

    overflow: "hidden",

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
    gap: 4,
    justifyContent: "center",
  },
  username: {
    color: COLORS.neutral[50],
    width: 140,
  },
  numCollections: {
    color: COLORS.neutral[400],
  },
});

export default ArtistCard;
