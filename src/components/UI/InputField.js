import React from "react";
import {
  TextInput,
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import {
  COLORS,
  FONT_SIZES,
  LINE_HEIGHT,
  LETTER_SPACING,
} from "../../styles/theme";

const InputField = ({
  type = "default", // 'default', 'textarea', 'password', 'link', 'date'
  leadingIcon,
  trailingIcon,
  placeholder,
  secureTextEntry = false, // for passwords
  value,
  onChangeText,
  onToggleVisibility, // for toggling password visibility
  prefix, // for 'https://' in the link field
  label, // Label for the input
  helperText, // Helper text to show below input
  error, // Error state flag
  ...props
}) => {
  const [isPasswordVisible, setIsPasswordVisible] =
    React.useState(secureTextEntry);

  const handleTogglePasswordVisibility = () => {
    setIsPasswordVisible(!isPasswordVisible);
    if (onToggleVisibility) onToggleVisibility(!isPasswordVisible);
  };

  const inputContainerStyle = [
    styles.inputContainer,
    error && type !== "link" && styles.inputError, // Apply error styling if error prop is passed
  ];

  const inputStyle = [
    styles.input,
    type === "textarea" && styles.textArea,
    type === "link" && styles.link,
    error && styles.inputError, // Apply error styling if error prop is passed
  ];

  const labelStyle = [
    styles.label,
    error && styles.labelError, // Apply error label style
  ];

  const helperTextStyle = [
    styles.helperText,
    error && styles.helperTextError, // Apply error helper text style
  ];

  return (
    <View style={styles.container}>
      {label && <Text style={labelStyle}>{label}</Text>}

      <View style={inputContainerStyle}>
        {leadingIcon && <View style={styles.icon}>{leadingIcon}</View>}
        {prefix && <Text style={styles.prefix}>{prefix}</Text>}

        <TextInput
          style={inputStyle}
          placeholder={placeholder}
          placeholderTextColor={COLORS.neutral[500]}
          secureTextEntry={type === "password" && isPasswordVisible === false}
          value={value}
          onChangeText={onChangeText}
          {...props}
        />

        {type === "password" && (
          <TouchableOpacity onPress={handleTogglePasswordVisibility}>
            {isPasswordVisible ? trailingIcon.visible : trailingIcon.hidden}
          </TouchableOpacity>
        )}

        {type !== "password" && trailingIcon && (
          <View style={styles.icon}>{trailingIcon}</View>
        )}
      </View>

      {helperText && <Text style={helperTextStyle}>{helperText}</Text>}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    gap: 8,
  },
  label: {
    fontSize: FONT_SIZES.label.lg,
    lineHeight: LINE_HEIGHT.label.lg,
    letterSpacing: LETTER_SPACING.label.lg,
    fontFamily: "Nunito-Medium",
    color: COLORS.neutral[50],
  },
  labelError: {
    // color: COLORS.error[500],
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: COLORS.neutral[400],
    borderRadius: 8,
    // paddingHorizontal: 10,
    paddingLeft: 10,
    gap: 8,

    backgroundColor: COLORS.primaryNeutral[700],
  },
  input: {
    flex: 1,
    fontSize: FONT_SIZES.label.lg,
    lineHeight: LINE_HEIGHT.label.lg,
    letterSpacing: LETTER_SPACING.label.lg,
    fontFamily: "Nunito-Regular",
    color: COLORS.neutral[50],

    paddingRight: 10,
    height: 48,
  },
  inputError: {
    borderColor: COLORS.error[500],
  },
  textArea: {
    height: 120,
    textAlignVertical: "top",
  },
  link: {
    borderWidth: 1,
    borderColor: COLORS.neutral[100],
    borderTopRightRadius: 8,
    borderBottomRightRadius: 8,
    paddingLeft: 10,
  },
  icon: {
    // marginRight: 8,
  },
  prefix: {
    color: COLORS.neutral[500],
    fontSize: FONT_SIZES.label.lg,
    lineHeight: LINE_HEIGHT.label.lg,
    letterSpacing: LETTER_SPACING.label.lg,
    fontFamily: "Nunito-Regular",
  },
  helperText: {
    fontSize: FONT_SIZES.label.md,
    lineHeight: LINE_HEIGHT.label.md,
    letterSpacing: LETTER_SPACING.label.md,
    fontFamily: "Nunito-Regular",
    color: COLORS.neutral[500],
  },
  helperTextError: {
    color: COLORS.error[500],
  },
});

export default InputField;
