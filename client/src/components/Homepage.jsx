import { useEffect, useState } from "react";

// No need to import from 'react-router-dom'
// No need to import fetchBooks from api since we are mocking it here
// import { fetchBooks } from "../services/api";

// --- MOCK DATA FOR TESTING ---

// 1. Mock data for the books array
const mockBooks = [
  { id: 1, title: 'The Great Gatsby', price: 10.99, createdAt: '2023-10-26T10:00:00Z', productType: 'Paperback', availability: 'In Stock', brand: 'Penguin Classics', color: 'Blue', material: 'Paper' },
  { id: 2, title: 'To Kill a Mockingbird', price: 12.50, createdAt: '2023-09-15T12:30:00Z', productType: 'Hardcover', availability: 'In Stock', brand: 'HarperCollins', color: 'Black', material: 'Premium Cardboard' },
  { id: 3, title: '1984', price: 9.99, createdAt: '2024-01-05T15:00:00Z', productType: 'Paperback', availability: 'Pre-order', brand: 'Vintage Books', color: 'Red', material: 'Paper' },
  { id: 4, title: 'Dune', price: 15.00, createdAt: '2022-11-20T08:45:00Z', productType: 'E-book', availability: 'In Stock', brand: 'Simon & Schuster', color: 'Multi-color', material: 'Paper' },
  // Add 10-20 more mock books here to test pagination properly
  { id: 5, title: 'Pride and Prejudice', price: 8.99, createdAt: '2023-12-01T11:00:00Z', productType: 'Paperback', availability: 'In Stock', brand: 'Penguin Classics', color: 'Multi-color', material: 'Paper' },
  { id: 6, title: 'The Hobbit', price: 14.99, createdAt: '2023-08-22T14:20:00Z', productType: 'Hardcover', availability: 'In Stock', brand: 'HarperCollins', color: 'Green', material: 'Premium Cardboard' },
  { id: 7, title: 'Brave New World', price: 11.25, createdAt: '2024-02-10T09:00:00Z', productType: 'Paperback', availability: 'In Stock', brand: 'Vintage Books', color: 'Blue', material: 'Paper' },
  { id: 8, title: 'Moby Dick', price: 13.75, createdAt: '2023-07-30T18:00:00Z', productType: 'Hardcover', availability: 'Pre-order', brand: 'Penguin Classics', color: 'Black', material: 'Leather Bound' },
  { id: 9, title: 'War and Peace', price: 19.99, createdAt: '2023-06-18T20:15:00Z', productType: 'E-book', availability: 'In Stock', brand: 'Simon & Schuster', color: 'Multi-color', material: 'Paper' },
  { id: 10, title: 'The Catcher in the Rye', price: 10.00, createdAt: '2023-05-12T13:45:00Z', productType: 'Paperback', availability: 'In Stock', brand: 'Penguin Classics', color: 'Red', material: 'Paper' },
  { id: 11, title: 'Crime and Punishment', price: 12.99, createdAt: '2023-04-25T16:55:00Z', productType: 'Hardcover', availability: 'In Stock', brand: 'Vintage Books', color: 'Black', material: 'Premium Cardboard' },
  { id: 12, title: 'The Lord of the Rings', price: 25.00, createdAt: '2023-03-19T22:00:00Z', productType: 'Hardcover', availability: 'In Stock', brand: 'HarperCollins', color: 'Multi-color', material: 'Leather Bound' },
  { id: 13, title: 'Frankenstein', price: 7.99, createdAt: '2024-03-01T07:30:00Z', productType: 'Paperback', availability: 'Pre-order', brand: 'Penguin Classics', color: 'Black', material: 'Paper' },

];

// 2. Mock fetchBooks function to simulate an API call
const fetchBooks = () => {
  console.log("Mock fetchBooks called");
  return Promise.resolve(mockBooks);
};

// Mock data for filter options
const mockFilterOptions = {
  productType: ["Hardcover", "Paperback", "E-book"],
  availability: ["In Stock", "Pre-order"],
  brand: ["Penguin Classics", "HarperCollins", "Simon & Schuster", "Vintage Books"],
  color: ["Red", "Blue", "Black", "Multi-color", "Green"],
  material: ["Paper", "Premium Cardboard", "Leather Bound"]
};

// Mock fetchFilters function to simulate an API call
const fetchFilters = () => {
  console.log("Mock fetchFilters called");
  return Promise.resolve(mockFilterOptions);
};


