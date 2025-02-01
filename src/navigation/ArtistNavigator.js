import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import Home from "../screens/Artist/Home";
import AR from "../screens/Artist/AR";
import Map from "../screens/Artist/Map";
import Settings from "../screens/Artist/Settings";
import AccountSettings from "../screens/Shared/SettingsScreens/AccountSettings";
import ChangePassword from "../screens/Shared/SettingsScreens/ChangePassword";
import Notification from "../screens/Shared/SettingsScreens/Notification";
import Details from "../screens/Shared/Details";

// Import custom icons
import HomeIcon from "../components/icons/HomeIcon";
import CameraIcon from "../components/icons/CameraIcon";
import MapIcon from "../components/icons/MapIcon";
import CogIcon from "../components/icons/CogIcon";

// Custom Components
import Header from "../components/UI/Header";

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

// Home Stack
const HomeStack = () => (
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
              profileImage="https://avatars.githubusercontent.com/u/147377015?v=4" // Replace with actual user image
              userName="John Doe" // Replace with actual user name
              tokens={150} // Replace with actual token count
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
    <Stack.Screen name="Details" component={Details} />
  </Stack.Navigator>
);

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
      tabBarStyle: route.name === "AR" ? { display: "none" } : {}, // Hide tab bar on AR screen
    })}
  >
    <Tab.Screen
      name="Home"
      component={HomeStack}
      options={{
        tabBarIcon: () => (
          <HomeIcon size={24} stroke="#B1B0AF" strokeWidth="1.5" />
        ),
      }}
    />
    <Tab.Screen
      name="AR"
      component={AR}
      options={{
        tabBarIcon: () => (
          <CameraIcon size={24} stroke="#B1B0AF" strokeWidth="1.5" />
        ),
      }}
    />
    <Tab.Screen
      name="Map"
      component={MapStack}
      options={{
        tabBarIcon: () => (
          <MapIcon size={24} stroke="#B1B0AF" strokeWidth="1.5" />
        ),
      }}
    />
    <Tab.Screen
      name="Settings"
      options={{
        tabBarIcon: () => (
          <CogIcon size={24} stroke="#B1B0AF" strokeWidth="1.5" />
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
