import React, { useState } from "react";
import {
  ViroARScene,
  Viro3DObject,
  ViroAmbientLight,
  ViroARPlane,
  ViroLightingEnvironment,
} from "@reactvision/react-viro";

const ARScene = ({ sceneNavigator }) => {
  // const [objects, setObjects] = useState([]);
  const [selectedPlane, setSelectedPlane] = useState(null); // Track the selected plane
  const { objects, setObjects, handleObjectSelect } =
    sceneNavigator.viroAppProps;

  // Function to add a new object to the scene
  const addObjectToScene = (selectedObject) => {
    setObjects((prevObjects) => [
      ...prevObjects,
      {
        ...selectedObject,
        objectId: selectedObject.id,
        position: [0, 0, -0.5],
        scale: [0.1, 0.1, 0.1],
        rotation: [0, 0, 0],
        id: Date.now(),
      },
    ]);
  };

  const handleObjectClick = (clickState, objectId) => {
    if (clickState === 3) {
      handleObjectSelect({ id: objectId });
    }
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

      <ViroLightingEnvironment
        source={require("../../../assets/hdr/sunset_2k.hdr")}
        intensity={200}
        onLoadEnd={() => console.log("Lighting environment loaded")}
        onError={(error) => console.error("Lighting environment error:", error)}
      />

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
          onClickState={(clickState) => handleObjectClick(clickState, obj.id)}
        />
      ))}
    </ViroARScene>
  );
};

export default ARScene;
