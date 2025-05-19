import React, { useState, useEffect } from "react";
import { Dimensions } from "react-native";
import {
  View,
  Text,
  FlatList,
  ActivityIndicator,
  StyleSheet,
} from "react-native";

// Import Utils
import { getOwnedCollections } from "../../utils/api";

// Import Styles
import { globalStyles } from "../../styles/global";
import { COLORS } from "../../styles/theme";

// Import Components
import { BoughtCollectionCard } from "../../components/UI";

const PurchasedCollections = ({ navigation }) => {
  const [collections, setCollections] = useState([]); // State to store collection data
  const [isLoading, setIsLoading] = useState(true); // State to manage loading state
  const [timeLeft, setTimeLeft] = useState([]); // State to store time left for each collection

  const screenWidth = Dimensions.get("window").width; // Get screen width
  const cardWidth = (screenWidth - 48) / 2; // Calculate card width

  useEffect(() => {
    // Function to get the owned collections data
    const getCollections = async () => {
      const result = await getOwnedCollections();

      if (result.status === "success") {
        // setUser(result.data.data.user); // Set user data
        setCollections(result.data.purchases); // Set collection data

        // Set loading state to false
        setIsLoading(false);

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

    getCollections(); // Call the function
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
      {/* Collections Section */}
      <View style={styles.section}>
        <View style={styles.sectionTitleContainer}>
          <Text style={[globalStyles.headingH6Bold, styles.sectionTitle]}>
            Tours & Expositions
          </Text>
        </View>

        {collections.length === 0 && !isLoading && (
          <View>
            <Text style={[globalStyles.bodySmallItalic, styles.emptyText]}>
              No owned tours or expositions found
            </Text>
          </View>
        )}

        {/* Display owned collections */}
        <FlatList
          data={collections}
          renderItem={({ item }) => (
            <BoughtCollectionCard
              id={item.collectionRef._id}
              imageUrl={item.collectionRef.coverImage.filePath}
              title={item.collectionRef.title}
              creator={item.collectionRef.createdBy.username}
              timeLeft={timeLeft[collections.indexOf(item)]}
              category={item.collectionRef.type}
              onPress={(id) =>
                navigation.navigate("CollectionDetails", {
                  collectionId: id,
                  owned: true,
                })
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

export default PurchasedCollections;
