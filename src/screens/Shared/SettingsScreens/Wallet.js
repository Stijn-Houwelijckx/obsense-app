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

// Import Utils
import { getCurrentUser, updateTokens } from "../../../utils/api";

// Import Styles
import { globalStyles } from "../../../styles/global";
import { COLORS } from "../../../styles/theme";

// Custom Components
import InputField from "../../../components/UI/InputField";
import CustomButton from "../../../components/UI/CustomButton";
import WalletCard from "../../../components/UI/WalletCard";
import NumberSelector from "../../../components/UI/NumberSelector";

const Wallet = ({ navigation }) => {
  const [user, setUser] = useState(null); // State to store user data
  const [isLoading, setIsLoading] = useState(true); // State to manage loading state
  const [message, setMessage] = useState(""); // State to manage message
  const [error, setError] = useState(""); // State to manage error

  const [selectedNumber, setSelectedNumber] = useState(null); // State to track the selected number

  const handleNumberSelect = (number) => {
    if (selectedNumber === number) {
      setSelectedNumber(null); // Deselect if already selected
    } else {
      setSelectedNumber(number); // Update the selected number
    }
  };

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

  const handleBuyTokens = async () => {
    const result = await updateTokens(selectedNumber); // Call the API to update tokens

    if (result.status === "success") {
      setUser((prevUser) => ({
        ...prevUser,
        tokens: result.data.tokens, // Update user tokens
      }));

      setSelectedNumber(null); // Reset selected number
      setError(""); // Reset error message
      setMessage("Purchase successfull!"); // Set success message

      // Clear the message after 3 seconds
      setTimeout(() => {
        setMessage(""); // Clear message after 3 seconds
      }, 2000);
    } else {
      setMessage(""); // Reset success message
      setError(result.message); // Set error message
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
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <View style={[globalStyles.container, styles.container]}>
        <ScrollView contentContainerStyle={styles.container}>
          <WalletCard tokens={user.tokens} conversionRate="0.05" />

          <View style={[styles.formContainer]}>
            <Text style={[globalStyles.headingH6Bold, styles.header]}>
              Buy Tokens
            </Text>
            <View style={styles.numberSelectorContainer}>
              <View style={styles.row}>
                <NumberSelector
                  number="5"
                  isActive={selectedNumber === "5"}
                  onPress={() => handleNumberSelect("5")}
                  style={styles.numberSelector}
                />
                <NumberSelector
                  number="10"
                  isActive={selectedNumber === "10"}
                  onPress={() => handleNumberSelect("10")}
                  style={styles.numberSelector}
                />
                <NumberSelector
                  number="20"
                  isActive={selectedNumber === "20"}
                  onPress={() => handleNumberSelect("20")}
                  style={styles.numberSelector}
                />
              </View>

              <View style={styles.row}>
                <NumberSelector
                  number="50"
                  isActive={selectedNumber === "50"}
                  onPress={() => handleNumberSelect("50")}
                  style={styles.numberSelector}
                />
                <NumberSelector
                  number="100"
                  isActive={selectedNumber === "100"}
                  onPress={() => handleNumberSelect("100")}
                  style={styles.numberSelector}
                />
                <NumberSelector
                  number="200"
                  isActive={selectedNumber === "200"}
                  onPress={() => handleNumberSelect("200")}
                  style={styles.numberSelector}
                />
              </View>
            </View>
            <InputField
              label="Custom Amount"
              placeholder="Enter amount"
              keyboardType="numeric"
              value={selectedNumber}
              onChangeText={(text) => setSelectedNumber(text)}
              style={styles.InputField}
            />
            {message && (
              <Text
                style={[
                  globalStyles.bodyMediumRegular,
                  { color: COLORS.success[500], marginBottom: 12 },
                ]}
              >
                {message}
              </Text>
            )}
            {error && (
              <Text
                style={[
                  globalStyles.bodyMediumRegular,
                  { color: COLORS.error[500], marginBottom: 12 },
                ]}
              >
                {error}
              </Text>
            )}
            <CustomButton
              variant="filled"
              size="large"
              title="Buy"
              onPress={() => handleBuyTokens()}
            />
          </View>
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
  numberSelectorContainer: {
    gap: 16,
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "column",
    marginBottom: 20,
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
    gap: 16,
  },
  formContainer: {
    backgroundColor: COLORS.primaryNeutral[800],
    padding: 16,
    borderRadius: 16,
  },
  header: {
    color: COLORS.neutral[50],
    marginBottom: 16,
  },
  numberSelector: {
    flex: 1,
    width: "100%",
  },
  InputField: {
    marginBottom: 20,
  },
});

export default Wallet;
