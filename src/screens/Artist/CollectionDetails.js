import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  FlatList,
  ActivityIndicator,
  StyleSheet,
  ScrollView,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import FastImage from "react-native-fast-image";

// Import Contexts
import { useActiveCollection } from "../../context/ActiveCollectionContext";

// Import Utils
import { getArtistCollectionDetails } from "../../utils/api";

// Import Styles
import { globalStyles } from "../../styles/global";
import { COLORS } from "../../styles/theme";

// Import Icons
import LocationPinIcon from "../../components/icons/LocationPinIcon";
import BoxDashIcon from "../../components/icons/BoxDashIcon";
import EyeIcon from "../../components/icons/EyeIcon";
import HearthIcon from "../../components/icons/HearthIcon";

// Import Components
import DescriptionTextBox from "../../components/UI/DescriptionTextBox";
import Badge from "../../components/UI/Badge";
import ObjectCard from "../../components/UI/ObjectCard";
import CustomButton from "../../components/UI/CustomButton";

const CollectionDetails = ({ navigation, route }) => {
  const { collectionId } = route.params;
  const [collectionDetailsData, setCollectionDetailsData] = useState([]); // State to store collection data
  const [isLoading, setIsLoading] = useState(true); // State to manage loading state
  const { setActiveCollection } = useActiveCollection();

  useEffect(() => {
    const getCollectionDataById = async () => {
      const result = await getArtistCollectionDetails(collectionId);

      if (result.status === "success") {
        // setUser(result.data.data.user); // Set user data
        setCollectionDetailsData(result.data.collection); // Set collection data
        // console.log("========================="); // Log collection data
        // console.log(result.data.collection); // Log collection data
      } else {
        console.log("Error getting user data:", result.message); // Log error message
      }

      setIsLoading(false); // Set loading state to false
    };

    getCollectionDataById(); // Call the function
  }, []);

  useEffect(() => {
    if (collectionDetailsData?.title) {
      navigation.setParams({ title: collectionDetailsData.title });
    }
  }, [collectionDetailsData, navigation]);

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
        <View style={styles.section}>
          <View style={styles.tourInfo}>
            <View style={styles.rowContainer}>
              <LocationPinIcon size={20} stroke={COLORS.neutral[50]} />
              <Text style={[globalStyles.bodyMediumRegular, styles.text]}>
                {collectionDetailsData.city}
              </Text>
            </View>
            <View style={styles.rowContainer}>
              <BoxDashIcon size={20} stroke={COLORS.neutral[50]} />
              <Text style={[globalStyles.bodyMediumRegular, styles.text]}>
                {collectionDetailsData.objects.length}{" "}
                {collectionDetailsData.objects.length === 1
                  ? "Artwork"
                  : "Artworks"}
              </Text>
            </View>
          </View>

          <View style={styles.imageContainer}>
            <Badge
              size="large"
              shape="rounded"
              type="primary"
              styleType="filled"
              text={collectionDetailsData.type}
              style={styles.badgeType}
            />
            <FastImage
              style={styles.image}
              source={{ uri: collectionDetailsData.coverImage.filePath }}
            />
            <Badge
              size="large"
              shape="rounded"
              type="primary"
              styleType="filled"
              text={collectionDetailsData.isPublished ? "Published" : "Draft"}
              style={styles.badgePublished}
            />
          </View>

          <View style={styles.tourStats}>
            <View style={styles.rowContainer}>
              <EyeIcon size={20} stroke={COLORS.neutral[50]} />
              <Text style={[globalStyles.bodyMediumRegular, styles.text]}>
                {collectionDetailsData.views.length}
              </Text>
            </View>
            <View style={styles.rowContainer}>
              <HearthIcon size={20} stroke={COLORS.neutral[50]} />
              <Text style={[globalStyles.bodyMediumRegular, styles.text]}>
                {collectionDetailsData.likes.length}
              </Text>
            </View>
          </View>
          <DescriptionTextBox description={collectionDetailsData.description} />
        </View>
        <View style={[styles.section, { gap: 16 }]}>
          <View style={styles.rowContainer}>
            <BoxDashIcon size={20} stroke={COLORS.neutral[50]} />
            <Text style={[globalStyles.bodyMediumRegular, styles.text]}>
              {collectionDetailsData.objects.length}{" "}
              {collectionDetailsData.objects.length === 1
                ? "Artwork"
                : "Artworks"}
            </Text>
          </View>

          {collectionDetailsData.objects.length > 0 ? (
            <FlatList
              data={collectionDetailsData.objects}
              renderItem={({ item }) => (
                <ObjectCard title={item.title} isPlaced={false} />
              )}
              keyExtractor={(item) => item._id}
              contentContainerStyle={styles.cardsContainer}
              horizontal
              showsHorizontalScrollIndicator={false}
            />
          ) : (
            <Text style={[globalStyles.bodyMediumRegular, styles.emptyText]}>
              No Artworks Found
            </Text>
          )}
        </View>
      </ScrollView>

      <View style={styles.bottomButtonContainer}>
        <CustomButton
          variant="filled"
          size="large"
          title={`Edit ${collectionDetailsData.type}`}
          onPress={() => {
            setActiveCollection(collectionDetailsData);
            navigation.navigate("AR", {
              screen: "ARScreen",
              params: {
                collection: collectionDetailsData,
              },
            });
          }}
          style={{}}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    justifyContent: "flex-start",
    alignItems: "flex-start",
    gap: 32,
  },
  section: {
    width: "100%",
    marginTop: 4,
    gap: 8,
    justifyContent: "flex-start",
    alignItems: "flex-start",
  },
  imageContainer: {
    position: "relative",
  },
  image: {
    width: "100%",
    aspectRatio: 1,
    borderRadius: 8,
  },
  badgeType: {
    position: "absolute",
    zIndex: 1,
    top: 16,
    left: 16,
  },
  badgePublished: {
    position: "absolute",
    zIndex: 1,
    bottom: 16,
    right: 16,
  },
  tourInfo: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
    gap: 20,
  },
  tourStats: {
    flexDirection: "row",
    gap: 20,
  },
  rowContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  text: {
    color: COLORS.neutral[50],
  },
  emptyText: {
    color: COLORS.neutral[500],
    fontStyle: "italic",
  },
  cardsContainer: {
    width: "100%",
    flexDirection: "col",
    gap: 8,
  },
  bottomButtonContainer: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    padding: 16,
    backgroundColor: "transparent",
  },
});

export default CollectionDetails;
