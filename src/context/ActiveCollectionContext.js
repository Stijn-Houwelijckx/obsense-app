import React, { createContext, useContext, useState, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

export const ActiveCollectionContext = createContext();

export const ActiveCollectionProvider = ({ children }) => {
  const [activeCollectionId, setActiveCollectionId] = useState(null);

  const setActiveCollection = (collectionId) => {
    setActiveCollectionId(collectionId);
  };

  const clearActiveCollection = () => {
    setActiveCollectionId(null);
  };

  return (
    <ActiveCollectionContext.Provider
      value={{
        activeCollectionId,
        setActiveCollection,
        clearActiveCollection,
      }}
    >
      {children}
    </ActiveCollectionContext.Provider>
  );
};

export const useActiveCollection = () => useContext(ActiveCollectionContext);
