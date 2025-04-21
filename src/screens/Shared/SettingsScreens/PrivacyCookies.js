import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, ScrollView } from "react-native";

// Import Styles
import { globalStyles } from "../../../styles/global";
import { COLORS } from "../../../styles/theme";

const PrivacyCookies = ({ navigation }) => {
  return (
    <View style={[globalStyles.container, styles.container]}>
      <ScrollView contentContainerStyle={styles.container}>
        <View style={{ gap: 8 }}>
          <Text style={[globalStyles.bodyLargeBold, styles.header]}>
            Privacy Policy
          </Text>
          <Text style={[globalStyles.bodyMediumBold, styles.title]}>
            Introduction
          </Text>
          <Text style={[globalStyles.bodyMediumRegular, styles.body]}>
            At Obsense, we are committed to protecting your privacy. This
            Privacy Policy explains how we collect, use, and safeguard your
            personal information when you use our application and services.
          </Text>
          <Text style={[globalStyles.bodyMediumBold, styles.title]}>
            Information We Collect
          </Text>
          <Text style={[globalStyles.bodyMediumRegular, styles.body]}>
            We may collect personal information such as your name, email
            address, username, and profile picture. Additionally, we collect
            usage data, device information, and location data (if permission is
            granted).
          </Text>
          <Text style={[globalStyles.bodyMediumBold, styles.title]}>
            How We Use Your Information
          </Text>
          <Text style={[globalStyles.bodyMediumRegular, styles.body]}>
            Your information is used to provide and improve our services,
            personalize your experience, communicate updates, and ensure the
            security of our application.
          </Text>
          <Text style={[globalStyles.bodyMediumBold, styles.title]}>
            Your Rights
          </Text>
          <Text style={[globalStyles.bodyMediumRegular, styles.body]}>
            You have the right to access, update, or delete your personal
            information. You can also opt out of marketing communications and
            withdraw consent for location tracking at any time.
          </Text>
        </View>
        <View style={{ gap: 8 }}>
          <Text style={[globalStyles.bodyLargeBold, styles.header]}>
            Cookies Policy
          </Text>
          <Text style={[globalStyles.bodyMediumBold, styles.title]}>
            What Are Cookies?
          </Text>
          <Text style={[globalStyles.bodyMediumRegular, styles.body]}>
            Cookies are small text files stored on your device to enhance your
            experience. They help us understand how you interact with our app
            and improve its functionality.
          </Text>
          <Text style={[globalStyles.bodyMediumBold, styles.title]}>
            How We Use Cookies
          </Text>
          <Text style={[globalStyles.bodyMediumRegular, styles.body]}>
            We use cookies to remember your preferences, analyze app usage, and
            provide personalized content. Cookies also help us improve the
            performance and security of our application.
          </Text>
          <Text style={[globalStyles.bodyMediumBold, styles.title]}>
            Managing Cookies
          </Text>
          <Text style={[globalStyles.bodyMediumRegular, styles.body]}>
            You can manage or disable cookies through your device settings.
            However, disabling cookies may affect the functionality of certain
            features in the app.
          </Text>
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    gap: 40,
    justifyContent: "",
    alignItems: "",
  },
  header: {
    color: COLORS.primary[500],
    marginBottom: 8,
  },
  title: {
    color: COLORS.neutral[50],
    marginBottom: 4,
  },
  body: {
    color: COLORS.neutral[400],
    marginBottom: 16,
  },
});

export default PrivacyCookies;
