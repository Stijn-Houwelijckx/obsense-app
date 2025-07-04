import React from "react";
import Svg, { Path } from "react-native-svg";

const GridIcon = ({ size = 24, stroke = "#B1B0AF", strokeWidth = "1.5" }) => (
  <Svg
    width={size}
    height={size}
    viewBox="0 0 20 20"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <Path
      d="M3.125 5C3.125 3.96447 3.96447 3.125 5 3.125H6.875C7.91053 3.125 8.75 3.96447 8.75 5V6.875C8.75 7.91053 7.91053 8.75 6.875 8.75H5C3.96447 8.75 3.125 7.91053 3.125 6.875V5Z"
      stroke={stroke}
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <Path
      d="M3.125 13.125C3.125 12.0895 3.96447 11.25 5 11.25H6.875C7.91053 11.25 8.75 12.0895 8.75 13.125V15C8.75 16.0355 7.91053 16.875 6.875 16.875H5C3.96447 16.875 3.125 16.0355 3.125 15V13.125Z"
      stroke={stroke}
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <Path
      d="M11.25 5C11.25 3.96447 12.0895 3.125 13.125 3.125H15C16.0355 3.125 16.875 3.96447 16.875 5V6.875C16.875 7.91053 16.0355 8.75 15 8.75H13.125C12.0895 8.75 11.25 7.91053 11.25 6.875V5Z"
      stroke={stroke}
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <Path
      d="M11.25 13.125C11.25 12.0895 12.0895 11.25 13.125 11.25H15C16.0355 11.25 16.875 12.0895 16.875 13.125V15C16.875 16.0355 16.0355 16.875 15 16.875H13.125C12.0895 16.875 11.25 16.0355 11.25 15V13.125Z"
      stroke={stroke}
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </Svg>
);

export default GridIcon;
