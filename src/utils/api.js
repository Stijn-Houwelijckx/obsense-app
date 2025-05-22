import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import API_PATHS from "../config/apiConfig";
const API_BASE_URL = "https://obsense-api.onrender.com/api/v1";

// Function to change the current user's password from the API
const changeCurrentUserPassword = async (oldPassword, newPassword) => {
  try {
    const token = await AsyncStorage.getItem("userToken");
    if (!token) {
      return { status: "fail", message: "Unauthorized" }; // No token, unauthorized
    }

    const payload = {
      user: {
        oldPassword,
        newPassword,
      },
    };

    const response = await axios.put(API_PATHS.CHANGE_PASSWORD, payload, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      validateStatus: (status) => status >= 200 && status < 500, // Accept any 2xx or 4xx status as valid
    });

    // Handle success response
    if (response.status === 200) {
      return { status: "success", data: response.data.data };
    }

    console.log("Response:", response.data); // Log the response for debugging

    // Handle other errors
    return {
      status: "fail",
      message: response.data?.message || "Something went wrong",
    };
  } catch (error) {
    return { status: "fail", message: error.message };
  }
};

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
      message: response.data?.message || "Something went wrong",
    };
  } catch (error) {
    return { status: "fail", message: error.message };
  }
};

// Function to update the current user from the API
const updateCurrentUser = async (userData) => {
  try {
    const token = await AsyncStorage.getItem("userToken");
    if (!token) {
      return { status: "fail", message: "Unauthorized" }; // No token, unauthorized
    }

    const response = await axios.put(API_PATHS.ME, userData, {
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
          message: "User not found",
        },
      };
    }

    // Handle other errors
    return {
      status: "fail",
      message: response.data?.message || "Something went wrong",
    };
  } catch (error) {
    return { status: "fail", message: error.message };
  }
};

// Function to deletre the current users account from the API
const deleteCurrentUserAccount = async () => {
  try {
    const token = await AsyncStorage.getItem("userToken");
    if (!token) {
      return { status: "fail", message: "Unauthorized" }; // No token, unauthorized
    }
    const response = await axios.delete(API_PATHS.ME, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      validateStatus: (status) => status >= 200 && status < 500, // Accept any 2xx or 4xx status as valid
    });

    // Handle success response
    if (response.status === 200) {
      return { status: "success", data: response.data };
    }

    // Handle 404 error
    if (response.status === 404) {
      return {
        status: "fail",
        data: {
          code: 404,
          message: "User not found",
        },
      };
    }
    // Handle other errors
    return {
      status: "fail",
      message: response.data?.message || "Something went wrong",
    };
  } catch (error) {
    return { status: "fail", message: error.message };
  }
};

// Function to update the current user profile picture from the API
const updateCurrentUserProfilePicture = async (formData) => {
  try {
    const token = await AsyncStorage.getItem("userToken");
    if (!token) {
      return { status: "fail", message: "Unauthorized" }; // No token, unauthorized
    }

    const response = await axios.put(API_PATHS.ME_PROFILE_PICTURE, formData, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "multipart/form-data",
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
      message: response.data?.message || "Something went wrong",
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
      message: response.data?.message || "Something went wrong",
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
      message: response.data?.message || "Something went wrong",
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
    if (response.status === 204) {
      return {
        status: "success",
        data: {
          code: 204,
          message: "No collections found",
          collections: [],
        },
      };
    }

    // Handle other errors
    return {
      status: "fail",
      message: response.data?.message || "Something went wrong",
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
      message: response.data?.message || "Something went wrong",
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
      message: response.data?.message || "Something went wrong",
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
      message: response.data?.message || "Something went wrong",
    };
  } catch (error) {
    return { status: "fail", message: error.message };
  }
};

// Function to purchase a collection from the API
const purchaseCollection = async (collectionId) => {
  try {
    const token = await AsyncStorage.getItem("userToken");
    if (!token) {
      return { status: "fail", message: "Unauthorized" }; // No token, unauthorized
    }

    const response = await axios.post(
      `${API_PATHS.PURCHASE}/${collectionId}`,
      {},
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        validateStatus: (status) => status >= 200 && status < 500, // Accept any 2xx or 4xx status as valid
      }
    );

    // Handle success response
    if (response.status === 200 || response.status === 201) {
      return { status: "success", data: response.data.data };
    }

    // Handle other errors
    return {
      status: "fail",
      message: response.data?.message || "Something went wrong",
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
      message: response.data?.message || "Something went wrong",
    };
  } catch (error) {
    return { status: "fail", message: error.message };
  }
};

