import React from "react";
import Svg, { Path } from "react-native-svg";

const LockClosedIcon = ({
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
      d="M13.75 8.75V5.625C13.75 3.55393 12.0711 1.875 10 1.875C7.92893 1.875 6.25 3.55393 6.25 5.625V8.75M5.625 18.125H14.375C15.4105 18.125 16.25 17.2855 16.25 16.25V10.625C16.25 9.58947 15.4105 8.75 14.375 8.75H5.625C4.58947 8.75 3.75 9.58947 3.75 10.625V16.25C3.75 17.2855 4.58947 18.125 5.625 18.125Z"
      stroke={stroke}
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </Svg>
);

export default LockClosedIcon;
