import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  Button,
  Alert,
  StyleSheet,
  PermissionsAndroid,
  Platform,
  Linking,
} from "react-native";
import MapView, { Marker, PROVIDER_GOOGLE } from "react-native-maps";
import Geolocation from "@react-native-community/geolocation";

// Import Styles
import { globalStyles } from "../../styles/global";
import { COLORS } from "../../styles/theme";

const Map = ({ navigation }) => {
  const [location, setLocation] = useState({
    latitude: 51.09284609, // Default latitude
    longitude: 4.52385715, // Default longitude
    latitudeDelta: 0.0922,
    longitudeDelta: 0.0421,
  });

  useEffect(() => {
    requestLocationPermission();

    // Start watching the user's location
    const watchId = Geolocation.watchPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        setLocation((prevLocation) => ({
          ...prevLocation,
          latitude,
          longitude,
        }));

        console.log("Location updated: ", position.coords);
      },
      (error) => {
        console.error("Error watching location: ", error);
      },
      { enableHighAccuracy: true, distanceFilter: 10 }
    );

    // Cleanup the watcher on component unmount
    return () => {
      Geolocation.clearWatch(watchId);
    };
  }, []);

  // Request location permission and get the user's location
  const requestLocationPermission = async () => {
    if (Platform.OS === "android") {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
        {
          title: "Location Permission",
          message:
            "This app needs access to your location to show it on the map.",
          buttonNeutral: "Ask Me Later",
          buttonNegative: "Cancel",
          buttonPositive: "OK",
        }
      );
      if (granted === PermissionsAndroid.RESULTS.GRANTED) {
        console.log("Location permission granted");
      } else {
        console.log("Location permission denied");
        Alert.alert(
          "Permission Denied",
          "Location permission is required to use this feature. Please enable it in your device settings.",
          [
            {
              text: "Cancel",
              style: "cancel",
            },
            {
              text: "Open Settings",
              onPress: () => {
                // Open device location settings
                if (Platform.OS === "android") {
                  Linking.openSettings();
                }
              },
            },
          ]
        );
      }
    }
  };

  return (
    <View style={[globalStyles.container, styles.container]}>
      <MapView
        provider={PROVIDER_GOOGLE} // Use Google Maps as the provider
        style={styles.map}
        region={location}
        showsUserLocation={true}
        followsUserLocation={true}
      >
        {/* Add a marker for the user's location */}
        <Marker coordinate={location} title="You are here" />
      </MapView>

      {/* Display coordinates for debugging */}
      <View style={styles.coordinatesContainer}>
        <Text style={styles.coordinatesText}>
          Latitude: {location.latitude.toFixed(6)}
        </Text>
        <Text style={styles.coordinatesText}>
          Longitude: {location.longitude.toFixed(6)}
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  map: {
    ...StyleSheet.absoluteFillObject, // Make the map fill the entire screen
  },
  coordinatesContainer: {
    position: "absolute",
    bottom: 20,
    left: 10,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    padding: 10,
    borderRadius: 8,
  },
  coordinatesText: {
    color: "white",
    fontSize: 14,
  },
});

export default Map;
