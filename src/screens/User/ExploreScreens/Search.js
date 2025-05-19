import React, { useState, useEffect, useCallback, useRef } from "react";
import { Dimensions } from "react-native";
import {
  View,
  Text,
  TouchableOpacity,
  FlatList,
  ActivityIndicator,
  StyleSheet,
  TouchableWithoutFeedback,
  Keyboard,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";

// Import Utils
import { getCollections } from "../../../utils/api";
import { getOwnedCollections } from "../../../utils/api";

// Import Styles
import { globalStyles } from "../../../styles/global";
import { COLORS } from "../../../styles/theme";

// Import Icons
import ChevronRightIcon from "../../../components/icons/ChevronRightIcon";

// Import Components
import CollectionCard from "../../../components/UI/CollectionCard";
import SearchInput from "../../../components/UI/SearchInput";

const Search = ({ navigation }) => {
  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <View style={[globalStyles.container, styles.container]}>
        {/* Search Bar */}
        <SearchInput
          placeholder="Search..."
          autoFocus={true}
          onClick={() => console.log("Search clicked")}
        />
      </View>
    </TouchableWithoutFeedback>
  );
};

const styles = StyleSheet.create({
  container: {
    justifyContent: "flex-start",
    alignItems: "flex-start",
    gap: 20,
    paddingBottom: 70,
  },
  section: {
    width: "100%",
    marginTop: 4,
    gap: 20,
    justifyContent: "flex-start",
    alignItems: "flex-start",
  },
  sectionTitleContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    width: "100%",
  },
  sectionTitle: {
    color: COLORS.neutral[50],
  },
  linkContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    paddingLeft: 5.5,
    height: 28,
  },
  sectionLink: {
    color: COLORS.neutral[50],
  },
  cardsContainer: {
    flexDirection: "column",
    gap: 16,
    paddingBottom: 60,
  },
  emptyText: {
    color: COLORS.neutral[300],
    fontStyle: "italic",
  },
});

export default Search;
