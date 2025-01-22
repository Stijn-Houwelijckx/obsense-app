import React from "react";
import { View, Text, Button } from "react-native";

const Home = ({ navigation }) => (
  <View>
    <Text>Artist Home</Text>
    <Button
      title="Go to Details"
      onPress={() => navigation.navigate("Details")}
    />
  </View>
);

export default Home;
