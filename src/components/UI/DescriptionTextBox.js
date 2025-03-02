import React, { useState } from "react";
import { Text, TouchableOpacity, View, StyleSheet } from "react-native";

// Import Styles
import { globalStyles } from "../../styles/global";
import { COLORS } from "../../styles/theme";

const DescriptionTextBox = ({ description, style }) => {
  // State to control whether the description is expanded or not
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <View style={[styles.container, style]}>
      {/* Text with dynamic line limit */}
      <Text
        style={[globalStyles.bodyMediumRegular, styles.description]}
        numberOfLines={isExpanded ? 0 : 4} // 0 means no limit, show all text
      >
        {description}
      </Text>

      {/* Button to toggle expand/collapse */}
      <TouchableOpacity
        onPress={() => setIsExpanded(!isExpanded)}
        style={styles.toggleButton}
      >
        <Text style={[globalStyles.bodySmallMedium, styles.toggleText]}>
          {isExpanded ? "Less" : "More"}
        </Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 10,
    position: "relative",
  },
  description: {
    color: COLORS.neutral[50],
  },
  toggleButton: {
    position: "absolute",
    right: 0,
    bottom: 0,
    backgroundColor: COLORS.primaryNeutral[900],
    paddingLeft: 8,
  },
  toggleText: {
    marginTop: 4,
    color: COLORS.primary[500],
  },
});

export default DescriptionTextBox;
