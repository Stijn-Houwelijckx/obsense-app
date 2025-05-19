import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  ActivityIndicator,
  StyleSheet,
  ScrollView,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useActiveCollection } from "../../../context/ActiveCollectionContext";
import FastImage from "react-native-fast-image";

// Import Utils
import { getCurrentUser } from "../../../utils/api";

// Import Styles
import { globalStyles } from "../../../styles/global";
import { COLORS } from "../../../styles/theme";

// Import Icons
import UserCircleIcon from "../../../components/icons/UserCircleIcon";
import EuroCircleIcon from "../../../components/icons/EuroCircleIcon";
import KeyIcon from "../../../components/icons/KeyIcon";
import BellIcon from "../../../components/icons/BellIcon";
import LockClosedIcon from "../../../components/icons/LockClosedIcon";
import ShieldCheckIcon from "../../../components/icons/ShieldCheckIcon";
import LogoutIcon from "../../../components/icons/LogoutIcon";

// Custom Components
import NavList from "../../../components/UI/NavList";
import NavListItem from "../../../components/UI/NavListItem";
import CustomButton from "../../../components/UI/CustomButton";

const Settings = ({ navigation, handleAuthChangeSuccess }) => {
  const [user, setUser] = useState(null); // State to store user data
  const [isLoading, setIsLoading] = useState(true); // State to manage loading state
  const [isArtist, setIsArtist] = useState(false);
  const { clearActiveCollection } = useActiveCollection();

  useEffect(() => {
    const getUser = async () => {
      const result = await getCurrentUser();

      if (result.status === "success") {
        setUser(result.data.user); // Set user data
      } else {
        console.log("Error getting user data:", result.message); // Log error message
      }

      // Check if the user is an artist
      const artistStatus = (await AsyncStorage.getItem("isArtist")) === "true";
      setIsArtist(artistStatus);

      setIsLoading(false); // Set loading state to false
    };

    getUser(); // Call the function
  }, []);

  const handleRoleSwitch = async () => {
    try {
      // Get the current role
      const currentRole = await AsyncStorage.getItem("selectedRole");

      // Toggle the role
      const newRole = currentRole === "artist" ? "user" : "artist";

      // Update AsyncStorage
      await AsyncStorage.setItem("selectedRole", newRole);

      // Trigger re-check in AppNavigator
      handleAuthChangeSuccess();

      navigation.navigate("Home");

      console.log(`Switched role to: ${newRole}`);
    } catch (error) {
      console.error("Failed to switch roles:", error.message);
    }
  };

  const handleLogout = async () => {
    try {
      // Remove user-related data from AsyncStorage
      await AsyncStorage.removeItem("userToken");
      await AsyncStorage.removeItem("userId");
      await AsyncStorage.removeItem("isArtist");
      await AsyncStorage.removeItem("selectedRole");
      await AsyncStorage.clear(); // Clear all AsyncStorage data

      // Clear the active AR collection
      clearActiveCollection();

      // Trigger re-check in AppNavigator
      handleAuthChangeSuccess(); // This will notify AppNavigator to update
    } catch (error) {
      console.error("Logout failed:", error.message);
    }
  };

  if (isLoading) {
    return (
      <View style={globalStyles.container}>
        <ActivityIndicator size="large" color={COLORS.primary[500]} />
      </View>
    );
  }

  return (
    <View style={[globalStyles.container, styles.container]}>
      <ScrollView contentContainerStyle={styles.container}>
        <View style={styles.profileHeader}>
          <FastImage
            source={
              user?.profilePicture?.filePath
                ? { uri: user.profilePicture.filePath } // Use the URI if it exists
                : require("../../../../assets/profileImages/Default.jpg") // Fallback to Default.jpg
            }
            style={styles.profilePicture}
          />
          <Text style={[globalStyles.headingH6Medium, styles.profileName]}>
            {user.firstName} {user.lastName}
          </Text>
          <Text style={[globalStyles.bodyMediumRegular, styles.profileEmail]}>
            {user.email}
          </Text>
        </View>

        <NavList>
          <NavListItem
            title="Account Settings"
            icon={UserCircleIcon}
            onPress={() => navigation.navigate("AccountSettings")}
          />
          <NavListItem
            title="My Tokens"
            icon={EuroCircleIcon}
            onPress={() => navigation.navigate("Wallet")}
          />
          <NavListItem
            title="Change Password"
            icon={KeyIcon}
            onPress={() => navigation.navigate("ChangePassword")}
          />
          <NavListItem
            title="Notifications"
            icon={BellIcon}
            onPress={() => navigation.navigate("Notification")}
          />
          <NavListItem
            title="Privacy & Cookies"
            icon={LockClosedIcon}
            onPress={() => navigation.navigate("PrivacyCookies")}
          />
          <NavListItem
            title="Terms and Conditions"
            icon={ShieldCheckIcon}
            onPress={() => navigation.navigate("TermsConditions")}
          />
        </NavList>

        {/* Add Role Switch Button if isArtist is true */}
        {isArtist && (
          <CustomButton
            variant="text"
            size="large"
            title="Switch Role"
            onPress={handleRoleSwitch}
            style={styles.switchRoleButton}
          />
        )}

        <CustomButton
          variant="text"
          size="large"
          title="Logout"
          leadingIcon={LogoutIcon}
          onPress={handleLogout}
          style={styles.logoutButton}
        />
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    gap: 20,
    justifyContent: "",
    alignItems: "",
  },
  profileHeader: {
    gap: 8,
    alignItems: "center",
  },
  profilePicture: {
    width: 130,
    height: 130,
    borderRadius: 9999,
    marginBottom: 8,
  },
  profileName: {
    color: COLORS.neutral[50],
  },
  profileEmail: {
    color: COLORS.neutral[100],
  },
  logoutButton: {
    alignSelf: "flex-start",
  },
});

export default Settings;
