import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  FlatList,
  ActivityIndicator,
  StyleSheet,
  ScrollView,
  Alert,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import FastImage from "react-native-fast-image";

// Import Utils
import { getCollectionDetails, purchaseCollection } from "../../utils/api";

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
import CustomButton from "../../components/UI/CustomButton";

const CollectionDetails = ({ navigation, route }) => {
  const { collectionId, owned } = route.params;
  const [collectionDetailsData, setCollectionDetailsData] = useState([]); // State to store collection data
  const [isLoading, setIsLoading] = useState(true); // State to manage loading state

  useEffect(() => {
    const getCollectionDataById = async () => {
      const result = await getCollectionDetails(collectionId);

      if (result.status === "success") {
        // setUser(result.data.data.user); // Set user data
        setCollectionDetailsData(result.data.collection); // Set collection data
        console.log(result.data.collection); // Log collection data
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

  const handlePurchaseConfirmation = () => {
    Alert.alert(
      "Confirm Purchase",
      `Are you sure you want to purchase ${collectionDetailsData.title} for ${collectionDetailsData.price} tokens?`,
      [
        {
          text: "Cancel",
          onPress: () => console.log("Purchase cancelled"),
          style: "cancel",
        },
        {
          text: "OK",
          onPress: () => handlePurchase(), // Call purchase function
        },
      ]
    );
  };

  const handlePurchase = async () => {
    try {
      const result = await purchaseCollection(collectionId);
      if (result.status === "success") {
        console.log("Purchase successful:", result.data); // Log purchase data
        navigation.reset({
          index: 0,
          routes: [{ name: "Home" }],
        });
      } else {
        console.log("Error purchasing collection:", result.message); // Log error message
      }
    } catch (error) {
      console.error("Error during purchase:", error); // Log error message
    }
  };

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
                {collectionDetailsData.objects}{" "}
                {collectionDetailsData.objects === 1 ? "Artwork" : "Artworks"}
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
            {!owned && (
              <Badge
                size="large"
                shape="rounded"
                type="primary"
                styleType="filled"
                text={`Price: ${collectionDetailsData.price} tokens`}
                style={styles.badgePrice}
              />
            )}
          </View>

          <View style={styles.tourStats}>
            <View style={styles.rowContainer}>
              <EyeIcon size={20} stroke={COLORS.neutral[50]} />
              <Text style={[globalStyles.bodyMediumRegular, styles.text]}>
                {collectionDetailsData.views}
              </Text>
            </View>
            <View style={styles.rowContainer}>
              <HearthIcon size={20} stroke={COLORS.neutral[50]} />
              <Text style={[globalStyles.bodyMediumRegular, styles.text]}>
                {collectionDetailsData.likes}
              </Text>
            </View>
          </View>
          <DescriptionTextBox description={collectionDetailsData.description} />
          {owned ? (
            <CustomButton
              variant="filled"
              size="large"
              title={`Start ${collectionDetailsData.type}`}
              onPress={() => console.log("Start button pressed")}
              style={{ width: "100%" }}
            />
          ) : (
            <CustomButton
              variant="filled"
              size="large"
              title={`Buy ${collectionDetailsData.type} - ${collectionDetailsData.price} tokens`}
              onPress={handlePurchaseConfirmation}
              style={{ width: "100%" }}
            />
          )}
        </View>
      </ScrollView>
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
  badgePrice: {
    position: "absolute",
    zIndex: 1,
    bottom: 16,
    left: 16,
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
});

export default CollectionDetails;
