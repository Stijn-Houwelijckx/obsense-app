import React from "react";
import Svg, { Path } from "react-native-svg";

const KeyIcon = ({ size = 24, stroke = "#B1B0AF", strokeWidth = "1.5" }) => (
  <Svg
    width={size}
    height={size}
    viewBox="0 0 20 20"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <Path
      d="M13.125 4.375C14.5057 4.375 15.625 5.49429 15.625 6.875M18.125 6.875C18.125 9.63642 15.8864 11.875 13.125 11.875C12.8327 11.875 12.5463 11.8499 12.2677 11.8018C11.7986 11.7207 11.3017 11.8233 10.965 12.16L8.75 14.375H6.875V16.25H5V18.125H1.875V15.7767C1.875 15.2794 2.07254 14.8025 2.42417 14.4508L7.84 9.035C8.17668 8.69832 8.27927 8.20144 8.1982 7.73225C8.15008 7.45372 8.125 7.16729 8.125 6.875C8.125 4.11358 10.3636 1.875 13.125 1.875C15.8864 1.875 18.125 4.11358 18.125 6.875Z"
      stroke={stroke}
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </Svg>
);

export default KeyIcon;
