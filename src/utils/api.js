import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import API_PATHS from "../config/apiConfig";

// Function to get the current user from the API
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
      return { status: "success", data: response.data.data };
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

// Function to get all artists from the API
const getArtists = async (page = 1, limit = 20) => {
  try {
    const token = await AsyncStorage.getItem("userToken");
    if (!token) {
      return { status: "fail", message: "Unauthorized" }; // No token, unauthorized
    }

    const response = await axios.get(
      `${API_PATHS.ARTISTS}?page=${page}&limit=${limit}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        validateStatus: (status) => status >= 200 && status < 500, // Accept any 2xx or 4xx status as valid
      }
    );

    // Handle success response
    if (response.status === 200) {
      return { status: "success", data: response.data.data };
    }

    // Handle 204 response
    if (response.status === 204) {
      return {
        status: "success",
        data: {
          code: 204,
          message: "No artists found",
          artists: [],
          hasMore: false,
        },
      };
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

// Function to get the artist details from the API
const getArtistDetails = async (artistId) => {
  try {
    const token = await AsyncStorage.getItem("userToken");
    if (!token) {
      return { status: "fail", message: "Unauthorized" }; // No token, unauthorized
    }

    const response = await axios.get(`${API_PATHS.ARTISTS}/${artistId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      validateStatus: (status) => status >= 200 && status < 500, // Accept any 2xx or 4xx status as valid
    });

    // Handle success response
    if (response.status === 200) {
      return { status: "success", data: response.data.data };
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

// Function to get the collections for the current artist from the API
const getCollectionsForCurrentArtist = async () => {
  try {
    const token = await AsyncStorage.getItem("userToken");
    if (!token) {
      return { status: "fail", message: "Unauthorized" }; // No token, unauthorized
    }

    const response = await axios.get(API_PATHS.ARTIST_COLLECTIONS, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      validateStatus: (status) => status >= 200 && status < 500, // Accept any 2xx or 4xx status as valid
    });

    // Handle success response
    if (response.status === 200) {
      return { status: "success", data: response.data.data };
    }

    // Handle 404 error
    if (response.status === 404) {
      return {
        status: "fail",
        data: {
          code: 404,
          message: "No collections found",
        },
      };
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

// Function to get the artist collection details from the API
const getArtistCollectionDetails = async (collectionId) => {
  try {
    const token = await AsyncStorage.getItem("userToken");
    if (!token) {
      return { status: "fail", message: "Unauthorized" }; // No token, unauthorized
    }

    const response = await axios.get(
      `${API_PATHS.ARTIST_COLLECTIONS}/${collectionId}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        validateStatus: (status) => status >= 200 && status < 500, // Accept any 2xx or 4xx status as valid
      }
    );

    // Handle success response
    if (response.status === 200) {
      return { status: "success", data: response.data.data };
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

// Function to get the collection details from the API
const getCollectionDetails = async (collectionId) => {
  try {
    const token = await AsyncStorage.getItem("userToken");
    if (!token) {
      return { status: "fail", message: "Unauthorized" }; // No token, unauthorized
    }

    const response = await axios.get(
      `${API_PATHS.COLLECTIONS}/${collectionId}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        validateStatus: (status) => status >= 200 && status < 500, // Accept any 2xx or 4xx status as valid
      }
    );

    // Handle success response
    if (response.status === 200) {
      return { status: "success", data: response.data.data };
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

// Function to get the owned collections for the current user from the API
const getOwnedCollections = async () => {
  try {
    const token = await AsyncStorage.getItem("userToken");
    if (!token) {
      return { status: "fail", message: "Unauthorized" }; // No token, unauthorized
    }

    const response = await axios.get(API_PATHS.OWNED_COLLECTIONS, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      validateStatus: (status) => status >= 200 && status < 500, // Accept any 2xx or 4xx status as valid
    });

    // Handle success response
    if (response.status === 200) {
      return { status: "success", data: response.data.data };
    }

    // Handle 204 response
    if (response.status === 204) {
      return {
        status: "success",
        data: {
          code: 204,
          message: "No purchases found",
          purchases: [],
        },
      };
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

// Function to get all collections from the API
const getCollections = async (page = 1, limit = 20) => {
  try {
    const token = await AsyncStorage.getItem("userToken");
    if (!token) {
      return { status: "fail", message: "Unauthorized" }; // No token, unauthorized
    }

    const response = await axios.get(
      `${API_PATHS.COLLECTIONS}?page=${page}&limit=${limit}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        validateStatus: (status) => status >= 200 && status < 500, // Accept any 2xx or 4xx status as valid
      }
    );

    // Handle success response
    if (response.status === 200) {
      return { status: "success", data: response.data.data };
    }

    // Handle 204 response
    if (response.status === 204) {
      return {
        status: "success",
        data: {
          code: 204,
          message: "No collections found",
          collections: [],
          hasMore: false,
        },
      };
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

// Save placed object to the API
const savePlacedObject = async (placedObject) => {
  try {
    const token = await AsyncStorage.getItem("userToken");
    if (!token) {
      return { status: "fail", message: "Unauthorized" }; // No token, unauthorized
    }

    const response = await axios.post(
      API_PATHS.SAVE_PLACED_OBJECT,
      placedObject,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        validateStatus: (status) => status >= 200 && status < 500, // Accept any 2xx or 4xx status as valid
      }
    );

    // Handle success response
    if (response.status === 200) {
      return { status: "success", data: response.data.data };
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

export {
  getCurrentUser,
  getArtists,
  getArtistDetails,
  getCollectionsForCurrentArtist,
  getArtistCollectionDetails,
  getCollectionDetails,
  getOwnedCollections,
  getCollections,
  savePlacedObject,
};
