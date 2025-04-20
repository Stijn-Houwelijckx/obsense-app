import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  ActivityIndicator,
  StyleSheet,
  ScrollView,
  TouchableWithoutFeedback,
  Keyboard,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useActiveCollection } from "../../../context/ActiveCollectionContext";
import FastImage from "react-native-fast-image";

// Import Utils
import { getCurrentUser } from "../../../utils/api";

// Import Styles
import { globalStyles } from "../../../styles/global";
import { COLORS } from "../../../styles/theme";

// Import Icons

// Custom Components
import InputField from "../../../components/UI/InputField";
import CustomButton from "../../../components/UI/CustomButton";

const AccountSettings = ({ navigation }) => {
  const [user, setUser] = useState(null); // State to store user data
  const [isLoading, setIsLoading] = useState(true); // State to manage loading state

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");

  useEffect(() => {
    const getUser = async () => {
      const result = await getCurrentUser();

      if (result.status === "success") {
        setUser(result.data.user); // Set user data
      } else {
        console.log("Error getting user data:", result.message); // Log error message
      }

      setIsLoading(false); // Set loading state to false
    };

    getUser(); // Call the function
  }, []);

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
            <FastImage
              source={{
                uri: user.profilePicture.filePath,
              }}
              style={styles.profilePicture}
            />
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
            <CustomButton
              variant="filled"
              size="large"
              title="Save Changes"
              onPress={() => console.log("Save Changes")}
              style={{ alignSelf: "flex-start", marginTop: 12 }}
            />
          </View>
          <CustomButton
            variant="outlinedError"
            size="large"
            title="Delete Account"
            onPress={() => console.log("Delete Account")}
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
});

export default AccountSettings;
