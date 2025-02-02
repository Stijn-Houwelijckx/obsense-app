import React from "react";
import Svg, { Path } from "react-native-svg";

const ChevronRightIcon = ({
  size = 24,
  stroke = "#B1B0AF",
  strokeWidth = "1.5",
}) => (
  <Svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <Path
      d="M8.25 4.5L15.75 12L8.25 19.5"
      stroke={stroke}
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </Svg>
);

export default ChevronRightIcon;
