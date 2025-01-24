import React, { useState, useEffect } from "react";
import { View, Image, StyleSheet } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import AppNavigator from "./navigation/AppNavigator";

import LogoSmallText from "./components/logo/LogoSmallText";

const App = () => {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadResources = () => {
      // Load resources here
      console.log("No resources to load yet");
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
  logo: {
    width: 200,
    height: 200,
  },
});

export default App;
