// Import the necessary libraries
import React, { useState, useEffect } from "react";
import {
  View,
  Alert,
  Button,
  Modal,
  Text,
  StyleSheet,
  // TouchableOpacity,
  // ScrollView,
} from "react-native";
import { ViroARSceneNavigator } from "@reactvision/react-viro";
import { useNavigation, useIsFocused } from "@react-navigation/native";
import FastImage from "react-native-fast-image";

// Import ARScene
import ARScene from "./ARScene";

// Import Contexts
import { useActiveCollection } from "../../context/ActiveCollectionContext";

// Import Utils
import {
  savePlacedObject,
  getArtistCollectionDetails,
  getPlacedObjectsByCollection,
  deletePlacedObject,
} from "../../utils/api";
import { getDeviceHeading } from "../../utils/headingUtils";
import { getPlacedObjectPayload } from "../../utils/payloadUtils";
import { getCurrentLocation } from "../../utils/locationUtils";
import {
  calculateARCoordinates,
  calculateGeoCoordinates,
} from "../../utils/geoUtils";

// Import Hooks
// import useLogs from "../../hooks/useLogs";
// import useLocation from "../../hooks/useLocation";

// Import Styles
import { COLORS } from "../../styles/theme";
import { globalStyles } from "../../styles/global";

// Import Icons
import {
  ArrowLeftIcon,
  SaveIcon,
  PlusIcon,
  DotsVerticalIcon,
  TrashIcon,
  MapIcon,
  QuestionMarkCircleIcon,
  XIcon,
} from "../../components/icons";

// Import Components
import {
  IconButton,
  ObjectSelectModal,
  CustomButton,
  TutorialOverlay,
  CustomSwitch,
} from "../../components/UI";

const videos = [
  {
    title: "Add an Object",
    source: require("../../../assets/videos/tutorials/AR/PlaceObject.mp4"),
  },
  {
    title: "Move the Object",
    source: require("../../../assets/videos/tutorials/AR/MoveObject.mp4"),
  },
  {
    title: "Scale object by pinching",
    source: require("../../../assets/videos/tutorials/AR/ScaleObject.mp4"),
  },
  {
    title: "Rotate object by making a circular gesture",
    source: require("../../../assets/videos/tutorials/AR/RotateObject.mp4"),
  },
  {
    title: "Save the Object",
    source: require("../../../assets/videos/tutorials/AR/SaveObject.mp4"),
  },
  {
    title: "Remove the Object",
    source: require("../../../assets/videos/tutorials/AR/DeleteObject.mp4"),
  },
  {
    title: "Disable snap to surface to place object in the air",
    source: require("../../../assets/videos/tutorials/AR/SnapToSurface.mp4"),
  },
  {
    title: "Turn of animations",
    source: require("../../../assets/videos/tutorials/AR/DisableAnimation.mp4"),
  },
];

const defaultImage = require("../../../assets/images/DefaultImage.jpg");

