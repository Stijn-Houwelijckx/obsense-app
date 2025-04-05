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
  PermissionsAndroid,
  Platform,
  Linking,
} from "react-native";
import {
  ViroARScene,
  ViroARSceneNavigator,
  Viro3DObject,
  ViroAmbientLight,
  ViroARPlane,
} from "@reactvision/react-viro";
import { useNavigation, useIsFocused } from "@react-navigation/native";
import Geolocation from "@react-native-community/geolocation";
import CompassHeading from "react-native-compass-heading";
import merc from "mercator-projection";
import Clipboard from "@react-native-clipboard/clipboard";

// Import Styles
// Import Styles
import { COLORS } from "../../styles/theme";
import { globalStyles } from "../../styles/global";

// Import Icons
import ArrowLeftIcon from "../../components/icons/ArrowLeftIcon";
import SaveIcon from "../../components/icons/SaveIcon";
import PlusIcon from "../../components/icons/PlusIcon";
import DotsVerticalIcon from "../../components/icons/DotsVerticalIcon";
import TrashIcon from "../../components/icons/TrashIcon";

// Import Components
import IconButton from "../../components/UI/IconButton";

// const requestLocationPermission = async () => {
//   if (Platform.OS === "android") {
//     const granted = await PermissionsAndroid.request(
//       PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
//       {
//         title: "Location Permission",
//         message:
//           "This app needs access to your location to show it on the map.",
//         buttonNeutral: "Ask Me Later",
//         buttonNegative: "Cancel",
//         buttonPositive: "OK",
//       }
//     );
//     if (granted === PermissionsAndroid.RESULTS.GRANTED) {
//       console.log("Location permission granted");
//       return true;
//     } else {
//       console.log("Location permission denied");
//       Alert.alert(
//         "Permission Denied",
//         "Location permission is required to use this feature. Please enable it in your device settings.",
//         [
//           {
//             text: "Cancel",
//             style: "cancel",
//           },
//           {
//             text: "Open Settings",
//             onPress: () => {
//               // Open device location settings
//               if (Platform.OS === "android") {
//                 Linking.openSettings();
//               }
//             },
//           },
//         ]
//       );
//       return false;
//     }
//   } else {
//     // For iOS, we assume permission is granted
//     return true;
//   }
// };

