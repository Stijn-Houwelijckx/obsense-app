import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  ActivityIndicator,
  TouchableOpacity,
  Modal,
  Pressable,
  Dimensions,
  StyleSheet,
  ScrollView,
  Alert,
} from "react-native";
import FastImage from "react-native-fast-image";
import SystemNavigationBar from "react-native-system-navigation-bar";

// Import Contexts
import { useActiveCollection } from "../../context/ActiveCollectionContext";

// Import Utils
import {
  getCollectionDetails,
  purchaseCollection,
  apiRequest,
} from "../../utils/api";

// Import Styles
import { globalStyles } from "../../styles/global";
import { COLORS } from "../../styles/theme";

// Import Icons
import {
  LocationPinIcon,
  BoxDashIcon,
  EyeIcon,
  HearthIcon,
  HearthFilledIcon,
  DotsHorizontalIcon,
  XIcon,
} from "../../components/icons";

// Import Components
import {
  DescriptionTextBox,
  Badge,
  CustomButton,
  IconButton,
} from "../../components/UI";

const reportReasons = [
  "I just don’t like it",
  "Inappropriate content",
  "Copyright infringement",
  "Harassment or bullying",
  "Violence, hate or racism",
  "Nudity or sexual activity",
  "Scam, fraud or spam",
  "False information",
];

const screenWidth = Dimensions.get("window").width; // Get screen width
const modalWidth = screenWidth - 32; // Calculate card width

const CollectionDetails = ({ navigation, route }) => {
  const { collectionId, owned } = route.params;
  const [collectionDetailsData, setCollectionDetailsData] = useState([]); // State to store collection data
  const [isLoading, setIsLoading] = useState(true); // State to manage loading state
  const { setActiveCollection } = useActiveCollection();
  const [liked, setLiked] = useState(false); // State to manage liked status
  const [optionsModalVisible, setOptionsModalVisible] = useState(false);
  const [reportModalVisible, setReportModalVisible] = useState(false);

  useEffect(() => {
    const getCollectionDataById = async () => {
      const result = await getCollectionDetails(collectionId);

      if (result.status === "success") {
        // setUser(result.data.data.user); // Set user data
        setCollectionDetailsData(result.data.collection); // Set collection data
        setLiked(result.data.liked); // Set liked status
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

  const handleLike = async () => {
    if (!owned) {
      return;
    }

    setLiked((prevLiked) => !prevLiked); // Toggle liked status
    setCollectionDetailsData((prevData) => ({
      ...prevData,
      likes: prevData.likes + (liked ? -1 : 1), // Update likes count based on current liked status
    }));

    try {
      const result = await apiRequest({
        method: "POST",
        endpoint: `/collections/${collectionId}/like`,
      });

      if (result.status === "success") {
        setLiked(result.data.liked); // Update liked status
        setCollectionDetailsData((prevData) => ({
          ...prevData,
          likes: result.data.likesCount, // Update likes count
        }));
      }
    } catch (error) {
      console.error("Error liking collection:", error); // Log error message
    }
  };

  const handleReportReason = (reason) => {
    setReportModalVisible(false);
    Alert.alert(
      "Report submitted",
      `Reason: ${reason}\n\nThank you for your feedback.`
    );
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
            <IconButton
              icon={DotsHorizontalIcon}
              iconSize={24}
              buttonSize={40}
              onPress={() => setOptionsModalVisible(true)}
              style={styles.optionsButton}
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
              <TouchableOpacity
                onPress={handleLike}
                activeOpacity={owned ? 0.2 : 1}
              >
                {liked && owned ? (
                  <HearthFilledIcon size={20} fill={COLORS.red[500]} />
                ) : (
                  <HearthIcon size={20} stroke={COLORS.neutral[50]} />
                )}
              </TouchableOpacity>
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
              onPress={() => {
                setActiveCollection(collectionDetailsData);
                navigation.navigate("AR", {
                  screen: "ARScreen",
                  params: {
                    collection: collectionDetailsData,
                  },
                });
              }}
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

      {/* Options Modal */}
      <Modal
        visible={optionsModalVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setOptionsModalVisible(false)}
      >
        <Pressable
          style={modalStyles.overlay}
          onPress={() => setOptionsModalVisible(false)}
        >
          <Pressable style={modalStyles.content} onPress={() => {}}>
            <View style={modalStyles.header}>
              <Text style={[globalStyles.headingH6SemiBold, modalStyles.title]}>
                Options
              </Text>
              <TouchableOpacity onPress={() => setOptionsModalVisible(false)}>
                <XIcon size={24} stroke={COLORS.neutral[50]} />
              </TouchableOpacity>
            </View>
            <TouchableOpacity
              style={modalStyles.reportButton}
              onPress={() => {
                setOptionsModalVisible(false);
                setTimeout(() => setReportModalVisible(true), 200);
              }}
            >
              <Text
                style={[globalStyles.bodyMediumRegular, modalStyles.reportText]}
              >
                Report
              </Text>
            </TouchableOpacity>
          </Pressable>
        </Pressable>
      </Modal>

      {/* Report Modal */}
      <Modal
        visible={reportModalVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setReportModalVisible(false)}
      >
        <Pressable
          style={modalStyles.overlay}
          onPress={() => setReportModalVisible(false)}
        >
          <Pressable style={modalStyles.reportContent} onPress={() => {}}>
            <View style={modalStyles.header}>
              <Text style={[globalStyles.headingH6SemiBold, modalStyles.title]}>
                Why are you reporting this artwork?
              </Text>
              <TouchableOpacity onPress={() => setReportModalVisible(false)}>
                <XIcon size={24} stroke={COLORS.neutral[50]} />
              </TouchableOpacity>
            </View>
            <Text
              style={[globalStyles.bodyMediumRegular, modalStyles.description]}
            >
              Your report is anonymous. Please select a reason below:
            </Text>
            {reportReasons.map((reason) => (
              <TouchableOpacity
                key={reason}
                style={modalStyles.reasonButton}
                onPress={() => handleReportReason(reason)}
              >
                <Text
                  style={[
                    globalStyles.bodyMediumRegular,
                    modalStyles.reasonText,
                  ]}
                >
                  {reason}
                </Text>
              </TouchableOpacity>
            ))}
          </Pressable>
        </Pressable>
      </Modal>
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
  optionsButton: {
    position: "absolute",
    zIndex: 1,
    top: 12,
    right: 12,
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

const modalStyles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.4)",
    justifyContent: "center",
    alignItems: "center",
  },
  content: {
    backgroundColor: COLORS.primaryNeutral[700],
    borderRadius: 12,
    padding: 24,
    minWidth: 220,
    alignItems: "flex-start",
    elevation: 5,
    maxWidth: modalWidth,
  },
  reportContent: {
    backgroundColor: COLORS.primaryNeutral[700],
    borderRadius: 12,
    padding: 24,
    minWidth: 280,
    alignItems: "flex-start",
    elevation: 5,
    maxWidth: modalWidth,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
    marginBottom: 16,
  },
  title: {
    color: COLORS.neutral[50],
    flex: 1,
    marginRight: 8,
  },
  reportButton: {
    paddingVertical: 8,
    paddingHorizontal: 0,
  },
  reportText: {
    color: COLORS.error[500],
  },
  description: {
    color: COLORS.neutral[300],
    marginBottom: 16,
  },
  reasonButton: {
    paddingVertical: 10,
    width: "100%",
  },
  reasonText: {
    color: COLORS.neutral[50],
  },
});

export default CollectionDetails;
