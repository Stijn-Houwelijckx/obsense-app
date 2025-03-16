import React from "react";
import { View, Text, Image, StyleSheet, TouchableOpacity } from "react-native";
import FastImage from "react-native-fast-image";

// Import Styles
import { COLORS } from "../../styles/theme";
import { globalStyles } from "../../styles/global";

const ArtistItem = ({
  id,
  profileImage,
  username,
  collectionCount,
  onPress,
  style,
}) => {
  const imageSource =
    typeof profileImage === "string"
      ? { uri: profileImage }
      : require("../../../assets/profileImages/Default.jpg");

  return (
    <TouchableOpacity
      activeOpacity={0.8}
      style={style}
      onPress={() => onPress(id)}
    >
      <View style={styles.container}>
        {/* Profile Image */}
        <FastImage source={imageSource} style={styles.profileImage} />

        {/* Artist Info */}
        <View style={styles.textContainer}>
          <Text style={[globalStyles.labelSmallSemiBold, styles.username]}>
            {username}
          </Text>
          <Text
            style={[globalStyles.labelXSmallRegular, styles.collectionCount]}
          >
            {collectionCount}{" "}
            {collectionCount === 1 ? "Collection" : "Collections"}
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    padding: 4,
    paddingRight: 12,
    backgroundColor: COLORS.neutral[900],
    borderRadius: 9999,
    gap: 8,
  },
  profileImage: {
    width: 40,
    height: 40,
    borderRadius: 9999,
  },
  textContainer: {
    flex: 1,
  },
  username: {
    color: COLORS.neutral[50],
  },
  collectionCount: {
    color: COLORS.neutral[400],
  },
});

export default ArtistItem;
