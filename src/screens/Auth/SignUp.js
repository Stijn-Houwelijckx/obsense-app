import React, { useState } from "react";
import {
  View,
  Text,
  TouchableWithoutFeedback,
  StyleSheet,
  ActivityIndicator,
  Keyboard,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import CheckBox from "@react-native-community/checkbox";
import axios from "axios";
import API_PATHS from "../../config/apiConfig";

// Import Styles
import { COLORS } from "../../styles/theme";
import { globalStyles } from "../../styles/global";

// Import Icons
import { LockClosedIcon, EyeIcon, EyeSlashIcon } from "../../components/icons";

// Import Components
import {
  ProgressIndicator,
  InputField,
  CustomButton,
  SocialButton,
} from "../../components/UI";

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
    if (step === 1) {
      if (!firstName || !lastName) {
        setErrorMessage("All fields are required.");
        return;
      }

      // Proceed to step 2
      setErrorMessage("");
      setStep(2);
    } else if (step === 2) {
      if (!username || !email) {
        setErrorMessage("All fields are required.");
        return;
      }
      setErrorMessage("");
      setStep(3);
    }
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
          validateStatus: (status) => status >= 200 && status < 500, // Accept any 2xx status as success
        }
      );

      console.log("Response data:", response.data);
      console.log("Response data:", response.data.status);

      if (response.data.status === "success") {
        const { isArtist, token } = response.data.data;

        console.log("Token:", token);

        // Save token and user type in AsyncStorage
        await AsyncStorage.setItem("userToken", token);
        await AsyncStorage.setItem("isArtist", isArtist.toString());

        // Notify AppNavigator that sign-up was successful
        handleAuthChangeSuccess(); // Trigger re-check in AppNavigator
      } else if (response.data.status === "fail") {
        // Handle "fail" response here
        // The error messages are inside the "data" object
        setErrorMessage(
          response.data.data.message ||
            "Something went wrong. Please try again."
        );
      }
    } catch (error) {
      // If response is available, extract error message or details
      const errorMsg = error.response?.data?.message || error.message;
      const errorDetails = error.response?.data?.details;

      // Combine both message and details if available
      setErrorMessage(errorDetails ? `${errorMsg}: ${errorDetails}` : errorMsg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <View style={[globalStyles.container, styles.container]}>
        <View
          style={[globalStyles.secondaryContainer, styles.secondaryContainer]}
        >
          <Text style={[globalStyles.headingH6Bold, styles.title]}>
            Sign up to continue
          </Text>

          {/* Error Message */}
          {errorMessage ? (
            <Text style={[globalStyles.labelMediumRegular, styles.errorText]}>
              {errorMessage}
            </Text>
          ) : null}

          {/* Step 1: First Name, Last Name, Email */}
          {step === 1 && (
            <>
              <ProgressIndicator totalSteps={3} currentStep={step} />

              <View style={styles.formContainer}>
                <View style={styles.fieldsContainer}>
                  <InputField
                    label="First Name"
                    placeholder="First Name"
                    value={firstName}
                    onChangeText={setFirstName}
                  />
                  <InputField
                    label="Last Name"
                    placeholder="Last Name"
                    value={lastName}
                    onChangeText={setLastName}
                  />
                </View>

                <CustomButton
                  variant="filled"
                  size="large"
                  title="Continue"
                  onPress={handleNextStep}
                  style={styles.button}
                />
              </View>
            </>
          )}

          {step === 2 && (
            <>
              <ProgressIndicator totalSteps={3} currentStep={step} />

              <View style={styles.formContainer}>
                <View style={styles.fieldsContainer}>
                  <InputField
                    label="Username"
                    placeholder="Username"
                    value={username}
                    onChangeText={setUsername}
                  />
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
                  title="Continue"
                  onPress={handleNextStep}
                  style={styles.button}
                />
              </View>
            </>
          )}

          {/* Step 2: Password, Confirm Password, Privacy Policy */}
          {step === 3 && (
            <>
              <ProgressIndicator totalSteps={3} currentStep={step} />

              <View style={styles.formContainer}>
                <View style={styles.fieldsContainer}>
                  <InputField
                    type="password"
                    label="Password"
                    leadingIcon={
                      <LockClosedIcon size={20} stroke={COLORS.neutral[500]} />
                    }
                    placeholder="Password"
                    secureTextEntry={false}
                    value={password}
                    onChangeText={setPassword}
                    trailingIcon={{
                      visible: (
                        <EyeSlashIcon size={20} stroke={COLORS.neutral[500]} />
                      ),
                      hidden: (
                        <EyeIcon size={20} stroke={COLORS.neutral[500]} />
                      ),
                    }}
                    autoCapitalize="none"
                  />
                  <InputField
                    type="password"
                    label="Confirm Password"
                    leadingIcon={
                      <LockClosedIcon size={20} stroke={COLORS.neutral[500]} />
                    }
                    placeholder="Confirm Password"
                    secureTextEntry={false}
                    value={confirmPassword}
                    onChangeText={setConfirmPassword}
                    trailingIcon={{
                      visible: (
                        <EyeSlashIcon size={20} stroke={COLORS.neutral[500]} />
                      ),
                      hidden: (
                        <EyeIcon size={20} stroke={COLORS.neutral[500]} />
                      ),
                    }}
                    autoCapitalize="none"
                  />
                </View>
                <View style={styles.checkboxContainer}>
                  <CheckBox
                    value={agreeToPolicy}
                    onValueChange={setAgreeToPolicy}
                    style={styles.checkbox}
                    tintColors
                  />
                  <Text style={styles.checkboxLabel}>
                    I agree with the privacy policy.
                  </Text>
                </View>
                {loading ? (
                  <ActivityIndicator size="large" color={COLORS.primary[500]} />
                ) : (
                  <CustomButton
                    variant="filled"
                    size="large"
                    title="Sign Up"
                    onPress={handleSignUp}
                    style={styles.button}
                  />
                )}
              </View>
            </>
          )}

          <View style={styles.alternativeLoginContainer}>
            <View style={styles.alternativeLoginText}>
              <View style={styles.line} />
              <Text
                style={[
                  globalStyles.labelXSmallSemiBold,
                  { color: COLORS.neutral[200] },
                ]}
              >
                or sign up with
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
                  Already have an account?
                </Text>
                <CustomButton
                  variant="text"
                  size="medium"
                  title="Login"
                  onPress={() => navigation.replace("Login")}
                />
              </View>
            </View>
          </View>
        </View>
      </View>
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
    top: 110,
    left: 16,
  },
  checkboxContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  checkbox: {
    marginRight: 8,
  },
  checkboxLabel: {
    fontSize: 14,
    color: COLORS.neutral[50],
  },
});

export default SignUp;
