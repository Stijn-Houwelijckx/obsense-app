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
        getCurrentLocation();
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
    } else {
      getCurrentLocation();
    }
  };

  const getCurrentLocation = () => {
    Geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        setLocation((prevLocation) => ({
          ...prevLocation,
          latitude,
          longitude,
        }));
        console.log("Current location:", position.coords); // Log the current location
      },
      (error) => {
        if (error.code === 2) {
          // Show alert if location services are disabled
          Alert.alert(
            "Location Services Disabled",
            "Please enable location services to use this feature.",
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
        } else {
          console.error("Error getting location: ", error);
        }
      },
      { enableHighAccuracy: true, timeout: 15000, maximumAge: 10000 }
    );
  };

  useEffect(() => {
    requestLocationPermission();
  }, []);

  return (
    <View style={[globalStyles.container, styles.container]}>
      <MapView
        provider={PROVIDER_GOOGLE} // Use Google Maps as the provider
        style={styles.map}
        // region={location}
        showsUserLocation={true}
        followsUserLocation={true}
        // showsBuildings={true} // Optional: Show 3D buildings on the map
        // showsMyLocationButton={true} // Optional: Show the "My Location" button
        scrollEnabled={true} // Enable scrolling
        // onPanDrag={() => {
        //   console.log("Map is being dragged");
        // }}
        onUserLocationChange={(event) => {
          const { latitude, longitude } = event.nativeEvent.coordinate;
          setLocation((prevLocation) => ({
            ...prevLocation,
            latitude,
            longitude,
          }));
          // console.log("User location updated:", latitude, longitude);
        }}
        initialCamera={{
          center: {
            latitude: location.latitude,
            longitude: location.longitude,
          },
          pitch: 0, // Default pitch (tilt)
          heading: 0, // Default heading (rotation)
          zoom: 15, // Set your desired zoom level here
          altitude: 0, // Optional: altitude (not commonly used)
        }}
      ></MapView>

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
    backgroundColor: "rgba(0, 0, 0, 0.5)", // Semi-transparent black background
    padding: 10,
    borderRadius: 8,
  },
  coordinatesText: {
    color: "white",
    fontSize: 14,
  },
});

export default Map;
