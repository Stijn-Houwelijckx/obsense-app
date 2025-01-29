import React, { useState, useEffect } from "react";
import { StatusBar } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import ArtistNavigator from "./ArtistNavigator";
import UserNavigator from "./UserNavigator";
import AuthNavigator from "./AuthNavigator";

import { COLORS } from "../styles/theme";

const AppNavigator = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isArtist, setIsArtist] = useState(false);
  const [isUpdated, setIsUpdated] = useState(false); // Track if the status is updated

  useEffect(() => {
    const checkUserStatus = async () => {
      const userToken = await AsyncStorage.getItem("userToken");

      if (userToken) {
        setIsLoggedIn(true);
        const isArtist =
          (await AsyncStorage.getItem("isArtist")) === "true" ? true : false;
        if (isArtist) {
          setIsArtist(true);
        } else {
          setIsArtist(false);
        }
      } else {
        setIsLoggedIn(false);
      }
    };

    checkUserStatus();
  }, [isUpdated]);

  // Function to notify that sign-up was successful
  const handleAuthChangeSuccess = () => {
    setIsUpdated((prev) => !prev); // Trigger state update to force recheck
    console.log("Auth Change successfull. Rechecking user status...");
  };

  return (
    <NavigationContainer>
      <StatusBar
        barStyle="light-content" // Makes the status bar text white
        backgroundColor={COLORS.primaryNeutral[900]} // Sets the background color of the status bar
      />
      {/* If the user is not logged in, show AuthNavigator */}
      {isLoggedIn ? (
        isArtist ? (
          <ArtistNavigator handleAuthChangeSuccess={handleAuthChangeSuccess} />
        ) : (
          <UserNavigator handleAuthChangeSuccess={handleAuthChangeSuccess} />
        )
      ) : (
        <AuthNavigator handleAuthChangeSuccess={handleAuthChangeSuccess} />
      )}
    </NavigationContainer>
  );
};

export default AppNavigator;
