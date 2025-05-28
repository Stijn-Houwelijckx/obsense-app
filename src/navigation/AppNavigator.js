import React, { useState, useEffect } from "react";
import { StatusBar } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import SystemNavigationBar from "react-native-system-navigation-bar";
import ArtistNavigator from "./ArtistNavigator";
import UserNavigator from "./UserNavigator";
import AuthNavigator from "./AuthNavigator";
import RoleSelection from "../screens/Auth/RoleSelection";

import {
  checkLocationPermission,
  checkCameraPermission,
} from "../utils/permissions";

// Import Contexts
import ContextProvider from "../context/ContexProvider";

import { COLORS } from "../styles/theme";

const AppNavigator = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isArtist, setIsArtist] = useState(false);
  const [isUpdated, setIsUpdated] = useState(false); // Track if the status is updated
  const [selectedRole, setSelectedRole] = useState(null);

  useEffect(() => {
    SystemNavigationBar.setNavigationColor(COLORS.primaryNeutral[800], "light");

    const checkUserStatus = async () => {
      const userToken = await AsyncStorage.getItem("userToken");

      if (userToken) {
        setIsLoggedIn(true);
        const isArtist =
          (await AsyncStorage.getItem("isArtist")) === "true" ? true : false;
        setIsArtist(isArtist);

        if (isArtist) {
          const savedRole = await AsyncStorage.getItem("selectedRole");
          setSelectedRole(savedRole);
        } else {
          const savedRole = await AsyncStorage.setItem("selectedRole", "user");
          setSelectedRole(savedRole);
        }

        // Check permissions
        const locationPermission = await checkLocationPermission();
        const cameraPermission = await checkCameraPermission();
        if (!locationPermission) {
          console.warn("Location permission is not granted.");
        }
        if (!cameraPermission) {
          console.warn("Camera permission is not granted.");
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
    <ContextProvider>
      <NavigationContainer>
        <StatusBar
          barStyle="light-content" // Makes the status bar text white
          backgroundColor={COLORS.primaryNeutral[900]} // Sets the background color of the status bar
        />
        {/* If the user is not logged in, show AuthNavigator */}
        {isLoggedIn ? (
          isArtist ? (
            selectedRole === "artist" ? (
              <ArtistNavigator
                handleAuthChangeSuccess={handleAuthChangeSuccess}
              />
            ) : selectedRole === "user" ? (
              <UserNavigator
                handleAuthChangeSuccess={handleAuthChangeSuccess}
              />
            ) : (
              <RoleSelection
                handleAuthChangeSuccess={handleAuthChangeSuccess}
              />
            )
          ) : (
            <UserNavigator handleAuthChangeSuccess={handleAuthChangeSuccess} />
          )
        ) : (
          <AuthNavigator handleAuthChangeSuccess={handleAuthChangeSuccess} />
        )}
      </NavigationContainer>
    </ContextProvider>
  );
};

export default AppNavigator;
