import React from "react";
import Svg, { Path } from "react-native-svg";

const EuroCircleIcon = ({
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
      d="M11.875 6.46354C10.5559 5.99832 9.02845 6.29325 7.97335 7.34835C6.50888 8.81282 6.50888 11.1872 7.97335 12.6517C9.02845 13.7067 10.5559 14.0017 11.875 13.5365M6.25 8.75H10.625M6.25 11.25H10.625M17.5 10C17.5 14.1421 14.1421 17.5 10 17.5C5.85786 17.5 2.5 14.1421 2.5 10C2.5 5.85786 5.85786 2.5 10 2.5C14.1421 2.5 17.5 5.85786 17.5 10Z"
      stroke={stroke}
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </Svg>
);

export default EuroCircleIcon;
