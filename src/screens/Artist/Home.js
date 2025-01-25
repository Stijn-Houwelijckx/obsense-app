import React, { useState, useEffect } from "react";
import { View, Text, Button } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";

const Home = ({ navigation }) => {
  const [userId, setUserId] = useState(null);

  useEffect(() => {
    const getUserId = async () => {
      try {
        const storedUserId = await AsyncStorage.getItem("userId");
        if (storedUserId !== null) {
          setUserId(storedUserId);
        } else {
          console.log("UserId not found");
        }
      } catch (error) {
        console.error("Error retrieving userId from AsyncStorage", error);
      }
    };

    getUserId();
  }, []);

  return (
    <View>
      <Text>User Home</Text>
      {userId ? (
        <Text>User ID: {userId}</Text>
      ) : (
        <Text>Loading User ID...</Text>
      )}
      <Button
        title="Go to Details"
        onPress={() => navigation.navigate("Details")}
      />
    </View>
  );
};

export default Home;
