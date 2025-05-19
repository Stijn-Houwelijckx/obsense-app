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

// Import Utils
import { getCollectionsForCurrentArtist } from "../../utils/api";

// Import Styles
import { globalStyles } from "../../styles/global";
import { COLORS } from "../../styles/theme";

// Import Icons
import ChevronRightIcon from "../../components/icons/ChevronRightIcon";

// Import Components
import ArtistCollectionCard from "../../components/UI/ArtistCollectionCard";

const Home = ({ navigation }) => {
  const [collectionData, setCollectionData] = useState([]); // State to store collection data
  const [isLoading, setIsLoading] = useState(true); // State to manage loading state

  useEffect(() => {
    const getCollectionData = async () => {
      const result = await getCollectionsForCurrentArtist();

      if (result.status === "success") {
        // setUser(result.data.data.user); // Set user data
        setCollectionData(result.data.collections); // Set collection data
        // console.log(result.data.collections); // Log collection data
      } else {
        console.log("Error getting collection data:", result.message); // Log error message
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

  // Check if collectionData is empty
  if (collectionData.length === 0) {
    return (
      <View style={globalStyles.container}>
        <Image source={require("../../../assets/images/RocketImage.png")} />
        <Text style={[globalStyles.headingH5Bold, styles.textColor]}>
          No collections yet
        </Text>
        <Text
          style={[
            globalStyles.bodyMediumRegular,
            styles.textColor,
            { textAlign: "center" },
          ]}
        >
          Log in to your dashboard to create tours or expositions. Created tours
          and expositions will appear here.
        </Text>
      </View>
    );
  }

  return (
    <View style={[globalStyles.container, styles.container]}>
      {/* Drafts Section */}
      <View style={styles.section}>
        <View style={styles.sectionTitleContainer}>
          <Text style={[globalStyles.headingH6Bold, styles.sectionTitle]}>
            Drafts
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
        <FlatList
          data={collectionData.filter((item) => !item.isPublished).slice(0, 3)}
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
            Published
          </Text>
          <TouchableOpacity
            onPress={() => navigation.navigate("Published Collections")}
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
        <FlatList
          data={collectionData.filter((item) => item.isPublished).slice(0, 3)}
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
  textColor: {
    color: COLORS.neutral[50],
  },
});

export default Home;
