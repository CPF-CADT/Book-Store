import { useEffect, useState, useCallback } from "react";
import { fetchBooks, fetchFilters } from "../services/api";
import FilterSideBar from "./FilterSideBar";
import SortControls from "./SortControls";
import ProductGrid from "./ProductGrid";
import { Filter, X } from "lucide-react";

const INITIAL_FILTERS = {
  priceRange: { min: '', max: '' },
  brand: [],
  material: [],
  availability: []
};

export function Homepage() {
  const [books, setBooks] = useState([]);
  const [totalItems, setTotalItems] = useState(0);
  const [filterOptions, setFilterOptions] = useState({});
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [filters, setFilters] = useState(INITIAL_FILTERS);
  const [sortBy, setSortBy] = useState('relevance');
  const [itemsPerPage, setItemsPerPage] = useState(12);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const [viewMode, setViewMode] = useState('grid');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadFilterOptions = async () => {
      try {
        const data = await fetchFilters();
        setFilterOptions(data);
      } catch (err) {
        console.error("Failed to load filter options:", err);
        console.error("Failed to load filter options:", err);
      }
    };
    loadFilterOptions();
  }, []);

  const loadBooks = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const params = { page: currentPage, limit: itemsPerPage, sort: sortBy, search: searchTerm, ...filters.priceRange, brand: filters.brand.join(','), material: filters.material.join(','), availability: filters.availability.join(',') };
      const data = await fetchBooks(params);
      setBooks(data.books || []);
      setTotalItems(data.total || 0);
    } catch (err) {
      setError('Failed to load books. Please try again later.',err);
    } finally {
      setLoading(false);
    }
  }, [currentPage, itemsPerPage, sortBy, searchTerm, filters]);

  useEffect(() => { loadBooks(); }, [loadBooks]);

  const handleFilterChange = (newFilters) => { setFilters(newFilters); setCurrentPage(1); };
  const handleSortChange = (newSort) => { setSortBy(newSort); setCurrentPage(1); };
  const handleItemsPerPageChange = (newLimit) => { setItemsPerPage(newLimit); setCurrentPage(1); };
  const handleSearch = (newSearchTerm) => { setSearchTerm(newSearchTerm); setCurrentPage(1); };

  const Pagination = () => {
    const totalPages = Math.ceil(totalItems / itemsPerPage);
    if (totalPages <= 1) return null;
    return (
      <div className="flex justify-center items-center mt-8 space-x-1 sm:space-x-2">
        <button onClick={() => setCurrentPage(p => Math.max(p - 1, 1))} disabled={currentPage === 1 || loading} className="px-3 py-2 border rounded disabled:opacity-50 text-sm">Prev</button>
        <span className="text-sm text-gray-600 px-2">Page {currentPage} of {totalPages}</span>
        <button onClick={() => setCurrentPage(p => Math.min(p + 1, totalPages))} disabled={currentPage === totalPages || loading} className="px-3 py-2 border rounded disabled:opacity-50 text-sm">Next</button>
      </div>
    );
  };

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex flex-col lg:flex-row gap-8">
        <div className="lg:hidden flex justify-end mb-4">
          <button onClick={() => setIsFilterOpen(true)} className="inline-flex items-center gap-2 bg-white px-4 py-2 border border-gray-300 rounded-md shadow-sm font-medium text-gray-700 hover:bg-gray-50">
            <Filter size={20} /> Show Filters
          </button>
        </div>
        <div className="hidden lg:block w-64 xl:w-72 flex-shrink-0">
          <FilterSideBar filters={filters} filterOptions={filterOptions} onFilterChange={handleFilterChange} />
        </div>
        {isFilterOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden" onClick={() => setIsFilterOpen(false)}>
            <div className="fixed inset-y-0 left-0 w-4/5 max-w-sm bg-white shadow-xl p-4 overflow-y-auto" onClick={(e) => e.stopPropagation()}>
              <div className="flex justify-between items-center mb-4 pb-4 border-b">
                <h2 className="text-xl font-bold">Filters</h2>
                <button onClick={() => setIsFilterOpen(false)}><X size={24} /></button>
              </div>
              <FilterSideBar filters={filters} filterOptions={filterOptions} onFilterChange={handleFilterChange} />
            </div>
          </div>
        )}
        <section className="flex-1 min-w-0">
          <SortControls sortBy={sortBy} itemsPerPage={itemsPerPage} totalItems={totalItems} currentPage={currentPage} searchTerm={searchTerm} viewMode={viewMode} loading={loading} onSortChange={handleSortChange} onItemsPerPageChange={handleItemsPerPageChange} onSearch={handleSearch} onViewModeChange={setViewMode} />
          {error ? (
            <div className="text-center py-20 text-red-500 bg-red-50 rounded-lg">{error}</div>
          ) : (
            <>
              <ProductGrid books={books} loading={loading} viewMode={viewMode} />
              <Pagination />
            </>
          )}
        </section>
      </div>
    </div>
  );
}

