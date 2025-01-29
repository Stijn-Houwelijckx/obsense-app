import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import Home from "../screens/User/Home";
import Explore from "../screens/User/Explore";
import AR from "../screens/User/AR";
import Map from "../screens/User/Map";
import Settings from "../screens/User/Settings";
import AccountSettings from "../screens/Shared/SettingsScreens/AccountSettings";
import ChangePassword from "../screens/Shared/SettingsScreens/ChangePassword";
import Notification from "../screens/Shared/SettingsScreens/Notification";
import Details from "../screens/Shared/Details";

// Import custom icons
import HomeIcon from "../components/icons/HomeIcon";
import CompassIcon from "../components/icons/CompassIcon";
import CameraIcon from "../components/icons/CameraIcon";
import MapIcon from "../components/icons/MapIcon";
import CogIcon from "../components/icons/CogIcon";

// Custom Components
import Header from "../components/UI/Header";

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

const HomeStack = () => (
  <Stack.Navigator
    screenOptions={({ navigation, route }) => ({
      // We use navigation.canGoBack() to check if there's a back action
      header: () => {
        const showBackButton =
          route.name !== "HomeScreen" && navigation.canGoBack();

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

const ExploreStack = () => (
  <Stack.Navigator
    screenOptions={({ navigation, route }) => ({
      // We use navigation.canGoBack() to check if there's a back action
      header: () => {
        const showBackButton =
          route.name !== "ExploreScreen" && navigation.canGoBack();

        return (
          <Header
            title={route.name} // You can set dynamic title here if needed
            showBackButton={showBackButton}
          />
        );
      },
    })}
  >
    <Stack.Screen name="ExploreScreen" component={Explore} />
    <Stack.Screen name="Details" component={Details} />
  </Stack.Navigator>
);

const ARStack = () => (
  <Stack.Navigator
    screenOptions={({ navigation, route }) => ({
      // We use navigation.canGoBack() to check if there's a back action
      header: () => {
        const showBackButton =
          route.name !== "ARScreen" && navigation.canGoBack();

        return (
          <Header
            title={route.name} // You can set dynamic title here if needed
            showBackButton={showBackButton}
          />
        );
      },
    })}
  >
    <Stack.Screen name="ARScreen" component={AR} />
    <Stack.Screen name="Details" component={Details} />
  </Stack.Navigator>
);

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

const UserNavigator = ({ handleAuthChangeSuccess }) => (
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
      name="Explore"
      component={ExploreStack}
      options={{
        tabBarIcon: () => <CompassIcon size={24} fill="#B1B0AF" />,
      }}
    />
    <Tab.Screen
      name="AR"
      component={ARStack}
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

export default UserNavigator;
