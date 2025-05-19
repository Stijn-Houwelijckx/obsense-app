import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  FlatList,
  ActivityIndicator,
  Dimensions,
  StyleSheet,
  TouchableWithoutFeedback,
  Keyboard,
} from "react-native";

// Import Styles
import { globalStyles } from "../../../styles/global";
import { COLORS } from "../../../styles/theme";

// Import Utils
import { getArtists } from "../../../utils/api";
import { getCollections } from "../../../utils/api";
import { getOwnedCollections } from "../../../utils/api";
import { getGenres } from "../../../utils/api";

// Import Icons
import ChevronRightIcon from "../../../components/icons/ChevronRightIcon";

// Import Components
import GenreItem from "../../../components/UI/GenreItem";
import ArtistItem from "../../../components/UI/ArtistItem";
import CollectionCard from "../../../components/UI/CollectionCard";
import SearchInput from "../../../components/UI/SearchInput";

const Explore = ({ navigation }) => {
  const [isLoading, setIsLoading] = useState(true); // State to manage loading state
  const [genres, setGenres] = useState([]); // State to store genres
  const [artists, setArtists] = useState([]); // State to store artists
  const [collections, setCollections] = useState([]); // State to store collections
  const [ownedCollections, setOwnedCollections] = useState([]); // State to store owned collections

  const screenWidth = Dimensions.get("window").width; // Get screen width
  const cardWidth = (screenWidth - 48) / 2; // Calculate card width

  const getGenresData = async () => {
    const result = await getGenres(); // Get genres from API
    if (result.status === "success") {
      setGenres(result.data.genres); // Set genres data
    } else {
      console.log("Error getting genres data:", result.message); // Log error message
    }
  };

  const getArtistsData = async () => {
    const result = await getArtists(1, 3);

    if (result.status === "success") {
      setArtists(result.data.artists); // Set artists data
    } else {
      console.log("Error getting artists data:", result.message); // Log error message
    }
  };

  const getCollectionsData = async () => {
    const result = await getCollections(1, 3);
    if (result.status === "success") {
      setCollections(result.data.collections); // Set collections data
    } else {
      console.log("Error getting collections data:", result.message); // Log error message
    }
  };

  const getOwnedCollectionsData = async () => {
    const result = await getOwnedCollections();
    if (result.status === "success") {
      setOwnedCollections(result.data.purchases); // Set owned collections data
    } else {
      console.log("Error getting owned collections data:", result.message); // Log error message
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      await getGenresData(); // Fetch genres data
      await getArtistsData(); // Fetch artists data
      await getCollectionsData(); // Fetch collections data
      await getOwnedCollectionsData(); // Fetch owned collections data
      setIsLoading(false); // Set loading state to false
    };

    fetchData(); // Call the function
  }, []);

  if (isLoading) {
    return (
      <View style={globalStyles.container}>
        <ActivityIndicator size="large" color={COLORS.primary[500]} />
      </View>
    );
  }

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <ScrollView>
        <View style={[globalStyles.container, styles.container]}>
          {/* Search Bar */}
          <SearchInput
            placeholder="Search..."
            onClick={() => navigation.navigate("Search", { searchType: "all" })} // Navigate to Search screen
          />

          {/* Genres */}
          <View style={styles.section}>
            <View style={styles.sectionTitleContainer}>
              <Text style={[globalStyles.headingH6Bold, styles.sectionTitle]}>
                Genres
              </Text>
              <TouchableOpacity onPress={() => console.log("See all genres")}>
                <View style={styles.linkContainer}>
                  <Text
                    style={[globalStyles.labelSmallRegular, styles.sectionLink]}
                  >
                    See all
                  </Text>
                  <ChevronRightIcon size={16} stroke={COLORS.neutral[50]} />
                </View>
              </TouchableOpacity>
            </View>

            {genres.length === 0 && !isLoading && (
              <View>
                <Text style={[globalStyles.bodySmallItalic, styles.emptyText]}>
                  No genres found
                </Text>
              </View>
            )}

            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              <View style={styles.horizontalContainer}>
                {/* First Row: Items 1-10 */}
                <View style={styles.row}>
                  {genres.slice(0, 10).map((item) => (
                    <GenreItem
                      key={item._id}
                      id={item._id}
                      title={item.name}
                      onPress={() =>
                        navigation.navigate("GenreCollections", {
                          genreId: item._id,
                        })
                      }
                    />
                  ))}
                </View>

                {/* Second Row: Items 11-20 */}
                <View style={styles.row}>
                  {genres.slice(10, 20).map((item) => (
                    <GenreItem
                      key={item._id}
                      id={item._id}
                      title={item.name}
                      onPress={() =>
                        navigation.navigate("GenreCollections", {
                          genreId: item._id,
                        })
                      }
                    />
                  ))}
                </View>
              </View>
            </ScrollView>
          </View>

          {/* Artists */}
          <View style={styles.section}>
            <View style={styles.sectionTitleContainer}>
              <Text style={[globalStyles.headingH6Bold, styles.sectionTitle]}>
                Artists
              </Text>
              <TouchableOpacity onPress={() => navigation.navigate("Artists")}>
                <View style={styles.linkContainer}>
                  <Text
                    style={[globalStyles.labelSmallRegular, styles.sectionLink]}
                  >
                    See all
                  </Text>
                  <ChevronRightIcon size={16} stroke={COLORS.neutral[50]} />
                </View>
              </TouchableOpacity>
            </View>

            {artists.length === 0 && !isLoading && (
              <View>
                <Text style={[globalStyles.bodySmallItalic, styles.emptyText]}>
                  No artists found
                </Text>
              </View>
            )}

            <FlatList
              data={artists}
              renderItem={({ item }) => (
                <ArtistItem
                  id={item._id}
                  profileImage={item.profilePicture.filePath}
                  username={item.username}
                  collectionCount={item.collectionCount}
                  onPress={(id) =>
                    navigation.navigate("Artist Profile", { artistId: id })
                  }
                />
              )}
              keyExtractor={(item) => item._id} // Unique key for each card
              contentContainerStyle={styles.cardsContainer} // Apply container styles
              horizontal // Optional: if you want to display the cards horizontally
              showsHorizontalScrollIndicator={false} // Optional: remove scroll indicator for horizontal list
            />
          </View>

          {/* Collections */}
          <View style={styles.section}>
            <View style={styles.sectionTitleContainer}>
              <Text style={[globalStyles.headingH6Bold, styles.sectionTitle]}>
                Tours & Expositions
              </Text>
              <TouchableOpacity
                onPress={() => navigation.navigate("Collections")}
              >
                <View style={styles.linkContainer}>
                  <Text
                    style={[globalStyles.labelSmallRegular, styles.sectionLink]}
                  >
                    See all
                  </Text>
                  <ChevronRightIcon size={16} stroke={COLORS.neutral[50]} />
                </View>
              </TouchableOpacity>
            </View>

            {collections.length === 0 && !isLoading && (
              <View>
                <Text style={[globalStyles.bodySmallItalic, styles.emptyText]}>
                  No tours or expositions found
                </Text>
              </View>
            )}

            {/* If not empty */}

            <FlatList
              data={collections}
              renderItem={({ item }) => {
                const isOwned = ownedCollections.some(
                  (c) => c.collectionRef._id === item._id
                );
                return (
                  <CollectionCard
                    id={item._id}
                    imageUrl={item.coverImage.filePath}
                    title={item.title}
                    creator={item.createdBy.username}
                    price={item.price}
                    owned={isOwned}
                    category={item.type}
                    onPress={(id) =>
                      navigation.navigate("CollectionDetails", {
                        collectionId: id,
                        owned: isOwned,
                      })
                    }
                    style={{ width: cardWidth }}
                  />
                );
              }}
              keyExtractor={(item) => item._id} // Unique key for each card
              contentContainerStyle={styles.cardsContainer} // Apply container styles
              horizontal // Optional: if you want to display the cards horizontally
              showsHorizontalScrollIndicator={false} // Optional: remove scroll indicator for horizontal list
            />
          </View>
        </View>
      </ScrollView>
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

  horizontalContainer: {
    flexDirection: "column", // Stack rows vertically
    gap: 12,
  },
  row: {
    flexDirection: "row", // Items in each row are laid out horizontally
    gap: 12,
  },

  cardsContainer: {
    flexDirection: "row",
    gap: 16,
  },
  emptyText: {
    color: COLORS.neutral[300],
  },
});

export default Explore;
