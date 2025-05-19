import React from "react";
import { View, Text, StyleSheet, ScrollView } from "react-native";

// Import Styles
import { globalStyles } from "../../../styles/global";
import { COLORS } from "../../../styles/theme";

const TermsConditions = ({ navigation }) => {
  return (
    <View style={[globalStyles.container, styles.container]}>
      <ScrollView contentContainerStyle={styles.container}>
        <View style={{ gap: 8 }}>
          <Text style={[globalStyles.bodyLargeBold, styles.header]}>
            Terms and Conditions
          </Text>
          <Text style={[globalStyles.bodyMediumBold, styles.title]}>
            Introduction
          </Text>
          <Text style={[globalStyles.bodyMediumRegular, styles.body]}>
            Welcome to Obsense. By using our application, you agree to comply
            with and be bound by the following terms and conditions. Please read
            them carefully.
          </Text>
          <Text style={[globalStyles.bodyMediumBold, styles.title]}>
            Use of the Application
          </Text>
          <Text style={[globalStyles.bodyMediumRegular, styles.body]}>
            You agree to use the application only for lawful purposes and in a
            way that does not infringe the rights of others or restrict their
            use and enjoyment of the application.
          </Text>
          <Text style={[globalStyles.bodyMediumBold, styles.title]}>
            User Accounts
          </Text>
          <Text style={[globalStyles.bodyMediumRegular, styles.body]}>
            You are responsible for maintaining the confidentiality of your
            account information and for all activities that occur under your
            account.
          </Text>
          <Text style={[globalStyles.bodyMediumBold, styles.title]}>
            Intellectual Property
          </Text>
          <Text style={[globalStyles.bodyMediumRegular, styles.body]}>
            All content, trademarks, and data on this application, including but
            not limited to text, graphics, logos, and software, are the property
            of Obsense or its licensors and are protected by intellectual
            property laws.
          </Text>
          <Text style={[globalStyles.bodyMediumBold, styles.title]}>
            Limitation of Liability
          </Text>
          <Text style={[globalStyles.bodyMediumRegular, styles.body]}>
            Obsense will not be held liable for any damages arising from the use
            or inability to use the application, including but not limited to
            direct, indirect, incidental, or consequential damages.
          </Text>
          <Text style={[globalStyles.bodyMediumBold, styles.title]}>
            Termination
          </Text>
          <Text style={[globalStyles.bodyMediumRegular, styles.body]}>
            We reserve the right to terminate or suspend your access to the
            application at any time, without notice, for conduct that we believe
            violates these terms or is harmful to other users.
          </Text>
        </View>
        <View style={{ gap: 8 }}>
          <Text style={[globalStyles.bodyLargeBold, styles.header]}>
            Governing Law
          </Text>
          <Text style={[globalStyles.bodyMediumBold, styles.title]}>
            Jurisdiction
          </Text>
          <Text style={[globalStyles.bodyMediumRegular, styles.body]}>
            These terms and conditions are governed by and construed in
            accordance with the laws of [Insert Jurisdiction]. Any disputes
            arising from these terms will be subject to the exclusive
            jurisdiction of the courts of [Insert Jurisdiction].
          </Text>
          <Text style={[globalStyles.bodyMediumBold, styles.title]}>
            Changes to Terms
          </Text>
          <Text style={[globalStyles.bodyMediumRegular, styles.body]}>
            We reserve the right to update these terms and conditions at any
            time. Continued use of the application after changes are made
            constitutes your acceptance of the updated terms.
          </Text>
          <Text style={[globalStyles.bodyMediumBold, styles.title]}>
            Contact Us
          </Text>
          <Text style={[globalStyles.bodyMediumRegular, styles.body]}>
            If you have any questions about these terms and conditions, please
            contact us at support@obsense.com.
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

export default TermsConditions;
