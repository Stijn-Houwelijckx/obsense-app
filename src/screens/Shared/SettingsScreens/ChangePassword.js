import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableWithoutFeedback,
  Keyboard,
} from "react-native";

// Import Utils
import { apiRequest } from "../../../utils/api";

// Import Styles
import { globalStyles } from "../../../styles/global";
import { COLORS } from "../../../styles/theme";

// Import Icons
import {
  LockClosedIcon,
  EyeIcon,
  EyeSlashIcon,
} from "../../../components/icons";

// Custom Components
import { InputField, CustomButton } from "../../../components/UI";

const ChangePassword = ({ navigation }) => {
  const [errorMessage, setErrorMessage] = useState(""); // State to manage error
  const [error, setError] = useState({}); // State to manage error object
  const [message, setMessage] = useState(""); // State to manage message

  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const handlePasswordChange = async () => {
    setErrorMessage(""); // Reset error state
    setError({}); // Reset error object state
    setMessage(""); // Reset message state

    // Validation for current password, new password, and confirm password
    if (!currentPassword || !newPassword || !confirmPassword) {
      setError({
        currentPassword: !currentPassword
          ? "Current password is required."
          : "",
        newPassword: !newPassword ? "New password is required." : "",
        confirmPassword: !confirmPassword
          ? "Confirm password is required."
          : "",
      });
      return;
    }

    // Additional validation for new password
    if (newPassword.length < 8) {
      setError({
        newPassword: "New password must be at least 8 characters long.",
      });
      return;
    }

    // Old and new password should not be the same
    if (currentPassword === newPassword) {
      setError({
        newPassword: "New password cannot be the same as current password.",
      });
      return;
    }

    // Function to handle password change
    if (newPassword !== confirmPassword) {
      setError({
        confirmPassword: "Password does not match.",
      });
      return;
    }

    const response = await apiRequest({
      method: "PUT",
      endpoint: "/users/change-password",
      data: {
        user: {
          oldPassword: currentPassword,
          newPassword: newPassword,
        },
      },
      requiresAuth: true, // Auth required for changing password
    });

    if (response.status === "success") {
      setMessage("Password changed successfully.");

      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } else if (response.status === "fail" && response.data.oldPassword) {
      setError({
        currentPassword: response.data.oldPassword,
      });
    } else {
      setErrorMessage(response.message);
    }
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <View style={[globalStyles.container, styles.container]}>
        <ScrollView contentContainerStyle={styles.container}>
          <View style={styles.formContainer}>
            <View style={styles.fieldsContainer}>
              <InputField
                type="password"
                label="Current Password"
                leadingIcon={
                  <LockClosedIcon size={20} stroke={COLORS.neutral[500]} />
                }
                placeholder="Current Password"
                secureTextEntry={false}
                value={currentPassword}
                onChangeText={(text) => {
                  setCurrentPassword(text);
                  setError((prev) => ({ ...prev, currentPassword: "" })); // Clear error on change
                }}
                trailingIcon={{
                  visible: (
                    <EyeSlashIcon size={20} stroke={COLORS.neutral[500]} />
                  ),
                  hidden: <EyeIcon size={20} stroke={COLORS.neutral[500]} />,
                }}
                autoCapitalize="none"
                error={error.currentPassword ? true : false}
                errorMessage={error.currentPassword}
              />
            </View>
            <View style={styles.fieldsContainer}>
              <InputField
                type="password"
                label="New Password"
                leadingIcon={
                  <LockClosedIcon size={20} stroke={COLORS.neutral[500]} />
                }
                placeholder="New Password"
                secureTextEntry={false}
                value={newPassword}
                onChangeText={(text) => {
                  setNewPassword(text);
                  setError((prev) => ({ ...prev, newPassword: "" })); // Clear error on change
                }}
                trailingIcon={{
                  visible: (
                    <EyeSlashIcon size={20} stroke={COLORS.neutral[500]} />
                  ),
                  hidden: <EyeIcon size={20} stroke={COLORS.neutral[500]} />,
                }}
                autoCapitalize="none"
                error={error.newPassword ? true : false}
                errorMessage={error.newPassword}
              />
            </View>
            <View style={styles.fieldsContainer}>
              <InputField
                type="password"
                label="Confirm New Password"
                leadingIcon={
                  <LockClosedIcon size={20} stroke={COLORS.neutral[500]} />
                }
                placeholder="Confirm New Password"
                secureTextEntry={false}
                value={confirmPassword}
                onChangeText={(text) => {
                  setConfirmPassword(text);
                  setError((prev) => ({ ...prev, confirmPassword: "" })); // Clear error on change
                }}
                trailingIcon={{
                  visible: (
                    <EyeSlashIcon size={20} stroke={COLORS.neutral[500]} />
                  ),
                  hidden: <EyeIcon size={20} stroke={COLORS.neutral[500]} />,
                }}
                autoCapitalize="none"
                error={error.confirmPassword ? true : false}
                errorMessage={error.confirmPassword}
              />
            </View>
            {message && (
              <Text
                style={[
                  globalStyles.bodyMediumRegular,
                  { color: COLORS.success[500], marginTop: 12 },
                ]}
              >
                {message}
              </Text>
            )}
            {errorMessage && (
              <Text
                style={[
                  globalStyles.bodyMediumRegular,
                  { color: COLORS.error[500], marginTop: 12 },
                ]}
              >
                {errorMessage}
              </Text>
            )}
            <CustomButton
              variant="filled"
              size="large"
              title="Save Changes"
              onPress={() => handlePasswordChange()}
              style={{ marginTop: 12 }}
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
  formContainer: {
    gap: 20,
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

export default ChangePassword;
