import { useState, useEffect } from "react";
import Geolocation from "@react-native-community/geolocation";

const useLocation = () => {
  const [location, setLocation] = useState({ latitude: 0, longitude: 0 });
  const [error, setError] = useState(null);

  useEffect(() => {
    // Watch location updates
    const watchId = Geolocation.watchPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        setLocation({ latitude, longitude });
      },
      (error) => {
        console.log("Error watching location: ", error);
        setError(error.message);
      },
      { enableHighAccuracy: true, distanceFilter: 1 }
    );

    // Cleanup the watcher on unmount
    return () => {
      Geolocation.clearWatch(watchId);
    };
  }, []);

  return { location, error };
};

export default useLocation;
