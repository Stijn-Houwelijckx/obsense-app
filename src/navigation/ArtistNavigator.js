import React, { useState, useEffect } from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import SystemNavigationBar from "react-native-system-navigation-bar";

// Import Utils
import { getCurrentUser } from "../utils/api";

// Import Screens
import Home from "../screens/Artist/Home";
import AR from "../screens/Artist/AR";
import Map from "../screens/Artist/Map";
import Settings from "../screens/Artist/Settings";
import AccountSettings from "../screens/Shared/SettingsScreens/AccountSettings";
import ChangePassword from "../screens/Shared/SettingsScreens/ChangePassword";
import Notification from "../screens/Shared/SettingsScreens/Notification";
import CollectionDetails from "../screens/Artist/CollectionDetails";
import PublishedCollections from "../screens/Artist/PublishedCollections";
import DraftCollections from "../screens/Artist/DraftCollections";
import Details from "../screens/Shared/Details";

// Import Styles
import {
  COLORS,
  FONT_SIZES,
  LINE_HEIGHT,
  LETTER_SPACING,
} from "../styles/theme";

// Import Icons
import HomeIcon from "../components/icons/HomeIcon";
import CameraIcon from "../components/icons/CameraIcon";
import MapIcon from "../components/icons/MapIcon";
import CogIcon from "../components/icons/CogIcon";

// Custom Components
import Header from "../components/UI/Header";

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

SystemNavigationBar.setNavigationColor(COLORS.primaryNeutral[800], "light");

// Home Stack
const HomeStack = () => {
  const [user, setUser] = useState(null); // State to store user data
  const [isLoading, setIsLoading] = useState(true); // State to manage loading state

  useEffect(() => {
    const getUser = async () => {
      const result = await getCurrentUser();

      if (result.status === "success") {
        setUser(result.data.user); // Set user data
      } else {
        console.log("Error getting user data:", result.message); // Log error message
      }

      setIsLoading(false); // Set loading state to false
    };

    getUser(); // Call the function
  }, []);

  if (!isLoading) {
    console.log(user); // Log user data

    const profilePicture = user?.profilePicture
      ? require("../../assets/profileImages/Stijn.png")
      : require("../../assets/profileImages/Leen.jpg");

    return (
      <Stack.Navigator
        screenOptions={({ navigation, route }) => ({
          // We use navigation.canGoBack() to check if there's a back action
          header: () => {
            const showBackButton =
              route.name !== "HomeScreen" && navigation.canGoBack();

            if (route.name === "HomeScreen") {
              return (
                <Header
                  type="profile"
                  profileImage={profilePicture}
                  text="Welcome Back!"
                  userName={user?.username}
                  onProfilePress={() => navigation.navigate("Settings")} // Navigate to Settings
                />
              );
            }

            return (
              <Header
                title={route.name} // You can set dynamic title here if needed
                showBackButton={showBackButton}
              />
            );
          },
        })}
      >
        <Stack.Screen name="HomeScreen" component={Home} />
        <Stack.Screen
          name="CollectionDetails"
          component={CollectionDetails}
          options={({ route }) => ({
            header: () => (
              <Header title={route.params?.title || "Loading..."} />
            ),
          })}
        />
        <Stack.Screen
          name="Published Collections"
          component={PublishedCollections}
        />
        <Stack.Screen name="Draft Collections" component={DraftCollections} />
      </Stack.Navigator>
    );
  }
};

// Map Stack
const MapStack = () => (
  <Stack.Navigator
    screenOptions={({ navigation, route }) => ({
      // We use navigation.canGoBack() to check if there's a back action
      header: () => {
        const showBackButton =
          route.name !== "MapScreen" && navigation.canGoBack();

        return (
          <Header
            title={route.name} // You can set dynamic title here if needed
            showBackButton={showBackButton}
          />
        );
      },
    })}
  >
    <Stack.Screen name="MapScreen" component={Map} />
    <Stack.Screen name="Details" component={Details} />
  </Stack.Navigator>
);

// Settings Stack (for settings pages like AccountSettings, ChangePassword, etc.)
const SettingsStack = ({ handleAuthChangeSuccess }) => (
  <Stack.Navigator
    screenOptions={({ navigation, route }) => ({
      // We use navigation.canGoBack() to check if there's a back action
      header: () => {
        const showBackButton =
          route.name !== "SettingsScreen" && navigation.canGoBack();

        return (
          <Header
            title={route.name} // You can set dynamic title here if needed
            showBackButton={showBackButton}
          />
        );
      },
    })}
  >
    <Stack.Screen name="SettingsScreen">
      {(props) => (
        <Settings
          {...props}
          handleAuthChangeSuccess={handleAuthChangeSuccess} // Pass it here
        />
      )}
    </Stack.Screen>
    <Stack.Screen name="AccountSettings" component={AccountSettings} />
    <Stack.Screen name="ChangePassword" component={ChangePassword} />
    <Stack.Screen name="Notification" component={Notification} />
  </Stack.Navigator>
);

// Main Artist Tab Navigator
const ArtistNavigator = ({ handleAuthChangeSuccess }) => (
  <Tab.Navigator
    screenOptions={({ route }) => ({
      headerShown: false,
      tabBarStyle:
        route.name === "AR"
          ? { display: "none" }
          : {
              backgroundColor: COLORS.primaryNeutral[800],
              borderTopWidth: 0, // Ensure no actual border
              elevation: 0, // Removes shadow on Android
              shadowOpacity: 0, // Removes shadow on iOS
            }, // Hide tab bar on AR screen
      tabBarLabelStyle: {
        fontSize: FONT_SIZES.label.sm,
        lineHeight: LINE_HEIGHT.label.sm,
        letterSpacing: LETTER_SPACING.label.sm,
        fontFamily: "Nunito-Medium",
      },
      tabBarActiveTintColor: COLORS.primary[500], // Set color for active tab label
      tabBarInactiveTintColor: COLORS.neutral[300], // Set color for inactive tab
    })}
  >
    <Tab.Screen
      name="Home"
      component={HomeStack}
      options={{
        tabBarIcon: ({ focused }) => (
          <HomeIcon
            size={24}
            stroke={focused ? COLORS.primary[500] : COLORS.neutral[300]}
            strokeWidth="1.5"
          />
        ),
      }}
    />
    <Tab.Screen
      name="AR"
      component={AR}
      options={{
        tabBarIcon: ({ focused }) => (
          <CameraIcon
            size={24}
            stroke={focused ? COLORS.primary[500] : COLORS.neutral[300]}
            strokeWidth="1.5"
          />
        ),
      }}
    />
    <Tab.Screen
      name="Map"
      component={MapStack}
      options={{
        tabBarIcon: ({ focused }) => (
          <MapIcon
            size={24}
            stroke={focused ? COLORS.primary[500] : COLORS.neutral[300]}
            strokeWidth="1.5"
          />
        ),
      }}
    />
    <Tab.Screen
      name="Settings"
      options={{
        tabBarIcon: ({ focused }) => (
          <CogIcon
            size={24}
            stroke={focused ? COLORS.primary[500] : COLORS.neutral[300]}
            strokeWidth="1.5"
          />
        ),
      }}
    >
      {(props) => (
        <SettingsStack
          {...props}
          handleAuthChangeSuccess={handleAuthChangeSuccess}
        />
      )}
    </Tab.Screen>
  </Tab.Navigator>
);

export default ArtistNavigator;
