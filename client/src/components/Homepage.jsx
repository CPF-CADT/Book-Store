import { useEffect, useState, useCallback } from "react";
import { HomeHeader, Footer } from "../components/HeaderFooter"; // Assuming these exist
// import FilterSideBar from "./FilterSideBar.jsx";
import ProductGrid from "./ProductGrid.jsx";
import BookListPage from "./SortControls.jsx";
import { fetchAllBooks } from "../services/api"; // Import your API function

export function Homepage() {
  // State for the data returned by the API
  const [pageData, setPageData] = useState({
    books: [],
    totalItems: 0,
    totalPages: 1,
    currentPage: 1,
  });

  // State for user-selected filters and sorting
    const [filters, setFilters] = useState({
    priceRange: { min: '', max: '' },
    categoryId: [], // Array for multi-select categories
    authorId: [],   // Array for multi-select authors
    searchQuery: '',
  });
const [sortBy, setSortBy] = useState('create_at-DESC');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(12);
  
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
const filterOptions = {
    categoryId: [
      { value: 1, label: 'Fiction' },
      { value: 2, label: 'Science' },
      { value: 5, label: 'History' },
    ],
    authorId: [
      { value: 3, label: 'J.K. Rowling' },
      { value: 4, label: 'George Orwell' },
    ]
  };

  // --- THE MAIN DATA FETCHING LOGIC ---
  const loadBooks = async (page, currentFilters, currentSortBy, limit) => {
    setLoading(true);
    setError(null);
    try {
      const [sortField, sortOrder] = currentSortBy.split('-');
      const params = {
        page: page,
        limit: limit,
        sortBy: sortField,
        sortOrder: sortOrder,
        searchQuery: currentFilters.searchQuery,
        minPrice: currentFilters.priceRange.min,
        maxPrice: currentFilters.priceRange.max,
        categoryId: currentFilters.categoryId.join(','),
        authorId: currentFilters.authorId.join(','),
      };
      const response = await fetchAllBooks(params);
      setPageData(response.data);
    } catch (err) {
      setError('Failed to load books. Please try again.');
      console.error('Error loading books:', err);
    } finally {
      setLoading(false);
    }
  }; // Dependencies for the fetch function

  // This single useEffect now handles all data loading
    useEffect(() => {
    // This effect is now the single source of truth for triggering a data fetch.
    loadBooks(currentPage, filters, sortBy, itemsPerPage);
  }, [currentPage, filters, sortBy, itemsPerPage]); // The dependency is the memoized `loadBooks` function

  // --- HANDLER FUNCTIONS ---
  // These functions update the state, which triggers the useEffect to re-fetch data

 const handleFilterChange = useCallback((updater) => {
    setFilters(prevFilters => {
      if (typeof updater === 'function') {
        return updater(prevFilters);
      }
      return { ...prevFilters, ...updater };
    });
    setCurrentPage(1);
  }, []); 

   const handleSortChange = (newSortBy) => {
    setSortBy(newSortBy);
    setCurrentPage(1);
  };

  // const handleItemsPerPageChange = (newItemsPerPage) => {
  //   setItemsPerPage(newItemsPerPage);
  //   setCurrentPage(1);
  // };
  
 const handlePageChange = (newPage) => {
    // Add boundary checks for safety
    if (newPage > 0 && newPage <= pageData.totalPages) {
      setCurrentPage(newPage);
    }
  };

  // --- RENDER LOGIC ---

  if (loading && pageData.books.length === 0) { // Show full-page loader only on initial load
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error} <button onClick={loadBooks}>Retry</button></div>;
  }


  return (
    <div className="min-h-screen flex flex-col bg-white">
      <HomeHeader />
      <main className="flex-1">
        <div className="flex flex-col lg:flex-row max-w-7xl mx-auto w-full pt-12 pb-8 px-4">
          {/* <FilterSideBar
            filters={filters}
            filterOptions={filterOptions}
            onFilterChange={handleFilterChange}
          /> */}
          <section className="flex-1 lg:ml-8 mt-8 lg:mt-0">
            {/* Sort Controls would be a component here */}
            <div className="mb-4">
              <select value={sortBy} onChange={(e) => handleSortChange(e.target.value)}>
                <option value="create_at-DESC">Newest</option>
                <option value="price-ASC">Price: Low to High</option>
                <option value="price-DESC">Price: High to Low</option>
              </select>
            </div>

            {loading && <p>Loading...</p>}
            {error && <p className="text-red-500">{error}</p>}
            {!loading && !error && (
              <>
                {pageData.books.length > 0 ? (
                  <ProductGrid books={pageData.books} />
                ) : (
                  <p>No books found matching your criteria.</p>
                )}

                {/* Pagination */}
                {pageData.totalPages > 1 && (
                  <div className="flex justify-center items-center mt-8 space-x-2">
                    <button onClick={() => handlePageChange(currentPage - 1)} disabled={currentPage === 1}>Prev</button>
                    <span>Page {pageData.currentPage} of {pageData.totalPages}</span>
                    <button onClick={() => handlePageChange(currentPage + 1)} disabled={currentPage === pageData.totalPages}>Next</button>
                  </div>
                )}
              </>
            )}
          </section>
        </div>
      </main>
      <Footer />
    </div>
  );
}