import axios from "axios";

const API_BASE_URL = "http://localhost:4000/api";

// Get all books (with optional search)
export const fetchBooks = (searchQuery = "") => {
  let url = `${API_BASE_URL}/books`;
  if (searchQuery) {
    url += `?searchQuery=${encodeURIComponent(searchQuery)}`;
  }
  return axios.get(url).then(res => res.data);
};

// Example: Get a single book by ID
export const fetchBookById = (id) => {
  return axios.get(`${API_BASE_URL}/books/${id}`).then(res => res.data);
};

// Example: Get user profile by ID
export const fetchUserProfile = (id) => {
  return axios.get(`${API_BASE_URL}/customer/Profile-Detail/${id}`).then(res => res.data);
};
export const fetchFilters = () => {
  return axios.get(`${API_BASE_URL}/filters`).then(res => res.data);
};