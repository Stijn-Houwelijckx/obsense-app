import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  ActivityIndicator,
  StyleSheet,
  ScrollView,
} from "react-native";
import FastImage from "react-native-fast-image";

// Import Utils
import { getArtistDetails, getOwnedCollections } from "../../utils/api";

// Import Styles
import { globalStyles } from "../../styles/global";
import { COLORS } from "../../styles/theme";

// Import Icons

// Import Components
import { CollectionListItem } from "../../components/UI";

const ArtistProfile = ({ navigation, route }) => {
  const { artistId } = route.params;
  const [artist, setArtist] = useState([]); // State to store artist data
  const [isLoading, setIsLoading] = useState(true); // State to manage loading state
  const [totalLikes, setTotalLikes] = useState(0); // State to store total likes
  const [totalViews, setTotalViews] = useState(0); // State to store total views
  const [totalCollections, setTotalCollections] = useState(0); // State to store total collections
  const [ownedCollections, setOwnedCollections] = useState([]); // State to store owned collection data

  useEffect(() => {
    const getArtistById = async () => {
      const result = await getArtistDetails(artistId); // Get artist data by ID

      if (result.status === "success") {
        // setUser(result.data.data.user); // Set user data
        setArtist(result.data.artist); // Set artist data
        // console.log(result.data.artist); // Log artist data

        // Set total likes, views from all collections
        const totalLikes = result.data.artist.collections.reduce(
          (acc, collection) => acc + collection.likes,
          0
        );
        setTotalLikes(totalLikes);

        const totalViews = result.data.artist.collections.reduce(
          (acc, collection) => acc + collection.views,
          0
        );
        setTotalViews(totalViews);

        // Set total collections
        setTotalCollections(result.data.artist.collections.length);
      } else {
        console.log("Error getting artist data:", result.message); // Log error message
      }

      setIsLoading(false); // Set loading state to false
    };

    const getOwnedCollectionsData = async () => {
      const result = await getOwnedCollections();

      if (result.status === "success") {
        setOwnedCollections(result.data.purchases); // Set owned collection data
        console.log(result.data.purchases); // Log owned collection data
      } else {
        console.log("Error getting owned collection data:", result.message); // Log error message
      }
    };

    getOwnedCollectionsData(); // Call the function
    getArtistById(); // Call the function
  }, []);

  if (isLoading) {
    return (
      <View style={globalStyles.container}>
        <ActivityIndicator size="large" color={COLORS.primary[500]} />
      </View>
    );
  }

  return (
    <View style={[globalStyles.container, styles.container]}>
      <ScrollView contentContainerStyle={styles.container}>
        <View style={styles.artistSection}>
          <View style={styles.artistInfo}>
            <FastImage
              style={styles.image}
              source={{ uri: artist.profilePicture.filePath }}
            />
            <Text style={[globalStyles.headingH6Bold, styles.text]}>
              {artist.username}
            </Text>
            <Text style={[globalStyles.bodyMediumRegular, styles.text]}>
              x monthly views
            </Text>
          </View>

          <View style={styles.collectionStats}>
            <View style={styles.statContainer}>
              <Text style={[globalStyles.headingH6Bold, styles.text]}>
                {totalCollections}
              </Text>
              <Text style={[globalStyles.bodyMediumRegular, styles.text]}>
                Collections
              </Text>
            </View>
            <View style={styles.statContainer}>
              <Text style={[globalStyles.headingH6Bold, styles.text]}>
                {totalLikes}
              </Text>
              <Text style={[globalStyles.bodyMediumRegular, styles.text]}>
                Likes
              </Text>
            </View>
            <View style={styles.statContainer}>
              <Text style={[globalStyles.headingH6Bold, styles.text]}>
                {totalViews}
              </Text>
              <Text style={[globalStyles.bodyMediumRegular, styles.text]}>
                Views
              </Text>
            </View>
          </View>
        </View>

        <View style={styles.collectionsSection}>
          <View style={styles.sectionTitleContainer}>
            <Text style={[globalStyles.headingH6Bold, styles.sectionTitle]}>
              Collections
            </Text>
          </View>

          <View style={styles.cardsContainer}>
            {artist.collections.map((item) => (
              <CollectionListItem
                key={item._id} // Unique key for each item
                id={item._id}
                imageUrl={item.coverImage.filePath}
                title={item.title}
                creator={artist.username}
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
            ))}
          </View>
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    gap: 32,
    justifyContent: "",
    alignItems: "",
  },
  artistSection: {
    width: "100%",
    marginTop: 4,
    gap: 16,

    justifyContent: "center",
    alignItems: "center",

    paddingHorizontal: 16,
    paddingTop: 32,
    paddingBottom: 16,

    borderRadius: 20,

    backgroundColor: COLORS.primaryNeutral[800],
  },
  image: {
    width: 120,
    aspectRatio: 1,
    borderRadius: 9999,
  },
  artistInfo: {
    alignItems: "center",
    gap: 8,
  },
  collectionStats: {
    width: "100%",
    flexDirection: "row",
    gap: 20,

    justifyContent: "space-around",
    alignItems: "center",

    padding: 16,
    borderRadius: 20,

    backgroundColor: COLORS.primaryNeutral[700],
  },
  statContainer: {
    width: "100%",
    alignItems: "center",
    gap: 4,
  },
  text: {
    color: COLORS.neutral[50],
  },
  collectionsSection: {
    width: "100%",
    gap: 16,
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
  cardsContainer: {
    flexDirection: "column",
    gap: 16,
  },
});

export default ArtistProfile;
