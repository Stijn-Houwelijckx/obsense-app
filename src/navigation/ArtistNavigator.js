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

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

// Home Stack
const HomeStack = () => (
  <Stack.Navigator>
    <Stack.Screen name="HomeScreen" component={Home} />
    <Stack.Screen name="Details" component={Details} />
  </Stack.Navigator>
);

// Map Stack
const MapStack = () => (
  <Stack.Navigator>
    <Stack.Screen name="MapScreen" component={Map} />
    <Stack.Screen name="Details" component={Details} />
  </Stack.Navigator>
);

// Settings Stack (for settings pages like AccountSettings, ChangePassword, etc.)
const SettingsStack = () => (
  <Stack.Navigator>
    <Stack.Screen name="SettingsScreen" component={Settings} />
    <Stack.Screen name="AccountSettings" component={AccountSettings} />
    <Stack.Screen name="ChangePassword" component={ChangePassword} />
    <Stack.Screen name="Notification" component={Notification} />
  </Stack.Navigator>
);

// Main Artist Tab Navigator
const ArtistNavigator = () => (
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
          <HomeIcon width={24} height={24} stroke="#B1B0AF" strokeWidth="1.5" />
        ),
      }}
    />
    <Tab.Screen
      name="AR"
      component={AR}
      options={{
        tabBarIcon: () => (
          <CameraIcon
            width={24}
            height={24}
            stroke="#B1B0AF"
            strokeWidth="1.5"
          />
        ),
      }}
    />
    <Tab.Screen
      name="Map"
      component={MapStack}
      options={{
        tabBarIcon: () => (
          <MapIcon width={24} height={24} stroke="#B1B0AF" strokeWidth="1.5" />
        ),
      }}
    />
    <Tab.Screen
      name="Settings"
      component={SettingsStack}
      options={{
        tabBarIcon: () => (
          <CogIcon width={24} height={24} stroke="#B1B0AF" strokeWidth="1.5" />
        ),
      }}
    />
  </Tab.Navigator>
);

export default ArtistNavigator;
