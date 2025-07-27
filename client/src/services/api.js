// client/src/services/api.js
import axios from 'axios';
const API_URL = 'http://localhost:3001/api';
const api = axios.create({ baseURL: API_URL });

export const fetchFilters = async () => {
  try {
    const response = await api.get('/books/filters');
    return response.data;
  } catch (error) {
    console.error("API Error: Failed to fetch filters", error);
    throw error;
  }
};

export const fetchBooks = async (params) => {
  try {
    const queryParams = { ...params };
    if (queryParams.availability) {
      queryParams.status = queryParams.availability;
      delete queryParams.availability;
    }
    const response = await api.get('/books', { params: queryParams });
    return response.data;
  } catch (error) {
    console.error("API Error: Failed to fetch books", error);
    throw error;
  }
};

export const fetchBookById = async (bookId) => {
  try {
    const response = await api.get(`/books/${bookId}`);
    return response.data;
  } catch (error) {
    console.error(`API Error: Failed to fetch book ${bookId}`, error);
    throw error;
  }
};

export const loginUser = async (credentials) => {
  try {
    const response = await api.post('/auth/login', credentials);
    return response.data;
  } catch (error) {
    return error.response?.data || { success: false, message: 'Network error.' };
  }
};

export const registerUser = async (userData) => {
  try {
    const response = await api.post('/auth/register', userData);
    return response.data;
  } catch (error) {
    return error.response?.data || { success: false, message: 'Network error.' };
  }
};