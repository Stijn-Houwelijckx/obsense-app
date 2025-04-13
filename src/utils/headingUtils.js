import CompassHeading from "react-native-compass-heading";

export const getDeviceHeading = () => {
  return new Promise((resolve) => {
    CompassHeading.start(1, (headingData) => {
      const heading = headingData.heading;
      CompassHeading.stop();
      resolve(heading);
    });
  });
};
