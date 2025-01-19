// Import the necessary libraries
import React, { useState } from "react";
import {
  View,
  Alert,
  Button,
  Modal,
  Text,
  Switch,
  StyleSheet,
  TouchableOpacity,
} from "react-native";
import {
  ViroARScene,
  ViroARSceneNavigator,
  Viro3DObject,
  ViroAmbientLight,
  ViroARPlane,
} from "@reactvision/react-viro";

// List of available 3D objects with their names and sources
const objectList = [
  {
    id: "1",
    name: "Cyber Robot",
    source: require("./res/cyber_robot/cyber_robot.glb"),
  },
  {
    id: "2",
    name: "Predator",
    source: require("./res/predator_alien/predator_alien.glb"),
  },
  {
    id: "3",
    name: "Zombie Head",
    source: require("./res/zombie_head/zombie_head.glb"),
  },
];

const ARScene = ({ sceneNavigator }) => {
  const [objects, setObjects] = useState([]);
  const [selectedPlane, setSelectedPlane] = useState(null); // Track the selected plane
  const { snapToSurfaceEnabled } = sceneNavigator.viroAppProps;

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

  // Function to handle drag events and update the position of the dragged object
  const onDrag = (dragToPos, objectId) => {
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

const App = () => {
  const [selectedObject, setSelectedObject] = useState(null);
  const [snapToSurfaceEnabled, setSnapToSurfaceEnabled] = useState(true); // State for snapping
  const [isSettingsVisible, setIsSettingsVisible] = useState(false); // State for modal visibility

  const showObjectSelectionAlert = () => {
    Alert.alert(
      "Choose a Model",
      "Select a 3D object to place in the AR scene:",
      objectList.map((obj) => ({
        text: obj.name,
        onPress: () => setSelectedObject(obj),
      })),
      { cancelable: true }
    );
  };

  return (
    <View style={{ flex: 1 }}>
      <ViroARSceneNavigator
        initialScene={{ scene: ARScene }}
        viroAppProps={{
          selectedObject: selectedObject,
          onObjectSelected: setSelectedObject,
          snapToSurfaceEnabled: snapToSurfaceEnabled,
        }}
      />

      {/* Button to open settings modal */}
      <View style={styles.settingsButton}>
        <TouchableOpacity onPress={() => setIsSettingsVisible(true)}>
          <Text style={styles.buttonText}>Settings</Text>
        </TouchableOpacity>
      </View>

      {/* Button to select a model */}
      <View style={styles.selectModelButton}>
        <Button title="Select Model" onPress={showObjectSelectionAlert} />
      </View>

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
    </View>
  );
};

const styles = StyleSheet.create({
  settingsButton: {
    position: "absolute",
    top: 20,
    right: 20,
    backgroundColor: "#007BFF",
    padding: 10,
    borderRadius: 5,
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
});

export default App;
