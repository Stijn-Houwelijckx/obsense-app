import React from "react";
import Svg, { Path } from "react-native-svg";

const MapIcon = ({ size = 24, stroke = "#B1B0AF", strokeWidth = "1.5" }) => (
  <Svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <Path
      d="M9 6.74999V15M15 8.99999V17.25M15.5031 20.7484L20.3781 18.3109C20.7592 18.1204 21 17.7308 21 17.3047V4.82028C21 3.98398 20.1199 3.44004 19.3719 3.81405L15.5031 5.74844C15.1864 5.9068 14.8136 5.9068 14.4969 5.74844L9.50312 3.25155C9.1864 3.09319 8.8136 3.09319 8.49688 3.25155L3.62188 5.68905C3.24075 5.87962 3 6.26916 3 6.69528V19.1797C3 20.016 3.8801 20.5599 4.62811 20.1859L8.49688 18.2516C8.8136 18.0932 9.1864 18.0932 9.50312 18.2516L14.4969 20.7484C14.8136 20.9068 15.1864 20.9068 15.5031 20.7484Z"
      stroke={stroke}
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </Svg>
);

export default MapIcon;
