// Import the necessary libraries
import React, { useState, useEffect } from "react";
import {
  View,
  Alert,
  Button,
  Modal,
  Text,
  Switch,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import { ViroARSceneNavigator } from "@reactvision/react-viro";
import { useNavigation, useIsFocused } from "@react-navigation/native";

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
import useLogs from "../../hooks/useLogs";
import useLocation from "../../hooks/useLocation";

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
} from "../../components/icons";

// Import Components
import { IconButton } from "../../components/UI";

const AR = (route) => {
  const navigation = useNavigation(); // React Navigation hook for navigation
  const isFocused = useIsFocused(); // React Navigation hook to track focus
  const { activeCollectionId, clearActiveCollection } = useActiveCollection();
  const [collection, setCollection] = useState(null);
  const [objectList, setObjectList] = useState([]);

  const [selectedObject, setSelectedObject] = useState(null);
  const [snapToSurfaceEnabled, setSnapToSurfaceEnabled] = useState(true); // State for snapping
  const [isObjectModalVisible, setIsObjectModalVisible] = useState(false);
  const [isSettingsVisible, setIsSettingsVisible] = useState(false); // State for modal visibility
  const [currentlySelectedObjectId, setCurrentlySelectedObjectId] =
    useState(null);
  const [objects, setObjects] = useState([]); // Manage objects in App
  const [isARActive, setIsARActive] = useState(true); // Track AR Scene status
  const [arOriginGeoCoordinates, setAROriginGeoCoordinates] = useState(null); // Track AR origin coordinates
  const [initialHeading, setInitialHeading] = useState(0); // Track initial heading
  // const [deviceHeading, setDeviceHeading] = useState(0); // Track device heading

  // const [location, setLocation] = useState({ latitude: 0, longitude: 0 });
  const { location } = useLocation(); // Get location from custom hook
  const { logs, addLog, clearLogs, copyLogsToClipboard } = useLogs();
  const [isLogsVisible, setIsLogsVisible] = useState(false); // State to toggle logs modal

  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    if (collection?.objects) {
      setObjectList(
        collection.objects.map((obj) => ({
          id: obj._id,
          name: obj.title,
          source: { uri: obj.file.filePath }, // Assuming the image is a URL
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
      setIsReady(true);
    } else {
      console.log("Waiting for dependencies...");
      setIsReady(false);
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
    if (isReady) {
      console.log("Fetching and placing objects...");
      fetchAndPlaceObjects();
    }
  }, [isReady]);

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
      addLog(`Initial heading: \n ${heading} degrees`);
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
      addLog(
        `AR Origin Coordinates: \n lat: ${currentLocation.latitude.toFixed(
          6
        )} \n lon: ${currentLocation.longitude.toFixed(6)}`
      );

      setAROriginGeoCoordinates({
        latitude: currentLocation.latitude,
        longitude: currentLocation.longitude,
      });
    } catch (error) {
      console.error("Error getting AR origin position: ", error);
    }
  };

  const handleBackPress = () => {
    if (currentlySelectedObjectId) {
      Alert.alert(
        "Save Changes",
        "You have unsaved changes. Do you want to save them before exiting?",
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
    // await AsyncStorage.removeItem("activeCollectionId"); // Clear active collection ID
    setObjects([]); // Clear objects when navigating away
    setCurrentlySelectedObjectId(null); // Reset selected object
    clearLogs(); // Clear logs when navigating away
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
      addLog("No object selected to save.");
      return;
    }
    addLog(`===================`);
    addLog(`Save object with ID: \n ${objectId}`);
    // console.log("Save object with ID: ", objectId);
    // console.log(
    //   "Position: ",
    //   objects.find((obj) => obj.id === objectId).position
    // );
    const currentObject = objects.find((obj) => obj.id === objectId);
    if (!currentObject) return null;

    addLog(
      `Position: \n x: ${JSON.stringify(
        currentObject.position[0].toFixed(6)
      )}\n y: ${JSON.stringify(
        currentObject.position[1].toFixed(6)
      )}\n z: ${JSON.stringify(currentObject.position[2].toFixed(6))}`
    );
    // console.log("Scale: ", objects.find((obj) => obj.id === objectId).scale);
    addLog(
      `Scale: \n x: ${JSON.stringify(
        currentObject.scale[0]
      )} \n y: ${JSON.stringify(currentObject.scale[1])} \n z: ${JSON.stringify(
        currentObject.scale[2]
      )}`
    );
    // console.log(
    //   "Rotation: ",
    //   objects.find((obj) => obj.id === objectId).rotation
    // );
    addLog(
      `Rotation: \n x: ${JSON.stringify(
        currentObject.rotation[0]
      )} \n y: ${JSON.stringify(
        currentObject.rotation[1]
      )} \n z: ${JSON.stringify(currentObject.rotation[2])}`
    );

    // Get the current heading
    const heading = await getDeviceHeading();
    addLog(`Device heading: \n ${heading} degrees`);

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
      addLog("No payload to save.");
      console.log("No payload to save.");
      return;
    }

    addLog(
      `Payload to save: \n { \n collectionId: \n ${JSON.stringify(
        payload.placedObject.collectionId
      )} \n deviceHeading: \n ${JSON.stringify(
        payload.placedObject.deviceHeading
      )} degrees \n\n objectId: \n ${JSON.stringify(
        payload.placedObject.objectId
      )} \n\n placedObjectId: \n ${JSON.stringify(
        payload.placedObject.placedObjectId
      )} \n\n position: \n { \n lat: ${JSON.stringify(
        payload.placedObject.position.lat.toFixed(6)
      )} \n lon: ${JSON.stringify(
        payload.placedObject.position.lon.toFixed(6)
      )} \n\n x: ${JSON.stringify(
        payload.placedObject.position.x.toFixed(6)
      )} \n y: ${JSON.stringify(
        payload.placedObject.position.y.toFixed(6)
      )} \n z: ${JSON.stringify(
        payload.placedObject.position.z.toFixed(6)
      )} \n } \n\n rotation: \n { \n x: ${JSON.stringify(
        payload.placedObject.rotation.x
      )} \n y: ${JSON.stringify(
        payload.placedObject.rotation.y
      )} \n z: ${JSON.stringify(
        payload.placedObject.rotation.z
      )} \n } \n\n scale: \n { \n x: ${JSON.stringify(
        payload.placedObject.scale.x
      )} \n y: ${JSON.stringify(
        payload.placedObject.scale.y
      )} \n z: ${JSON.stringify(payload.placedObject.scale.z)} \n } \n } \n`
    );

    // Post the payload to the API
    try {
      const response = await savePlacedObject(payload.placedObject);

      if (response.status === "success") {
        console.log("Object updated successfully:", response.data);
        addLog("Object saved successfully.");
      } else if (response.status === "created") {
        console.log("Object created successfully:", response.data);
        addLog("Object created successfully.");

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
        addLog(`Failed to save object: ${response.message}`);
      }
    } catch (error) {
      console.error("Error saving object:", error.message);
      addLog(`Error saving object: ${error.message}`);
    }

    setCurrentlySelectedObjectId(null); // Reset the selected object after saving
  };

  const handleDeleteObject = async (objectId) => {
    // API call to delete the object
    try {
      const response = await deletePlacedObject(objectId);
      if (response.status === "success" || response.data.code === 404) {
        console.log("Object deleted successfully:", response.data);
        addLog("Object deleted successfully.");
      } else {
        console.error("Failed to delete object:", response.message);
        addLog(`Failed to delete object: ${response.message}`);
      }
    } catch (error) {
      console.error("Error deleting object:", error.message);
      addLog(`Error deleting object: ${error.message}`);
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
            objects: objects, // Pass objects to ARScene
            setObjects: setObjects, // Allow ARScene to update objects
            currentlySelectedObjectId: currentlySelectedObjectId,
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

      {/* Button to Show Logs */}
      <TouchableOpacity
        style={styles.showLogsButton}
        onPress={() => setIsLogsVisible(true)}
      >
        <Text style={styles.showLogsButtonText}>Show Logs</Text>
      </TouchableOpacity>

      {/* Logs Modal */}
      <Modal
        visible={isLogsVisible}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setIsLogsVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Logs</Text>
            <ScrollView style={styles.logContainer}>
              {logs.length === 0 && (
                <Text style={styles.logText}>No logs available.</Text>
              )}
              {logs.length > 0 &&
                logs.map((log, index) => (
                  <Text key={index} style={styles.logText}>
                    {log}
                  </Text>
                ))}
            </ScrollView>
            <View style={{ flexDirection: "row", gap: 10 }}>
              <Button title="Copy" onPress={copyLogsToClipboard} />
              <Button title="Close" onPress={() => setIsLogsVisible(false)} />
              <Button title="Clear" onPress={clearLogs} />
            </View>
          </View>
        </View>
      </Modal>

      {/* Button to go back */}
      <IconButton
        icon={ArrowLeftIcon}
        onPress={handleBackPress}
        buttonSize={48}
        iconSize={24}
        style={styles.customBackButton}
      />

      {/* Button to open settings modal */}
      <IconButton
        icon={DotsVerticalIcon}
        onPress={() => setIsSettingsVisible(true)}
        buttonSize={48}
        iconSize={24}
        style={styles.settingsButton}
      />

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
            <Text style={styles.modalTitle}>Settings</Text>
            <View style={styles.switchContainer}>
              <Text>Snap to Surface:</Text>
              <Switch
                value={snapToSurfaceEnabled}
                onValueChange={setSnapToSurfaceEnabled}
              />
            </View>
            <Button title="Close" onPress={() => setIsSettingsVisible(false)} />
          </View>
        </View>
      </Modal>

      <Modal
        visible={isObjectModalVisible}
        transparent={true}
        animationType="slide"
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Choose a Model</Text>
            <ScrollView style={{ maxHeight: 300 }}>
              {objectList.map((obj) => (
                <TouchableOpacity
                  key={obj.id}
                  style={styles.objectItem}
                  onPress={() => selectObject(obj)}
                >
                  <Text>{obj.name}</Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
            <Button
              title="Close"
              onPress={() => setIsObjectModalVisible(false)}
            />
          </View>
        </View>
      </Modal>

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
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContent: {
    margin: 20,
    padding: 20,
    backgroundColor: "white",
    borderRadius: 10,
    alignItems: "center",
  },
  switchContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    width: "80%",
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
  showLogsButton: {
    position: "absolute",
    bottom: 80,
    left: 10,
    backgroundColor: "blue",
    padding: 10,
    borderRadius: 8,
  },
  showLogsButtonText: {
    color: "white",
    fontSize: 14,
    textAlign: "center",
  },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContent: {
    margin: 20,
    padding: 20,
    backgroundColor: "white",
    borderRadius: 10,
    alignItems: "center",
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 20,
  },
  logContainer: {
    maxHeight: 300,
    width: "100%",
    backgroundColor: "rgba(0, 0, 0, 0.1)",
    padding: 10,
    borderRadius: 8,
    marginBottom: 8,
  },
  logText: {
    color: "black",
    fontSize: 12,
    marginBottom: 5,
  },
});

export default AR;
