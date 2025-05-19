import React from "react";
import { View, Text, StyleSheet, Image } from "react-native";

// Import Styles
import { COLORS } from "../../styles/theme";
import { globalStyles } from "../../styles/global";

// Import Components
import LogoSmallText from "../../components/logo/LogoSmallText";
import { CustomButton } from "../../components/UI";

const LandingPage = ({ navigation }) => {
  return (
    <View style={[globalStyles.container, styles.container]}>
      <Image
        source={require("../../../assets/images/BallImage.png")}
        style={[styles.ballImage, { top: 0, width: 245, height: 245 }]}
      />
      <Image
        source={require("../../../assets/images/BallImage.png")}
        style={[
          styles.ballImage,
          { top: 150, left: "10%", width: 105, height: 105 },
        ]}
      />
      <Image
        source={require("../../../assets/images/BallImage.png")}
        style={[
          styles.ballImage,
          { top: 150, right: "10%", width: 63, height: 63 },
        ]}
      />

      <View
        style={[globalStyles.secondaryContainer, styles.secondaryContainer]}
      >
        <View style={styles.headingContainer}>
          <LogoSmallText width={210} />
          <Text style={[styles.title, globalStyles.bodyLargeBold]}>
            Where Reality and Imagination Collide
          </Text>
        </View>
        <View style={styles.btnContainer}>
          <CustomButton
            variant="filled"
            size="large"
            title="Create Account"
            onPress={() => navigation.navigate("Create Account")} // Navigate to Signup screen
            style={styles.btn}
          />
          <CustomButton
            variant="outlined"
            size="large"
            title="Already Have an Account"
            onPress={() => navigation.navigate("Login")} // Navigate to Login screen
            style={styles.btn}
          />
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    justifyContent: "flex-end",
  },
  ballImage: {
    position: "absolute",
  },
  secondaryContainer: {
    borderRadius: 16,
    width: "100%",
    gap: 40,
  },
  headingContainer: {
    alignItems: "center",
  },
  title: {
    color: COLORS.neutral[50],
    textAlign: "center",
    width: 164,
  },
  btnContainer: {
    width: "100%",
    gap: 12,
  },
  btn: {
    width: "100%",
  },
});

export default LandingPage;