export function Homepage() {
  const [books, setBooks] = useState([]);
  const [filteredBooks, setFilteredBooks] = useState([]);
  const [filters, setFilters] = useState({
    priceRange: { min: '', max: '' },
    productType: [],
    availability: [],
    brand: [],
    color: [],
    material: []
  });
  const [sortBy, setSortBy] = useState('alphabetical-asc');
  const [itemsPerPage, setItemsPerPage] = useState(12);
  const [currentPage, setCurrentPage] = useState(1);
  const [filterOptions, setFilterOptions] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch initial data
  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        const [bookRes, filtersRes] = await Promise.all([
          fetchBooks(),
          fetchFilters()
        ]);
        
        // **FIX & SAFEGUARD**: Ensure bookRes is an array before setting state.
        setBooks(Array.isArray(bookRes) ? bookRes : []);
        setFilteredBooks(Array.isArray(bookRes) ? bookRes : []);
        setFilterOptions(filtersRes);

      } catch (err) {
        setError('Failed to load data');
        console.error('Error loading data: ', err);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, []);

  // Apply filtering and sorting
  useEffect(() => {
    // No need for a try-catch here if the data is handled correctly.
    // Errors in this logic are better caught during development.
    let result = [...books];

    // Apply price range filter
    if (filters.priceRange.min || filters.priceRange.max) {
      result = result.filter(book => {
        const price = book.price;
        const min = filters.priceRange.min ? parseFloat(filters.priceRange.min) : 0;
        const max = filters.priceRange.max ? parseFloat(filters.priceRange.max) : Infinity;
        return price >= min && price <= max;
      });
    }

    // Apply category filters
    Object.keys(filters).forEach(filterKey => {
      if (filterKey !== 'priceRange' && filters[filterKey].length > 0) {
        result = result.filter(book => {
          return filters[filterKey].some(value =>
            book[filterKey]?.toLowerCase().includes(value.toLowerCase())
          );
        });
      }
    });

    // Apply sorting
    result.sort((a, b) => {
      switch (sortBy) {
        case 'alphabetical-asc':
          return a.title.localeCompare(b.title);
        case 'alphabetical-desc':
          return b.title.localeCompare(a.title);
        case 'price-low-high':
          return a.price - b.price;
        case 'price-high-low':
          return b.price - a.price;
        case 'newest':
          return new Date(b.createdAt) - new Date(a.createdAt);
        default:
          return 0;
      }
    });

    setFilteredBooks(result);
    if(books.length > 0) { // Avoid resetting page on initial empty render
        setCurrentPage(1);
    }
    
  }, [books, filters, sortBy]);

  const handleFilterChange = (newFilters) => {
    setFilters(prevFilters => ({...prevFilters, ...newFilters}));
  };

  const handleSortChange = (newSortBy) => {
    setSortBy(newSortBy);
  };

  const handleItemsPerPageChange = (newItemPerPage) => {
    setItemsPerPage(newItemPerPage);
    setCurrentPage(1);
  };

  // Pagination logic
  const totalItems = filteredBooks.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentBooks = filteredBooks.slice(startIndex, endIndex);

  if (loading) {
    return (
       <div className="min-h-screen flex flex-col bg-white">
        <main className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-500 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading Books...</p>
          </div>
        </main>
      </div>
    )
  }

  if (error) {
    return (
       <div className="min-h-screen flex flex-col bg-white">
        <main className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <p className="text-red-500 mb-4">{error}</p>
            <button
              onClick={() => window.location.reload()}
              className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
            >
              Retry
            </button>
          </div>
        </main>
      </div>
    )
  }

  // NOTE: Placeholder components for rendering.
  const FilterSidebar = ({ filters, filterOptions, onFilterChange }) => <div>Filter Sidebar Placeholder</div>;
  const SortControls = ({ onSortChange }) => <div>Sort Controls Placeholder</div>;
  const ProductGrid = ({ books }) => {
      if (!books || books.length === 0) return <p>No books to display.</p>;

      return (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {books.map((book) => (
            <div key={book.id} className="border p-4 rounded-lg shadow">
                <h3 className="font-bold">{book.title}</h3>
                <p>${book.price.toFixed(2)}</p>
                <p className="text-sm text-gray-500">{book.brand}</p>
            </div>
          ))}
        </div>
      );
  };

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <main className="flex-1 flex flex-col">
        <div className="flex flex-1 max-w-7xl mx-auto w-auto pt-12 pb-8 px-4">
          <aside className="w-64 pr-8">
            <FilterSidebar
              filters={filters}
              filterOptions={filterOptions}
              onFilterChange={handleFilterChange}
            />
          </aside>

          <section className="flex-1">
            <SortControls
              sortBy={sortBy}
              itemsPerPage={itemsPerPage}
              totalItems={totalItems}
              startIndex={startIndex}
              endIndex={Math.min(endIndex, totalItems)}
              onSortChange={handleSortChange}
              onItemsPerPageChange={handleItemsPerPageChange}
            />

            <div className="mt-6">
              <ProductGrid books={currentBooks} />
            </div>

            {totalPages > 1 && (
              <div className="flex justify-center items-center mt-8 space-x-2">
                <button
                  onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                  disabled={currentPage === 1}
                  className="px-4 py-2 border rounded disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-100"
                >
                  Previous
                </button>

                {[...Array(totalPages)].map((_, index) => (
                  <button
                    key={index + 1}
                    onClick={() => setCurrentPage(index + 1)}
                    className={`px-4 py-2 border rounded ${
                      currentPage === index + 1
                        ? 'bg-red-500 text-white border-red-500'
                        : 'hover:bg-gray-100'
                    }`}
                  >
                    {index + 1}
                  </button>
                ))}

                <button
                  onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                  disabled={currentPage === totalPages}
                  className="px-4 py-2 border rounded disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-100"
                >
                  Next
                </button>
              </div>
            )}
          </section>
        </div>
      </main>
    </div>
  );
}