// Function to get all collections by genre from the API
const getCollectionsByGenre = async (genreId, page = 1, limit = 20) => {
  try {
    const token = await AsyncStorage.getItem("userToken");
    if (!token) {
      return { status: "fail", message: "Unauthorized" }; // No token, unauthorized
    }
    const response = await axios.get(
      `${API_PATHS.COLLECTIONS}/genre/${genreId}?page=${page}&limit=${limit}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        validateStatus: (status) => status >= 200 && status < 500, // Accept any 2xx or 4xx status as valid
      }
    );

    // Handle success response
    if (response.status === 200 && response.data.code !== 204) {
      return { status: "success", data: response.data.data };
    }

    // Handle 204 response
    if (response.status === 204 || response.data.code === 204) {
      return {
        status: "success",
        data: {
          code: 204,
          message: "No collections found",
          genre: response.data.data.genre,
          collections: [],
          hasMore: false,
        },
      };
    }

    // Handle other errors
    return {
      status: "fail",
      message: response.data?.message || "Something went wrong",
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

    const payload = { placedObject };

    const response = await axios.post(API_PATHS.SAVE_PLACED_OBJECT, payload, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      validateStatus: (status) => status >= 200 && status < 500, // Accept any 2xx or 4xx status as valid
    });

    // Handle success response
    if (response.status === 200) {
      return { status: "success", data: response.data.data };
    } else if (response.status === 201) {
      return { status: "created", data: response.data.data };
    }

    // Handle other errors
    return {
      status: "fail",
      message: response.data?.message || "Something went wrong",
    };
  } catch (error) {
    return { status: "fail", message: error.message };
  }
};

// Get all placed objects form a collection
const getPlacedObjectsByCollection = async (collectionId) => {
  try {
    const token = await AsyncStorage.getItem("userToken");
    if (!token) {
      return { status: "fail", message: "Unauthorized" }; // No token, unauthorized
    }

    const response = await axios.get(
      `${API_PATHS.PLACED_OBJECTS}/${collectionId}`,
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
          message: "No placed objects found",
          placedObjects: [],
        },
      };
    }

    // Handle other errors
    return {
      status: "fail",
      message: response.data?.message || "Something went wrong",
    };
  } catch (error) {
    return { status: "fail", message: error.message };
  }
};

// Delete a placed object
const deletePlacedObject = async (placedObjectId) => {
  try {
    const token = await AsyncStorage.getItem("userToken");
    if (!token) {
      return { status: "fail", message: "Unauthorized" }; // No token, unauthorized
    }

    const response = await axios.delete(
      `${API_PATHS.PLACED_OBJECTS}/${placedObjectId}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        validateStatus: (status) => status >= 200 && status < 500, // Accept any 2xx or 4xx status as valid
      }
    );

    console.log("Response:", response.status, response.data); // Log the response for debugging

    // Handle success response
    if (response.status === 200) {
      return { status: "success", data: response.data };
    }

    // Handle 404 error
    if (response.status === 404) {
      return {
        status: "fail",
        data: {
          code: 404,
          message: "Placed object not found",
        },
      };
    }

    // Handle other errors
    return {
      status: "fail",
      message: response.data?.message || "Something went wrong",
    };
  } catch (error) {
    return { status: "fail", message: error.message };
  }
};

// Updat tokens for the current user from the API
const updateTokens = async (tokenAmount) => {
  try {
    const token = await AsyncStorage.getItem("userToken");
    if (!token) {
      return { status: "fail", message: "Unauthorized" }; // No token, unauthorized
    }

    const payload = {
      tokens: {
        tokenAmount,
      },
    };

    const response = await axios.put(API_PATHS.TOKENS, payload, {
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
      message: response.data?.message || "Something went wrong",
    };
  } catch (error) {
    return { status: "fail", message: error.message };
  }
};

// Get all genres from the API
const getGenres = async () => {
  try {
    const token = await AsyncStorage.getItem("userToken");
    if (!token) {
      return { status: "fail", message: "Unauthorized" }; // No token, unauthorized
    }

    const response = await axios.get(API_PATHS.GENRES, {
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
      message: response.data?.message || "Something went wrong",
    };
  } catch (error) {
    return { status: "fail", message: error.message };
  }
};

// Search for artists
const searchArtists = async (query, page = 1, limit = 20) => {
  try {
    const token = await AsyncStorage.getItem("userToken");
    if (!token) {
      return { status: "fail", message: "Unauthorized" }; // No token, unauthorized
    }

    const response = await axios.get(
      `${API_PATHS.SEARCH_ARTISTS}?query=${query}&page=${page}&limit=${limit}`,
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
      message: response.data?.message || "Something went wrong",
    };
  } catch (error) {
    return { status: "fail", message: error.message };
  }
};

// Search for collections
const searchCollections = async (query, page = 1, limit = 20) => {
  try {
    const token = await AsyncStorage.getItem("userToken");
    if (!token) {
      return { status: "fail", message: "Unauthorized" }; // No token, unauthorized
    }

    const response = await axios.get(
      `${API_PATHS.SEARCH_COLLECTIONS}?query=${query}&page=${page}&limit=${limit}`,
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
      message: response.data?.message || "Something went wrong",
    };
  } catch (error) {
    return { status: "fail", message: error.message };
  }
};

const apiRequest = async ({
  method = "GET",
  endpoint,
  data = null,
  params = {},
  requiresAuth = true,
}) => {
  try {
    console.log("API request data:", {
      method,
      endpoint,
      data,
      params,
      requiresAuth,
    }); // Log the request for debugging

    const token = requiresAuth ? await AsyncStorage.getItem("userToken") : null;

    if (requiresAuth && !token) {
      return { status: "fail", code: 401, message: "Unauthorized" }; // No token, unauthorized
    }

    const response = await axios({
      method,
      url: `${API_BASE_URL}${endpoint}`,
      headers: {
        ...(requiresAuth && token && { Authorization: `Bearer ${token}` }),
      },
      data,
      params,
      validateStatus: (status) => status >= 200 && status < 500, // Accept any 2xx or 4xx status as valid
    });

    console.log("API response:", response.data); // Log the response for debugging

    return response.data;
  } catch (error) {
    console.error("API request error:", error);
    throw error;
  }
};

export {
  changeCurrentUserPassword,
  getCurrentUser,
  updateCurrentUser,
  deleteCurrentUserAccount,
  updateCurrentUserProfilePicture,
  getArtists,
  getArtistDetails,
  getCollectionsForCurrentArtist,
  getArtistCollectionDetails,
  getCollectionDetails,
  getOwnedCollections,
  purchaseCollection,
  getCollections,
  getCollectionsByGenre,
  savePlacedObject,
  getPlacedObjectsByCollection,
  deletePlacedObject,
  updateTokens,
  getGenres,
  searchArtists,
  searchCollections,
  apiRequest,
};
