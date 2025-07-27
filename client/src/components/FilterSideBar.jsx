import { useState, useEffect } from "react";
import { useDebounce } from "../context/useDebounce"; // Or wherever your hook is
function FilterDropdown({ label, value, options, onChange }) {
  return (
    <div>
      <label className="font-semibold mb-2 text-gray-800 block">{label}</label>
      <select
        value={value}
        onChange={onChange}
        className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-red-500 focus:border-red-500 bg-white"
      >
        <option value="">All {label}</option>
        {options.map(option => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </div>
  );
}
export default function FilterSideBar({ 
  filters = { priceRange: { min: '', max: '' }, searchQuery: '' }, 
  filterOptions = { categories: [], authors: [], tags: [] }, // Provide default arrays
  onFilterChange = () => {} 
})  {
    // Local state ONLY for the text inputs to enable debouncing
    const [minPrice, setMinPrice] = useState(filters.priceRange.min);
    const [maxPrice, setMaxPrice] = useState(filters.priceRange.max);
    const [searchTerm, setSearchTerm] = useState(filters.searchQuery);
    const debouncedMinPrice = useDebounce(minPrice, 500);
    const debouncedMaxPrice = useDebounce(maxPrice, 500);
     const debouncedSearchTerm = useDebounce(searchTerm, 500);

    // This useEffect handles the debounced price changes
   useEffect(() => {
        setMinPrice(filters.priceRange.min);
        setMaxPrice(filters.priceRange.max);
        setSearchTerm(filters.searchQuery);
    }, [filters.priceRange.min, filters.priceRange.max, filters.searchQuery]);
     useEffect(() => {
        // Only update if the debounced value is different from the global state
        if (debouncedMinPrice !== filters.priceRange.min || debouncedMaxPrice !== filters.priceRange.max) {
            onFilterChange(prevFilters => ({
                ...prevFilters,
                priceRange: { min: debouncedMinPrice, max: debouncedMaxPrice }
            }));
        }
    }, [debouncedMinPrice, debouncedMaxPrice, filters.priceRange, onFilterChange]);

    // Effect for debounced search term changes
    useEffect(() => {
        if (debouncedSearchTerm !== filters.searchQuery) {
            onFilterChange(prevFilters => ({
                ...prevFilters,
                searchQuery: debouncedSearchTerm
            }));
        }
    }, [debouncedSearchTerm, filters.searchQuery, onFilterChange]);

    const [expandedSections, setExpandedSections] = useState({});

    const handleCheckBoxChange = (category, value, isChecked) => {
        onFilterChange(prevFilters => {
            const currentValues = prevFilters[category] || [];
            const newValues = isChecked
                ? [...currentValues, value]
                : currentValues.filter(v => v !== value);
            return { ...prevFilters, [category]: newValues };
        });
    };

    const toggleSection = (section) => {
        setExpandedSections(prev => ({ ...prev, [section]: !prev[section] }));
    };

     const handleDropdownChange = (filterKey, value) => {
        onFilterChange(prevFilters => ({
            ...prevFilters,
            [filterKey]: value
        }));
    };
    // We do NOT need a localFilters state or an applyFilters button for this pattern.

    return (
        <aside className="w-64 hidden lg:block pr-8">
            <div className="bg-white rounded p-6 shadow-sm border">
                {/* Price Filter */} <div>
                    <label htmlFor="search-filter" className="font-semibold mb-3 text-gray-800 block">Search by Title</label>
                    <div className="relative">
                        <input
                            id="search-filter"
                            type="text"
                            placeholder="e.g., Clean Code"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-red-500 focus:border-red-500"
                        />
                         {/* Optional: Add a search icon */}
                        <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                            <svg className="h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
                            </svg>
                        </div>
                    </div>
                </div>
                {/* --- NEW DROPDOWN FILTERS --- */}
                <div className="border-t pt-6 space-y-4">
                  <FilterDropdown
                    label="Categories"
                    value={filters.categoryId}
                    options={filterOptions.categories}
                    onChange={(e) => handleDropdownChange('categoryId', e.target.value)}
                  />
                  <FilterDropdown
                    label="Authors"
                    value={filters.authorId}
                    options={filterOptions.authors}
                    onChange={(e) => handleDropdownChange('authorId', e.target.value)}
                  />
                  <FilterDropdown
                    label="Tags"
                    value={filters.tagId}
                    options={filterOptions.tags}
                    onChange={(e) => handleDropdownChange('tagId', e.target.value)}
                  />
                </div>
                <div className="mb-6">
                    <h3 className="font-semibold mb-3 text-gray-800">Price</h3>
                    <div className="flex items-center mb-3">
                        <input
                          type="text"
                          min="0"
                          step="1"
                          placeholder="Min"
                          value={minPrice}
                          onChange={e => setMinPrice(e.target.value.replace(/[^0-9.]/g, ""))}
                          className="w-20 border border-gray-300 rounded px-2 py-1 text-sm"
                        />
                        <span>to</span>
                        <input
                          type="text"
                          min="0"
                          step="1"
                          placeholder="Max"
                          value={maxPrice}
                          onChange={e => setMaxPrice(e.target.value.replace(/[^0-9.]/g, ""))}
                          className="w-20 border border-gray-300 rounded px-2 py-1 text-sm"
                        />
                    </div>
                </div>

                {/* Dynamic Filter Sections */}
                {/* <div className="border-t pt-4">
                  {Object.entries(filterOptions).map(([category, options]) => (
                    // ... your checkbox mapping logic is here ...
                    // It should use handleCheckBoxChange
                  ))}
                </div> */}

                {/* NO "Apply Filters" button is needed for this UX pattern */}
            </div>
        </aside>
    );
}