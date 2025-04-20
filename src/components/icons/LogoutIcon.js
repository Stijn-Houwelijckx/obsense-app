import React from "react";
import Svg, { Path } from "react-native-svg";

const LogoutIcon = ({ size = 24, stroke = "#B1B0AF", strokeWidth = "1.5" }) => (
  <Svg
    width={size}
    height={size}
    viewBox="0 0 20 20"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <Path
      d="M13.125 7.5V4.375C13.125 3.33947 12.2855 2.5 11.25 2.5L6.25 2.5C5.21447 2.5 4.375 3.33947 4.375 4.375L4.375 15.625C4.375 16.6605 5.21447 17.5 6.25 17.5H11.25C12.2855 17.5 13.125 16.6605 13.125 15.625V12.5M15.625 12.5L18.125 10M18.125 10L15.625 7.5M18.125 10L7.5 10"
      stroke={stroke}
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </Svg>
);

export default LogoutIcon;
