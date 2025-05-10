import React from "react";
import { View, Text, Button } from "react-native";

const Explore = ({ navigation }) => (
  <View>
    <Text>User Explore</Text>
    <Button
      title="Go to Details"
      onPress={() => navigation.navigate("Details")}
    />
  </View>
);

export default Explore;
