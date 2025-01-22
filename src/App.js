import React from "react";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import AppNavigator from "./navigation/AppNavigator";

const App = () => (
  <GestureHandlerRootView style={{ flex: 1 }}>
    <AppNavigator />
  </GestureHandlerRootView>
);

export default App;
