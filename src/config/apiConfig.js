const API_BASE_URL = "https://obsense-api.onrender.com/api/v1";

const API_PATHS = {
  // Auth Endpoints
  SIGNUP: `${API_BASE_URL}/users/signup`,
  LOGIN: `${API_BASE_URL}/users/login`,
  CHANGE_PASSWORD: `${API_BASE_URL}/users/change-password`,

  // Current User Endpoints
  // GET /users/me -> Get current user
  ME: `${API_BASE_URL}/users/me`,
  ME_PROFILE_PICTURE: `${API_BASE_URL}/users/me/profile-picture`,

  // Artist Endpoints
  // GET /artists -> Get all artists
  ARTISTS: `${API_BASE_URL}/artists`,
  // GET /artist/collections -> Get all collections for current artist
  ARTIST_COLLECTIONS: `${API_BASE_URL}/artist/collections`,

  // User Endpoints

  // Purchase Endpoints
  // GET /purchases -> Get all purchases for the current user
  OWNED_COLLECTIONS: `${API_BASE_URL}/purchases`,
  // GET /purchases/:id -> Get purchase by ID
  PURCHASE: `${API_BASE_URL}/purchases`,

  // Collection Endpoints
  // GET /collections -> Get all collections
  COLLECTIONS: `${API_BASE_URL}/collections`,

  // Placeholder Endpoints
  // Placed Object Endpoints
  SAVE_PLACED_OBJECT: `${API_BASE_URL}/placedObjects/save`,
  // GET /placedObjects -> Get all placed objects for the current user
  PLACED_OBJECTS: `${API_BASE_URL}/placedObjects`,

  // Token Endpoints
  // GET /tokens -> Get all tokens for the current user
  TOKENS: `${API_BASE_URL}/tokens`,
};

export default API_PATHS;
