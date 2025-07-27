// client/services/api.js
import axios from "axios";

const API_BASE_URL = "http://localhost:3000/api";

// Create axios instance with default config
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000, // 10 second timeout
  headers: {
    'Content-Type': 'application/json'
  }
});

// Add request interceptor for debugging
apiClient.interceptors.request.use(
  (config) => {
    console.log(`Making ${config.method?.toUpperCase()} request to: ${config.url}`);
    return config;
  },
  (error) => {
    console.error('Request error:', error);
    return Promise.reject(error);
  }
);

// Add response interceptor for error handling
apiClient.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    console.error('API Error:', error.response?.data || error.message);
    return Promise.reject(error);
  }
);

// Get all books (with optional search)
export const fetchBooks = async (searchQuery = "") => {
  try {
    let url = `/books`;
    if (searchQuery) {
      url += `?searchQuery=${encodeURIComponent(searchQuery)}`;
    }
    const response = await apiClient.get(url);
    return response.data;
  } catch (error) {
    console.error('Error fetching books:', error);
    throw new Error(`Failed to fetch books: ${error.response?.data?.message || error.message}`);
  }
};  

// Get filter options
export const fetchFilters = async () => {
  try {
    const response = await apiClient.get('/filters');
    return response.data;
  } catch (error) {
    console.error('Error fetching filters:', error);
    throw new Error(`Failed to fetch filters: ${error.response?.data?.message || error.message}`);
  }
};

// Get price range for filters
export const fetchPriceRange = async () => {
  try {
    const response = await apiClient.get('/filters/price-range');
    return response.data;
  } catch (error) {
    console.error('Error fetching price range:', error);
    throw new Error(`Failed to fetch price range: ${error.response?.data?.message || error.message}`);
  }
};

// Get a single book by ID
export const fetchBookById = async (id) => {
  try {
    const response = await apiClient.get(`/books/${id}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching book by ID:', error);
    throw new Error(`Failed to fetch book: ${error.response?.data?.message || error.message}`);
  }
};

// Get user profile by ID
export const fetchUserProfile = async (id) => {
  try {
    const response = await apiClient.get(`/customer/Profile-Detail/${id}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching user profile:', error);
    throw new Error(`Failed to fetch user profile: ${error.response?.data?.message || error.message}`);
  }
};

// Health check function to test if API is running
export const checkApiHealth = async () => {
  try {
    const response = await apiClient.get('/');
    return response.data;
  } catch (error) {
    console.error('API health check failed:', error);
    throw new Error(`API is not responding: ${error.message}`);
  }
};