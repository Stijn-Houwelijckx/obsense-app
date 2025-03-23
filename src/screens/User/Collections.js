import React, { useState, useEffect, useCallback, useRef } from "react";
import { Dimensions } from "react-native";
import {
  View,
  Text,
  TouchableOpacity,
  FlatList,
  ActivityIndicator,
  StyleSheet,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";

// Import Utils
import { getCollections } from "../../utils/api";

// Import Styles
import { globalStyles } from "../../styles/global";
import { COLORS } from "../../styles/theme";

// Import Icons
import ChevronRightIcon from "../../components/icons/ChevronRightIcon";

// Import Components
import CollectionCard from "../../components/UI/CollectionCard";

const Collections = ({ navigation }) => {
  const [collections, setCollections] = useState([]); // State to store collection data
  const [page, setPage] = useState(1); // State to manage pagination
  const [isLoading, setIsLoading] = useState(false); // State to manage loading state
  const [hasMore, setHasMore] = useState(true); // State to manage pagination

  const initialLoadDone = useRef(false);

  const screenWidth = Dimensions.get("window").width; // Get screen width
  const cardWidth = (screenWidth - 48) / 2; // Calculate card width

  const loadCollections = useCallback(async () => {
    if (isLoading || !hasMore) return; // If loading or no more data, return

    setIsLoading(true);

    const result = await getCollections(page, 8); // Get collection data from API (page 1, limit 20)

    if (result.status === "success") {
      setCollections((prev) => [...prev, ...result.data.collections]); // Set collection data
      setPage((prev) => prev + 1); // Increment page number
      setHasMore(result.data.hasMore); // Set hasMore state
      console.log("hasMore: " + result.data.hasMore); // Log hasMore state
      console.log("current page: " + result.data.currentPage); // Log current page number
      console.log("total pages: " + result.data.totalPages); // Log total pages
    } else {
      console.log("Error getting collection data:", result.message); // Log error message
    }

    setIsLoading(false);
  }, [isLoading, hasMore, page]);

  useEffect(() => {
    if (!initialLoadDone.current) {
      loadCollections();
      initialLoadDone.current = true;
    }
  }, [loadCollections]);

  return (
    <View style={[globalStyles.container, styles.container]}>
      {/* Collections Section */}
      <View style={styles.section}>
        <View style={styles.sectionTitleContainer}>
          <Text style={[globalStyles.headingH6Bold, styles.sectionTitle]}>
            Tours & Expositions
          </Text>
        </View>

        {/* Empty State */}
        {collections.length === 0 && !isLoading && (
          <Text style={[globalStyles.bodyText, styles.emptyText]}>
            No tours or expositions found.
          </Text>
        )}

        {/* If not empty */}
        <FlatList
          data={collections}
          renderItem={({ item }) => (
            <CollectionCard
              id={item._id}
              imageUrl={item.coverImage.filePath}
              title={item.title}
              creator={item.createdBy.username}
              price={item.price}
              category={item.type}
              onPress={(id) =>
                navigation.navigate("CollectionDetails", { collectionId: id })
              }
              style={{ width: cardWidth }}
            />
          )}
          keyExtractor={(item) => item._id} // Unique key for each card
          contentContainerStyle={styles.cardsContainer} // Apply container styles
          numColumns={2} // Show 2 cards in a row
          columnWrapperStyle={{
            gap: 16,
          }} // Space between columns
          onEndReached={() => {
            loadCollections();
          }} // Load more data when end is reached
          onEndReachedThreshold={0.1} // Load more data when 10% is left
          ListFooterComponent={
            isLoading ? (
              <ActivityIndicator size="small" color={COLORS.primary[500]} />
            ) : null
          } // Show loading indicator at the end of the list
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    justifyContent: "flex-start",
    alignItems: "flex-start",
    gap: 20,
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

export default Collections;
