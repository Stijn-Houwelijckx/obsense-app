import React from "react";
import Svg, { Path } from "react-native-svg";

const LocationPinIcon = ({
  size = 24,
  stroke = "#B1B0AF",
  strokeWidth = "1.5",
}) => (
  <Svg
    width={size}
    height={size}
    viewBox="0 0 20 20"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <Path
      d="M12.5 8.75C12.5 10.1307 11.3807 11.25 10 11.25C8.61929 11.25 7.5 10.1307 7.5 8.75C7.5 7.36929 8.61929 6.25 10 6.25C11.3807 6.25 12.5 7.36929 12.5 8.75Z"
      stroke={stroke}
      stroke-width={strokeWidth}
      stroke-linecap="round"
      stroke-linejoin="round"
    />
    <Path
      d="M16.25 8.75C16.25 14.7018 10 18.125 10 18.125C10 18.125 3.75 14.7018 3.75 8.75C3.75 5.29822 6.54822 2.5 10 2.5C13.4518 2.5 16.25 5.29822 16.25 8.75Z"
      stroke={stroke}
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </Svg>
);

export default LocationPinIcon;
