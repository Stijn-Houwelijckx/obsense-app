import React from "react";
import Svg, { Path } from "react-native-svg";

const DotsVerticalIcon = ({
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
      d="M10 5.625C9.65482 5.625 9.375 5.34518 9.375 5C9.375 4.65482 9.65482 4.375 10 4.375C10.3452 4.375 10.625 4.65482 10.625 5C10.625 5.34518 10.3452 5.625 10 5.625Z"
      stroke={stroke}
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <Path
      d="M10 10.625C9.65482 10.625 9.375 10.3452 9.375 10C9.375 9.65482 9.65482 9.375 10 9.375C10.3452 9.375 10.625 9.65482 10.625 10C10.625 10.3452 10.3452 10.625 10 10.625Z"
      stroke={stroke}
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <Path
      d="M10 15.625C9.65482 15.625 9.375 15.3452 9.375 15C9.375 14.6548 9.65482 14.375 10 14.375C10.3452 14.375 10.625 14.6548 10.625 15C10.625 15.3452 10.3452 15.625 10 15.625Z"
      stroke={stroke}
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </Svg>
);

export default DotsVerticalIcon;
