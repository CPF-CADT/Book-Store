import { useEffect, useState } from "react";
import { fetchBooks, fetchFilters } from "../services/api";

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

  // Fetch initial data from database
  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        const [bookRes, filtersRes] = await Promise.all([
          fetchBooks(),
          fetchFilters()
        ]);
        
        setBooks(Array.isArray(bookRes) ? bookRes : []);
        setFilteredBooks(Array.isArray(bookRes) ? bookRes : []);
        setFilterOptions(filtersRes);

      } catch (err) {
        setError('Failed to load data from database');
        console.error('Error loading data: ');
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, []);

  // Apply filtering and sorting
  useEffect(() => {
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
    if(books.length > 0) {
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

  // Filter Sidebar Component
  const FilterSidebar = ({ filters, filterOptions, onFilterChange }) => {
    const handlePriceChange = (type, value) => {
      onFilterChange({
        priceRange: {
          ...filters.priceRange,
          [type]: value
        }
      });
    };

    const handleCategoryChange = (category, value, checked) => {
      const currentValues = filters[category] || [];
      const newValues = checked
        ? [...currentValues, value]
        : currentValues.filter(v => v !== value);
      
      onFilterChange({
        [category]: newValues
      });
    };

    return (
      <div className="space-y-6">
        <h2 className="text-xl font-bold">Filters</h2>
        
        {/* Price Range Filter */}
        <div>
          <h3 className="font-semibold mb-2">Price Range</h3>
          <div className="space-y-2">
            <input
              type="number"
              placeholder="Min Price"
              value={filters.priceRange.min}
              onChange={(e) => handlePriceChange('min', e.target.value)}
              className="w-full p-2 border rounded"
            />
            <input
              type="number"
              placeholder="Max Price"
              value={filters.priceRange.max}
              onChange={(e) => handlePriceChange('max', e.target.value)}
              className="w-full p-2 border rounded"
            />
          </div>
        </div>

        {/* Dynamic Filter Sections from /api/filters */}
        {Object.entries(filterOptions).map(([category, options]) => (
          <div key={category}>
            <h3 className="font-semibold mb-2 capitalize">{category.replace(/([A-Z])/g, ' $1')}</h3>
            <div className="space-y-1 max-h-32 overflow-y-auto">
              {options.map(option => (
                <label key={option.value} className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={filters[category]?.includes(option.value) || false}
                    onChange={(e) => handleCategoryChange(category, option.value, e.target.checked)}
                    className="rounded"
                  />
                  <span className="text-sm">{option.label}</span>
                </label>
              ))}
            </div>
          </div>
        ))}

        {/* Clear Filters Button */}
        <button
          onClick={() => onFilterChange({
            priceRange: { min: '', max: '' },
            productType: [],
            availability: [],
            brand: [],
            color: [],
            material: []
          })}
          className="w-full bg-gray-500 text-white py-2 rounded hover:bg-gray-600"
        >
          Clear All Filters
        </button>
      </div>
    );
  };

  // Sort Controls Component
  const SortControls = ({ sortBy, itemsPerPage, totalItems, startIndex, endIndex, onSortChange, onItemsPerPageChange }) => {
    return (
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center space-x-4">
          <div>
            <label className="text-sm font-medium mr-2">Sort by:</label>
            <select
              value={sortBy}
              onChange={(e) => onSortChange(e.target.value)}
              className="p-2 border rounded"
            >
              <option value="alphabetical-asc">Title A-Z</option>
              <option value="alphabetical-desc">Title Z-A</option>
              <option value="price-low-high">Price: Low to High</option>
              <option value="price-high-low">Price: High to Low</option>
              <option value="newest">Newest First</option>
            </select>
          </div>

          <div>
            <label className="text-sm font-medium mr-2">Show:</label>
            <select
              value={itemsPerPage}
              onChange={(e) => onItemsPerPageChange(parseInt(e.target.value))}
              className="p-2 border rounded"
            >
              <option value={12}>12 per page</option>
              <option value={24}>24 per page</option>
              <option value={48}>48 per page</option>
            </select>
          </div>
        </div>

        <div className="text-sm text-gray-600">
          Showing {startIndex + 1}-{endIndex} of {totalItems} products
        </div>
      </div>
    );
  };

  // Product Grid Component
  const ProductGrid = ({ books }) => {
    if (!books || books.length === 0) {
      return (
        <div className="text-center py-12">
          <p className="text-gray-500 text-lg">No products found matching your criteria.</p>
        </div>
      );
    }

    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {books.map((book) => (
          <div key={book.id} className="border rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 overflow-hidden">
            <div className="p-4">
              <h3 className="font-bold text-lg mb-2 line-clamp-2">{book.title}</h3>
              <div className="space-y-1 mb-3">
                <p className="text-2xl font-bold text-red-600">${book.price.toFixed(2)}</p>
                <p className="text-sm text-gray-600">{book.brand}</p>
                <p className="text-sm text-gray-500">{book.productType}</p>
              </div>
              
              <div className="flex items-center justify-between mb-3">
                <span className={`px-2 py-1 text-xs rounded-full ${
                  book.availability === 'In Stock' 
                    ? 'bg-green-100 text-green-800' 
                    : 'bg-yellow-100 text-yellow-800'
                }`}>
                  {book.availability}
                </span>
                {book.color && (
                  <span className="text-xs text-gray-500">{book.color}</span>
                )}
              </div>

              <button className="w-full bg-red-500 text-white py-2 rounded hover:bg-red-600 transition-colors">
                {book.availability === 'In Stock' ? 'Add to Cart' : 'Pre-order'}
              </button>
            </div>
          </div>
        ))}
      </div>
    );
  };

  if (loading) {
    return (
       <div className="min-h-screen flex flex-col bg-white">
        <main className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-500 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading Products...</p>
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