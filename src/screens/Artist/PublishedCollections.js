import React, { useState, useEffect } from "react";
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
import { getCollectionsForCurrentArtist } from "../../utils/api";

// Import Styles
import { globalStyles } from "../../styles/global";
import { COLORS } from "../../styles/theme";

// Import Icons
import ChevronRightIcon from "../../components/icons/ChevronRightIcon";

// Import Components
import ArtistCollectionCard from "../../components/UI/ArtistCollectionCard";

const PublishedCollections = ({ navigation }) => {
  const [collectionData, setCollectionData] = useState([]); // State to store collection data
  const [isLoading, setIsLoading] = useState(true); // State to manage loading state

  useEffect(() => {
    const getCollectionData = async () => {
      const result = await getCollectionsForCurrentArtist();

      if (result.status === "success") {
        // setUser(result.data.data.user); // Set user data
        setCollectionData(result.data.collections); // Set collection data
        console.log(result.data.collections); // Log collection data
      } else {
        console.log("Error getting user data:", result.message); // Log error message
      }

      setIsLoading(false); // Set loading state to false
    };

    getCollectionData(); // Call the function
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
      {/* Drafts Section */}
      <View style={styles.section}>
        <View style={styles.sectionTitleContainer}>
          <Text style={[globalStyles.headingH6Bold, styles.sectionTitle]}>
            Tours
          </Text>
        </View>
        {/* If empty */}
        {collectionData.filter(
          (item) => item.isPublished && item.type === "tour"
        ).length === 0 && (
          <Text style={[globalStyles.bodyText, styles.emptyText]}>
            No tours found.
          </Text>
        )}
        {/* If not empty */}
        <FlatList
          data={collectionData.filter(
            (item) => item.isPublished && item.type === "tour"
          )}
          renderItem={({ item }) => (
            <ArtistCollectionCard
              id={item._id}
              imageUrl={item.coverImage.filePath}
              title={item.title}
              published={item.isPublished}
              category={item.type}
              onPress={(id) =>
                navigation.navigate("CollectionDetails", { collectionId: id })
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

      {/* Published Section */}
      <View style={styles.section}>
        <View style={styles.sectionTitleContainer}>
          <Text style={[globalStyles.headingH6Bold, styles.sectionTitle]}>
            Expositions
          </Text>
        </View>
        {/* If empty */}
        {collectionData.filter(
          (item) => item.isPublished && item.type === "exposition"
        ).length === 0 && (
          <Text style={[globalStyles.bodyText, styles.emptyText]}>
            No expositions found.
          </Text>
        )}
        {/* If not empty */}
        <FlatList
          data={collectionData.filter(
            (item) => item.isPublished && item.type === "exposition"
          )}
          renderItem={({ item }) => (
            <ArtistCollectionCard
              id={item._id}
              imageUrl={item.coverImage.filePath}
              title={item.title}
              published={item.isPublished}
              category={item.type}
              onPress={(id) =>
                navigation.navigate("CollectionDetails", { collectionId: id })
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
  emptyText: {
    color: COLORS.neutral[300],
    fontStyle: "italic",
  },
});

export default PublishedCollections;
