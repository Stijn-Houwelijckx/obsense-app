import React from "react";
import Svg, { Path } from "react-native-svg";

const BoxDashIcon = ({
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
      d="M17.5 6.25L15.625 5.15625M17.5 6.25V8.125M17.5 6.25L15.625 7.34375M2.5 6.25L4.375 5.15625M2.5 6.25L4.375 7.34375M2.5 6.25V8.125M10 10.625L11.875 9.53125M10 10.625L8.125 9.53125M10 10.625V12.5M10 18.125L11.875 17.0312M10 18.125V16.25M10 18.125L8.125 17.0312M8.125 2.96875L10 1.875L11.875 2.96875M17.5 11.875V13.75L15.625 14.8438M4.375 14.8438L2.5 13.75V11.875"
      stroke={stroke}
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </Svg>
);

export default BoxDashIcon;
