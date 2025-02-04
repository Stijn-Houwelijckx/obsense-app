import React from "react";
import { View, Text, TouchableOpacity, Image, StyleSheet } from "react-native";
import { useNavigation } from "@react-navigation/native";

// Import Styles
import {
  COLORS,
  FONT_SIZES,
  LINE_HEIGHT,
  LETTER_SPACING,
} from "../../styles/theme";
import { globalStyles } from "../../styles/global";

// Import icons
import ArrowLeftIcon from "../icons/ArrowLeftIcon";
import MagnifyingGlassIcon from "../icons/MagnifyingGlassIcon";

// Import Components
import IconButton from "./IconButton";

const Header = ({
  title,
  showBackButton = true,
  type = "default", // "default" or "profile"
  profileImage,
  text,
  userName,
  tokens,
  onProfilePress,
}) => {
  const navigation = useNavigation();
  const imageSource =
    typeof profileImage === "string" ? { uri: profileImage } : profileImage;

  // Function to go back to the previous screen
  const handleBack = () => {
    navigation.goBack();
  };

  return (
    <View style={styles.headerContainer}>
      {type === "default" ? (
        <>
          {showBackButton && (
            <IconButton
              icon={ArrowLeftIcon}
              onPress={handleBack}
              buttonSize={48}
              iconSize={24}
            />
          )}
          <Text style={[globalStyles.headingH6Bold, styles.headerTitle]}>
            {title}
          </Text>
          {showBackButton && <View style={styles.spacer} />}
        </>
      ) : (
        <>
          {/* Profile Section */}
          <TouchableOpacity
            style={styles.profileContainer}
            onPress={onProfilePress}
          >
            <Image source={imageSource} style={styles.profileImage} />
            <View style={[styles.userInfo, text && tokens ? { gap: -3 } : {}]}>
              {text && (
                <Text style={[globalStyles.bodyXSmallRegular, styles.text]}>
                  {text}
                </Text>
              )}
              <Text style={[globalStyles.bodySmallBold, styles.userName]}>
                {userName}
              </Text>
              {tokens && (
                <Text style={[globalStyles.bodySmallItalic, styles.tokens]}>
                  {tokens} Tokens
                </Text>
              )}
            </View>
          </TouchableOpacity>

          {/* Search Button */}
          <IconButton
            icon={MagnifyingGlassIcon}
            onPress={() => console.log("Search")}
            buttonSize={48}
            iconSize={24}
          />
        </>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  headerContainer: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingTop: 8,
    height: 56,
    backgroundColor: COLORS.primaryNeutral[900],
    justifyContent: "space-between",
  },
  backButton: {
    // paddingRight: 12,
  },
  headerTitle: {
    flex: 1,
    textAlign: "center",
    color: COLORS.neutral[50],
  },
  spacer: {
    width: 48,
    // height: 48,
    // backgroundColor: "red",
  },
  profileContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  profileImage: {
    width: 48,
    height: 48,
    borderRadius: 9999,
    borderWidth: 2,
    borderColor: COLORS.primary[500],
    // marginRight: 12,
  },
  userInfo: {
    flexDirection: "column",
  },
  text: {
    color: COLORS.neutral[500],
  },
  userName: {
    color: COLORS.neutral[50],
  },
  tokens: {
    color: COLORS.neutral[300],
    // fontStyle: "italic",
  },
});

export default Header;
