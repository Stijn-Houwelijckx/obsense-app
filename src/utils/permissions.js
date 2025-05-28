import { PermissionsAndroid, Platform, Alert, Linking } from "react-native";

export const checkLocationPermission = async () => {
  if (Platform.OS !== "android") return true;

  console.log("Checking location permission...");

  const granted = await PermissionsAndroid.check(
    PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION
  );
  if (!granted) {
    const result = await PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION
    );
    if (result !== PermissionsAndroid.RESULTS.GRANTED) {
      Alert.alert(
        "Location Permission Required",
        "Please enable location access in your device settings to use this app.",
        [
          { text: "Cancel", style: "cancel" },
          { text: "Open Settings", onPress: () => Linking.openSettings() },
        ]
      );
      return false;
    }

    console.log("Location permission granted.");
  }
  return true;
};

export const checkCameraPermission = async () => {
  if (Platform.OS !== "android") return true;
  const granted = await PermissionsAndroid.check(
    PermissionsAndroid.PERMISSIONS.CAMERA
  );

  console.log("Checking camera permission...");

  if (!granted) {
    const result = await PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.CAMERA
    );
    if (result !== PermissionsAndroid.RESULTS.GRANTED) {
      Alert.alert(
        "Camera Permission Required",
        "Please enable camera access in your device settings to use this app.",
        [
          { text: "Cancel", style: "cancel" },
          { text: "Open Settings", onPress: () => Linking.openSettings() },
        ]
      );
      return false;
    }

    console.log("Camera permission granted.");
  }
  return true;
};
