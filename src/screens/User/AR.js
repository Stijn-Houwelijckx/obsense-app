// Import the necessary libraries
import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  Modal,
  Pressable,
  TouchableOpacity,
  Dimensions,
  Alert,
} from "react-native";
import { ViroARSceneNavigator } from "@reactvision/react-viro";
import { useNavigation, useIsFocused } from "@react-navigation/native";
import FastImage from "react-native-fast-image";

// Import ARScene
import ARScene from "./ARScene";

// Import Contexts
import { useActiveCollection } from "../../context/ActiveCollectionContext";

// Import Utils
import { getPlacedObjectsByCollection, apiRequest } from "../../utils/api";
import { getDeviceHeading } from "../../utils/headingUtils";
import { getCurrentLocation } from "../../utils/locationUtils";
import { calculateARCoordinates } from "../../utils/geoUtils";

// Import Hooks
import useLocation from "../../hooks/useLocation";

// Import Styles
import { COLORS } from "../../styles/theme";
import { globalStyles } from "../../styles/global";

// Import Icons
import {
  ArrowLeftIcon,
  MapIcon,
  XIcon,
  ExclamationCircleIcon,
} from "../../components/icons";

// Import Components
import { IconButton, ReportModal } from "../../components/UI";

const reportReasons = [
  "I just don’t like it",
  "Inappropriate content",
  "Copyright infringement",
  "Harassment or bullying",
  "Violence, hate or racism",
  "Nudity or sexual activity",
  "Scam, fraud or spam",
  "False information",
];

const screenWidth = Dimensions.get("window").width; // Get screen width
const modalWidth = screenWidth - 32; // Calculate card width

