import React, { useState, useEffect, useCallback, useRef } from "react";
import { Dimensions } from "react-native";
import {
  View,
  Text,
  FlatList,
  ActivityIndicator,
  StyleSheet,
  TouchableWithoutFeedback,
  Keyboard,
} from "react-native";

// Import Utils
import { getArtists } from "../../utils/api";

// Import Styles
import { globalStyles } from "../../styles/global";
import { COLORS } from "../../styles/theme";

// Import Components
import { ArtistCard, SearchInput } from "../../components/UI";

const Artists = ({ navigation }) => {
  const [artists, setArtists] = useState([]); // State to store artists data
  const [page, setPage] = useState(1); // State to manage pagination
  const [isLoading, setIsLoading] = useState(false); // State to manage loading state
  const [hasMore, setHasMore] = useState(true); // State to manage pagination

  const initialLoadDone = useRef(false);

  const screenWidth = Dimensions.get("window").width; // Get screen width
  const cardWidth = screenWidth - 32; // Calculate card width

  const loadArtists = useCallback(async () => {
    if (isLoading || !hasMore) return; // If loading or no more data, return

    setIsLoading(true);

    const result = await getArtists(page, 10); // Get artists data from API (page 1, limit 20)

    if (result.status === "success") {
      setArtists((prev) => [...prev, ...result.data.artists]); // Set artists data
      setPage((prev) => prev + 1); // Increment page number
      setHasMore(result.data.hasMore); // Set hasMore state
      console.log("hasMore: " + result.data.hasMore); // Log hasMore state
      console.log("current page: " + result.data.currentPage); // Log current page number
      console.log("total pages: " + result.data.totalPages); // Log total pages
    } else {
      console.log("Error getting artist data:", result.message); // Log error message
    }

    setIsLoading(false);
  }, [isLoading, hasMore, page]);

  useEffect(() => {
    if (!initialLoadDone.current) {
      loadArtists();
      initialLoadDone.current = true;
    }
  }, [loadArtists]);

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <View style={[globalStyles.container, styles.container]}>
        {/* Search Bar */}
        <SearchInput
          placeholder="Search..."
          onClick={() =>
            navigation.navigate("Explore", {
              screen: "Search",
              params: { searchType: "artists" },
            })
          } // Navigate to Search screen
        />

        {/* Artists Section */}
        <View style={styles.section}>
          {/* Empty State */}
          {artists.length === 0 && !isLoading && (
            <Text style={[globalStyles.bodyText, styles.emptyText]}>
              No tours or expositions found.
            </Text>
          )}

          {/* If not empty */}
          <FlatList
            data={artists}
            renderItem={({ item }) => (
              <ArtistCard
                id={item._id}
                imageUrl={item.profilePicture.filePath}
                username={item.username}
                numCollections={item.collectionCount}
                onPress={(id) =>
                  navigation.navigate("Artist Profile", {
                    artistId: id,
                  })
                }
                style={{ width: cardWidth }}
              />
            )}
            keyExtractor={(item) => item._id} // Unique key for each card
            contentContainerStyle={styles.cardsContainer} // Apply container styles
            showsVerticalScrollIndicator={false} // Hide vertical scroll indicator
            numColumns={1} // Show 2 cards in a row
            onEndReached={() => {
              loadArtists();
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

export default Artists;
