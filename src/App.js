import React, { useState, useEffect } from "react";
import { View, StyleSheet } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import AppNavigator from "./navigation/AppNavigator";
import GlobalFont from "react-native-global-font";

import LogoSmallText from "./components/logo/LogoSmallText";

const App = () => {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadResources = () => {
      // Load fonts and apply globally using the font names defined in the CSS (font-family)

      // Nohemi Fonts
      GlobalFont.applyGlobal("Nohemi-Regular"); // Regular weight
      GlobalFont.applyGlobal("Nohemi-Black"); // Black weight
      GlobalFont.applyGlobal("Nohemi-Bold"); // Bold weight
      GlobalFont.applyGlobal("Nohemi-ExtraBold"); // ExtraBold weight
      GlobalFont.applyGlobal("Nohemi-Light"); // Light weight
      GlobalFont.applyGlobal("Nohemi-Thin"); // Thin weight
      GlobalFont.applyGlobal("Nohemi-SemiBold"); // SemiBold weight
      GlobalFont.applyGlobal("Nohemi-Medium"); // Medium weight
      GlobalFont.applyGlobal("Nohemi-ExtraLight"); // ExtraLight weight

      // Nunito Fonts
      GlobalFont.applyGlobal("Nunito-Regular"); // Regular weight
      GlobalFont.applyGlobal("Nunito-SemiBoldItalic"); // SemiBoldItalic weight
      GlobalFont.applyGlobal("Nunito-BoldItalic"); // BoldItalic weight
      GlobalFont.applyGlobal("Nunito-ExtraBold"); // ExtraBold weight
      GlobalFont.applyGlobal("Nunito-SemiBold"); // SemiBold weight
      GlobalFont.applyGlobal("Nunito-Bold"); // Bold weight
      GlobalFont.applyGlobal("Nunito-MediumItalic"); // MediumItalic weight
      GlobalFont.applyGlobal("Nunito-ExtraBoldItalic"); // ExtraBoldItalic weight
      GlobalFont.applyGlobal("Nunito-Medium"); // Medium weight
      GlobalFont.applyGlobal("Nunito-Italic"); // Italic weight

      // Any other resources can be loaded here as needed
      console.log("Fonts loaded");
    };

    setTimeout(() => {
      setIsLoading(false);
    }, 1500);

    loadResources();
  }, []);

  if (isLoading) {
    return (
      <View style={styles.loaderContainer}>
        <LogoSmallText width={239} height={176} />
      </View>
    );
  }

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <AppNavigator />
    </GestureHandlerRootView>
  );
};

const styles = StyleSheet.create({
  loaderContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#000",
  },
});

export default App;
