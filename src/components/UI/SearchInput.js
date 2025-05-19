import React from "react";
import { View, TextInput, TouchableOpacity, StyleSheet } from "react-native";
import {
  COLORS,
  FONT_SIZES,
  LINE_HEIGHT,
  LETTER_SPACING,
} from "../../styles/theme";

// Import Styles
import { XIcon, MagnifyingGlassIcon } from "../icons";

const SearchInput = ({
  value,
  onChangeText,
  placeholder = "Search...",
  onClear,
  style,
  onClick,
  ...props
}) => {
  const showClear = value && value.length > 0;

  const handleClear = () => {
    onChangeText("");
    if (onClear) {
      onClear();
    }
  };

  return (
    <View style={[styles.container, style]}>
      <MagnifyingGlassIcon size={20} stroke={COLORS.neutral[500]} />

      <TextInput
        style={styles.input}
        placeholder={placeholder}
        placeholderTextColor={COLORS.neutral[500]}
        value={value}
        onChangeText={onChangeText}
        onFocus={onClick}
        autoCapitalize="none"
        autoCorrect={false}
        {...props}
      />

      {showClear && (
        <TouchableOpacity onPress={handleClear} hitSlop={10}>
          <XIcon size={20} stroke={COLORS.neutral[500]} />
        </TouchableOpacity>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    borderRadius: 8,
    borderWidth: 1,
    borderColor: COLORS.neutral[500],
    backgroundColor: COLORS.primaryNeutral[800],
    paddingHorizontal: 10,
    height: 48,
    gap: 8,
  },
  input: {
    flex: 1,
    fontSize: FONT_SIZES.label.lg,
    lineHeight: LINE_HEIGHT.label.lg,
    letterSpacing: LETTER_SPACING.label.lg,
    fontFamily: "Nunito-Regular",
    color: COLORS.neutral[50],
  },
  icon: {
    // Optional margin for the leading icon
  },
});

export default SearchInput;
