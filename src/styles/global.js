import { StyleSheet } from "react-native";
import { COLORS, FONT_SIZES, LINE_HEIGHT, LETTER_SPACING } from "./theme";

export const globalStyles = StyleSheet.create({
  // Container
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 16,
    backgroundColor: COLORS.primaryNeutral[900],
  },
  secondaryContainer: {
    justifyContent: "center",
    alignItems: "center",
    padding: 16,
    backgroundColor: COLORS.primaryNeutral[800],
  },

  // ===== FONT STYLES =====
  // Display Text Styles
  // displayLarge
  displayLargeMedium: {
    fontSize: FONT_SIZES.display.lg,
    lineHeight: LINE_HEIGHT.display.lg,
    letterSpacing: LETTER_SPACING.display.lg,
    fontFamily: "Nohemi-Medium",
  },
  displayLargeSemiBold: {
    fontSize: FONT_SIZES.display.lg,
    lineHeight: LINE_HEIGHT.display.lg,
    letterSpacing: LETTER_SPACING.display.lg,
    fontFamily: "Nohemi-SemiBold",
  },
  displayLargeBold: {
    fontSize: FONT_SIZES.display.lg,
    lineHeight: LINE_HEIGHT.display.lg,
    letterSpacing: LETTER_SPACING.display.lg,
    fontFamily: "Nohemi-Bold",
  },
  displayLargeExtraBold: {
    fontSize: FONT_SIZES.display.lg,
    lineHeight: LINE_HEIGHT.display.lg,
    letterSpacing: LETTER_SPACING.display.lg,
    fontFamily: "Nohemi-ExtraBold",
  },

  // displaySmall
  displaySmallMedium: {
    fontSize: FONT_SIZES.display.sm,
    lineHeight: LINE_HEIGHT.display.sm,
    letterSpacing: LETTER_SPACING.display.sm,
    fontFamily: "Nohemi-Medium",
  },
  displaySmallSemiBold: {
    fontSize: FONT_SIZES.display.sm,
    lineHeight: LINE_HEIGHT.display.sm,
    letterSpacing: LETTER_SPACING.display.sm,
    fontFamily: "Nohemi-SemiBold",
  },
  displaySmallBold: {
    fontSize: FONT_SIZES.display.sm,
    lineHeight: LINE_HEIGHT.display.sm,
    letterSpacing: LETTER_SPACING.display.sm,
    fontFamily: "Nohemi-Bold",
  },
  displaySmallExtraBold: {
    fontSize: FONT_SIZES.display.sm,
    lineHeight: LINE_HEIGHT.display.sm,
    letterSpacing: LETTER_SPACING.display.sm,
    fontFamily: "Nohemi-ExtraBold",
  },

  // displayXSmall
  displayXSmallMedium: {
    fontSize: FONT_SIZES.display.xs,
    lineHeight: LINE_HEIGHT.display.xm,
    letterSpacing: LETTER_SPACING.display.xs,
    fontFamily: "Nohemi-Medium",
  },
  displayXSmallSemiBold: {
    fontSize: FONT_SIZES.display.xs,
    lineHeight: LINE_HEIGHT.display.xs,
    letterSpacing: LETTER_SPACING.display.xs,
    fontFamily: "Nohemi-SemiBold",
  },
  displayXSmallBold: {
    fontSize: FONT_SIZES.display.xs,
    lineHeight: LINE_HEIGHT.display.xs,
    letterSpacing: LETTER_SPACING.display.xs,
    fontFamily: "Nohemi-Bold",
  },
  displayXSmallExtraBold: {
    fontSize: FONT_SIZES.display.xs,
    lineHeight: LINE_HEIGHT.display.xs,
    letterSpacing: LETTER_SPACING.display.xs,
    fontFamily: "Nohemi-ExtraBold",
  },

  // Heading Text Styles
  // heading H1
  headingH1Medium: {
    fontSize: FONT_SIZES.heading.xxl,
    lineHeight: LINE_HEIGHT.heading.xxl,
    letterSpacing: LETTER_SPACING.heading.xxl,
    fontFamily: "Nohemi-Medium",
  },
  headingH1SemiBold: {
    fontSize: FONT_SIZES.heading.xxl,
    lineHeight: LINE_HEIGHT.heading.xxl,
    letterSpacing: LETTER_SPACING.heading.xxl,
    fontFamily: "Nohemi-SemiBold",
  },
  headingH1Bold: {
    fontSize: FONT_SIZES.heading.xxl,
    lineHeight: LINE_HEIGHT.heading.xxl,
    letterSpacing: LETTER_SPACING.heading.xxl,
    fontFamily: "Nohemi-Bold",
  },
  headingH1ExtraBold: {
    fontSize: FONT_SIZES.heading.xxl,
    lineHeight: LINE_HEIGHT.heading.xxl,
    letterSpacing: LETTER_SPACING.heading.xxl,
    fontFamily: "Nohemi-ExtraBold",
  },

  // heading H2
  headingH2Medium: {
    fontSize: FONT_SIZES.heading.xl,
    lineHeight: LINE_HEIGHT.heading.xl,
    letterSpacing: LETTER_SPACING.heading.xl,
    fontFamily: "Nohemi-Medium",
  },
  headingH2SemiBold: {
    fontSize: FONT_SIZES.heading.xl,
    lineHeight: LINE_HEIGHT.heading.xl,
    letterSpacing: LETTER_SPACING.heading.xl,
    fontFamily: "Nohemi-SemiBold",
  },
  headingH2Bold: {
    fontSize: FONT_SIZES.heading.xl,
    lineHeight: LINE_HEIGHT.heading.xl,
    letterSpacing: LETTER_SPACING.heading.xl,
    fontFamily: "Nohemi-Bold",
  },
  headingH2ExtraBold: {
    fontSize: FONT_SIZES.heading.xl,
    lineHeight: LINE_HEIGHT.heading.xl,
    letterSpacing: LETTER_SPACING.heading.xl,
    fontFamily: "Nohemi-ExtraBold",
  },

  // heading H3
  headingH3Medium: {
    fontSize: FONT_SIZES.heading.lg,
    lineHeight: LINE_HEIGHT.heading.lg,
    letterSpacing: LETTER_SPACING.heading.lg,
    fontFamily: "Nohemi-Medium",
  },
  headingH3SemiBold: {
    fontSize: FONT_SIZES.heading.lg,
    lineHeight: LINE_HEIGHT.heading.lg,
    letterSpacing: LETTER_SPACING.heading.lg,
    fontFamily: "Nohemi-SemiBold",
  },
  headingH3Bold: {
    fontSize: FONT_SIZES.heading.lg,
    lineHeight: LINE_HEIGHT.heading.lg,
    letterSpacing: LETTER_SPACING.heading.lg,
    fontFamily: "Nohemi-Bold",
  },
  headingH3ExtraBold: {
    fontSize: FONT_SIZES.heading.lg,
    lineHeight: LINE_HEIGHT.heading.lg,
    letterSpacing: LETTER_SPACING.heading.lg,
    fontFamily: "Nohemi-ExtraBold",
  },

  // heading H4
  headingH4Medium: {
    fontSize: FONT_SIZES.heading.md,
    lineHeight: LINE_HEIGHT.heading.md,
    letterSpacing: LETTER_SPACING.heading.md,
    fontFamily: "Nohemi-Medium",
  },
  headingH4SemiBold: {
    fontSize: FONT_SIZES.heading.md,
    lineHeight: LINE_HEIGHT.heading.md,
    letterSpacing: LETTER_SPACING.heading.md,
    fontFamily: "Nohemi-SemiBold",
  },
  headingH4Bold: {
    fontSize: FONT_SIZES.heading.md,
    lineHeight: LINE_HEIGHT.heading.md,
    letterSpacing: LETTER_SPACING.heading.md,
    fontFamily: "Nohemi-Bold",
  },
  headingH4ExtraBold: {
    fontSize: FONT_SIZES.heading.md,
    lineHeight: LINE_HEIGHT.heading.md,
    letterSpacing: LETTER_SPACING.heading.md,
    fontFamily: "Nohemi-ExtraBold",
  },

  // heading H5
  headingH5Medium: {
    fontSize: FONT_SIZES.heading.sm,
    lineHeight: LINE_HEIGHT.heading.sm,
    letterSpacing: LETTER_SPACING.heading.sm,
    fontFamily: "Nohemi-Medium",
  },
  headingH5SemiBold: {
    fontSize: FONT_SIZES.heading.sm,
    lineHeight: LINE_HEIGHT.heading.sm,
    letterSpacing: LETTER_SPACING.heading.sm,
    fontFamily: "Nohemi-SemiBold",
  },
  headingH5Bold: {
    fontSize: FONT_SIZES.heading.sm,
    lineHeight: LINE_HEIGHT.heading.sm,
    letterSpacing: LETTER_SPACING.heading.sm,
    fontFamily: "Nohemi-Bold",
  },
  headingH5ExtraBold: {
    fontSize: FONT_SIZES.heading.sm,
    lineHeight: LINE_HEIGHT.heading.sm,
    letterSpacing: LETTER_SPACING.heading.sm,
    fontFamily: "Nohemi-ExtraBold",
  },

  // heading H6
  headingH6Medium: {
    fontSize: FONT_SIZES.heading.xs,
    lineHeight: LINE_HEIGHT.heading.xs,
    letterSpacing: LETTER_SPACING.heading.xs,
    fontFamily: "Nohemi-Medium",
  },
  headingH6SemiBold: {
    fontSize: FONT_SIZES.heading.xs,
    lineHeight: LINE_HEIGHT.heading.xs,
    letterSpacing: LETTER_SPACING.heading.xs,
    fontFamily: "Nohemi-SemiBold",
  },
  headingH6Bold: {
    fontSize: FONT_SIZES.heading.xs,
    lineHeight: LINE_HEIGHT.heading.xs,
    letterSpacing: LETTER_SPACING.heading.xs,
    fontFamily: "Nohemi-Bold",
  },
  headingH6ExtraBold: {
    fontSize: FONT_SIZES.heading.xs,
    lineHeight: LINE_HEIGHT.heading.xs,
    letterSpacing: LETTER_SPACING.heading.xs,
    fontFamily: "Nohemi-ExtraBold",
  },

  // Body Text Styles
  // bodyLarge
  bodyLargeRegular: {
    fontSize: FONT_SIZES.body.lg,
    lineHeight: LINE_HEIGHT.body.lg,
    letterSpacing: LETTER_SPACING.body.lg,
    fontFamily: "Nunito-Regular",
  },
  bodyLargeMedium: {
    fontSize: FONT_SIZES.body.lg,
    lineHeight: LINE_HEIGHT.body.lg,
    letterSpacing: LETTER_SPACING.body.lg,
    fontFamily: "Nunito-Medium",
  },
  bodyLargeSemiBold: {
    fontSize: FONT_SIZES.body.lg,
    lineHeight: LINE_HEIGHT.body.lg,
    letterSpacing: LETTER_SPACING.body.lg,
    fontFamily: "Nunito-SemiBold",
  },
  bodyLargeBold: {
    fontSize: FONT_SIZES.body.lg,
    lineHeight: LINE_HEIGHT.body.lg,
    letterSpacing: LETTER_SPACING.body.lg,
    fontFamily: "Nunito-Bold",
  },

  // bodyMedium
  bodyMediumRegular: {
    fontSize: FONT_SIZES.body.md,
    lineHeight: LINE_HEIGHT.body.md,
    letterSpacing: LETTER_SPACING.body.md,
    fontFamily: "Nunito-Regular",
  },
  bodyMediumMedium: {
    fontSize: FONT_SIZES.body.md,
    lineHeight: LINE_HEIGHT.body.md,
    letterSpacing: LETTER_SPACING.body.md,
    fontFamily: "Nunito-Medium",
  },
  bodyMediumSemiBold: {
    fontSize: FONT_SIZES.body.md,
    lineHeight: LINE_HEIGHT.body.md,
    letterSpacing: LETTER_SPACING.body.md,
    fontFamily: "Nunito-SemiBold",
  },
  bodyMediumBold: {
    fontSize: FONT_SIZES.body.md,
    lineHeight: LINE_HEIGHT.body.md,
    letterSpacing: LETTER_SPACING.body.md,
    fontFamily: "Nunito-Bold",
  },

  // bodySmall
  bodySmallRegular: {
    fontSize: FONT_SIZES.body.sm,
    lineHeight: LINE_HEIGHT.body.sm,
    letterSpacing: LETTER_SPACING.body.sm,
    fontFamily: "Nunito-Regular",
  },
  bodySmallMedium: {
    fontSize: FONT_SIZES.body.sm,
    lineHeight: LINE_HEIGHT.body.sm,
    letterSpacing: LETTER_SPACING.body.sm,
    fontFamily: "Nunito-Medium",
  },
  bodySmallSemiBold: {
    fontSize: FONT_SIZES.body.sm,
    lineHeight: LINE_HEIGHT.body.sm,
    letterSpacing: LETTER_SPACING.body.sm,
    fontFamily: "Nunito-SemiBold",
  },
  bodySmallBold: {
    fontSize: FONT_SIZES.body.sm,
    lineHeight: LINE_HEIGHT.body.sm,
    letterSpacing: LETTER_SPACING.body.sm,
    fontFamily: "Nunito-Bold",
  },
  // BodySmallSpecial
  bodySmallItalic: {
    fontSize: FONT_SIZES.body.sm,
    lineHeight: LINE_HEIGHT.body.sm,
    letterSpacing: LETTER_SPACING.body.sm,
    fontFamily: "Nunito-Italic",
  },

  // bodyXSmall
  bodyXSmallRegular: {
    fontSize: FONT_SIZES.body.xs,
    lineHeight: LINE_HEIGHT.body.xs,
    letterSpacing: LETTER_SPACING.body.xs,
    fontFamily: "Nunito-Regular",
  },
  bodyXSmallMedium: {
    fontSize: FONT_SIZES.body.xs,
    lineHeight: LINE_HEIGHT.body.xs,
    letterSpacing: LETTER_SPACING.body.xs,
    fontFamily: "Nunito-Medium",
  },
  bodyXSmallSemiBold: {
    fontSize: FONT_SIZES.body.xs,
    lineHeight: LINE_HEIGHT.body.xs,
    letterSpacing: LETTER_SPACING.body.xs,
    fontFamily: "Nunito-SemiBold",
  },
  bodyXSmallBold: {
    fontSize: FONT_SIZES.body.xs,
    lineHeight: LINE_HEIGHT.body.xs,
    letterSpacing: LETTER_SPACING.body.xs,
    fontFamily: "Nunito-Bold",
  },

  // Label Text Styles
  // labelLarge
  labelLargeRegular: {
    fontSize: FONT_SIZES.label.lg,
    lineHeight: LINE_HEIGHT.label.lg,
    letterSpacing: LETTER_SPACING.label.lg,
    fontFamily: "Nunito-Regular",
  },
  labelLargeMedium: {
    fontSize: FONT_SIZES.label.lg,
    lineHeight: LINE_HEIGHT.label.lg,
    letterSpacing: LETTER_SPACING.label.lg,
    fontFamily: "Nunito-Medium",
  },
  labelLargeSemiBold: {
    fontSize: FONT_SIZES.label.lg,
    lineHeight: LINE_HEIGHT.label.lg,
    letterSpacing: LETTER_SPACING.label.lg,
    fontFamily: "Nunito-SemiBold",
  },
  labelLargeBold: {
    fontSize: FONT_SIZES.label.lg,
    lineHeight: LINE_HEIGHT.label.lg,
    letterSpacing: LETTER_SPACING.label.lg,
    fontFamily: "Nunito-Bold",
  },

  // labelMedium
  labelMediumRegular: {
    fontSize: FONT_SIZES.label.md,
    lineHeight: LINE_HEIGHT.label.md,
    letterSpacing: LETTER_SPACING.label.md,
    fontFamily: "Nunito-Regular",
  },
  labelMediumMedium: {
    fontSize: FONT_SIZES.label.md,
    lineHeight: LINE_HEIGHT.label.md,
    letterSpacing: LETTER_SPACING.label.md,
    fontFamily: "Nunito-Medium",
  },
  labelMediumSemiBold: {
    fontSize: FONT_SIZES.label.md,
    lineHeight: LINE_HEIGHT.label.md,
    letterSpacing: LETTER_SPACING.label.md,
    fontFamily: "Nunito-SemiBold",
  },
  labelMediumBold: {
    fontSize: FONT_SIZES.label.md,
    lineHeight: LINE_HEIGHT.label.md,
    letterSpacing: LETTER_SPACING.label.md,
    fontFamily: "Nunito-Bold",
  },

  // labelSmall
  labelSmallRegular: {
    fontSize: FONT_SIZES.label.sm,
    lineHeight: LINE_HEIGHT.label.sm,
    letterSpacing: LETTER_SPACING.label.sm,
    fontFamily: "Nunito-Regular",
  },
  labelSmallMedium: {
    fontSize: FONT_SIZES.label.sm,
    lineHeight: LINE_HEIGHT.label.sm,
    letterSpacing: LETTER_SPACING.label.sm,
    fontFamily: "Nunito-Medium",
  },
  labelSmallSemiBold: {
    fontSize: FONT_SIZES.label.sm,
    lineHeight: LINE_HEIGHT.label.sm,
    letterSpacing: LETTER_SPACING.label.sm,
    fontFamily: "Nunito-SemiBold",
  },
  labelSmallBold: {
    fontSize: FONT_SIZES.label.sm,
    lineHeight: LINE_HEIGHT.label.sm,
    letterSpacing: LETTER_SPACING.label.sm,
    fontFamily: "Nunito-Bold",
  },

  // labelXSmall
  labelXSmallRegular: {
    fontSize: FONT_SIZES.label.xs,
    lineHeight: LINE_HEIGHT.label.xs,
    letterSpacing: LETTER_SPACING.label.xs,
    fontFamily: "Nunito-Regular",
  },
  labelXSmallMedium: {
    fontSize: FONT_SIZES.label.xs,
    lineHeight: LINE_HEIGHT.label.xs,
    letterSpacing: LETTER_SPACING.label.xs,
    fontFamily: "Nunito-Medium",
  },
  labelXSmallSemiBold: {
    fontSize: FONT_SIZES.label.xs,
    lineHeight: LINE_HEIGHT.label.xs,
    letterSpacing: LETTER_SPACING.label.xs,
    fontFamily: "Nunito-SemiBold",
  },
  labelXSmallBold: {
    fontSize: FONT_SIZES.label.xs,
    lineHeight: LINE_HEIGHT.label.xs,
    letterSpacing: LETTER_SPACING.label.xs,
    fontFamily: "Nunito-Bold",
  },
});