const AR = (route) => {
  const navigation = useNavigation(); // React Navigation hook for navigation
  const isFocused = useIsFocused(); // React Navigation hook to track focus
  const { activeCollectionId, clearActiveCollection } = useActiveCollection();

  const [objects, setObjects] = useState([]); // Manage objects in App
  const [isARActive, setIsARActive] = useState(true); // Track AR Scene status
  const [arOriginGeoCoordinates, setAROriginGeoCoordinates] = useState(null); // Track AR origin coordinates
  const [initialHeading, setInitialHeading] = useState(0); // Track initial heading
  // const [deviceHeading, setDeviceHeading] = useState(0); // Track device heading

  // const [location, setLocation] = useState({ latitude: 0, longitude: 0 });
  const { location } = useLocation(); // Get location from custom hook

  const [currentLocationReady, setCurrentLocationReady] = useState(false); // Track if current location is ready
  const [initialHeadingReady, setInitialHeadingReady] = useState(false); // Track if initial heading is ready

  const [objectInfoModalVisible, setObjectInfoModalVisible] = useState(false);
  const [objectInfo, setObjectInfo] = useState(null); // Track object info
  const [objectInfoLoading, setObjectInfoLoading] = useState(false);
  const [reportModalVisible, setReportModalVisible] = useState(false);

  const getFinalARPosition = async ({
    modelPosition, // { lat, lon }
    savedOrigin, // { lat, lon, heading } -> from DB
    currentOrigin, // { lat, lon, heading } -> device now
  }) => {
    // 1. Calculate offset between current AR origin and saved AR origin
    const originDelta = await calculateARCoordinates(
      { lat: savedOrigin.lat, lng: savedOrigin.lon },
      { latitude: currentOrigin.lat, longitude: currentOrigin.lon },
      currentOrigin.heading
    );

    console.log("Origin delta: ", originDelta); // Debug log

    // 2. Get model's position relative to the saved origin
    const modelOffset = await calculateARCoordinates(
      { lat: modelPosition.lat, lng: modelPosition.lon },
      { latitude: savedOrigin.lat, longitude: savedOrigin.lon },
      savedOrigin.heading
    );

    console.log("Model offset: ", modelOffset); // Debug log

    // 3. Subtract the origin delta to convert to new AR session's space
    const finalPosition = [
      modelOffset[0] - originDelta[0],
      modelOffset[1] - originDelta[1], // usually 0
      modelOffset[2] - originDelta[2],
    ];

    return finalPosition;
  };

  const fetchAndPlaceObjects = async () => {
    console.log("Fetching and placing objects..."); // Debug log

    if (
      arOriginGeoCoordinates &&
      initialHeading &&
      currentLocationReady &&
      initialHeadingReady
    ) {
      try {
        const response = await getPlacedObjectsByCollection(
          route.route?.params?.collection?._id || activeCollectionId._id
        );

        console.log("Response from API: ", response); // Debug log

        if (response.status === "success") {
          const placedObjects = response.data.placedObjects;

          const arObjects = await Promise.all(
            placedObjects.map(async (obj) => {
              // console.log("Object: ", obj); // Debug log
              // const geoCoordinates = await calculateARCoordinates(
              //   { lat: obj.position.lat, lng: obj.position.lon },
              //   { latitude: obj.origin.lat, longitude: obj.origin.lon },
              //   obj.origin.heading
              // );

              const geoCoordinates = await getFinalARPosition({
                modelPosition: {
                  lat: obj.position.lat,
                  lon: obj.position.lon,
                },
                savedOrigin: {
                  lat: obj.origin.lat,
                  lon: obj.origin.lon,
                  heading: obj.origin.heading,
                },
                currentOrigin: {
                  lat: arOriginGeoCoordinates.latitude,
                  lon: arOriginGeoCoordinates.longitude,
                  heading: initialHeading,
                },
              });

              console.log("Object id: " + obj._id); // Debug log
              console.log("AR Coordinates: ", geoCoordinates);

              return {
                id: obj._id,
                objectId: obj.object._id,
                source: { uri: obj.object.file.filePath },
                position: [
                  geoCoordinates[0],
                  geoCoordinates[1],
                  geoCoordinates[2],
                ],
                scale: [obj.scale.x, obj.scale.y, obj.scale.z],
                rotation: [obj.rotation.x, obj.rotation.y, obj.rotation.z],
              };
            })
          );

          setObjects(arObjects); // Set the objects in AR
        } else {
          console.log("Error fetching objects:", response.message);
        }
      } catch (error) {
        console.error("Error fetching objects:", error.message);
      }
    }
  };

  // Fetch AR origin and placed objects when the component mounts
  useEffect(() => {
    if (
      arOriginGeoCoordinates &&
      initialHeading &&
      currentLocationReady &&
      initialHeadingReady
    ) {
      console.log("Fetching and placing objects...");
      fetchAndPlaceObjects();
    }
  }, [currentLocationReady, initialHeadingReady]);

  useEffect(() => {
    if (!currentLocationReady) {
      console.log("Getting AR origin coordinates once..."); // Debug log
      // Set the AR origin when the AR session starts
      getAROriginGeoCoordinates();
    }
  });

  useEffect(() => {
    // Get the device's heading when the AR session starts
    const fetchHeading = async () => {
      const heading = await getDeviceHeading(); // Get the device's heading
      setInitialHeading(heading); // Save the initial heading

      setInitialHeadingReady(true); // Mark initial heading as ready
    };

    fetchHeading(); // Call the function to fetch heading
  }, []);

  // React Navigation Focus Effect
  useEffect(() => {
    if (isFocused) {
      setIsARActive(true); // Activate AR scene when screen is focused
    } else {
      setIsARActive(false); // Deactivate AR scene when screen is blurred
    }
  }, [isFocused]);

  const getAROriginGeoCoordinates = async () => {
    try {
      const currentLocation = await getCurrentLocation(); // Get the current location

      setAROriginGeoCoordinates({
        latitude: currentLocation.latitude,
        longitude: currentLocation.longitude,
      });

      setCurrentLocationReady(true); // Mark current location as ready
    } catch (error) {
      console.error("Error getting AR origin position: ", error);
    }
  };

  const fetchObjectInfo = async (objectId) => {
    setObjectInfoLoading(true); // Show loading state
    try {
      response = await apiRequest({
        method: "GET",
        endpoint: `/placedObjects/${objectId}`,
      });

      if (response.status === "success") {
        setObjectInfo(response.data.placedObject.object); // Set the object info
        setObjectInfoModalVisible(true); // Show the modal
      }
    } catch (error) {
      console.error("Error fetching object info:", error);
      setObjectInfoLoading(false); // Hide loading state
      return;
    } finally {
      setObjectInfoLoading(false); // Hide loading state
    }
  };

  const handleObjectSelect = (obj) => {
    console.log("Selected object:", obj); // Debug log
    if (obj && obj.id) {
      // If an object is selected, fetch its info
      fetchObjectInfo(obj.id);
    } else {
      // If no object is selected, close the modal
      setObjectInfoModalVisible(false);
      setObjectInfo(null); // Clear object info
    }
  };

  const handleBackPress = () => {
    cleanupAndGoBack();
  };

  const cleanupAndGoBack = async () => {
    clearActiveCollection();
    // await AsyncStorage.removeItem("activeCollectionId"); // Clear active collection ID
    setObjects([]); // Clear objects when navigating away
    setObjectInfo(null); // Clear object info
    setObjectInfoModalVisible(false); // Hide object info modal
    navigation.goBack(); // Go back to the previous screen
  };

  const handleReportReason = (reason) => {
    setReportModalVisible(false);
    Alert.alert(
      "Report submitted",
      `Reason: ${reason}\n\nThank you for your feedback.`
    );
  };

  return (
    <View style={{ flex: 1 }}>
      {isARActive && (
        <ViroARSceneNavigator
          autofocus={true}
          initialScene={{ scene: ARScene }}
          viroAppProps={{
            objects: objects, // Pass objects to ARScene
            setObjects: setObjects, // Allow ARScene to update objects
            handleObjectSelect: handleObjectSelect,
          }}
          shadowsEnabled={true}
          pbrEnabled={true}
          hdrEnabled={true}
          bloomEnabled={true}
        />
      )}

      {/* Coordinates Display */}
      <View style={styles.coordinatesContainer}>
        <Text style={styles.coordinatesText}>
          Latitude: {location.latitude.toFixed(6)}
        </Text>
        <Text style={styles.coordinatesText}>
          Longitude: {location.longitude.toFixed(6)}
        </Text>
      </View>

      {/* Button to go back */}
      <IconButton
        icon={ArrowLeftIcon}
        onPress={handleBackPress}
        buttonSize={48}
        iconSize={24}
        style={styles.customBackButton}
      />

      <View style={styles.mapButton}>
        <IconButton
          icon={MapIcon}
          onPress={async () => {
            console.log("Navigating to Map screen");
            // Navigate to the map screen
            navigation.navigate("Map", {});
          }}
          buttonSize={40}
          iconSize={20}
        />
        <Text style={[globalStyles.labelSmallSemiBold, styles.iconButtonText]}>
          Map
        </Text>
      </View>

      {/* Model Info Modal */}
      <Modal
        visible={objectInfoModalVisible}
        transparent
        animationType="fade"
        onRequestClose={() => {
          setObjectInfoModalVisible(false);
          setObjectInfo(null);
        }}
      >
        <Pressable
          style={modalStyles.overlay}
          onPress={() => {
            setObjectInfoModalVisible(false);
            setObjectInfo(null);
          }}
        >
          <Pressable style={modalStyles.content} onPress={() => {}}>
            <View style={modalStyles.header}>
              <Text style={[globalStyles.headingH6SemiBold, modalStyles.title]}>
                {objectInfoLoading
                  ? "Loading..."
                  : objectInfo?.title || "Object Info"}
              </Text>
              <TouchableOpacity
                onPress={() => {
                  setObjectInfoModalVisible(false);
                  setObjectInfo(null);
                }}
              >
                <XIcon size={24} stroke={COLORS.neutral[50]} />
              </TouchableOpacity>
            </View>

            <View
              style={{
                width: modalWidth - 48,
                height: 100,
                borderRadius: 8,
                overflow: "hidden",
                marginBottom: 16,
              }}
            >
              <FastImage
                style={{
                  width: "100%",
                  height: 180, // Make this larger than the container height
                  borderRadius: 8,
                  marginTop: 0, // Set to 0 to show the top, or adjust for more/less
                }}
                source={
                  objectInfoLoading
                    ? require("../../../assets/profileImages/Default.jpg")
                    : { uri: objectInfo?.thumbnail?.filePath || "" }
                }
                resizeMode="cover"
              />
            </View>

            <Text
              style={[globalStyles.bodySmallRegular, modalStyles.description]}
            >
              {objectInfoLoading
                ? "Loading description..."
                : objectInfo?.description || "No description available."}
            </Text>
            <TouchableOpacity
              style={modalStyles.reportButton}
              onPress={() => {
                setObjectInfoModalVisible(false);
                setTimeout(() => setReportModalVisible(true), 200);
              }}
            >
              <ExclamationCircleIcon size={24} stroke={COLORS.error[500]} />
              <Text
                style={[globalStyles.bodyMediumRegular, modalStyles.reportText]}
              >
                Report Artwork
              </Text>
            </TouchableOpacity>
          </Pressable>
        </Pressable>
      </Modal>

      {/* Report Modal */}
      <ReportModal
        visible={reportModalVisible}
        onClose={() => setReportModalVisible(false)}
        reasons={reportReasons}
        onSelectReason={handleReportReason}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  customBackButton: {
    position: "absolute",
    top: 16,
    left: 16,
  },
  iconButtonText: {
    color: COLORS.neutral[50],
  },
  mapButton: {
    position: "absolute",
    bottom: 16,
    right: 20,
    alignItems: "center",
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

const modalStyles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.4)",
    justifyContent: "center",
    alignItems: "center",
  },
  content: {
    backgroundColor: COLORS.primaryNeutral[700],
    borderRadius: 12,
    padding: 24,
    minWidth: 220,
    alignItems: "flex-start",
    elevation: 5,
    maxWidth: modalWidth,
  },
  reportContent: {
    backgroundColor: COLORS.primaryNeutral[700],
    borderRadius: 12,
    padding: 24,
    minWidth: 280,
    alignItems: "flex-start",
    elevation: 5,
    maxWidth: modalWidth,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
    marginBottom: 16,
  },
  title: {
    color: COLORS.neutral[50],
    flex: 1,
    marginRight: 8,
  },
  reportButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    paddingVertical: 8,
    paddingHorizontal: 0,
  },
  reportText: {
    color: COLORS.error[500],
  },
  description: {
    color: COLORS.neutral[300],
    marginBottom: 16,
  },
  reasonButton: {
    paddingVertical: 10,
    width: "100%",
  },
  reasonText: {
    color: COLORS.neutral[50],
  },
  image: {
    width: modalWidth - 48, // Adjust width to fit modal
    height: 100,
    borderRadius: 8,
    marginBottom: 16,
  },
});

export default AR;
