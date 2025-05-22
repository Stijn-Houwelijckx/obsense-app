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
import { ArrowLeftIcon, MagnifyingGlassIcon } from "../icons";

// Import Components
import IconButton from "./IconButton";
import SearchInput from "./SearchInput";

const Header = ({
  title,
  showBackButton = true,
  type = "default", // "default", "profile" or "search"
  profileImage,
  text,
  userName,
  tokens,
  onProfilePress,
  searchValue,
  onSearchChange,
  onSearchClear,
  showSearchButton = false,
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
      {type === "default" && (
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
      )}

      {type === "profile" && (
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
              {tokens != null && tokens !== "" && (
                <Text style={[globalStyles.bodySmallItalic, styles.tokens]}>
                  {String(tokens)} Tokens
                </Text>
              )}
            </View>
          </TouchableOpacity>

          {/* Search Button */}
          {showSearchButton && (
            <IconButton
              icon={MagnifyingGlassIcon}
              onPress={() =>
                navigation.navigate("Explore", {
                  screen: "Search",
                  params: { searchType: "all" },
                })
              } // Navigate to Search screen
              buttonSize={48}
              iconSize={24}
            />
          )}
        </>
      )}

      {type === "search" && (
        <>
          {showBackButton && (
            <IconButton
              icon={ArrowLeftIcon}
              onPress={handleBack}
              buttonSize={48}
              iconSize={24}
            />
          )}
          <SearchInput
            value={searchValue}
            onChangeText={onSearchChange}
            placeholder="Search..."
            onClear={onSearchClear}
            autoFocus={true}
            style={{ flex: 1, marginLeft: 16 }}
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
