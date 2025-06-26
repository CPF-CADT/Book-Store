// services/api.js
const API_BASE_URL = import.meta.env.REACT_APP_API_URL || '/api';

// Generic API call function
async function apiCall(endpoint, options = {}) {
  const url = `${API_BASE_URL}${endpoint}`;
  const config = {
    headers: {
      'Content-Type': 'application/json',
      ...options.headers
    },
    ...options
  };

  try {
    const response = await fetch(url, config);
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error(`API call failed for ${endpoint}:`, error);
    throw error;
  }
}

// Fetch all books with optional filters
export async function fetchBooks(filters = {}) {
  const queryParams = new URLSearchParams();
  
  // Add filters to query params
  Object.entries(filters).forEach(([key, value]) => {
    if (value && value !== '') {
      if (Array.isArray(value) && value.length > 0) {
        queryParams.append(key, value.join(','));
      } else {
        queryParams.append(key, value);
      }
    }
  });

  const endpoint = `/books${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
  
  try {
    const data = await apiCall(endpoint);
    return data.books || data; // Handle different API response structures
  } catch (error) {
    // Fallback to mock data if API fails
    console.warn('Using fallback data due to API error', error);
    return getMockBooks();
  }
}

// Fetch a single book by ID
export async function fetchBookById(id) {
  try {
    const data = await apiCall(`/books/${id}`);
    return data.book || data;
  } catch (error) {
    console.error('Error fetching book:', error);
    throw error;
  }
}

// Fetch filter options (categories, brands, etc.)
export async function fetchFilters() {
  try {
    const data = await apiCall('/books/filters');
    return data.filters || data;
  } catch (error) {
    // Fallback to mock filter data
    console.warn('Using fallback filter data due to API error', error);
    return getMockFilters();
  }
}

// Search books
export async function searchBooks(query, filters = {}) {
  const searchParams = new URLSearchParams({
    q: query,
    ...filters
  });

  try {
    const data = await apiCall(`/books/search?${searchParams.toString()}`);
    return data.books || data;
  } catch (error) {
    console.error('Error searching books:', error);
    throw error;
  }
}

// Add book to cart
export async function addToCart(bookId, quantity = 1) {
  try {
    const data = await apiCall('/cart/add', {
      method: 'POST',
      body: JSON.stringify({ bookId, quantity })
    });
    return data;
  } catch (error) {
    console.error('Error adding to cart:', error);
    throw error;
  }
}

// Get user's cart
export async function getCart() {
  try {
    const data = await apiCall('/cart');
    return data.cart || data;
  } catch (error) {
    console.error('Error fetching cart:', error);
    throw error;
  }
}

// Mock data functions (fallbacks)
function getMockBooks() {
  return [
    {
      id: 1,
      title: "Simple Way Of Piece Life.",
      author: "Armor Ramsey",
      price: 40.00,
      originalPrice: 45.00,
      imageUrl: "https://images.unsplash.com/photo-1464983953574-0892a716854b?auto=format&fit=crop&w=400&q=80",
      rating: 4.5,
      stock: 15,
      category: "Self Help",
      availability: "In Stock",
      brand: "Penguin Books",
      color: "Blue",
      material: "Paperback",
      createdAt: "2024-01-15T00:00:00Z"
    },
    {
      id: 2,
      title: "Great Travel At Desert",
      author: "Sanchit Howdy",
      price: 38.00,
      imageUrl: "https://images.unsplash.com/photo-1512820790803-83ca734da794?auto=format&fit=crop&w=400&q=80",
      rating: 4.2,
      stock: 8,
      category: "Travel",
      availability: "In Stock",
      brand: "National Geographic",
      color: "Orange",
      material: "Hardcover",
      createdAt: "2024-01-10T00:00:00Z"
    },
    {
      id: 3,
      title: "The Art of Mindful Living",
      author: "Arthur Doyle",
      price: 45.00,
      imageUrl: "https://images.unsplash.com/photo-1524985069026-dd778a71c7b4?auto=format&fit=crop&w=400&q=80",
      rating: 4.8,
      stock: 12,
      category: "Philosophy",
      availability: "In Stock",
      brand: "Wisdom Publications",
      color: "Green",
      material: "Paperback",
      createdAt: "2024-01-20T00:00:00Z"
    },
    {
      id: 4,
      title: "Modern Web Development",
      author: "Tech Author",
      price: 55.00,
      originalPrice: 65.00,
      imageUrl: "https://images.unsplash.com/photo-1465101046530-73398c7f28ca?auto=format&fit=crop&w=400&q=80",
      rating: 4.6,
      stock: 0,
      category: "Technology",
      availability: "Out of Stock",
      brand: "O'Reilly Media",
      color: "Black",
      material: "Paperback",
      createdAt: "2024-01-25T00:00:00Z"
    },
    {
      id: 5,
      title: "Cooking Mastery",
      author: "Chef Master",
      price: 42.00,
      imageUrl: "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=400&q=80",
      rating: 4.4,
      stock: 20,
      category: "Cooking",
      availability: "In Stock",
      brand: "Culinary Press",
      color: "Red",
      material: "Hardcover",
      createdAt: "2024-01-05T00:00:00Z"
    }
  ];
}

function getMockFilters() {
  return {
    productType: [
      { value: "fiction", label: "Fiction", count: 150 },
      { value: "non-fiction", label: "Non-Fiction", count: 120 },
      { value: "textbook", label: "Textbook", count: 80 },
      { value: "children", label: "Children's Books", count: 90 }
    ],
    availability: [
      { value: "in-stock", label: "In Stock", count: 200 },
      { value: "out-of-stock", label: "Out of Stock", count: 15 },
      { value: "pre-order", label: "Pre-Order", count: 25 }
    ],
    brand: [
      { value: "penguin", label: "Penguin Books", count: 85 },
      { value: "harpercollins", label: "HarperCollins", count: 67 },
      { value: "macmillan", label: "Macmillan", count: 52 },
      { value: "random-house", label: "Random House", count: 73 }
    ],
    color: [
      { value: "blue", label: "Blue", count: 45 },
      { value: "red", label: "Red", count: 38 },
      { value: "green", label: "Green", count: 42 },
      { value: "black", label: "Black", count: 35 },
      { value: "white", label: "White", count: 40 }
    ],
    material: [
      { value: "paperback", label: "Paperback", count: 180 },
      { value: "hardcover", label: "Hardcover", count: 120 },
      { value: "ebook", label: "E-book", count: 95 }
    ]
  };
}