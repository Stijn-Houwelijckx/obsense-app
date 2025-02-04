import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import API_PATHS from "../config/apiConfig";

const getCurrentUser = async () => {
  try {
    const token = await AsyncStorage.getItem("userToken");
    if (!token) {
      return { status: "fail", message: "Unauthorized" }; // No token, unauthorized
    }

    const response = await axios.get(API_PATHS.ME, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      validateStatus: (status) => status >= 200 && status < 500, // Accept any 2xx or 4xx status as valid
    });

    // Handle success response
    if (response.status === 200) {
      return { status: "success", data: response.data };
    }

    // Handle other errors
    return {
      status: "fail",
      message: response.data?.data?.message || "Something went wrong",
    };
  } catch (error) {
    return { status: "fail", message: error.message };
  }
};

export { getCurrentUser };
