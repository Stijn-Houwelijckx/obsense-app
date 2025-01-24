import React, { useState, useEffect } from "react";
import { NavigationContainer } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import ArtistNavigator from "./ArtistNavigator";
import UserNavigator from "./UserNavigator";
import AuthNavigator from "./AuthNavigator";

const AppNavigator = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isArtist, setIsArtist] = useState(false);

  useEffect(() => {
    const checkUserStatus = async () => {
      const userToken = await AsyncStorage.getItem("userToken");

      if (userToken) {
        setIsLoggedIn(true);
        const isArtist = await AsyncStorage.getItem("isArtist");
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
  }, []);

  if (!isLoggedIn) {
    return <AuthNavigator />;
  }

  return (
    <NavigationContainer>
      {isArtist ? <ArtistNavigator /> : <UserNavigator />}
    </NavigationContainer>
  );
};

export default AppNavigator;
