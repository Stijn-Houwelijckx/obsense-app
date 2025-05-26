import React from "react";
import Svg, { Path } from "react-native-svg";

const ListIcon = ({ size = 24, stroke = "#B1B0AF", strokeWidth = "1.5" }) => (
  <Svg
    width={size}
    height={size}
    viewBox="0 0 20 20"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <Path
      d="M3.125 5.625H16.875M3.125 10H16.875M3.125 14.375H10"
      stroke={stroke}
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </Svg>
);

export default ListIcon;
