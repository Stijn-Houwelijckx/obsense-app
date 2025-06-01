import React, { useState, useEffect } from "react";
import {
  View,
  FlatList,
  ActivityIndicator,
  StyleSheet,
  TouchableWithoutFeedback,
  Keyboard,
} from "react-native";

// Import Utils
import {
  searchArtists,
  searchCollections,
  getOwnedCollections,
} from "../../../utils/api";

// Import Styles
import { globalStyles } from "../../../styles/global";
import { COLORS } from "../../../styles/theme";

// Import Components
import { Header, ArtistCard, CollectionListItem } from "../../../components/UI";

const Search = ({ navigation, route }) => {
  const searchType = route.params?.searchType || "all";

  const [ownedCollections, setOwnedCollections] = useState([]);
  const [searchValue, setSearchValue] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [pageArtists, setPageArtists] = useState(1);
  const [pageCollections, setPageCollections] = useState(1);
  const [hasMoreArtists, setHasMoreArtists] = useState(true);
  const [hasMoreCollections, setHasMoreCollections] = useState(true);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    setSearchResults([]);
    setPageArtists(1);
    setPageCollections(1);
    setHasMoreArtists(true);
    setHasMoreCollections(true);
    setSearchValue("");

    // Get owned collections
    const getOwnedCollectionsData = async () => {
      setIsLoading(true);

      const result = await getOwnedCollections();

      if (result.status === "success") {
        setOwnedCollections(result.data.purchases); // Set owned collection data
        console.log(result.data.purchases); // Log owned collection data
      } else {
        console.log("Error getting owned collection data:", result.message); // Log error message
      }

      setIsLoading(false);
    };

    getOwnedCollectionsData(); // Call the function
  }, [searchType]);

  useEffect(() => {
    navigation.setOptions({
      header: () => (
        <Header
          type="search"
          searchValue={searchValue}
          onSearchChange={setSearchValue}
          onSearchClear={() => setSearchValue("")}
        />
      ),
    });
  }, [navigation, searchValue]);

  useEffect(() => {
    const delayDebounce = setTimeout(() => {
      if (searchValue.trim() === "") {
        setSearchResults([]);
        setPageArtists(1);
        setPageCollections(1);
        setHasMoreArtists(true);
        setHasMoreCollections(true);
        return;
      }

      loadInitialResults();
    }, 300); // debounce input

    return () => clearTimeout(delayDebounce);
  }, [searchValue]);

  const loadInitialResults = async () => {
    setIsLoading(true);

    const [artistResult, collectionResult] = await Promise.all([
      searchType === "artists" || searchType === "all"
        ? searchArtists(searchValue, 1, 4)
        : { status: "success", data: { artists: [], hasMore: false } },
      searchType === "collections" || searchType === "all"
        ? searchCollections(searchValue, 1, 4)
        : { status: "success", data: { collections: [], hasMore: false } },
    ]);

    const artists = (artistResult?.data?.artists || []).map((a) => ({
      ...a,
      type: "artist",
    }));

    const collections = (collectionResult?.data?.collections || []).map(
      (c) => ({
        ...c,
        type: "collection",
      })
    );

    setSearchResults([...artists, ...collections]);
    setPageArtists(2);
    setPageCollections(2);
    setHasMoreArtists(artistResult?.data?.hasMore || false);
    setHasMoreCollections(collectionResult?.data?.hasMore || false);
    setIsLoading(false);
  };

  const loadMore = async () => {
    if (isLoading || searchValue.trim() === "") return;
    setIsLoading(true);

    let newResults = [];

    if ((searchType === "artists" || searchType === "all") && hasMoreArtists) {
      const result = await searchArtists(searchValue, pageArtists, 4);
      if (result.status === "success") {
        const artists = result.data.artists.map((a) => ({
          ...a,
          type: "artist",
        }));
        newResults = [...newResults, ...artists];
        setPageArtists((prev) => prev + 1);
        setHasMoreArtists(result.data.hasMore);
      }
    }

    if (
      (searchType === "collections" || searchType === "all") &&
      hasMoreCollections
    ) {
      const result = await searchCollections(searchValue, pageCollections, 4);
      if (result.status === "success") {
        const collections = result.data.collections.map((c) => ({
          ...c,
          type: "collection",
        }));
        newResults = [...newResults, ...collections];
        setPageCollections((prev) => prev + 1);
        setHasMoreCollections(result.data.hasMore);
      }
    }

    setSearchResults((prev) => [...prev, ...newResults]);
    setIsLoading(false);
  };

  const renderItem = ({ item }) => {
    if (item.type === "artist") {
      return (
        <ArtistCard
          id={item._id}
          imageUrl={item.profilePicture?.filePath}
          username={item.username}
          numCollections={item.collectionCount}
          onPress={(id) =>
            navigation.navigate("Artist Profile", { artistId: id })
          }
          style={styles.card}
        />
      );
    } else if (item.type === "collection") {
      return (
        <CollectionListItem
          id={item._id}
          imageUrl={item.coverImage?.filePath}
          title={item.title}
          creator={item.createdBy?.username}
          category={item.type}
          onPress={(id) =>
            navigation.navigate("CollectionDetails", {
              collectionId: id,
              owned: ownedCollections.some((c) => c.collectionRef._id === id),
            })
          }
          style={styles.card}
        />
      );
    }
    return null;
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <View
        style={[globalStyles.container, styles.container, { paddingBottom: 0 }]}
      >
        <FlatList
          data={searchResults}
          keyExtractor={(item) => item._id}
          renderItem={renderItem}
          numColumns={1}
          contentContainerStyle={styles.cardsContainer}
          onEndReached={loadMore}
          onEndReachedThreshold={0.1}
          ListFooterComponent={
            isLoading ? (
              <ActivityIndicator size="small" color={COLORS.primary[500]} />
            ) : null
          }
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
  },
  cardsContainer: {
    flexDirection: "column",
    gap: 16,
    paddingBottom: 60,
  },
  card: {
    width: "100%",
  },
});

export default Search;