const AR = (route) => {
  const navigation = useNavigation(); // React Navigation hook for navigation
  const isFocused = useIsFocused(); // React Navigation hook to track focus
  const { activeCollectionId, clearActiveCollection } = useActiveCollection();
  const [collection, setCollection] = useState(null);
  const [objectList, setObjectList] = useState([]);

  const [selectedObject, setSelectedObject] = useState(null);

  const [snapToSurfaceEnabled, setSnapToSurfaceEnabled] = useState(true); // State for snapping
  const [animationsEnabled, setAnimationsEnabled] = useState(true); // State for animations
  const [spawnAtAROrigin, setSpawnAtAROrigin] = useState(false); // State for spawning at AR origin

  const [isObjectModalVisible, setIsObjectModalVisible] = useState(false);
  const [isSettingsVisible, setIsSettingsVisible] = useState(false); // State for modal visibility
  const [currentlySelectedObjectId, setCurrentlySelectedObjectId] =
    useState(null);
  const [objects, setObjects] = useState([]); // Manage objects in App
  const [isARActive, setIsARActive] = useState(true); // Track AR Scene status
  const [arOriginGeoCoordinates, setAROriginGeoCoordinates] = useState(null); // Track AR origin coordinates
  const [initialHeading, setInitialHeading] = useState(0); // Track initial heading

  const [showTutorialOverlay, setShowTutorialOverlay] = useState(false);

  const [dependenciesReady, setDependenciesReady] = useState(false);
  const [objectsPlaced, setObjectsPlaced] = useState(false); // Track if objects are placed
  const [planeFound, setPlaneFound] = useState(false);
  const [showScanOverlay, setShowScanOverlay] = useState(true);

  useEffect(() => {
    if (collection?.objects) {
      setObjectList(
        collection.objects.map((obj) => ({
          id: obj._id,
          title: obj.title,
          source: { uri: obj.file.filePath },
          thumbnail: obj.thumbnail.filePath
            ? { uri: obj.thumbnail.filePath }
            : defaultImage, // Use default image if thumbnail is not available
        }))
      );
    } else {
      setObjectList([]); // Reset to an empty array if no objects are available
    }
  }, [collection]);

  useEffect(() => {
    const fetchActiveCollection = async () => {
      if (route.route?.params?.collection) {
        setCollection(route.route.params.collection); // Set collection from route params
      } else if (activeCollectionId) {
        try {
          const result = await getArtistCollectionDetails(
            activeCollectionId._id
          ); // Fetch collection details
          if (result.status === "success") {
            setCollection(result.data.collection); // Set collection from API response
          } else {
            console.log("Error getting collection data:", result.message);
            console.log(
              "ActiveCollectionID on fetch: ",
              activeCollectionId._id
            );
          }
        } catch (error) {
          console.error("Error fetching collection data:", error.message);
        }
      }
    };

    fetchActiveCollection(); // Call the function to fetch collection
  }, [activeCollectionId, route.route?.params]);

  useEffect(() => {
    if (
      activeCollectionId &&
      collection &&
      arOriginGeoCoordinates &&
      initialHeading
    ) {
      console.log("All dependencies are ready.");
      setDependenciesReady(true);
    } else {
      console.log("Waiting for dependencies...");
      setDependenciesReady(false);
    }
  }, [activeCollectionId, collection, arOriginGeoCoordinates, initialHeading]);

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

    if (collection) {
      try {
        const response = await getPlacedObjectsByCollection(collection._id); // Fetch placed objects by collection ID

        console.log("Response from API: ", response); // Debug log

        if (response.status === "success") {
          const placedObjects = response.data.placedObjects;

          const arObjects = await Promise.all(
            placedObjects.map(async (obj) => {
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

          setObjectsPlaced(true);

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
    if (dependenciesReady) {
      console.log("Fetching and placing objects...");
      fetchAndPlaceObjects();
    }
  }, [dependenciesReady]);

  useEffect(() => {
    // Request location permission when the component mounts
    if (collection) {
      console.log("Editing collection with ID: ", collection._id);

      // Set the AR origin when the AR session starts
      getAROriginGeoCoordinates();
    }
  }, [collection]);

  useEffect(() => {
    // Get the device's heading when the AR session starts
    const fetchHeading = async () => {
      const heading = await getDeviceHeading(); // Get the device's heading
      setInitialHeading(heading); // Save the initial heading
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
    } catch (error) {
      console.log("Error getting AR origin position: ", error);

      Alert.alert(
        "Location Error",
        "Unable to get your current location. Please check your device's location settings and try again.",
        [
          {
            text: "OK",
            onPress: () => cleanupAndGoBack(),
          },
        ]
      );
    }
  };

  const handleBackPress = () => {
    if (currentlySelectedObjectId) {
      Alert.alert(
        "Save Changes",
        "You have unsaved changes. Do you want to save them before exiting?",
        [
          {
            text: "Discard",
            onPress: () => {
              cleanupAndGoBack();
            },
          },
          {
            text: "Save",
            onPress: () => {
              saveObject(currentlySelectedObjectId);
              cleanupAndGoBack();
            },
          },
        ]
      );
    } else {
      cleanupAndGoBack();
    }
  };

  const cleanupAndGoBack = async () => {
    clearActiveCollection();
    setObjects([]); // Clear objects when navigating away
    setCurrentlySelectedObjectId(null); // Reset selected object
    navigation.goBack(); // Go back to the previous screen
  };

  const showObjectSelectionModal = () => {
    setIsObjectModalVisible(true);
  };

  const selectObject = (obj) => {
    setSelectedObject(obj);
    setIsObjectModalVisible(false);
  };

  const handleObjectSelect = (obj) => {
    // If an object is selected already and it's different from the current one
    if (currentlySelectedObjectId && currentlySelectedObjectId !== obj.id) {
      Alert.alert(
        "Save Changes",
        "You have unsaved changes. Do you want to save them before selecting another object?",
        [
          {
            text: "Cancel",
            onPress: () => {},
            style: "cancel",
          },
          {
            text: "Save",
            onPress: () => {
              saveObject(currentlySelectedObjectId);
            },
          },
        ]
      );
    } else {
      // If no object is selected, just select the new object
      selectNewObject(obj);
    }
  };

  const selectNewObject = (obj) => {
    setCurrentlySelectedObjectId(obj.id);
  };

  const saveObject = async (objectId) => {
    if (!objectId) {
      console.log("No object selected to save.");
      // addLog("No object selected to save.");
      return;
    }

    const currentObject = objects.find((obj) => obj.id === objectId);
    if (!currentObject) return null;

    // Get the current heading
    const heading = await getDeviceHeading();

    const geoCoordinates = await calculateGeoCoordinates(
      currentObject.position,
      arOriginGeoCoordinates,
      initialHeading
    );

    // Get the payload for the object to be saved
    const payload = await getPlacedObjectPayload(
      objectId,
      currentObject,
      collection,
      geoCoordinates,
      heading,
      arOriginGeoCoordinates,
      initialHeading
    );

    if (!payload) {
      console.log("No payload to save.");
      return;
    }

    // Post the payload to the API
    try {
      const response = await savePlacedObject(payload.placedObject);

      if (response.status === "success") {
        console.log("Object updated successfully:", response.data);
        // addLog("Object saved successfully.");
      } else if (response.status === "created") {
        console.log("Object created successfully:", response.data);
        // addLog("Object created successfully.");

        // Update the placedObjectId with the new _id from the response
        const newPlacedObjectId = response.data.placedObject._id;
        setObjects((prevObjects) =>
          prevObjects.map((obj) =>
            obj.id === objectId ? { ...obj, id: newPlacedObjectId } : obj
          )
        );

        console.log(
          `Updated placedObjectId for object ${objectId} to ${newPlacedObjectId}`
        );
      } else {
        console.error("Failed to save object:", response.message);
        console.log(response);
      }
    } catch (error) {
      console.error("Error saving object:", error.message);
    }

    setCurrentlySelectedObjectId(null); // Reset the selected object after saving
  };

  const handleDeleteObject = async (objectId) => {
    // API call to delete the object
    try {
      const response = await deletePlacedObject(objectId);
      if (response.status === "success" || response.data.code === 404) {
        console.log("Object deleted successfully:", response.data);
      } else {
        console.error("Failed to delete object:", response.message);
      }
    } catch (error) {
      console.error("Error deleting object:", error.message);
    }
  };

  const deleteSelectedObject = () => {
    handleDeleteObject(currentlySelectedObjectId);

    setObjects((prevObjects) =>
      prevObjects.filter((obj) => obj.id !== currentlySelectedObjectId)
    );
    setCurrentlySelectedObjectId(null);
  };

  return (
    <View style={{ flex: 1 }}>
      {isARActive && (
        <ViroARSceneNavigator
          autofocus={true}
          initialScene={{ scene: ARScene }}
          viroAppProps={{
            selectedObject: selectedObject,
            onObjectSelected: setSelectedObject,
            snapToSurfaceEnabled: snapToSurfaceEnabled,
            animationsEnabled: animationsEnabled,
            spawnAtAROrigin: spawnAtAROrigin,
            objects: objects, // Pass objects to ARScene
            setObjects: setObjects, // Allow ARScene to update objects
            currentlySelectedObjectId: currentlySelectedObjectId,
            handleObjectSelect: handleObjectSelect,
            onPlaneFound: () => {
              console.log("Plane found");
              setPlaneFound(true);
            },
            onPlaneLost: () => {
              console.log("Plane lost");
              setPlaneFound(false);
              setShowScanOverlay(true); // Show scan overlay when plane is lost
              setShowTutorialOverlay(false); // Hide tutorial overlay when plane is lost
            },
          }}
          shadowsEnabled={true}
          pbrEnabled={true}
          hdrEnabled={true}
          bloomEnabled={true}
        />
      )}

      {(!planeFound || !dependenciesReady) && showScanOverlay === true && (
        <View style={styles.scanOverlay} pointerEvents="auto">
          <FastImage
            source={require("../../../assets/animations/ScanARGround.gif")}
            style={styles.scanImage}
            resizeMode="contain"
          />
          <Text style={[globalStyles.bodyLargeBold, styles.scanText]}>
            Move your phone slowly from side to side to scan the ground
          </Text>
          {dependenciesReady && (
            <CustomButton
              variant="text"
              size="medium"
              title="Continue without scanning"
              onPress={() => {
                // setShowScanOverlay(false);
                Alert.alert(
                  "Continue without scanning",
                  "Are you sure you want to continue without scanning the ground? Objects may not be placed or shown correctly.",
                  [
                    {
                      text: "Cancel",
                      style: "cancel",
                    },
                    {
                      text: "Continue",
                      onPress: () => {
                        setShowScanOverlay(false);
                      },
                    },
                  ]
                );
              }}
              style={styles.noScanButton}
            />
          )}
        </View>
      )}

      {/* Button to go back */}
      {!showTutorialOverlay && (
        <IconButton
          icon={ArrowLeftIcon}
          onPress={handleBackPress}
          buttonSize={48}
          iconSize={24}
          style={styles.customBackButton}
        />
      )}

      {/* Button to open settings modal */}
      <IconButton
        icon={DotsVerticalIcon}
        onPress={() => setIsSettingsVisible(true)}
        buttonSize={48}
        iconSize={24}
        style={styles.settingsButton}
      />

      {/* Button to open tutorial overlay */}
      {((planeFound && dependenciesReady) || !showScanOverlay) &&
        !showTutorialOverlay && (
          <IconButton
            icon={QuestionMarkCircleIcon}
            onPress={() => setShowTutorialOverlay(true)}
            buttonSize={48}
            iconSize={24}
            style={styles.tutorialButton}
          />
        )}

      {showTutorialOverlay && (
        <TutorialOverlay
          videos={videos}
          initialIndex={0}
          autoAdvance={true}
          allowSkip={true}
          onClose={() => setShowTutorialOverlay(false)}
        />
      )}

      {/* Button to add a new object */}
      {!currentlySelectedObjectId && (
        <View style={styles.selectModelButton}>
          <IconButton
            icon={PlusIcon}
            onPress={showObjectSelectionModal}
            buttonSize={40}
            iconSize={20}
          />
          <Text
            style={[globalStyles.labelSmallSemiBold, styles.iconButtonText]}
          >
            Add
          </Text>
        </View>
      )}

      {/* Modal for settings */}
      <Modal
        visible={isSettingsVisible}
        transparent={true}
        animationType="slide"
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={[styles.modalTitle, globalStyles.bodyLargeBold]}>
              Settings
            </Text>
            <IconButton
              icon={XIcon}
              onPress={() => setIsSettingsVisible(false)}
              buttonSize={40}
              iconSize={20}
              style={styles.closeButton}
            />
            <View style={styles.switchContainer}>
              <CustomSwitch
                value={snapToSurfaceEnabled}
                onValueChange={setSnapToSurfaceEnabled}
                label="Snap to Surface"
                helperText="Enable or disable snapping objects to detected surfaces"
                switchPosition="right"
              />
              <CustomSwitch
                value={animationsEnabled}
                onValueChange={setAnimationsEnabled}
                label="Animations"
                helperText="Enable or disable animations for objects"
                switchPosition="right"
              />
              <CustomSwitch
                value={spawnAtAROrigin}
                onValueChange={setSpawnAtAROrigin}
                label="Spawn at AR Origin"
                helperText="Enable or disable spawning objects at the AR origin"
                switchPosition="right"
              />
            </View>
          </View>
        </View>
      </Modal>

      <ObjectSelectModal
        visible={isObjectModalVisible}
        onClose={() => setIsObjectModalVisible(false)}
        objects={objectList}
        onSelect={selectObject}
        style={styles.objectSelectModal}
      />

      {currentlySelectedObjectId && (
        <View style={styles.saveButton}>
          <IconButton
            icon={SaveIcon}
            onPress={() => saveObject(currentlySelectedObjectId)}
            buttonSize={64}
            iconSize={32}
          />
        </View>
      )}

      {currentlySelectedObjectId && (
        <View style={styles.deleteButton}>
          <IconButton
            icon={TrashIcon}
            onPress={deleteSelectedObject}
            buttonSize={40}
            iconSize={20}
          />
          <Text
            style={[globalStyles.labelSmallSemiBold, styles.iconButtonText]}
          >
            Remove
          </Text>
        </View>
      )}

      {!currentlySelectedObjectId && (
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
          <Text
            style={[globalStyles.labelSmallSemiBold, styles.iconButtonText]}
          >
            Map
          </Text>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  customBackButton: {
    zIndex: 9999,
    position: "absolute",
    top: 16,
    left: 16,
  },
  iconButtonText: {
    color: COLORS.neutral[50],
  },
  settingsButton: {
    position: "absolute",
    top: 16,
    right: 16,
  },
  buttonText: {
    color: "#fff",
    fontWeight: "bold",
  },
  selectModelButton: {
    position: "absolute",
    bottom: 20,
    left: 20,
    right: 20,
    alignItems: "center",
  },
  switchContainer: {
    flexDirection: "column",
    gap: 20,
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },
  saveButton: {
    position: "absolute",
    bottom: 16,
    left: 20,
    right: 20,
    alignItems: "center",
  },
  deleteButton: {
    position: "absolute",
    bottom: 16,
    right: 20,
    alignItems: "center",
  },
  mapButton: {
    position: "absolute",
    bottom: 16,
    right: 20,
    alignItems: "center",
  },
  objectItem: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
    alignItems: "center",
  },

  modalContainer: {
    flex: 1,
    justifyContent: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContent: {
    margin: 20,
    padding: 16,
    backgroundColor: COLORS.primaryNeutral[700],
    borderRadius: 10,
    alignItems: "center",
  },
  modalTitle: {
    marginBottom: 20,
    color: COLORS.neutral[200],
  },
  logContainer: {
    maxHeight: 300,
    width: "100%",
    backgroundColor: "rgba(0, 0, 0, 0.1)",
    padding: 10,
    borderRadius: 8,
    marginBottom: 8,
  },
  objectSelectModal: {
    maxWidth: "100%",
    width: "100%",
    maxHeight: "75%",
    height: "75%",
    bottom: 0,
    position: "absolute",
  },
  scanOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0,0,0,0.7)",
    zIndex: 9998,
    justifyContent: "center",
    alignItems: "center",
  },
  scanImage: {
    width: 300,
    aspectRatio: 1,
  },
  scanText: {
    color: COLORS.neutral[50],
    textAlign: "center",
    paddingHorizontal: 20,
  },
  noScanButton: {
    position: "absolute",
    bottom: 60,
  },
  tutorialButton: {
    position: "absolute",
    top: 76,
    right: 16,
    zIndex: 9998,
  },
  closeButton: {
    position: "absolute",
    top: 12,
    right: 12,
  },
});

export default AR;