const ARScene = ({ sceneNavigator }) => {
  // const [objects, setObjects] = useState([]);
  const [selectedPlane, setSelectedPlane] = useState(null); // Track the selected plane
  const {
    snapToSurfaceEnabled,
    objects,
    setObjects,
    currentlySelectedObjectId,
    handleObjectSelect,
  } = sceneNavigator.viroAppProps;

  // Function to add a new object to the scene
  const addObjectToScene = (selectedObject) => {
    setObjects((prevObjects) => [
      ...prevObjects,
      {
        ...selectedObject,
        position: [0, 0, -0.5],
        scale: [0.1, 0.1, 0.1],
        rotation: [0, 0, 0],
        id: Date.now(),
      },
    ]);
  };

  const handleObjectClick = (clickState, objectId) => {
    if (clickState === 1) {
      handleObjectSelect({ id: objectId });
    }
  };

  // Helper function to determine opacity based on selection
  const getObjectOpacity = (objectId) => {
    return currentlySelectedObjectId && currentlySelectedObjectId !== objectId
      ? 0.5 // Reduced opacity for unselected objects
      : 1.0; // Full opacity for selected or all if none is selected
  };

  // Function to handle drag events and update the position of the dragged object
  const onDrag = (dragToPos, objectId) => {
    if (currentlySelectedObjectId !== objectId) return;
    setObjects((prevObjects) =>
      prevObjects.map((obj) => {
        if (obj.id !== objectId) return obj;

        const newPos = [
          dragToPos[0],
          snapToSurfaceEnabled && selectedPlane
            ? selectedPlane.position[1]
            : dragToPos[1], // Use the plane's Y height only if snap is enabled
          dragToPos[2],
        ];
        return { ...obj, position: newPos };
      })
    );
  };

  const onPinch = (pinchState, scaleFactor, objectId) => {
    if (currentlySelectedObjectId !== objectId) return;
    setObjects((prevObjects) =>
      prevObjects.map((obj) => {
        if (obj.id !== objectId) return obj;

        if (pinchState === 1) {
          return { ...obj, baseScale: obj.scale };
        }

        if (pinchState === 2) {
          const newScale = obj.baseScale.map((s) => s * scaleFactor);
          return { ...obj, scale: newScale };
        }

        return obj;
      })
    );
  };

  const onRotate = (rotateState, rotationFactor, objectId) => {
    if (currentlySelectedObjectId !== objectId) return;
    setObjects((prevObjects) =>
      prevObjects.map((obj) => {
        if (obj.id !== objectId) return obj;

        if (rotateState === 1) {
          return { ...obj, baseRotation: obj.rotation };
        }

        if (rotateState === 2) {
          const newRotation = [
            obj.baseRotation[0],
            obj.baseRotation[1] + rotationFactor,
            obj.baseRotation[2],
          ];
          return { ...obj, rotation: newRotation };
        }

        return obj;
      })
    );
  };

  React.useEffect(() => {
    const selectedObject = sceneNavigator.viroAppProps.selectedObject;

    if (selectedObject) {
      addObjectToScene(selectedObject);

      setTimeout(() => {
        sceneNavigator.viroAppProps.onObjectSelected(null);
      }, 100);
    }
  }, [sceneNavigator.viroAppProps.selectedObject]);

  const onAnchorFound = (anchor) => {
    setSelectedPlane(anchor);
  };

  const onAnchorUpdated = (anchor) => {
    setSelectedPlane(anchor);
  };

  const onAnchorRemoved = () => {
    setSelectedPlane(null);
  };

  return (
    <ViroARScene>
      <ViroAmbientLight color="#ffffff" intensity={200} />

      <ViroARPlane
        onAnchorFound={onAnchorFound}
        onAnchorUpdated={onAnchorUpdated}
        onAnchorRemoved={onAnchorRemoved}
        minHeight={0.5}
        minWidth={0.5}
      />

      {objects.map((obj) => (
        <Viro3DObject
          key={obj.id}
          source={obj.source}
          position={obj.position}
          scale={obj.scale}
          rotation={obj.rotation}
          type="GLB"
          // dragType="FixedToWorld"
          onClickState={(clickState) => handleObjectClick(clickState, obj.id)}
          opacity={getObjectOpacity(obj.id)} // Apply opacity dynamically
          onDrag={(dragToPos) => onDrag(dragToPos, obj.id)}
          onPinch={(pinchState, scaleFactor) =>
            onPinch(pinchState, scaleFactor, obj.id)
          }
          onRotate={(rotateState, rotationFactor) =>
            onRotate(rotateState, rotationFactor, obj.id)
          }
        />
      ))}
    </ViroARScene>
  );
};

