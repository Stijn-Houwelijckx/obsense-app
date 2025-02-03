import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  FlatList,
  StyleSheet,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";

// Import Styles
import { globalStyles } from "../../styles/global";
import { COLORS } from "../../styles/theme";

// Import Icons
import ChevronRightIcon from "../../components/icons/ChevronRightIcon";

// Import Components
import ArtistCard from "../../components/UI/ArtistCard";

const Home = ({ navigation }) => {
  const [userId, setUserId] = useState(null);

  const collectionData = [
    {
      id: "65a7f92b8e4f9c0012345678",
      imageUrl: require("../../../assets/collectionImages/SpookyScarySkeleton.jpg"),
      title: "Spooky Scary Skeleton",
      published: false,
      category: "Exposition",
    },
    {
      id: "65a7f92b8e4f9c0012345679",
      imageUrl: require("../../../assets/collectionImages/Monolith.png"),
      title: "Monolith",
      published: true,
      category: "Tour",
    },
    {
      id: "65a7f92b8e4f9c0012345680",
      imageUrl: require("../../../assets/collectionImages/DeliveryDragon.jpg"),
      title: "Delivery Dragon",
      published: true,
      category: "Tour",
    },
    {
      id: "65a7f92b8e4f9c0012345681",
      imageUrl: require("../../../assets/collectionImages/EifelTower.png"),
      title: "Eifel Tower",
      published: true,
      category: "Exposition",
    },
    // Add more items as needed
  ];

  useEffect(() => {
    const getUserId = async () => {
      try {
        const storedUserId = await AsyncStorage.getItem("userId");
        if (storedUserId !== null) {
          setUserId(storedUserId);
        } else {
          console.log("UserId not found");
        }
      } catch (error) {
        console.error("Error retrieving userId from AsyncStorage", error);
      }
    };

    getUserId();
  }, []);

  return (
    <View style={[globalStyles.container, styles.container]}>
      {/* Drafts Section */}
      <View style={styles.section}>
        <View style={styles.sectionTitleContainer}>
          <Text style={[globalStyles.headingH6Bold, styles.sectionTitle]}>
            Drafts
          </Text>
          <TouchableOpacity onPress={() => console.log("Go to drafts")}>
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
          data={collectionData.filter((item) => !item.published)}
          renderItem={({ item }) => (
            <ArtistCard
              id={item.id}
              imageUrl={item.imageUrl}
              title={item.title}
              published={item.published}
              category={item.category}
              onPress={(id) => console.log("Go to details of", id)}
              style={{ width: 140 }} // Custom styles (46%)
            />
          )}
          keyExtractor={(item) => item.id} // Unique key for each card
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
          <TouchableOpacity onPress={() => console.log("Go to published")}>
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
          data={collectionData.filter((item) => item.published)}
          renderItem={({ item }) => (
            <ArtistCard
              id={item.id}
              imageUrl={item.imageUrl}
              title={item.title}
              published={item.published}
              category={item.category}
              onPress={(id) => console.log("Go to details of", id)}
              style={{ width: 140 }} // Custom styles (46%)
            />
          )}
          keyExtractor={(item) => item.id} // Unique key for each card
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
});

export default Home;
