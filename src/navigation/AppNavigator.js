import React, { useState, useEffect } from "react";
import { StatusBar, View, Text, StyleSheet } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import SystemNavigationBar from "react-native-system-navigation-bar";
import NetInfo from "@react-native-community/netinfo";

import ArtistNavigator from "./ArtistNavigator";
import UserNavigator from "./UserNavigator";
import AuthNavigator from "./AuthNavigator";
import RoleSelection from "../screens/Auth/RoleSelection";

import { COLORS } from "../styles/theme";
import { globalStyles } from "../styles/global";

import {
  checkLocationPermission,
  checkCameraPermission,
} from "../utils/permissions";

// Import Contexts
import ContextProvider from "../context/ContexProvider";

const AppNavigator = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isArtist, setIsArtist] = useState(false);
  const [isUpdated, setIsUpdated] = useState(false); // Track if the status is updated
  const [selectedRole, setSelectedRole] = useState(null);

  const [isOffline, setIsOffline] = useState(false);

  useEffect(() => {
    const unsubscribe = NetInfo.addEventListener((state) => {
      setIsOffline(!state.isConnected);
      console.log("Network status: ", state.isConnected ? "Online" : "Offline");
    });
    return () => {
      unsubscribe();
    };
  }, []);

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
        {/* Full Screen Offline Overlay */}
        {isOffline && (
          <View style={[styles.offlineOverlay]}>
            <Text style={[styles.text, globalStyles.bodyLargeBold]}>
              You are currently offline. Please check your internet connection.
            </Text>
          </View>
        )}

        {/* If the user is not logged in, show AuthNavigator */}
        {isLoggedIn && isOffline === false ? (
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

const styles = StyleSheet.create({
  offlineOverlay: {
    flex: 1,
    zIndex: 1000, // Ensure the overlay is on top
    position: "absolute",
    height: "100%",
    width: "100%",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    padding: 16,
    backgroundColor: "rgba(0, 0, 0, 0.8)",
    justifyContent: "center",
    alignItems: "center",
  },
  text: {
    color: COLORS.neutral[50],
    textAlign: "center",
    padding: 28,
    backgroundColor: COLORS.primaryNeutral[800],
    borderRadius: 10,
  },
});

export default AppNavigator;
