import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

import LandingPage from "../screens/Auth/LandingPage";
import Login from "../screens/Auth/Login";
import SignUp from "../screens/Auth/SignUp";

// Custom Components
import Header from "../components/UI/Header";

const AuthNavigator = ({ handleAuthChangeSuccess }) => {
  const Stack = createNativeStackNavigator();

  return (
    <Stack.Navigator
      initialRouteName="LandingPage"
      screenOptions={({ navigation, route }) => ({
        // We use navigation.canGoBack() to check if there's a back action
        header: () => {
          const showBackButton =
            route.name !== "LandingPage" && navigation.canGoBack();

          return (
            <Header
              title={route.name} // You can set dynamic title here if needed
              showBackButton={showBackButton}
            />
          );
        },
      })}
    >
      <Stack.Screen name="LandingPage" component={LandingPage} />
      <Stack.Screen name="Login">
        {(props) => (
          <Login {...props} handleAuthChangeSuccess={handleAuthChangeSuccess} />
        )}
      </Stack.Screen>
      <Stack.Screen name="SignUp">
        {(props) => (
          <SignUp
            {...props}
            handleAuthChangeSuccess={handleAuthChangeSuccess}
          />
        )}
      </Stack.Screen>
    </Stack.Navigator>
  );
};

export default AuthNavigator;
