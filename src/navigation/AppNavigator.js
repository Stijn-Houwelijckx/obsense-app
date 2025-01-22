import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import ArtistNavigator from "./ArtistNavigator";
import UserNavigator from "./UserNavigator";

const AppNavigator = () => {
  // Simulate user type (change this to implement actual logic, e.g., Redux or Context)
  const userType = "artist"; // Change to 'user' for testing user navigation

  return (
    <NavigationContainer>
      {userType === "artist" ? <ArtistNavigator /> : <UserNavigator />}
    </NavigationContainer>
  );
};

export default AppNavigator;
