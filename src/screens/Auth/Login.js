import React, { useState } from "react";
import {
  View,
  Text,
  TouchableWithoutFeedback,
  ScrollView,
  StyleSheet,
  ActivityIndicator,
  Keyboard,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";

import { apiRequest } from "../../utils/api";

// Import Styles
import { COLORS } from "../../styles/theme";
import { globalStyles } from "../../styles/global";

// Import Icons
import { LockClosedIcon, EyeIcon, EyeSlashIcon } from "../../components/icons";

// Import Components
import { InputField, CustomButton, SocialButton } from "../../components/UI";

const Login = ({ navigation, handleAuthChangeSuccess }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  // Other states
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [error, setError] = useState({});

  const handleLogin = async () => {
    setErrorMessage(""); // Reset error message

    // Validation for step 2 (password, confirm password, privacy policy)
    if (!email || !password) {
      setError({
        email: !email ? "Email is required." : "",
        password: !password ? "Password is required." : "",
      });
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setError({
        email: "Please enter a valid email address.",
      });
      return;
    }

    setLoading(true);

    try {
      const response = await apiRequest({
        method: "POST",
        endpoint: "/users/login",
        data: {
          user: {
            email,
            password,
          },
        },
        requiresAuth: false, // No auth required for login
      });

      console.log("Response data:", response);

      if (response.status === "success") {
        const { isArtist, token } = response.data;

        console.log("Token:", token);

        // Save token and user type in AsyncStorage
        await AsyncStorage.setItem("userToken", token);
        await AsyncStorage.setItem("isArtist", isArtist.toString());

        // Notify AppNavigator that sign-up was successful
        if (isArtist) {
          navigation.navigate("Role Selection");
        } else {
          handleAuthChangeSuccess(); // Proceed to UserNavigator
        }
      } else if (response.status === "fail") {
        // Handle "fail" response here
        // The error messages are inside the "data" object
        setErrorMessage(
          response.message || "Something went wrong. Please try again."
        );
      }
    } catch (error) {
      // If response is available, extract error message or details
      const errorMsg = error.response?.message || error.message;
      const errorDetails = error.response?.data?.details;

      // Combine both message and details if available
      setErrorMessage(errorDetails ? `${errorMsg}: ${errorDetails}` : errorMsg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
        <View style={[globalStyles.container, styles.container]}>
          <View
            style={[globalStyles.secondaryContainer, styles.secondaryContainer]}
          >
            <Text style={[globalStyles.headingH6Bold, styles.title]}>
              Welcome Back!
            </Text>

            {/* Error Message */}
            {errorMessage ? (
              <Text style={[globalStyles.labelMediumRegular, styles.errorText]}>
                {errorMessage}
              </Text>
            ) : null}

            <View style={styles.formContainer}>
              <View style={styles.fieldsContainer}>
                <InputField
                  label="Email Address"
                  placeholder="Email Address"
                  value={email}
                  onChangeText={(text) => {
                    setEmail(text);
                    setError((prev) => ({ ...prev, email: "" })); // Clear error on change
                  }}
                  keyboardType="email-address"
                  autoCapitalize="none"
                  error={error.email ? true : false}
                  errorMessage={error.email}
                />

                <InputField
                  type="password"
                  label="Password"
                  leadingIcon={
                    <LockClosedIcon size={20} stroke={COLORS.neutral[500]} />
                  }
                  placeholder="Password"
                  secureTextEntry={false}
                  value={password}
                  onChangeText={(text) => {
                    setPassword(text);
                    setError((prev) => ({ ...prev, password: "" })); // Clear error on change
                  }}
                  trailingIcon={{
                    visible: (
                      <EyeSlashIcon size={20} stroke={COLORS.neutral[500]} />
                    ),
                    hidden: <EyeIcon size={20} stroke={COLORS.neutral[500]} />,
                  }}
                  autoCapitalize="none"
                  error={error.password ? true : false}
                  errorMessage={error.password}
                />
                {loading ? (
                  <ActivityIndicator size="large" color={COLORS.primary[500]} />
                ) : (
                  <CustomButton
                    variant="filled"
                    size="large"
                    title="Login"
                    onPress={handleLogin}
                    style={styles.button}
                  />
                )}
              </View>
            </View>

            <View style={styles.alternativeLoginContainer}>
              <View style={styles.alternativeLoginText}>
                <View style={styles.line} />
                <Text
                  style={[
                    globalStyles.labelXSmallSemiBold,
                    { color: COLORS.neutral[200] },
                  ]}
                >
                  or sign in with
                </Text>
                <View style={styles.line} />
              </View>

              <View style={styles.socialButtonsContainer}>
                <SocialButton
                  provider={"google"}
                  backgroundColor={COLORS.primary["500-20"]}
                  borderColor={COLORS.primary[500]}
                  textColor={COLORS.neutral[50]}
                  style={styles.socialButton}
                />
                <SocialButton
                  provider={"apple"}
                  backgroundColor={COLORS.primary["500-20"]}
                  borderColor={COLORS.primary[500]}
                  textColor={COLORS.neutral[50]}
                  style={styles.socialButton}
                />
                <SocialButton
                  provider={"facebook"}
                  backgroundColor={COLORS.primary["500-20"]}
                  borderColor={COLORS.primary[500]}
                  textColor={COLORS.neutral[50]}
                  style={styles.socialButton}
                />
              </View>
              <View style={styles.linkContainer}>
                <View style={styles.linkContent}>
                  <Text style={[globalStyles.bodySmallBold, styles.linkText]}>
                    Don't have an account?
                  </Text>
                  <CustomButton
                    variant="text"
                    size="medium"
                    title="Sign Up"
                    onPress={() => navigation.replace("Create Account")}
                  />
                </View>
              </View>
            </View>
          </View>
        </View>
      </ScrollView>
    </TouchableWithoutFeedback>
  );
};

const styles = StyleSheet.create({
  container: {},
  secondaryContainer: {
    justifyContent: "flex-start",
    alignItems: "flex-start",
    borderRadius: 16,
    width: "100%",
    height: "100%",
    gap: 32,
  },
  title: {
    color: COLORS.neutral[50],
  },
  formContainer: {
    width: "100%",
    gap: 20,
  },
  fieldsContainer: {
    width: "100%",
    gap: 20,
  },
  input: {},
  button: {
    width: "100%",
  },
  alternativeLoginContainer: {
    flex: 1,
    width: "100%",
    gap: 20,
  },
  alternativeLoginText: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  line: {
    flex: 1,
    height: 1,
    backgroundColor: COLORS.neutral[300],
    marginTop: 2, // Adjust line position to center with text
  },
  socialButtonsContainer: {
    flexDirection: "row",
    justifyContent: "center",
    gap: 12,
  },
  socialButton: {
    flex: 1,
    height: 56,
  },
  linkContainer: {
    flex: 1,
    height: "100%",
    width: "100%",
    justifyContent: "flex-end",
  },
  linkContent: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    width: "100%",
    gap: -12,
  },
  linkText: {
    color: COLORS.neutral[50],
    paddingBottom: 4, // Adjust text position to center with button
  },
  errorText: {
    color: COLORS.error[500],
    position: "absolute",
    top: 50,
    left: 16,
  },
});

export default Login;