const AR = (route) => {
  const navigation = useNavigation(); // React Navigation hook for navigation
  const isFocused = useIsFocused(); // React Navigation hook to track focus
  const [selectedObject, setSelectedObject] = useState(null);
  const [snapToSurfaceEnabled, setSnapToSurfaceEnabled] = useState(true); // State for snapping
  const [isObjectModalVisible, setIsObjectModalVisible] = useState(false);
  const [isSettingsVisible, setIsSettingsVisible] = useState(false); // State for modal visibility
  const [currentlySelectedObjectId, setCurrentlySelectedObjectId] =
    useState(null);
  const [objects, setObjects] = useState([]); // Manage objects in App
  const [isARActive, setIsARActive] = useState(true); // Track AR Scene status
  const [arOriginGeoCoordinates, setAROriginGeoCoordinates] = useState(null); // Track AR origin coordinates
  // const [deviceHeading, setDeviceHeading] = useState(0); // Track device heading

  const [logs, setLogs] = useState([]); // State to store logs
  const [location, setLocation] = useState({ latitude: 0, longitude: 0 });
  const [isLogsVisible, setIsLogsVisible] = useState(false); // State to toggle logs modal

  const { collection } = route.route.params; // Get collectionId from route params

  const addLog = (message) => {
    setLogs((prevLogs) => [...prevLogs, message]); // Add new log to the state
  };

  const copyLogsToClipboard = () => {
    const logsText = logs.join("\n"); // Combine logs into a single string
    Clipboard.setString(logsText); // Copy logs to clipboard
    Alert.alert("Logs Copied", "The logs have been copied to your clipboard.");
  };

  const objectList = collection?.objects.map((obj) => ({
    id: obj._id,
    name: obj.title,
    source: { uri: obj.file.filePath }, // Assuming the image is a URL
  }));

  // Watch location updates
  useEffect(() => {
    const watchId = Geolocation.watchPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        setLocation({ latitude, longitude });
      },
      (error) => {
        console.error("Error watching location: ", error);
        addLog(`Error watching location: ${error.message}`);
      },
      { enableHighAccuracy: true, distanceFilter: 1 }
    );

    // Cleanup the watcher on unmount
    return () => {
      Geolocation.clearWatch(watchId);
    };
  }, []);

  useEffect(() => {
    // Request location permission when the component mounts
    if (collection) {
      console.log("Editing collection with ID: ", collection._id);
      // Set the AR origin when the AR session starts
      getAROriginGeoCoordinates();
    }
  }, [collection]);

  // React Navigation Focus Effect
  useEffect(() => {
    if (isFocused) {
      setIsARActive(true); // Activate AR scene when screen is focused
    } else {
      setIsARActive(false); // Deactivate AR scene when screen is blurred
    }
  }, [isFocused]);

  const getAROriginGeoCoordinates = () => {
    return new Promise((resolve, reject) => {
      Geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setAROriginGeoCoordinates({
            latitude: latitude,
            longitude: longitude,
          });

          addLog(
            `AR Origin Coordinates: \n lat: ${latitude.toFixed(
              6
            )} \n lon: ${longitude.toFixed(6)}`
          );
        },
        (error) => {
          console.error("Error getting AR origin position: ", error);
          reject(error);
        },
        { enableHighAccuracy: true, timeout: 20000, maximumAge: 1000 }
      );
    });
  };

  // Reusable function: Calculate geographic coordinates from AR space position.
  // It gets the device's current geo position, projects it, adds the AR offset (using the X and Z values)
  // and then converts back to lat/lon.
  const calculateGeoCoordinates = (arPosition) => {
    return new Promise((resolve, reject) => {
      // Geolocation.getCurrentPosition(
      //   (position) => {
      //     const { latitude, longitude } = position.coords;

      //     const devicePoint = merc.fromLatLngToPoint({
      //       lat: latitude,
      //       lng: longitude,
      //     });

      //     console.log("Device Point: ", devicePoint);
      //     console.log("AR Position: ", arPosition);

      //     // Calculate meters per pixel at the current latitude
      //     const metersPerPixel =
      //       (40075016.686 / 256) * Math.cos((latitude * Math.PI) / 180);

      //     // Scale AR space offsets (in meters) to Mercator units
      //     const scaledOffsetX = arPosition[0] / metersPerPixel; // X-axis in AR
      //     const scaledOffsetY = arPosition[2] / metersPerPixel; // Z-axis in AR corresponds to Y in Mercator

      //     // Add scaled offsets to the device's Mercator coordinates
      //     const objectPoint = {
      //       x: devicePoint.x + scaledOffsetX,
      //       y: devicePoint.y + scaledOffsetY,
      //     };

      //     const objectGeo = merc.fromPointToLatLng(objectPoint);
      //     resolve(objectGeo);
      //   },
      //   (error) => {
      //     console.error("Error getting current position: ", error);
      //     reject(error);
      //   },
      //   { enableHighAccuracy: true, timeout: 20000, maximumAge: 1000 }
      // );

      if (!arOriginGeoCoordinates) {
        reject(new Error("AR origin coordinates are not set."));
        return;
      }

      // Convert AR origin's geographic coordinates to Mercator
      const arOriginPoint = merc.fromLatLngToPoint({
        lat: arOriginGeoCoordinates.latitude,
        lng: arOriginGeoCoordinates.longitude,
      });

      console.log("AR Origin Point: ", arOriginPoint);
      console.log("AR Position: ", arPosition);

      // Calculate meters per pixel at the AR origin's latitude
      const metersPerPixel =
        (40075016.686 / 256) *
        Math.cos((arOriginGeoCoordinates.latitude * Math.PI) / 180);

      // Scale AR space offsets (in meters) to Mercator units
      const scaledOffsetX = arPosition[0] / metersPerPixel; // X-axis in AR
      const scaledOffsetY = arPosition[2] / metersPerPixel; // Z-axis in AR corresponds to Y in Mercator

      // Add scaled offsets to the AR origin's Mercator coordinates
      const objectPoint = {
        x: arOriginPoint.x + scaledOffsetX,
        y: arOriginPoint.y + scaledOffsetY,
      };

      // Convert back to geographic coordinates (lat/lon)
      const objectGeo = merc.fromPointToLatLng(objectPoint);
      resolve(objectGeo);
    });
  };

  // Reusable function: Assemble the payload to save a placed object.
  const getPlacedObjectPayload = async (
    objectId,
    objects,
    collection,
    deviceHeading
  ) => {
    const currentObject = objects.find((obj) => obj.id === objectId);
    if (!currentObject) return null;
    // Calculate geographic coordinates from AR object's position.
    const geoCoordinates = await calculateGeoCoordinates(
      currentObject.position
    );
    return {
      placedObject: {
        placedObjectId: objectId, // for updates; leave null or omit for new objects
        collectionId: collection._id,
        objectId: currentObject.objectId || objectId, // adjust if your object model differs
        position: {
          lat: geoCoordinates.lat,
          lon: geoCoordinates.lng,
          x: currentObject.position[0],
          y: currentObject.position[1] || 1, // default height if not set
          z: currentObject.position[2],
        },
        scale: {
          x: currentObject.scale[0],
          y: currentObject.scale[1],
          z: currentObject.scale[2],
        },
        rotation: {
          x: currentObject.rotation[0],
          y: currentObject.rotation[1],
          z: currentObject.rotation[2],
        },
        deviceHeading, // use the latest heading from the device
      },
    };
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

  const cleanupAndGoBack = () => {
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
      addLog("No object selected to save.");
      return;
    }
    addLog(`===================`);
    addLog(`Save object with ID: \n ${objectId}`);
    console.log("Save object with ID: ", objectId);
    console.log(
      "Position: ",
      objects.find((obj) => obj.id === objectId).position
    );
    const currentObject = objects.find((obj) => obj.id === objectId);
    addLog(
      `Position: \n x: ${JSON.stringify(
        currentObject.position[0].toFixed(6)
      )}\n y: ${JSON.stringify(
        currentObject.position[1].toFixed(6)
      )}\n z: ${JSON.stringify(currentObject.position[2].toFixed(6))}`
    );
    console.log("Scale: ", objects.find((obj) => obj.id === objectId).scale);
    addLog(
      `Scale: \n x: ${JSON.stringify(
        currentObject.scale[0]
      )} \n y: ${JSON.stringify(currentObject.scale[1])} \n z: ${JSON.stringify(
        currentObject.scale[2]
      )}`
    );
    console.log(
      "Rotation: ",
      objects.find((obj) => obj.id === objectId).rotation
    );
    addLog(
      `Rotation: \n x: ${JSON.stringify(
        currentObject.rotation[0]
      )} \n y: ${JSON.stringify(
        currentObject.rotation[1]
      )} \n z: ${JSON.stringify(currentObject.rotation[2])}`
    );

    // Get the current heading
    let heading = 0;
    await new Promise((resolve) => {
      CompassHeading.start(1, (headingData) => {
        heading = headingData.heading;
        addLog(`Device heading: \n ${heading} degrees`);
        console.log("Device heading: ", heading);
        CompassHeading.stop(); // Stop listening after getting the heading
        resolve();
      });
    });

    // Get the payload for the object to be saved
    const payload = await getPlacedObjectPayload(
      objectId,
      objects,
      collection,
      heading
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
    console.log("Payload to save: ", payload);

    setCurrentlySelectedObjectId(null); // Reset the selected object after saving
  };

  const deleteSelectedObject = () => {
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
              <Button title="Clear" onPress={() => setLogs([])} />
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
  modalTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 20,
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
