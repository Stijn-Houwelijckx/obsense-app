import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  ActivityIndicator,
  StyleSheet,
  ScrollView,
  TouchableWithoutFeedback,
  Keyboard,
  Alert,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import FastImage from "react-native-fast-image";
import { launchImageLibrary } from "react-native-image-picker";

import { useActiveCollection } from "../../../context/ActiveCollectionContext";

// Import Utils
import {
  getCurrentUser,
  updateCurrentUser,
  updateCurrentUserProfilePicture,
  deleteCurrentUserAccount,
} from "../../../utils/api";

// Import Styles
import { globalStyles } from "../../../styles/global";
import { COLORS } from "../../../styles/theme";

// Import Icons
import PencilSquareIcon from "../../../components/icons/PencilSquareIcon";

// Custom Components
import { InputField, CustomButton, IconButton } from "../../../components/UI";

const AccountSettings = ({ navigation, handleAuthChangeSuccess }) => {
  const { clearActiveCollection } = useActiveCollection();

  const [user, setUser] = useState(null); // State to store user data
  const [isLoading, setIsLoading] = useState(true); // State to manage loading state
  const [error, setError] = useState(""); // State to manage error
  const [message, setMessage] = useState(""); // State to manage message

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");

  useEffect(() => {
    const getUser = async () => {
      const result = await getCurrentUser();

      if (result.status === "success") {
        setUser(result.data.user); // Set user data

        setFirstName(result.data.user.firstName); // Set first name
        setLastName(result.data.user.lastName); // Set last name

        setUsername(result.data.user.username); // Set username

        setEmail(result.data.user.email); // Set email
      } else {
        console.log("Error getting user data:", result.message); // Log error message
      }

      setIsLoading(false); // Set loading state to false
    };

    getUser(); // Call the function
  }, []);

  const handleSaveChanges = async () => {
    const updatedUser = {
      user: {
        firstName,
        lastName,
        username,
        email,
      },
    };

    const result = await updateCurrentUser(updatedUser);
    if (result.status === "success") {
      setUser(result.data.user); // Update user data
      console.log("User updated successfully:", result.data.user); // Log success message

      setError(""); // Reset error state
      setMessage("Saved"); // Set success message

      // Clear the message after 2 seconds
      setTimeout(() => {
        setMessage("");
      }, 2000);
    } else {
      console.log("Error updating user data:", result.message); // Log error message
      setError(result.message); // Set error message
    }
  };

  const handleImagePicker = () => {
    launchImageLibrary(
      {
        mediaType: "photo",
        maxWidth: 300,
        maxHeight: 300,
        quality: 0.8,
      },
      (response) => {
        if (response.didCancel) {
          console.log("User cancelled image picker");
        } else if (response.errorCode) {
          console.log("Image picker error:", response.errorMessage);
        } else {
          const selectedImage = response.assets[0].uri;
          console.log("Selected image:", selectedImage); // Log selected image URI

          // Update the profile picture using the API

          const formData = new FormData();
          formData.append("profilePicture", {
            uri: selectedImage,
            type: response.assets[0].type,
            name: response.assets[0].fileName,
          });

          updateCurrentUserProfilePicture(formData)
            .then((result) => {
              if (result.status === "success") {
                setUser(result.data.user); // Update user data

                console.log(
                  "Profile picture updated successfully:",
                  result.data.user
                ); // Log success message

                setMessage("Image updated"); // Set success message

                // Clear the message after 2 seconds
                setTimeout(() => {
                  setMessage("");
                }, 2000);
              } else {
                console.log("Error updating profile picture:", result.message); // Log error message
              }
            })
            .catch((error) => {
              console.log("Error updating profile picture:", error.message); // Log error message
            });
        }
      }
    );
  };

  const handleDeleteAccountConfirmation = () => {
    Alert.alert(
      "Delete Account",
      "Are you sure you want to delete your account? This action cannot be undone.",

      [
        {
          text: "Cancel",
          onPress: () => console.log("Cancel Pressed"),
          style: "cancel",
        },
        {
          text: "Delete",
          onPress: () => handleDeleteAccount(), // Call the delete account function
          style: "destructive",
        },
      ],
      { cancelable: true } // Allow canceling the alert
    );
  };

  const handleDeleteAccount = () => {
    deleteCurrentUserAccount()
      .then(async (result) => {
        if (result.status === "success") {
          console.log("Account deleted successfully"); // Log success message

          // Remove user-related data from AsyncStorage
          await AsyncStorage.removeItem("userToken");
          await AsyncStorage.removeItem("userId");
          await AsyncStorage.removeItem("isArtist");
          await AsyncStorage.removeItem("selectedRole");
          await AsyncStorage.clear(); // Clear all AsyncStorage data

          // Clear the active AR collection
          clearActiveCollection();

          // Trigger re-check in AppNavigator
          handleAuthChangeSuccess(); // This will notify AppNavigator to update
        } else {
          console.log("Error deleting account:", result.message); // Log error message
        }
      })
      .catch((error) => {
        console.log("Error deleting account:", error.message); // Log error message
      });
  };

  if (isLoading) {
    return (
      <View style={globalStyles.container}>
        <ActivityIndicator size="large" color={COLORS.primary[500]} />
      </View>
    );
  }

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <View style={[globalStyles.container, styles.container]}>
        <ScrollView contentContainerStyle={styles.container}>
          <View style={styles.profileHeader}>
            <View style={styles.profilePictureContainer}>
              <FastImage
                source={
                  user?.profilePicture?.filePath
                    ? { uri: user.profilePicture.filePath } // Use the URI if it exists
                    : require("../../../../assets/profileImages/Default.jpg") // Fallback to Default.jpg
                }
                style={styles.profilePicture}
              />

              <IconButton
                icon={PencilSquareIcon}
                onPress={() => {
                  handleImagePicker(); // Open image picker
                }}
                buttonSize={48}
                iconSize={24}
                iconColor={COLORS.neutral[950]}
                style={styles.editIconButton}
              />
            </View>
            <Text style={[globalStyles.headingH6Medium, styles.profileName]}>
              {user.firstName} {user.lastName}
            </Text>
            <Text style={[globalStyles.bodyMediumRegular, styles.profileEmail]}>
              {user.email}
            </Text>
          </View>
          <View style={styles.formContainer}>
            <View style={[styles.fieldsContainer]}>
              <InputField
                label="First Name"
                placeholder="First Name"
                value={firstName}
                onChangeText={setFirstName}
                style={styles.inputField}
              />
              <InputField
                label="Last Name"
                placeholder="Last Name"
                value={lastName}
                onChangeText={setLastName}
                style={styles.inputField}
              />
            </View>
            <View style={styles.fieldsContainer}>
              <InputField
                label="Username"
                placeholder="Username"
                value={username}
                onChangeText={setUsername}
              />
            </View>
            <View style={styles.fieldsContainer}>
              <InputField
                label="Email Address"
                placeholder="Email Address"
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
              />
            </View>
            {error && (
              <Text
                style={[
                  globalStyles.bodyMediumRegular,
                  { color: COLORS.error[500], marginTop: 12 },
                ]}
              >
                {error}
              </Text>
            )}
            <View style={styles.buttonContainer}>
              <CustomButton
                variant="filled"
                size="large"
                title="Save Changes"
                onPress={() => handleSaveChanges()}
                style={{ alignSelf: "flex-start", marginTop: 12 }}
              />
              {message && (
                <Text
                  style={[
                    globalStyles.bodyMediumRegular,
                    { color: COLORS.neutral[500], marginTop: 12 },
                  ]}
                >
                  {message}
                </Text>
              )}
            </View>
          </View>
          <CustomButton
            variant="outlinedError"
            size="large"
            title="Delete Account"
            onPress={() => handleDeleteAccountConfirmation()}
            style={{ alignSelf: "flex-start" }}
          />
        </ScrollView>
      </View>
    </TouchableWithoutFeedback>
  );
};

const styles = StyleSheet.create({
  container: {
    gap: 20,
    justifyContent: "",
    alignItems: "",
  },
  profileHeader: {
    gap: 8,
    alignItems: "center",
  },
  profilePicture: {
    width: 130,
    height: 130,
    borderRadius: 9999,
    marginBottom: 8,
  },
  profileName: {
    color: COLORS.neutral[50],
  },
  profileEmail: {
    color: COLORS.neutral[100],
  },
  formContainer: {
    gap: 8,
    backgroundColor: COLORS.primaryNeutral[800],
    padding: 16,
    borderRadius: 16,
  },
  fieldsContainer: {
    flexDirection: "row",
    gap: 8,
  },
  inputField: {
    flex: 1,
  },
  buttonContainer: {
    flexDirection: "row",
    gap: 8,
    alignItems: "center",
  },
  profilePictureContainer: {
    position: "relative",
  },
  editIconButton: {
    position: "absolute",
    bottom: 0,
    right: 0,
    backgroundColor: COLORS.primary[500],
    borderRadius: 9999,
  },
});

export default AccountSettings;
