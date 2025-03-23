import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  FlatList,
  ActivityIndicator,
  StyleSheet,
  Image,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";

// Import Utils
import { getOwnedCollections } from "../../utils/api";
import { getArtists } from "../../utils/api";
import { getCollections } from "../../utils/api";

// Import Styles
import { globalStyles } from "../../styles/global";
import { COLORS } from "../../styles/theme";

// Import Icons
import ChevronRightIcon from "../../components/icons/ChevronRightIcon";

// Import Components
import BoughtCollectionCard from "../../components/UI/BoughtCollectionCard";
import ArtistItem from "../../components/UI/ArtistItem";
import CollectionListItem from "../../components/UI/CollectionListItem";

const Home = ({ navigation }) => {
  const [ownedCollections, setOwnedCollections] = useState([]); // State to store owned collections
  const [artists, setArtists] = useState([]); // State to store artists
  const [collections, setCollections] = useState([]); // State to store collections
  const [isLoading, setIsLoading] = useState(true); // State to manage loading state
  const [timeLeft, setTimeLeft] = useState([]); // State to store time left for each collection

  useEffect(() => {
    // Function to get the owned collections data
    const getOwnedCollectionsData = async () => {
      const result = await getOwnedCollections();

      if (result.status === "success") {
        // setUser(result.data.data.user); // Set user data
        setOwnedCollections(result.data.purchases); // Set collection data

        // Calculate time left for each collection
        // "purchasedAt": "2025-03-16T21:15:24.146Z", "expiresAt": "2025-04-15T21:15:24.146Z"
        setTimeLeft(
          result.data.purchases.map((purchase) => {
            const timeDifference =
              new Date(purchase.expiresAt).getTime() - new Date().getTime();

            if (timeDifference > 24 * 60 * 60 * 1000) {
              const daysLeft = Math.floor(
                timeDifference / (24 * 60 * 60 * 1000)
              );
              return `${daysLeft} Days Left`;
            } else if (timeDifference > 60 * 60 * 1000) {
              const hoursLeft = Math.floor(timeDifference / (60 * 60 * 1000));
              return `${hoursLeft} Hours Left`;
            } else if (timeDifference > 0) {
              const minutesLeft = Math.floor(timeDifference / (60 * 1000));
              return `${minutesLeft} Minutes Left`;
            } else {
              return "Expired";
            }
          })
        );

        // console.log(result.data.purchases); // Log collection data
      } else {
        console.log("Error getting user data:", result.message); // Log error message
      }
    };

    // Function to get all artists
    const getArtistsData = async () => {
      const result = await getArtists();

      if (result.status === "success") {
        setArtists(result.data.artists); // Set artists data
        // console.log(result.data.artists); // Log artists data
      } else {
        console.log("Error getting artists data:", result.message); // Log error message
      }
    };

    // Function to get all collections
    const getCollectionsData = async () => {
      const result = await getCollections();

      if (result.status === "success") {
        setCollections(result.data.collections); // Set collections data
        // console.log(result.data.collections); // Log collections data
      } else {
        console.log("Error getting collections data:", result.message); // Log error message
      }
    };

    if (
      ownedCollections.length === 0 &&
      artists.length === 0 &&
      collections.length === 0
    ) {
      setIsLoading(true); // Set loading state to true
    } else {
      setIsLoading(false); // Set loading state to false
    }

    getArtistsData(); // Call the function
    getOwnedCollectionsData(); // Call the function
    getCollectionsData(); // Call the function
  }, []);

  return (
    <View style={[globalStyles.container, styles.container]}>
      {/* Owned Collections Section */}
      <View style={styles.section}>
        <View style={styles.sectionTitleContainer}>
          <Text style={[globalStyles.headingH6Bold, styles.sectionTitle]}>
            Your Tours & Expositions
          </Text>
          <TouchableOpacity
            onPress={() => navigation.navigate("Draft Collections")}
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

        {ownedCollections.length === 0 && !isLoading && (
          <View>
            <Text style={[globalStyles.bodySmallItalic, styles.emptyText]}>
              No owned tours or expositions found
            </Text>
          </View>
        )}

        {/* Display owned collections */}
        <FlatList
          data={ownedCollections.slice(0, 3)}
          renderItem={({ item }) => (
            <BoughtCollectionCard
              id={item.collectionRef._id}
              imageUrl={item.collectionRef.coverImage.filePath}
              title={item.collectionRef.title}
              creator={item.collectionRef.createdBy.username}
              timeLeft={timeLeft[ownedCollections.indexOf(item)]}
              category={item.collectionRef.type}
              onPress={(id) =>
                navigation.navigate("CollectionDetails", {
                  collectionId: id,
                  owned: true,
                })
              }
              style={{ width: 140 }} // Custom styles (46%)
            />
          )}
          keyExtractor={(item) => item._id} // Unique key for each card
          contentContainerStyle={styles.cardsContainer} // Apply container styles
          horizontal // Optional: if you want to display the cards horizontally
          showsHorizontalScrollIndicator={false} // Optional: remove scroll indicator for horizontal list
        />
      </View>

      {/* Artists Section */}
      <View style={styles.section}>
        <View style={styles.sectionTitleContainer}>
          <Text style={[globalStyles.headingH6Bold, styles.sectionTitle]}>
            Top Artists
          </Text>
          <TouchableOpacity
            onPress={() => navigation.navigate("Draft Collections")}
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

        {artists.length === 0 && !isLoading && (
          <View>
            <Text style={[globalStyles.bodySmallItalic, styles.emptyText]}>
              No artists found
            </Text>
          </View>
        )}

        {/* Display owned collections */}
        <FlatList
          data={artists.slice(0, 3)}
          renderItem={({ item }) => (
            <ArtistItem
              id={item._id}
              profileImage={item.profilePicture.filePath}
              username={item.username}
              collectionCount={item.collectionCount}
              onPress={(id) => navigation.navigate("Artist", { artistId: id })}
            />
          )}
          keyExtractor={(item) => item._id} // Unique key for each card
          contentContainerStyle={styles.cardsContainer} // Apply container styles
          horizontal // Optional: if you want to display the cards horizontally
          showsHorizontalScrollIndicator={false} // Optional: remove scroll indicator for horizontal list
        />
      </View>

      {/* Trending Collections Section */}
      <View style={styles.section}>
        <View style={styles.sectionTitleContainer}>
          <Text style={[globalStyles.headingH6Bold, styles.sectionTitle]}>
            Trending Near You
          </Text>
          <TouchableOpacity onPress={() => navigation.navigate("Collections")}>
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
              No collections found
            </Text>
          </View>
        )}

        {/* Display owned collections */}
        <FlatList
          data={collections.slice(0, 3)}
          renderItem={({ item }) => (
            <CollectionListItem
              id={item._id}
              imageUrl={item.coverImage.filePath}
              title={item.title}
              creator={item.createdBy.username}
              category={item.type}
              onPress={(id) =>
                navigation.navigate("CollectionDetails", {
                  collectionId: id,
                  owned: ownedCollections.some(
                    (ownedItem) => ownedItem.collectionRef._id === id
                  ),
                })
              }
            />
          )}
          keyExtractor={(item) => item._id} // Unique key for each card
          contentContainerStyle={styles.cardsContainer} // Apply container styles
          horizontal // Optional: if you want to display the cards horizontally
          showsHorizontalScrollIndicator={false} // Optional: remove scroll indicator for horizontal list
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
    flexDirection: "row",
    gap: 16,
  },
  textColor: {
    color: COLORS.neutral[50],
  },
  emptyText: {
    color: COLORS.neutral[300],
  },
});

export default Home;
