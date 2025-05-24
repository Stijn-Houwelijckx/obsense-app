import React from "react";
import Svg, { Path } from "react-native-svg";

const DotsHorizontalIcon = ({
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
      d="M5.625 10C5.625 10.3452 5.34518 10.625 5 10.625C4.65482 10.625 4.375 10.3452 4.375 10C4.375 9.65482 4.65482 9.375 5 9.375C5.34518 9.375 5.625 9.65482 5.625 10Z"
      stroke={stroke}
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <Path
      d="M10.625 10C10.625 10.3452 10.3452 10.625 10 10.625C9.65482 10.625 9.375 10.3452 9.375 10C9.375 9.65482 9.65482 9.375 10 9.375C10.3452 9.375 10.625 9.65482 10.625 10Z"
      stroke={stroke}
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <Path
      d="M15.625 10C15.625 10.3452 15.3452 10.625 15 10.625C14.6548 10.625 14.375 10.3452 14.375 10C14.375 9.65482 14.6548 9.375 15 9.375C15.3452 9.375 15.625 9.65482 15.625 10Z"
      stroke={stroke}
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </Svg>
);

export default DotsHorizontalIcon;
