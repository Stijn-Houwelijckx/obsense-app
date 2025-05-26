import React from "react";
import Svg, { Path } from "react-native-svg";

const ExclamationTriangleIcon = ({
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
      d="M9.99957 7.50005V10.6251M2.24686 13.4381C1.52571 14.6881 2.42785 16.2501 3.87096 16.2501H16.1282C17.5713 16.2501 18.4734 14.6881 17.7523 13.4381L11.6237 2.81516C10.9021 1.56446 9.09702 1.56446 8.37547 2.81516L2.24686 13.4381ZM9.99957 13.1251H10.0058V13.1313H9.99957V13.1251Z"
      stroke={stroke}
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </Svg>
);

export default ExclamationTriangleIcon;
