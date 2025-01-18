// Import the necessary libraries
import React, { useState } from "react";
import { View, Alert, Button } from "react-native";
import {
  ViroARScene,
  ViroARSceneNavigator,
  Viro3DObject,
  ViroAmbientLight,
} from "@reactvision/react-viro";

// List of available 3D objects with their names and sources
const objectList = [
  {
    id: "1",
    name: "Coffee Mug",
    source: require("./res/coffee_mug/object_coffee_mug.vrx"),
  },
  {
    id: "2",
    name: "Flowers",
    source: require("./res/object_flowers/object_flowers.vrx"),
  },
  {
    id: "3",
    name: "Emoji Smile",
    source: require("./res/emoji_smile/emoji_smile.vrx"),
  },
];

// ARScene component to render the AR scene
const ARScene = ({ sceneNavigator }) => {
  // State to store the objects in the scene
  const [objects, setObjects] = useState([]);

  // Function to add a new object to the scene
  const addObjectToScene = (selectedObject) => {
    setObjects((prevObjects) => [
      ...prevObjects, // Keep the previous objects
      {
        ...selectedObject, // Add the selected object's data
        position: [0, 0, -0.5], // Set the initial position of the object in the AR space
        id: Date.now(), // Unique id for the object (using the current timestamp)
      },
    ]);
  };

  // Function to handle drag events and update the position of the dragged object
  const onDrag = (event, objectId) => {
    // Check if the event has a position (dragging has started)
    if (event.nativeEvent && event.nativeEvent.position) {
      setObjects((prevObjects) =>
        prevObjects.map(
          (obj) =>
            obj.id === objectId // Find the object being dragged
              ? { ...obj, position: event.nativeEvent.position } // Update the position of the dragged object
              : obj // Keep the other objects as they are
        )
      );
    }
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

  return (
    <ViroARScene>
      <ViroAmbientLight color="#ffffff" intensity={200} />
      {objects.map((obj) => (
        <Viro3DObject
          key={obj.id} // Unique key for the object
          source={obj.source} // Source of the 3D object
          position={obj.position} // Position of the object in the AR space
          scale={[0.4, 0.4, 0.4]} // Scale of the object
          type="VRX" // Type of the object
          onDrag={(event) => onDrag(event, obj.id)} // Handle drag for this specific object
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
