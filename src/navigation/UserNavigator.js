import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import Home from "../screens/User/Home";
import Explore from "../screens/User/Explore";
import AR from "../screens/User/AR";
import Map from "../screens/User/Map";
import AccountSettings from "../screens/Shared/SettingsScreens/AccountSettings";
import ChangePassword from "../screens/Shared/SettingsScreens/ChangePassword";
import Notification from "../screens/Shared/SettingsScreens/Notification";
import Details from "../screens/Shared/Details";

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

const HomeStack = () => (
  <Stack.Navigator>
    <Stack.Screen name="HomeScreen" component={Home} />
    <Stack.Screen name="Details" component={Details} />
  </Stack.Navigator>
);

const ExploreStack = () => (
  <Stack.Navigator>
    <Stack.Screen name="ExploreScreen" component={Explore} />
    <Stack.Screen name="Details" component={Details} />
  </Stack.Navigator>
);

const ARStack = () => (
  <Stack.Navigator>
    <Stack.Screen name="ARScreen" component={AR} />
    <Stack.Screen name="Details" component={Details} />
  </Stack.Navigator>
);

const MapStack = () => (
  <Stack.Navigator>
    <Stack.Screen name="MapScreen" component={Map} />
    <Stack.Screen name="Details" component={Details} />
  </Stack.Navigator>
);

const SettingsStack = () => (
  <Stack.Navigator>
    <Stack.Screen name="AccountSettings" component={AccountSettings} />
    <Stack.Screen name="ChangePassword" component={ChangePassword} />
    <Stack.Screen name="Notification" component={Notification} />
  </Stack.Navigator>
);

const UserNavigator = () => (
  <Tab.Navigator>
    <Tab.Screen name="Home" component={HomeStack} />
    <Tab.Screen name="Explore" component={ExploreStack} />
    <Tab.Screen name="AR" component={ARStack} />
    <Tab.Screen name="Map" component={MapStack} />
    <Tab.Screen name="Settings" component={SettingsStack} />
  </Tab.Navigator>
);

export default UserNavigator;
