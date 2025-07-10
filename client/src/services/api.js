const API_BASE_URL = 'http://localhost:3000/api'; // Replace with your backend URL

export const api = {
  // Authentication
  login: (credentials) => fetch(`${API_BASE_URL}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(credentials)
  }),
  
  register: (userData) => fetch(`${API_BASE_URL}/auth/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(userData)
  }),
  
  // Books
  getBooks: () => fetch(`${API_BASE_URL}/books`),
  getBookById: (id) => fetch(`${API_BASE_URL}/books/${id}`),
  
  // User account
  getUserProfile: (token) => fetch(`${API_BASE_URL}/user/profile`, {
    headers: { 'Authorization': `Bearer ${token}` }
  })
};