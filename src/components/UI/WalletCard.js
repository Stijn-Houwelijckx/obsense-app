import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import RadialGradient from "react-native-radial-gradient";
import {
  COLORS,
  FONT_SIZES,
  LINE_HEIGHT,
  LETTER_SPACING,
} from "../../styles/theme";
import { globalStyles } from "../../styles/global";

const WalletCard = ({ tokens, conversionRate, style }) => {
  return (
    <RadialGradient
      style={[styles.cardContainer, style]} // Apply gradient to the card container
      colors={[COLORS.primary[200], COLORS.primary[500]]} // Define gradient colors
      stops={[0.1, 0.9]} // Define gradient stops
      center={[0, 0]} // Center of the radial gradient
      radius={300} // Radius of the radial gradient
    >
      <Text style={[globalStyles.headingH6Medium, styles.title]}>
        Token Wallet
      </Text>
      <Text style={[globalStyles.headingH4Bold, styles.tokens]}>
        {tokens} tokens
      </Text>
      <Text style={[globalStyles.bodySmallRegular, styles.conversionRate]}>
        1 token = € {conversionRate}
      </Text>
    </RadialGradient>
  );
};

const styles = StyleSheet.create({
  cardContainer: {
    padding: 16,
    height: 200,
    borderRadius: 20,
    overflow: "hidden",
  },
  title: {
    color: COLORS.neutral[950],
  },
  tokens: {
    color: COLORS.neutral[950],
    paddingTop: 20,
  },
  conversionRate: {
    color: COLORS.neutral[700],
  },
});

export default WalletCard;
