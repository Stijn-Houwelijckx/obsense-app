import React, { useState, useEffect, useRef } from "react";
import { View, Text, Alert, StyleSheet, Platform, Linking } from "react-native";
import MapView, { Marker, Callout, PROVIDER_GOOGLE } from "react-native-maps";
import Geolocation from "@react-native-community/geolocation";
import FastImage from "react-native-fast-image";
import AsyncStorage from "@react-native-async-storage/async-storage";

// Import Contexts
import { useActiveCollection } from "../../context/ActiveCollectionContext";

// Import Utils
import {
  getCollectionsForCurrentArtist,
  getOwnedCollections,
  getPlacedObjectsByCollection,
} from "../../utils/api";
import { checkLocationPermission } from "../../utils/permissions";

// Import Styles
import { globalStyles } from "../../styles/global";
import { COLORS } from "../../styles/theme";
import darkModeStyle from "../../styles/mapStyles";

// Import Components
import { CustomButton } from "../../components/UI";

const defaultImage = require("../../../assets/images/DefaultImage.jpg");

const Map = ({ navigation }) => {
  const [collectionData, setCollectionData] = useState([]); // State to store collection data
  const { activeCollectionId } = useActiveCollection();
  const [placedObjects, setPlacedObjects] = useState([]); // State to store placed objects
  const [location, setLocation] = useState({
    latitude: 51.50262830611886, // Default latitude
    longitude: -0.17658189393580523, // Default longitude
    latitudeDelta: 0.0922,
    longitudeDelta: 0.0421,
  });
  const [zoomLevel, setZoomLevel] = useState(15); // Default zoom level

  const mapRef = useRef(null);

  useEffect(() => {
    const getCollectionData = async () => {
      // Check if the user is an artist or a normal user
      const selectedRole = await AsyncStorage.getItem("selectedRole");
      const isArtist = await AsyncStorage.getItem("isArtist");

      let result = null; // Initialize result variable

      if (selectedRole === "artist" && isArtist === "true") {
        result = await getCollectionsForCurrentArtist();
      } else if (selectedRole === "user") {
        result = await getOwnedCollections(); // Fetch owned collections for normal user
      }

      if (result.status === "success") {
        // setUser(result.data.data.user); // Set user data
        if (selectedRole === "artist" && isArtist === "true") {
          setCollectionData(result.data.collections); // Set collection data
        } else if (selectedRole === "user") {
          setCollectionData(
            result.data.purchases.map((purchase) => purchase.collectionRef)
          );
        }
      } else {
        console.log("Error getting collection data:", result.message); // Log error message
      }
    };

    getCollectionData(); // Call the function
  }, []);

  useEffect(() => {
    const fetchPlacedObjects = async () => {
      if (activeCollectionId) {
        try {
          const result = await getPlacedObjectsByCollection(
            activeCollectionId._id
          );
          if (result.status === "success") {
            setPlacedObjects(result.data.placedObjects || []); // Set placed objects
          } else {
            console.error("Error fetching placed objects:", result.message);
          }
        } catch (error) {
          console.error("Error fetching placed objects:", error.message);
        }
      } else {
        setPlacedObjects([]); // Clear placed objects if no active collection
      }
    };

    fetchPlacedObjects();
  }, [activeCollectionId]);

  const getCurrentLocation = () => {
    Geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        setLocation((prevLocation) => ({
          ...prevLocation,
          latitude,
          longitude,
        }));
        mapRef.current?.animateToRegion(
          {
            latitude,
            longitude,
            latitudeDelta: 0.0922, // Default latitude delta
            longitudeDelta: 0.0421, // Default longitude delta
          },
          1000
        );
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
    // Chekc permission, if granted, get the current location
    const checkAndGetLocation = async () => {
      const locationPermission = await checkLocationPermission();
      if (locationPermission) {
        getCurrentLocation();
      }
    };

    checkAndGetLocation(); // Call the function to check permission and get location
  }, []);

  const calculateZoomLevel = (latitudeDelta) => {
    // Formula to calculate zoom level from latitudeDelta
    return Math.round(Math.log(360 / latitudeDelta) / Math.LN2);
  };

  return (
    <View style={[globalStyles.container, styles.container]}>
      <MapView
        ref={mapRef}
        provider={PROVIDER_GOOGLE} // Use Google Maps as the provider
        style={styles.map}
        customMapStyle={darkModeStyle}
        // region={location}
        showsUserLocation={true}
        followsUserLocation={true}
        // showsBuildings={true} // Optional: Show 3D buildings on the map
        // showsMyLocationButton={true} // Optional: Show the "My Location" button
        scrollEnabled={true} // Enable scrolling
        toolbarEnabled={false} // Disable the toolbar
        // onPanDrag={() => {
        //   console.log("Map is being dragged");
        // }}
        onRegionChangeComplete={(region) => {
          const zoom = calculateZoomLevel(region.latitudeDelta);
          setZoomLevel(zoom); // Update the zoom level state
        }}
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
      >
        {/* Render markers for collections with valid locations */}
        {zoomLevel >= 7 &&
          !activeCollectionId &&
          collectionData
            .filter(
              (collection) =>
                collection.location?.lat && collection.location?.lon
            )
            .map((collection) => (
              <Marker
                key={collection._id}
                coordinate={{
                  latitude: parseFloat(collection.location.lat),
                  longitude: parseFloat(collection.location.lon),
                }}
                anchor={{ x: 0.5, y: 0.5 }}
                calloutAnchor={{ x: 0.5, y: 0 }}
                onCalloutPress={() =>
                  navigation.navigate("Home", {
                    screen: "CollectionDetails",
                    params: {
                      collectionId: collection._id,
                      owned: true,
                    },
                  })
                }
              >
                {/* Custom marker using the collection's image */}
                <View style={styles.markerContainer}>
                  <FastImage
                    source={{ uri: collection.coverImage.filePath }}
                    style={styles.markerImage}
                  />
                </View>

                {/* Custom Callout */}
                <Callout tooltip>
                  <View style={styles.calloutContainer}>
                    <Text style={styles.calloutTitle}>{collection.title}</Text>
                    <View style={styles.calloutButtonContainer}>
                      <CustomButton
                        variant="filled"
                        size="small"
                        title="View Details"
                        style={{}}
                      />
                    </View>
                  </View>
                </Callout>
              </Marker>
            ))}

        {/* Render markers for placed objects with valid locations */}
        {zoomLevel >= 7 &&
          activeCollectionId &&
          placedObjects.map((object) => (
            <Marker
              key={object._id}
              coordinate={{
                latitude: object.position.lat,
                longitude: object.position.lon,
              }}
              anchor={{ x: 0.5, y: 0.5 }}
              calloutAnchor={{ x: 0.5, y: 0 }}
            >
              {/* Custom marker using the objects's image */}
              <View style={styles.markerContainer}>
                <FastImage
                  // source={{ uri: object.object.thumbnail.filePath }}
                  source={
                    object.object.thumbnail.filePath
                      ? { uri: object.object.thumbnail.filePath }
                      : defaultImage
                  }
                  style={styles.markerImage}
                />
              </View>

              {/* Custom Callout */}
              <Callout tooltip>
                <View style={styles.calloutContainer}>
                  <Text style={styles.calloutTitle}>{object.object.title}</Text>
                </View>
              </Callout>
            </Marker>
          ))}
      </MapView>
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
  markerContainer: {
    alignItems: "center",
    justifyContent: "center",
    width: 40, // Adjust the size of the marker container
    height: 40,
  },
  markerImage: {
    width: 40, // Adjust the size of the marker image
    height: 40,
    borderRadius: 9999, // Make the image circular
    borderWidth: 2,
    borderColor: COLORS.primary[500], // Add a border for better visibility
  },

  calloutContainer: {
    width: 250, // Set a fixed width for the callout
    padding: 10,
    backgroundColor: COLORS.primaryNeutral[600],
    borderWidth: 1,
    borderColor: COLORS.primary[500],
    borderRadius: 8,
  },
  calloutTitle: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 4,
    color: COLORS.neutral[50],
  },
  calloutCity: {
    fontSize: 14,
    marginBottom: 4,
    color: COLORS.neutral[50],
  },
  calloutPrice: {
    fontSize: 14,
    fontWeight: "bold",
    color: COLORS.neutral[50],
    marginBottom: 8,
  },
  calloutButtonContainer: {
    marginTop: 8,
  },
});

export default Map;
