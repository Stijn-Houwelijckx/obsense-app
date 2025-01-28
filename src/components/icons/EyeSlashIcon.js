import React from "react";
import Svg, { Path } from "react-native-svg";

const EyeSlashIcon = ({
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
      d="M3.31646 6.85214C2.54721 7.76152 1.9602 8.83001 1.61182 10.0012C2.6879 13.615 6.03578 16.25 9.9991 16.25C10.8262 16.25 11.6266 16.1352 12.3851 15.9207M5.18954 5.18969C6.56976 4.27965 8.22294 3.75 9.99984 3.75C13.9632 3.75 17.311 6.38504 18.3871 9.99877C17.7939 11.9932 16.5087 13.6898 14.8099 14.81M5.18954 5.18969L2.49985 2.5M5.18954 5.18969L8.23209 8.23223M14.8099 14.81L17.4999 17.5M14.8099 14.81L11.7676 11.7678M11.7676 11.7678C12.22 11.3154 12.4999 10.6904 12.4999 10C12.4999 8.61929 11.3806 7.5 9.99985 7.5C9.3095 7.5 8.6845 7.77982 8.23209 8.23223M11.7676 11.7678L8.23209 8.23223"
      stroke={stroke}
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </Svg>
);

export default EyeSlashIcon;
