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
  const {
    snapToSurfaceEnabled,
    animationsEnabled,
    objects,
    setObjects,
    currentlySelectedObjectId,
    handleObjectSelect,
    onPlaneFound,
    onPlaneLost,
  } = sceneNavigator.viroAppProps;

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
    if (onPlaneFound) {
      onPlaneFound();
    }

    // Set y psoition of the objects to the plane's position
    setObjects((prevObjects) =>
      prevObjects.map((obj) => ({
        ...obj,
        position: [
          obj.position[0],
          anchor.position[1], // Set y position to the plane's y position
          obj.position[2],
        ],
      }))
    );
  };

  const onAnchorUpdated = (anchor) => {
    setSelectedPlane(anchor);
  };

  const onAnchorRemoved = () => {
    setSelectedPlane(null);
    if (onPlaneLost) {
      onPlaneLost();
    }
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
          animation={{
            run: animationsEnabled ? true : false,
            loop: true,
          }}
        />
      ))}
    </ViroARScene>
  );
};

export default ARScene;
