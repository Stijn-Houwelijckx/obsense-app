import React from "react";
import Svg, { Path } from "react-native-svg";

const XIcon = ({ size = 24, stroke = "#B1B0AF", strokeWidth = "1.5" }) => (
  <Svg
    width={size}
    height={size}
    viewBox="0 0 20 20"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <Path
      d="M5 15L15 5M5 5L15 15"
      stroke={stroke}
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </Svg>
);

export default XIcon;
