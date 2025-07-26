import axios from "axios";

const API_BASE_URL = "http://localhost:4000/api";

const axiosInstance = axios.create({
  baseURL: API_BASE_URL,
});

axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export const registerUser = (userData) => {
  return axiosInstance.post("/user/sign-up", userData);
};
export const updateUserProfile = (id, role = "customer", profileData) => {
  return axiosInstance.put(`/${role}/profile-detail/${id}`, profileData);
};

export const loginUser = (credentials) => {
  return axiosInstance.post("/user/login", credentials);
};

export const fetchUserProfile = (id, role = "customer") => {

  return axiosInstance.get(`/${role}/profile-detail/${id}`);
};

export const fetchAllBooks = (params = {}) => {
  return axiosInstance.get('/books', { params });
};

export const fetchBookById = (bookId) => {
  return axiosInstance.get(`/books/${bookId}`);
};
export const createBook = (userId, bookData) => {
  return axiosInstance.post(`/books/${userId}`, bookData);
};
export const updateBook = (userId, bookId, bookData) => {
  return axiosInstance.patch(`/books/${userId}/${bookId}`, bookData);
};
export const deleteBooks = (userId, bookIdsString) => {
  return axiosInstance.delete(`/books/${userId}/${bookIdsString}`);
};

export const addToCart = (bookId, quantity = 1) => {
  return axiosInstance.post('/cart/add', { bookId, quantity });
};
export const fetchUserProfileAdmin = (id, role) => {
  // Constructs the URL based on role: /vendor/profile-detail/123 or /customer/profile-detail/123
  // It defaults to 'customer' if the role isn't 'vendor' or 'admin'
  const rolePath = (role === 'vendor' || role === 'admin') ? 'vendor' : 'customer';
  return axiosInstance.get(`/${rolePath}/profile-detail/${id}`);
};