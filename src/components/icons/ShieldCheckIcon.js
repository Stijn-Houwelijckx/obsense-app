import React from "react";
import Svg, { Path } from "react-native-svg";

const ShieldCheckIcon = ({
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
      d="M7.5 10.6249L9.375 12.4999L12.5 8.12487M10 2.26176C8.20792 3.95894 5.78802 4.99988 3.125 4.99988C3.08269 4.99988 3.04043 4.99962 2.99825 4.9991C2.67491 5.98252 2.5 7.03329 2.5 8.12492C2.5 12.7845 5.68693 16.6998 10 17.8099C14.3131 16.6998 17.5 12.7845 17.5 8.12492C17.5 7.03329 17.3251 5.98252 17.0018 4.9991C16.9596 4.99962 16.9173 4.99988 16.875 4.99988C14.212 4.99988 11.7921 3.95894 10 2.26176Z"
      stroke={stroke}
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </Svg>
);

export default ShieldCheckIcon;
