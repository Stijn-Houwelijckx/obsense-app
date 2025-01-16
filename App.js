import {
  ViroARScene,
  ViroARSceneNavigator,
  Viro3DObject,
  ViroAmbientLight,
  ViroTrackingStateConstants,
} from "@reactvision/react-viro";
import React, { useState } from "react";
import { StyleSheet } from "react-native";

const HelloWorldSceneAR = () => {
  const [initialized, setInitialized] = useState(false);
  const [position, setPosition] = useState([0, 0, -0.5]); // Initial position of the 3D object

  function onInitialized(state, reason) {
    console.log("AR Tracking State:", state, "Reason:", reason);
    if (state === ViroTrackingStateConstants.TRACKING_NORMAL) {
      setInitialized(true); // Set initialized to true when tracking is normal
    }
  }

  // Handle the drag event and update the position
  function onDrag(event) {
    // Make sure event.nativeEvent is properly structured
    if (event.nativeEvent && event.nativeEvent.position) {
      setPosition(event.nativeEvent.position); // Update the position based on drag event
    }
  }

  return (
    <ViroARScene onTrackingUpdated={onInitialized}>
      <ViroAmbientLight color="#ffffff" intensity={200} />
      {initialized && (
        <Viro3DObject
          source={require("./res/emoji_smile/emoji_smile.vrx")}
          position={position} // Update the position from the state
          scale={[0.5, 0.5, 0.5]}
          type="VRX"
          onDrag={onDrag} // Enable dragging functionality
        />
      )}
    </ViroARScene>
  );
};

export default () => {
  return (
    <ViroARSceneNavigator
      autofocus={true}
      initialScene={{
        scene: HelloWorldSceneAR,
      }}
      style={styles.f1}
    />
  );
};

const styles = StyleSheet.create({
  f1: { flex: 1 },
});
