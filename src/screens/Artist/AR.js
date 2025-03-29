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
import {
  ViroARScene,
  ViroARSceneNavigator,
  Viro3DObject,
  ViroAmbientLight,
  ViroARPlane,
} from "@reactvision/react-viro";
import { useNavigation, useIsFocused } from "@react-navigation/native";

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

// List of available 3D objects with their names and sources
// const objectList = [
//   {
//     id: "1",
//     name: "Cyber Robot",
//     source: require("../../../res/cyber_robot/cyber_robot.glb"),
//   },
//   {
//     id: "2",
//     name: "Predator",
//     source: require("../../../res/predator_alien/predator_alien.glb"),
//   },
//   {
//     id: "3",
//     name: "Velociraptor",
//     source: require("../../../res/velociraptor/velociraptor.glb"),
//   },
//   // {
//   //   id: "4",
//   //   name: "Zombie Head",
//   //   source: require("../../../res/zombie_head/zombie_head.glb"),
//   // },
//   // {
//   //   id: "5",
//   //   name: "Abstract Ball",
//   //   source: require("../../../res/abstract_ball/symmetrical_abstract_ball.glb"),
//   // },
//   // {
//   //   id: "6",
//   //   name: "Stonehenge",
//   //   source: require("../../../res/stonehenge/stonehenge_england_-_vr.glb"),
//   // },
//   // {
//   //   id: "7",
//   //   name: "Nautilus",
//   //   source: require("../../../res/nautilus/nautilus_concept.glb"),
//   // },
//   // {
//   //   id: "8",
//   //   name: "Black Castle",
//   //   source: require("../../../res/black_castle/low_poly_black_castle.glb"),
//   // },
//   // {
//   //   id: "9",
//   //   name: "Golden Eagle",
//   //   source: require("../../../res/golden_eagle/golden_eagle.glb"),
//   // },
//   // {
//   //   id: "10",
//   //   name: "Castle",
//   //   source: require("../../../res/castle/corridor_castle.glb"),
//   // },
//   // {
//   //   id: "11",
//   //   name: "Layered Structure",
//   //   source: require("../../../res/layered_structure/abstract_layered_architecture_structure_1.glb"),
//   // },
//   // {
//   //   id: "12",
//   //   name: "Iron Man",
//   //   source: require("../../../res/iron_man/abstract_ironman.glb"),
//   // },
//   // {
//   //   id: "13",
//   //   name: "Flying Bee",
//   //   source: require("../../../res/flying_bee/stylized_flying_bee_bird_rigged.glb"),
//   // },
//   // {
//   //   id: "14",
//   //   name: "Abstract 1",
//   //   source: require("../../../res/abstract_1/abstract_shape.glb"),
//   // },
//   // {
//   //   id: "15",
//   //   name: "Abstract 2",
//   //   source: require("../../../res/abstract_2/abstract_design.glb"),
//   // },
//   // {
//   //   id: "16",
//   //   name: "Diamond",
//   //   source: require("../../../res/diamond/diamond.glb"),
//   // },
//   {
//     id: "17",
//     name: "Manneken Pis",
//     source: require("../../../res/manneken_pis/manneken_pis.glb"),
//   },
//   // {
//   //   id: "18",
//   //   name: "Kings Hall",
//   //   source: require("../../../res/kings_hall/the_king_s_hall.glb"),
//   // },
// ];

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

  const { collection } = route.route.params; // Get collectionId from route params

  const objectList = collection?.objects.map((obj) => ({
    id: obj._id,
    name: obj.title,
    source: { uri: obj.file.filePath }, // Assuming the image is a URL
  }));

  useEffect(() => {
    if (collection) {
      console.log("Editing collection with ID: ", collection._id);
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

  const saveObject = (objectId) => {
    if (!objectId) {
      console.log("No object selected to save.");
      return;
    }
    console.log("Save object with ID: ", objectId);
    console.log(
      "Position: ",
      objects.find((obj) => obj.id === objectId).position
    );
    console.log("Scale: ", objects.find((obj) => obj.id === objectId).scale);
    console.log(
      "Rotation: ",
      objects.find((obj) => obj.id === objectId).rotation
    );
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
});

export default AR;
