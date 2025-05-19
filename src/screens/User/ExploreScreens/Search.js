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
import { searchArtists } from "../../../utils/api";
import { searchCollections } from "../../../utils/api";
import { getOwnedCollections } from "../../../utils/api";

// Import Styles
import { globalStyles } from "../../../styles/global";
import { COLORS } from "../../../styles/theme";

// Import Icons
import ChevronRightIcon from "../../../components/icons/ChevronRightIcon";

// Import Components
import CollectionCard from "../../../components/UI/CollectionCard";
import Header from "../../../components/UI/Header";
import SearchInput from "../../../components/UI/SearchInput";
import ArtistCard from "../../../components/UI/ArtistCard";
import CollectionListItem from "../../../components/UI/CollectionListItem";

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

  const screenWidth = Dimensions.get("window").width;
  const cardWidth = screenWidth - 32;

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
          style={{ width: cardWidth }}
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
          style={{ width: cardWidth }}
        />
      );
    }
    return null;
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <View style={[globalStyles.container, styles.container]}>
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
