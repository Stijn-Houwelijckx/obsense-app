// Import the necessary libraries
import React, { useState } from "react";
import { View, Alert, Button } from "react-native";
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

// ARScene component to render the AR scene
const ARScene = ({ sceneNavigator }) => {
  // State to store the objects in the scene
  const [objects, setObjects] = useState([]);
  const [selectedPlane, setSelectedPlane] = useState(null); // Track the selected plane

  // Function to add a new object to the scene
  const addObjectToScene = (selectedObject) => {
    setObjects((prevObjects) => [
      ...prevObjects, // Keep the previous objects
      {
        ...selectedObject, // Add the selected object's data
        position: [0, 0, -0.5], // Set the initial position of the object in the AR space
        scale: [0.1, 0.1, 0.1], // Set the initial scale of the object
        rotation: [0, 0, 0], // Set the initial rotation of the object
        id: Date.now(), // Unique id for the object (using the current timestamp)
      },
    ]);
  };

  // Function to handle drag events and update the position of the dragged object
  const onDrag = (dragToPos, objectId) => {
    setObjects((prevObjects) =>
      prevObjects.map((obj) => {
        if (obj.id !== objectId) return obj;

        // Fix the Y position to the height of the detected plane
        const newPos = [
          dragToPos[0],
          selectedPlane ? selectedPlane.position[1] : obj.position[1], // Use the plane's Y height
          dragToPos[2],
        ];
        return { ...obj, position: newPos };
      })
    );
  };

  const onPinch = (pinchState, scaleFactor, objectId) => {
    setObjects((prevObjects) =>
      prevObjects.map((obj) => {
        if (obj.id !== objectId) return obj; // Skip objects that aren't being scaled

        if (pinchState === 1) {
          // Pinch start: Save the initial scale
          return { ...obj, baseScale: obj.scale };
        }

        if (pinchState === 2) {
          // Pinch move: Calculate the new scale dynamically
          const newScale = obj.baseScale.map((s) => s * scaleFactor); // Scale all axes equally
          return { ...obj, scale: newScale };
        }

        if (pinchState === 3) {
          // Pinch end: Finalize the scale
          // console.log("Final scale:", obj.scale);
          return obj; // No additional changes needed
        }

        return obj; // Default case
      })
    );
  };

  const onRotate = (rotateState, rotationFactor, objectId) => {
    setObjects((prevObjects) =>
      prevObjects.map((obj) => {
        if (obj.id !== objectId) return obj; // Skip objects that aren't being rotated

        if (rotateState === 1) {
          // Rotation start: Save the initial rotation
          return { ...obj, baseRotation: obj.rotation };
        }

        if (rotateState === 2) {
          // Rotation move: Calculate the new rotation
          const newRotation = [
            obj.baseRotation[0], // X-axis remains unchanged
            obj.baseRotation[1] + rotationFactor, // Adjust Y-axis by the rotation factor
            obj.baseRotation[2], // Z-axis remains unchanged
          ];
          return { ...obj, rotation: newRotation };
        }

        if (rotateState === 3) {
          // Rotation end: Finalize the rotation
          // console.log("Final rotation:", obj.rotation);
          return obj; // No additional changes needed
        }

        return obj; // Default case
      })
    );
  };

  // React hook to add the selected object to the scene when the selection changes
  React.useEffect(() => {
    // Get the selected object from the props
    const selectedObject = sceneNavigator.viroAppProps.selectedObject;

    // Check if an object has been selected
    if (selectedObject) {
      console.log("Adding object to scene:", selectedObject.name);

      // Add the selected object to the scene
      addObjectToScene(selectedObject);

      // Reset AFTER the object has been added to the state
      setTimeout(() => {
        // Reset the selected object to null
        sceneNavigator.viroAppProps.onObjectSelected(null);
      }, 100); // Allow time for rendering
    }
  }, [sceneNavigator.viroAppProps.selectedObject]); // Run when the selected object changes

  // Handle plane selection (automatically detect the plane)
  const onAnchorFound = (anchor) => {
    // console.log("onAnchorFound:", anchor);
    setSelectedPlane(anchor); // Store the anchor's data
  };

  const onAnchorUpdated = (anchor) => {
    // console.log("onAnchorUpdated:", anchor.position[1]);
    setSelectedPlane(anchor); // Update the plane's position
  };

  const onAnchorRemoved = () => {
    // console.log("onAnchorRemoved");
    setSelectedPlane(null); // Clear the selected plane when removed
  };

  return (
    <ViroARScene>
      <ViroAmbientLight color="#ffffff" intensity={200} />

      {/* Automatically detects and anchors objects to the plane */}
      <ViroARPlane
        onAnchorFound={onAnchorFound}
        onAnchorUpdated={onAnchorUpdated}
        onAnchorRemoved={onAnchorRemoved}
        minHeight={0.5}
        minWidth={0.5}
      />
      {objects.map((obj) => (
        <Viro3DObject
          key={obj.id} // Unique key for the object
          source={obj.source} // Source of the 3D object
          position={obj.position} // Position of the object in the AR space
          scale={obj.scale} // Scale of the object
          rotation={obj.rotation} // Rotation of the object
          type="GLB" // Type of the object
          onDrag={(dragToPos) => onDrag(dragToPos, obj.id)} // Pass the object ID
          onPinch={(pinchState, scaleFactor) =>
            onPinch(pinchState, scaleFactor, obj.id)
          } // Pass the object ID
          onRotate={(rotateState, rotationFactor) =>
            onRotate(rotateState, rotationFactor, obj.id)
          } // Pass the object ID
        />
      ))}
    </ViroARScene>
  );
};

// Main App component
const App = () => {
  const [selectedObject, setSelectedObject] = useState(null); // State to store the selected object

  // Function to show an alert with the list of available 3D objects
  const showObjectSelectionAlert = () => {
    Alert.alert(
      "Choose a Model",
      "Select a 3D object to place in the AR scene:",
      objectList.map((obj) => ({
        text: obj.name, // Display the name of the object
        onPress: () => {
          console.log("Selected:", obj.name);
          setSelectedObject(obj); // Set the selected object
        },
      })),
      { cancelable: true } // Allow the user to cancel the alert
    );
  };

  return (
    <View style={{ flex: 1 }}>
      <ViroARSceneNavigator
        initialScene={{ scene: ARScene }}
        viroAppProps={{
          selectedObject: selectedObject,
          onObjectSelected: setSelectedObject,
        }}
      />
      <View
        style={{
          position: "absolute",
          bottom: 20,
          left: 20,
          right: 20,
          alignItems: "center",
        }}
      >
        <Button title="Select Model" onPress={showObjectSelectionAlert} />
      </View>
    </View>
  );
};

export default App;
