import React from "react";
import { View, StyleSheet } from "react-native";
import { COLORS } from "../../styles/theme";

const ProgressIndicator = ({ totalSteps = 2, currentStep = 1 }) => {
  return (
    <View style={styles.container}>
      {Array.from({ length: totalSteps }, (_, index) => {
        const isActive = index + 1 === currentStep;
        return (
          <View
            key={index}
            style={[
              styles.step,
              isActive ? styles.activeStep : styles.inactiveStep,
            ]}
          />
        );
      })}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    width: "100%",
    height: 8,

    borderRadius: 9999,
    backgroundColor: COLORS.primary["500-20"],

    marginBottom: 10,
  },
  step: {
    flex: 1,
    height: "100%",
    borderRadius: 9999,
  },
  inactiveStep: {
    backgroundColor: "transparent",
  },
  activeStep: {
    backgroundColor: COLORS.primary[500],
  },
});

export default ProgressIndicator;
