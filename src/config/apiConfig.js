const API_BASE_URL = "https://obsense-api.onrender.com/api/v1";

const API_PATHS = {
  // Auth Endpoints
  SIGNUP: `${API_BASE_URL}/users/signup`,
  LOGIN: `${API_BASE_URL}/users/login`,

  // Current User Endpoints
  // GET /users/me -> Get current user
  ME: `${API_BASE_URL}/users/me`,

  // Artist Endpoints
  // GET /artist/collections -> Get all collections for current artist
  ARTIST_COLLECTIONS: `${API_BASE_URL}/artist/collections`,

  // User Endpoints
};

export default API_PATHS;
