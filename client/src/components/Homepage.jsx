import { useEffect, useState, useCallback } from "react";
import { HomeHeader, Footer } from "../components/HeaderFooter"; // Assuming these exist
import FilterSideBar from "./FilterSideBar.jsx";
import ProductGrid from "./ProductGrid.jsx";
import BookListPage from "./SortControls.jsx";
import { 
  fetchAllBooks, 
  fetchAllCategories, 
  fetchAllAuthorsForFilter, 
  fetchAllTags 
} from "../services/api"; // Import your API function

export function Homepage() {
  // State for the data returned by the API
  const [pageData, setPageData] = useState({
    books: [],
    totalItems: 0,
    totalPages: 1,
    currentPage: 1,
  });

  const [filters, setFilters] = useState({
    priceRange: { min: '', max: '' },
    // FIX #4: Use strings for single-select dropdowns
    categoryId: '',
    authorId: '',
    tagId: '',
    searchQuery: '',
  });
const [sortBy, setSortBy] = useState('create_at-DESC');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(12);

 const [dynamicFilterOptions, setDynamicFilterOptions] = useState({
    categories: [],
    authors: [],
    tags: [],
  });

  
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
// const filterOptions = {
//     categoryId: [
//       { value: 1, label: 'Fiction' },
//       { value: 2, label: 'Science' },
//       { value: 5, label: 'History' },
//     ],
//     authorId: [
//       { value: 3, label: 'J.K. Rowling' },
//       { value: 4, label: 'George Orwell' },
//     ]
//   };
   useEffect(() => {
    const loadFilterOptions = async () => {
      try {
        const [catRes, authRes, tagRes] = await Promise.all([
          fetchAllCategories(),
          fetchAllAuthorsForFilter(),
          fetchAllTags()
        ]);
        
        setDynamicFilterOptions({
          categories: catRes.data.categories?.map(c => ({ value: c.id, label: c.name })) || [],
          authors: authRes.data.authors?.map(a => ({ value: a.id, label: a.name })) || [],
          tags: tagRes.data.tags?.map(t => ({ value: t.id, label: t.name })) || [],
        });
      } catch (err) {
        console.error("Failed to load filter options:", err);
      }
    };
    loadFilterOptions();
  }, []); 

  // --- THE MAIN DATA FETCHING LOGIC ---
   const loadBooks = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const [sortField, sortOrder] = sortBy.split('-');
      
      const params = {
        page: currentPage,
        limit: itemsPerPage,
        sortBy: sortField,
        sortOrder: sortOrder,
        searchQuery: filters.searchQuery,
        minPrice: filters.priceRange.min,
        maxPrice: filters.priceRange.max,
        // FIX #3: Include tagId and use the correct filter state properties
        categoryId: filters.categoryId,
        authorId: filters.authorId,
        tagId: filters.tagId,
      };
      
      const response = await fetchAllBooks(params);
      setPageData(response.data);
    } catch (err) {
      setError('Failed to load books. Please try again.');
      console.error('Error loading books:', err);
    } finally {
      setLoading(false);
    }
  }, [currentPage, itemsPerPage, filters, sortBy]); // Dependencies for the fetch function

  // This single useEffect now handles all data loading
    useEffect(() => {
    loadBooks();
  }, [loadBooks]);

  // --- HANDLER FUNCTIONS ---
  // These functions update the state, which triggers the useEffect to re-fetch data

const handleFilterChange = useCallback((updater) => {
    setFilters(prevFilters => {
      if (typeof updater === 'function') {
        return updater(prevFilters);
      }
      return { ...prevFilters, ...updater };
    });
    setCurrentPage(1); // Reset page on filter change
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
<FilterSideBar
            filters={filters}
            filterOptions={dynamicFilterOptions} 
            onFilterChange={handleFilterChange}
          />
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
                    {/* Previous Button */}
                    <button 
                      onClick={() => handlePageChange(currentPage - 1)} 
                      // FIX: Consistently use the 'currentPage' state variable
                      disabled={currentPage === 1}
                      // FIX: Added Tailwind CSS for better styling and disabled state
                      className="px-4 py-2 border rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                      Previous
                    </button>

                    {/* Numbered Page Buttons */}
                    {[...Array(pageData.totalPages)].map((_, index) => {
                      const pageNumber = index + 1;
                      return (
                        <button 
                          key={pageNumber}
                          onClick={() => handlePageChange(pageNumber)}
                          // FIX: Consistently use 'currentPage' for styling the active button
                          className={`hidden md:block px-4 py-2 border rounded-md transition-colors ${
                            currentPage === pageNumber
                            ? 'bg-red-500 text-white border-red-500' // Active page style
                            : 'bg-white text-gray-700 hover:bg-gray-50' // Inactive page style
                          }`}
                        >
                          {pageNumber}
                        </button>
                      );
                    })}

                    {/* Next Button */}
                    <button 
                      onClick={() => handlePageChange(currentPage + 1)} 
                      // FIX: Consistently use 'currentPage' state for the disabled check
                      disabled={currentPage === pageData.totalPages}
                      className="px-4 py-2 border rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                      Next
                    </button>
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

