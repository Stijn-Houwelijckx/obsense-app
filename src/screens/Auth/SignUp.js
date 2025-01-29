import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  TouchableWithoutFeedback,
  StyleSheet,
  ActivityIndicator,
  Keyboard,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import CheckBox from "@react-native-community/checkbox";
import axios from "axios";
import API_PATHS from "../../config/apiConfig";

import ProgressIndicator from "../../components/UI/ProgressIndicator";

const SignUp = ({ navigation, handleAuthChangeSuccess }) => {
  // Step state
  const [step, setStep] = useState(1);

  // Input states
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [agreeToPolicy, setAgreeToPolicy] = useState(false);

  // Other states
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const handleNextStep = () => {
    // Validation for step 1 (first name, last name, email)
    if (!firstName || !lastName || !username || !email) {
      setErrorMessage("All fields are required.");
      return;
    }

    // Proceed to step 2
    setErrorMessage("");
    setStep(2);
  };

  const handleSignUp = async () => {
    setErrorMessage(""); // Reset error message

    // Validation for step 2 (password, confirm password, privacy policy)
    if (!password || !confirmPassword) {
      setErrorMessage("All fields are required.");
      return;
    }

    if (password !== confirmPassword) {
      setErrorMessage("Passwords do not match.");
      return;
    }

    if (!agreeToPolicy) {
      setErrorMessage("You must agree to the privacy policy.");
      return;
    }

    setLoading(true);

    try {
      // API request to signup
      const response = await axios.post(
        API_PATHS.SIGNUP,
        {
          user: {
            firstName,
            lastName,
            username,
            email,
            password,
          },
        },
        {
          validateStatus: (status) => status >= 200 && status < 300, // Accept any 2xx status as success
        }
      );

      console.log("Response data:", response.data);
      console.log("Response data:", response.data.status);

      if (response.data.status === "success") {
        const { _id, isArtist, token } = response.data.data;

        console.log("Token:", token);

        // Save token and user type in AsyncStorage
        await AsyncStorage.setItem("userToken", token);
        await AsyncStorage.setItem("userId", _id);
        await AsyncStorage.setItem("isArtist", isArtist.toString());

        // Notify AppNavigator that sign-up was successful
        handleAuthChangeSuccess(); // Trigger re-check in AppNavigator
      } else {
        throw new Error(response.data.message);
      }
    } catch (error) {
      // console.error("Signup failed:", error.response?.data || error.message);
      setErrorMessage(
        error.response?.data?.message ||
          "Something went wrong. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <View style={styles.container}>
        <Text style={styles.title}>Sign Up</Text>

        {/* Error Message */}
        {errorMessage ? (
          <Text style={styles.errorText}>{errorMessage}</Text>
        ) : null}

        {/* Step 1: First Name, Last Name, Email */}
        {step === 1 && (
          <>
            <ProgressIndicator totalSteps={2} currentStep={step} />
            <TextInput
              style={styles.input}
              placeholder="First Name"
              placeholderTextColor="#aaa"
              value={firstName}
              onChangeText={setFirstName}
            />
            <TextInput
              style={styles.input}
              placeholder="Last Name"
              placeholderTextColor="#aaa"
              value={lastName}
              onChangeText={setLastName}
            />
            <TextInput
              style={styles.input}
              placeholder="Username"
              placeholderTextColor="#aaa"
              value={username}
              onChangeText={setUsername}
            />
            <TextInput
              style={styles.input}
              placeholder="Email Address"
              placeholderTextColor="#aaa"
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
            />
            <TouchableOpacity style={styles.button} onPress={handleNextStep}>
              <Text style={styles.buttonText}>Next</Text>
            </TouchableOpacity>
          </>
        )}

        {/* Step 2: Password, Confirm Password, Privacy Policy */}
        {step === 2 && (
          <>
            <ProgressIndicator totalSteps={2} currentStep={step} />
            <TextInput
              style={styles.input}
              placeholder="Password"
              placeholderTextColor="#aaa"
              value={password}
              onChangeText={setPassword}
              secureTextEntry
              autoCapitalize="none"
            />
            <TextInput
              style={styles.input}
              placeholder="Confirm Password"
              placeholderTextColor="#aaa"
              value={confirmPassword}
              onChangeText={setConfirmPassword}
              secureTextEntry
              autoCapitalize="none"
            />
            <View style={styles.checkboxContainer}>
              <CheckBox
                value={agreeToPolicy}
                onValueChange={setAgreeToPolicy}
                style={styles.checkbox}
              />
              <Text style={styles.checkboxLabel}>
                I agree with the privacy policy.
              </Text>
            </View>
            {loading ? (
              <ActivityIndicator size="large" color="#0000ff" />
            ) : (
              <TouchableOpacity style={styles.button} onPress={handleSignUp}>
                <Text style={styles.buttonText}>Sign Up</Text>
              </TouchableOpacity>
            )}
          </>
        )}

        <TouchableOpacity
          style={styles.link}
          onPress={() => navigation.navigate("Login")}
        >
          <Text style={styles.linkText}>Already have an account? Log in</Text>
        </TouchableOpacity>
      </View>
    </TouchableWithoutFeedback>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    justifyContent: "center",
    backgroundColor: "#fff",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
  },
  input: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    padding: 10,
    marginBottom: 15,
    fontSize: 16,
    color: "#333",
  },
  button: {
    backgroundColor: "#007bff",
    padding: 15,
    borderRadius: 8,
    alignItems: "center",
  },
  buttonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },
  link: {
    marginTop: 15,
    alignItems: "center",
  },
  linkText: {
    color: "#007bff",
    fontSize: 16,
  },
  errorText: {
    color: "red",
    fontSize: 14,
    marginBottom: 15,
    textAlign: "center",
  },
  checkboxContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 15,
  },
  checkbox: {
    marginRight: 8,
  },
  checkboxLabel: {
    fontSize: 14,
    color: "#333",
  },
});

export default SignUp;
