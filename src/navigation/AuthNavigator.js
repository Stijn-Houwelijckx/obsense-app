import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

import LandingPage from "../screens/Auth/LandingPage";
import Login from "../screens/Auth/Login";
import SignUp from "../screens/Auth/SignUp";
import RoleSelection from "../screens/Auth/RoleSelection";

// Custom Components
import { Header } from "../components/UI";

const AuthNavigator = ({ handleAuthChangeSuccess }) => {
  const Stack = createNativeStackNavigator();

  return (
    <Stack.Navigator
      initialRouteName="LandingPage"
      screenOptions={({ navigation, route }) => {
        // Hide header for LandingPage
        if (route.name === "LandingPage") {
          return { headerShown: false };
        }

        const showBackButton = navigation.canGoBack();

        return {
          header: () => (
            <Header title={route.name} showBackButton={showBackButton} />
          ),
        };
      }}
    >
      <Stack.Screen name="LandingPage" component={LandingPage} />
      <Stack.Screen name="Create Account">
        {(props) => (
          <SignUp
            {...props}
            handleAuthChangeSuccess={handleAuthChangeSuccess}
          />
        )}
      </Stack.Screen>
      <Stack.Screen name="Login">
        {(props) => (
          <Login {...props} handleAuthChangeSuccess={handleAuthChangeSuccess} />
        )}
      </Stack.Screen>
      <Stack.Screen name="Role Selection">
        {(props) => (
          <RoleSelection
            {...props}
            handleAuthChangeSuccess={handleAuthChangeSuccess}
          />
        )}
      </Stack.Screen>
    </Stack.Navigator>
  );
};

export default AuthNavigator;
