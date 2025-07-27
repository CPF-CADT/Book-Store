// client/src/components/SortControls.jsx
import { useState, useEffect } from "react";
import { FaSearch, FaBars, FaTh, FaSpinner } from "react-icons/fa";

const SortControls = ({ sortBy, itemsPerPage, totalItems, currentPage, onSortChange, onItemsPerPageChange, onViewModeChange, onSearch, loading = false, searchTerm = "", viewMode = "grid" }) => {
  const [searchInput, setSearchInput] = useState(searchTerm);
  
  useEffect(() => { setSearchInput(searchTerm); }, [searchTerm]);

  const handleSearchSubmit = (e) => { e.preventDefault(); onSearch(searchInput); };

  const getResultsText = () => {
    if (loading) return <div className="flex items-center gap-2"><FaSpinner className="animate-spin" />Loading...</div>;
    if (totalItems === 0) return <span>0 results</span>;
    const startIndex = (currentPage - 1) * itemsPerPage + 1;
    const endIndex = Math.min(startIndex + itemsPerPage - 1, totalItems);
    return <span>Showing {startIndex}-{endIndex} of {totalItems}</span>;
  };

  return (
    <div className="bg-white border-b border-gray-200 py-3 px-4 mb-6 rounded-lg shadow-sm">
      <div className="flex flex-col lg:flex-row items-center justify-between gap-4">
        <div className="flex flex-col sm:flex-row items-center gap-4 w-full lg:w-auto">
          <form onSubmit={handleSearchSubmit} className="flex items-center w-full sm:w-auto">
            <input type="text" value={searchInput} onChange={(e) => setSearchInput(e.target.value)} placeholder="Search books..." disabled={loading} className="w-full border border-gray-300 rounded-l-md px-3 py-2 text-sm focus:ring-red-500 focus:border-red-500" />
            <button type="submit" className="px-3 py-2 bg-red-500 text-white rounded-r-md hover:bg-red-600 text-sm" disabled={loading}><FaSearch /></button>
          </form>
          <div className="flex items-center gap-2 w-full sm:w-auto">
            <label htmlFor="sort-by" className="text-sm font-medium text-gray-700 shrink-0">Sort:</label>
            <select id="sort-by" value={sortBy} onChange={(e) => onSortChange(e.target.value)} disabled={loading} className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm">
              <option value="relevance">Relevance</option>
              <option value="title_asc">Title: A-Z</option>
              <option value="title_desc">Title: Z-A</option>
              <option value="price_asc">Price: Low to High</option>
              <option value="price_desc">Price: High to Low</option>
              <option value="newest">Newest</option>
            </select>
          </div>
        </div>
        
        <div className="text-sm text-gray-600 shrink-0">{getResultsText()}</div>

        <div className="flex items-center gap-4 w-full lg:w-auto justify-center sm:justify-end">
          <div className="flex items-center gap-2">
            <label htmlFor="items-per-page" className="text-sm font-medium text-gray-700">Show:</label>
            <select id="items-per-page" value={itemsPerPage} onChange={(e) => onItemsPerPageChange(Number(e.target.value))} disabled={loading} className="border border-gray-300 rounded-md pl-3 pr-8 py-2 text-sm">
              {[12, 24, 36, 48].map(option => <option key={option} value={option}>{option}</option>)}
            </select>
          </div>
          <div className="hidden sm:flex items-center border border-gray-300 rounded-md overflow-hidden">
            <button onClick={() => onViewModeChange('grid')} disabled={loading} className={`p-2.5 ${viewMode === 'grid' ? 'bg-red-500 text-white' : 'text-gray-600 hover:bg-gray-100'}`} title="Grid view"><FaTh /></button>
            <button onClick={() => onViewModeChange('list')} disabled={loading} className={`p-2.5 ${viewMode === 'list' ? 'bg-red-500 text-white' : 'text-gray-600 hover:bg-gray-100'}`} title="List view"><FaBars /></button>
          </div>
        </div>
      </div>
    </div>
  );
};
export default SortControls;