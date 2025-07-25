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

export const fetchBooks = (params = {}) => {
  return axiosInstance.get("/books", { params });
};

export const fetchBookById = (id) => {
  return axiosInstance.get(`/books/${id}`);
};
