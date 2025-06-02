import React, { useRef, useEffect } from "react";
import {
  TouchableOpacity,
  View,
  StyleSheet,
  Animated,
  Text,
} from "react-native";
import { COLORS } from "../../styles/theme";

const THUMB_SIZE = 22;
const TRACK_WIDTH = 48;
const TRACK_HEIGHT = 28;
const PADDING = 3;
const ACTIVE_LEFT = TRACK_WIDTH - THUMB_SIZE - PADDING;

const CustomSwitch = ({
  value,
  onValueChange,
  disabled = false,
  label,
  helperText,
  switchPosition = "right", // "left" or "right"
  style,
}) => {
  const anim = useRef(new Animated.Value(value ? 1 : 0)).current;

  useEffect(() => {
    Animated.timing(anim, {
      toValue: value ? 1 : 0,
      duration: 180,
      useNativeDriver: false,
    }).start();
  }, [value]);

  const thumbLeft = anim.interpolate({
    inputRange: [0, 1],
    outputRange: [PADDING, ACTIVE_LEFT],
  });

  const trackColor = anim.interpolate({
    inputRange: [0, 1],
    outputRange: [COLORS.neutral[200], COLORS.primary[500]],
  });

  const SwitchComponent = (
    <TouchableOpacity
      activeOpacity={0.8}
      onPress={() => !disabled && onValueChange && onValueChange(!value)}
      style={styles.switch}
      disabled={disabled}
    >
      <Animated.View
        style={[
          styles.track,
          { backgroundColor: trackColor, opacity: disabled ? 0.5 : 1 },
        ]}
      />
      <Animated.View
        style={[
          styles.thumb,
          {
            left: thumbLeft,
            backgroundColor: disabled
              ? COLORS.neutral[300]
              : COLORS.neutral[50],
          },
        ]}
      />
    </TouchableOpacity>
  );

  return (
    <View style={[styles.row, style]}>
      {switchPosition === "left" && SwitchComponent}
      <View style={styles.labelContainer}>
        {label && <Text style={styles.label}>{label}</Text>}
        {helperText && <Text style={styles.helperText}>{helperText}</Text>}
      </View>
      {switchPosition === "right" && SwitchComponent}
    </View>
  );
};

const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
    alignItems: "center",
  },
  labelContainer: {
    flex: 1,
    marginHorizontal: 12,
  },
  label: {
    fontSize: 16,
    color: COLORS.neutral[50],
    fontWeight: "500",
  },
  helperText: {
    fontSize: 13,
    color: COLORS.neutral[400],
    marginTop: 2,
  },
  switch: {
    width: TRACK_WIDTH,
    height: TRACK_HEIGHT,
    borderRadius: TRACK_HEIGHT / 2,
    justifyContent: "center",
    backgroundColor: "transparent",
    overflow: "visible",
  },
  track: {
    position: "absolute",
    width: TRACK_WIDTH,
    height: TRACK_HEIGHT,
    borderRadius: TRACK_HEIGHT / 2,
  },
  thumb: {
    position: "absolute",
    width: THUMB_SIZE,
    height: THUMB_SIZE,
    borderRadius: THUMB_SIZE / 2,
    top: PADDING,
  },
});

export default CustomSwitch;
