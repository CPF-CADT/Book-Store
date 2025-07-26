import { useState, useEffect, useCallback } from "react";
import { useDebounce } from "../context/useDebounce"; // Or wherever your hook is

export default function FilterSideBar({ 
  filters = { priceRange: { min: '', max: '' } }, 
  filterOptions = {}, 
  onFilterChange = () => {} 
}) {
    // Local state ONLY for the text inputs to enable debouncing
    const [minPrice, setMinPrice] = useState(filters.priceRange.min);
    const [maxPrice, setMaxPrice] = useState(filters.priceRange.max);

    const debouncedMinPrice = useDebounce(minPrice, 500);
    const debouncedMaxPrice = useDebounce(maxPrice, 500);

    // This useEffect handles the debounced price changes
   useEffect(() => {
        setMinPrice(filters.priceRange.min);
        setMaxPrice(filters.priceRange.max);
    }, [filters.priceRange.min, filters.priceRange.max]);
     useEffect(() => {
        // Only call the parent if the debounced value is different from the global state.
        // This prevents the initial render from causing a loop.
        if (debouncedMinPrice !== filters.priceRange.min || debouncedMaxPrice !== filters.priceRange.max) {
            onFilterChange(prevFilters => ({
                ...prevFilters,
                priceRange: {
                    min: debouncedMinPrice,
                    max: debouncedMaxPrice,
                }
            }));
        }
    }, [debouncedMinPrice, debouncedMaxPrice, onFilterChange, filters.priceRange.min, filters.priceRange.max]);
    const [expandedSections, setExpandedSections] = useState({});

    // Checkboxes call onFilterChange directly and immediately
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

    // We do NOT need a localFilters state or an applyFilters button for this pattern.

    return (
        <aside className="w-64 hidden lg:block pr-8">
            <div className="bg-white rounded p-6 shadow-sm border">
                {/* Price Filter */}
                <div className="mb-6">
                    <h3 className="font-semibold mb-3 text-gray-800">Price</h3>
                    <div className="flex items-center mb-3">
                        <input
                            type="text"
                            placeholder="Min"
                            value={minPrice} // Bound to local state for typing
                            onChange={(e) => setMinPrice(e.target.value)}
                            className="w-20 border border-gray-300 rounded px-2 py-1 text-sm"
                        />
                        <span>to</span>
                        <input
                            type="text"
                            placeholder="Max"
                            value={maxPrice} // Bound to local state for typing
                            onChange={(e) => setMaxPrice(e.target.value)}
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