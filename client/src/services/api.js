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
  const rolePath = (role === 'vendor' || role === 'admin') ? 'vendor' : 'customer';
  return axiosInstance.get(`/${rolePath}/profile-detail/${id}`);
};
export const fetchAllCategories = () => {
  return axiosInstance.get('/category', { params: { limit: 100 } }); 
};
export const fetchAllAuthorsForFilter = () => {
  return axiosInstance.get('/author', { params: { limit: 100 } });
};
export const fetchAllTags = () => {
  return axiosInstance.get('/tag', { params: { limit: 100 } });
};
export const submitContactForm = (formData) => {
  return axiosInstance.post('/contact/submit', formData);
};
export const fetchBlogPosts = (page = 1) => {
  return axiosInstance.get('/blog/posts', { params: { page } });
};

export const fetchBlogPostBySlug = (slug) => {
  return axiosInstance.get(`/blog/posts/${slug}`);
};
export const adminFetchUsers = (params = {}) => {
  return axiosInstance.get('/admin/users', { params });
};

export const adminCreateUser = (userData) => {
  return axiosInstance.post('/admin/users', userData);
};

export const adminUpdateUser = (userId, userData) => {
  return axiosInstance.put(`/admin/users/${userId}`, userData);
};

export const adminDeleteUser = (userId) => {
  return axiosInstance.delete(`/admin/users/${userId}`);
};

export const adminCreateBook = (userId, bookData) => {
  return axiosInstance.post(`/books/${userId}`, bookData);
};
export const adminUpdateBook = (userId, bookId, bookData) => {
  return axiosInstance.patch(`/books/${userId}/${bookId}`, bookData);
};
export const adminDeleteBooks = (userId, bookIdsString) => {
  return axiosInstance.delete(`/books/${userId}/${bookIdsString}`);
};
export const createCategory = (userId, categoryData) => {
  // Matches POST /:userId/category
  return axiosInstance.post(`/${userId}/category`, categoryData);
};
export const updateCategory = (userId, categoryId, categoryData) => {
  // Matches PATCH /:userId/category/:id
  return axiosInstance.patch(`/${userId}/category/${categoryId}`, categoryData);
};
export const deleteCategories = (userId, categoryIdsString) => {
  return axiosInstance.delete(`/${userId}/category`, { params: { ids: categoryIdsString } });
};

export const fetchAllAuthors = (params = {}) => {
  // Matches GET /author
  // Note: The base URL from axiosInstance will be `/api`, so this becomes /api/author
  return axiosInstance.get('/author', { params });
};
export const createAuthor = (userId, authorData) => {
  // Matches POST /author/:userId
  return axiosInstance.post(`/author/${userId}`, authorData);
};
export const updateAuthor = (userId, authorId, authorData) => {
  // Matches PATCH /author/:userId/:authorId
  return axiosInstance.patch(`/author/${userId}/${authorId}`, authorData);
};
export const deleteAuthors = (userId, authorIdsString) => {
  // Matches DELETE /author/:userId/:ids
  return axiosInstance.delete(`/author/${userId}/${authorIdsString}`);
};
export const createTag = (tagData) => {
  // Matches POST /tag
  return axiosInstance.post('/tag', tagData);
};
export const updateTag = (tagId, tagData) => {
  // Matches PATCH /tag/:id
  return axiosInstance.patch(`/tag/${tagId}`, tagData);
};

export const deleteTags = (tagIdsString) => {
  // Matches DELETE /tag?ids=1,2,3
  return axiosInstance.delete('/tag', { params: { ids: tagIdsString } });
};
export const adminCreateBlogPost = (postData) => {
  return axiosInstance.post('/blog/posts', postData);
};

export const adminUpdateBlogPost = (postId, postData) => {
  return axiosInstance.put(`/blog/posts/${postId}`, postData);
};

export const adminDeleteBlogPost = (postId) => {
  return axiosInstance.delete(`/blog/posts/${postId}`);
};