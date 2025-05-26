import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  ActivityIndicator,
  Dimensions,
  StyleSheet,
  ScrollView,
  Alert,
} from "react-native";
import FastImage from "react-native-fast-image";

// Import Utils
import { apiRequest } from "../../utils/api";

// Import Styles
import { globalStyles } from "../../styles/global";
import { COLORS } from "../../styles/theme";

// Import Icons
import { ExclamationTriangleIcon } from "../../components/icons";

// Import Components
import { Badge, CustomButton, WalletCard } from "../../components/UI";

const Payment = ({ navigation, route }) => {
  const { collection } = route.params;

  const [user, setUser] = useState(null); // State to store user data
  const [isLoading, setIsLoading] = useState(true); // State to manage loading state
  const [message, setMessage] = useState(""); // State to manage message
  const [error, setError] = useState(""); // State to manage error

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const result = await apiRequest({
          method: "GET",
          endpoint: "/users/me",
        });
        if (result.status === "success") {
          setUser(result.data.user);
        } else {
          console.error("Error fetching user data:", result.message);
        }
      } catch (err) {
        console.error("Error fetching user data:", err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchUserData();
  }, []);

  const handlePurchaseConfirmation = () => {
    Alert.alert(
      "Confirm Purchase",
      `Are you sure you want to purchase ${collection.title} for ${collection.price} tokens?`,
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
      //   const result = await purchaseCollection(collectionId);
      const result = await apiRequest({
        method: "POST",
        endpoint: `/purchases/${collection._id}`,
      });
      if (result.status === "success") {
        console.log("Purchase successful:", result.data); // Log purchase data
        navigation.reset({
          index: 0,
          routes: [{ name: "Home" }],
        });
      } else if (
        result.status === "fail" &&
        result.code === 400 &&
        result.data.tokens
      ) {
        setError(
          result.data.tokens + "\nPlease top up your wallet in settings."
        );
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
        <WalletCard tokens={user.tokens} conversionRate="0.05" />
        <View style={styles.section}>
          <FastImage
            style={styles.image}
            source={{ uri: collection.coverImage.filePath }}
            resizeMode="cover"
          />
          <View style={styles.textContainer}>
            <Text
              style={[globalStyles.headingH6Bold, styles.text]}
              numberOfLines={2}
              ellipsizeMode="tail"
            >
              {collection.title}
            </Text>
            <Badge
              size="large"
              shape="rounded"
              type="primary"
              styleType="filled"
              text={collection.type}
            />
            <Text
              style={[globalStyles.headingH5Bold, styles.text]}
              numberOfLines={2}
              ellipsizeMode="tail"
            >
              {collection.price} Tokens
            </Text>
          </View>
        </View>

        <View style={styles.disclaimerContainer}>
          <View style={styles.iconContainer}>
            <ExclamationTriangleIcon size={24} stroke={COLORS.error[500]} />
          </View>
          <Text style={[globalStyles.bodySmallRegular, styles.text]}>
            Purchased expositions will remain accessible in your account for 30
            days from the date of purchase. After this period, the tour will
            expire and no longer be available.
          </Text>
        </View>
        {error ? (
          <Text
            style={[
              globalStyles.bodySmallRegular,
              { color: COLORS.error[500] },
            ]}
          >
            {error}
          </Text>
        ) : null}
        <CustomButton
          variant="filled"
          size="large"
          title="Confirm Payment"
          style={styles.button}
          onPress={handlePurchaseConfirmation}
        />
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    gap: 20,
  },
  section: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 16,
  },
  image: {
    width: 140,
    aspectRatio: 1,
    borderRadius: 16,
  },
  textContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "flex-start",
    gap: 8,
  },
  text: {
    color: COLORS.neutral[50],
  },
  disclaimerContainer: {
    marginTop: 32,
    backgroundColor: COLORS.primaryNeutral[700],
    padding: 16,
    borderRadius: 16,
    position: "relative",
  },
  iconContainer: {
    position: "absolute",
    top: -12,
    left: 16,
  },
});

export default Payment;
