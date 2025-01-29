import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { useNavigation } from "@react-navigation/native";
import {
  COLORS,
  FONT_SIZES,
  LINE_HEIGHT,
  LETTER_SPACING,
} from "../../styles/theme";

import ArrowLeftIcon from "../icons/ArrowLeftIcon";

import IconButton from "./IconButton";

const Header = ({ title, showBackButton = true }) => {
  const navigation = useNavigation();

  // Function to go back to the previous screen
  const handleBack = () => {
    navigation.goBack();
  };

  return (
    <View style={styles.headerContainer}>
      {showBackButton && (
        <IconButton
          icon={ArrowLeftIcon}
          onPress={handleBack}
          buttonSize={48}
          iconSize={24}
        />
      )}
      <Text style={styles.headerTitle}>{title}</Text>
      {showBackButton && <View style={styles.spacer} />}
    </View>
  );
};

const styles = StyleSheet.create({
  headerContainer: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingTop: 10,
    height: 58,
    backgroundColor: COLORS.primaryNeutral[900],
  },
  backButton: {
    // paddingRight: 12,
  },
  headerTitle: {
    flex: 1,
    textAlign: "center",
    color: COLORS.neutral[50],

    fontSize: FONT_SIZES.heading.xs,
    lineHeight: LINE_HEIGHT.heading.xs,
    letterSpacing: LETTER_SPACING.heading.xs,
    fontFamily: "Nohemi-Bold",
  },
  spacer: {
    width: 48,
    // height: 48,
    // backgroundColor: "red",
  },
});

export default Header;
