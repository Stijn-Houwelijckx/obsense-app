import React from "react";
import Svg, { Path } from "react-native-svg";

const EyeIcon = ({
  width = 24,
  height = 24,
  stroke = "#B1B0AF",
  strokeWidth = "1.5",
}) => (
  <Svg
    width={width}
    height={height}
    viewBox="0 0 20 20"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <Path
      d="M1.69605 10.2687C1.63848 10.0959 1.63843 9.90895 1.69589 9.73619C2.85286 6.2581 6.13375 3.75 10.0004 3.75C13.8653 3.75 17.145 6.25577 18.3034 9.73134C18.3609 9.90406 18.361 10.0911 18.3035 10.2638C17.1465 13.7419 13.8657 16.25 9.99897 16.25C6.13409 16.25 2.85446 13.7442 1.69605 10.2687Z"
      stroke={stroke}
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <Path
      d="M12.4998 10C12.4998 11.3807 11.3805 12.5 9.99976 12.5C8.61904 12.5 7.49976 11.3807 7.49976 10C7.49976 8.61929 8.61904 7.5 9.99976 7.5C11.3805 7.5 12.4998 8.61929 12.4998 10Z"
      stroke={stroke}
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </Svg>
);

export default EyeIcon;
