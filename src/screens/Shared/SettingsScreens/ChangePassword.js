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
import { changeCurrentUserPassword } from "../../../utils/api";

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
  const [error, setError] = useState(""); // State to manage error
  const [message, setMessage] = useState(""); // State to manage message

  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const handlePasswordChange = async () => {
    setError(""); // Reset error state
    setMessage(""); // Reset message state

    // Function to handle password change
    if (newPassword !== confirmPassword) {
      setError("Password doesn't match, try again.");
      return;
    }

    const result = await changeCurrentUserPassword(
      currentPassword,
      newPassword
    );

    if (result.status === "success") {
      setMessage("Password changed successfully.");

      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } else {
      setError(result.message);
    }

    setTimeout(() => {
      setMessage("");
    }, 2000);
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
                onChangeText={setCurrentPassword}
                trailingIcon={{
                  visible: (
                    <EyeSlashIcon size={20} stroke={COLORS.neutral[500]} />
                  ),
                  hidden: <EyeIcon size={20} stroke={COLORS.neutral[500]} />,
                }}
                autoCapitalize="none"
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
                onChangeText={setNewPassword}
                trailingIcon={{
                  visible: (
                    <EyeSlashIcon size={20} stroke={COLORS.neutral[500]} />
                  ),
                  hidden: <EyeIcon size={20} stroke={COLORS.neutral[500]} />,
                }}
                autoCapitalize="none"
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
                onChangeText={setConfirmPassword}
                trailingIcon={{
                  visible: (
                    <EyeSlashIcon size={20} stroke={COLORS.neutral[500]} />
                  ),
                  hidden: <EyeIcon size={20} stroke={COLORS.neutral[500]} />,
                }}
                autoCapitalize="none"
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
