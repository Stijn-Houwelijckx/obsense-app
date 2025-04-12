import React from "react";
import { ActiveCollectionProvider } from "./ActiveCollectionContext";
// Import other contexts as needed
// import { UserProvider } from "./UserContext";
// import { ThemeProvider } from "./ThemeContext";

const ContextProvider = ({ children }) => {
  return (
    <ActiveCollectionProvider>
      {/* Wrap other providers here */}
      {/* <UserProvider> */}
      {/* <ThemeProvider> */}
      {children}
      {/* </ThemeProvider> */}
      {/* </UserProvider> */}
    </ActiveCollectionProvider>
  );
};

export default ContextProvider;
