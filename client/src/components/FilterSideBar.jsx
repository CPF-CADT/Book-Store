// client/src/components/FilterSideBar.jsx
import { useState, useEffect } from "react";

const INITIAL_FILTERS = {
  priceRange: { min: '', max: '' },
  productType: [],
  availability: [],
  brand: [],
  color: [],
  material: []
};

export default function FilterSideBar({ filters, filterOptions, onFilterChange }) {
  const [expandedSections, setExpandedSections] = useState({});

  useEffect(() => {
    // Initialize expanded sections state based on available filter options
    if (filterOptions) {
      const initialSections = Object.keys(filterOptions).reduce((acc, key) => {
        acc[key] = false; // Start all sections collapsed
        return acc;
      }, {});
      setExpandedSections(initialSections);
    }
  }, [filterOptions]);

  const handlePriceChange = (field, value) => {
    onFilterChange({
      ...filters,
      priceRange: {
        ...filters.priceRange,
        [field]: value
      }
    });
  };

  const handleCheckBoxChange = (category, value, checked) => {
    const currentValues = filters[category] || [];
    const newValues = checked
      ? [...currentValues, value]
      : currentValues.filter(v => v !== value);
    
    onFilterChange({
      ...filters,
      [category]: newValues
    });
  };

  const toggleSection = (section) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  const clearFilters = () => {
    onFilterChange(INITIAL_FILTERS);
  };

  const hasActiveFilters = () => {
    return filters.priceRange.min ||
           filters.priceRange.max ||
           Object.entries(filters).some(([key, value]) => 
             key !== 'priceRange' && Array.isArray(value) && value.length > 0
           );
  };
  
  // Helper to format category names for display
  const formatCategoryName = (name) => {
      return name.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase());
  }

  return (
    <aside className="w-64 hidden lg:block pr-8">
      <div className="bg-white rounded p-6 shadow-sm border">
        <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold text-gray-800">Filters</h2>
            {hasActiveFilters() && (
                <button
                onClick={clearFilters}
                className="text-red-500 text-sm font-medium hover:underline"
                >
                Clear all
                </button>
            )}
        </div>

        <div className="mb-6">
          <h3 className="font-semibold mb-3 text-gray-800">Price</h3>
          <div className="flex items-center space-x-2">
            <input
              type="number"
              placeholder="Min"
              value={filters.priceRange.min}
              onChange={(e) => handlePriceChange('min', e.target.value)}
              className="w-full border border-gray-300 rounded px-2 py-1 text-sm"
              min="0"
            />
            <span className="text-gray-500">-</span>
            <input
              type="number"
              placeholder="Max"
              value={filters.priceRange.max}
              onChange={(e) => handlePriceChange('max', e.target.value)}
              className="w-full border border-gray-300 rounded px-2 py-1 text-sm"
              min="0"
            />
          </div>
        </div>

        <div className="border-t pt-4">
          {Object.entries(filterOptions).map(([category, options]) => (
            <div key={category} className="mb-2">
              <button
                className="flex justify-between items-center w-full cursor-pointer py-2 hover:bg-gray-50 rounded px-2 text-left"
                onClick={() => toggleSection(category)}
                aria-expanded={expandedSections[category]}
              >
                <span className="font-medium capitalize text-gray-700">
                  {formatCategoryName(category)}
                  {filters[category]?.length > 0 && (
                    <span className="ml-2 bg-red-500 text-white rounded-full px-2 py-0.5 text-xs">
                      {filters[category].length}
                    </span>
                  )}
                </span>
                <span className="text-gray-500 font-bold text-lg transition-transform transform" style={{ transform: expandedSections[category] ? 'rotate(0deg)' : 'rotate(-90deg)' }}>
                    {expandedSections[category] ? '−' : '+'}
                </span>
              </button>
              
              {expandedSections[category] && (
                <div className="mt-2 ml-4 pl-2 border-l-2 border-gray-100 space-y-2">
                  {options.map((option) => (
                    <label
                      key={option.value}
                      className="flex items-center space-x-2 cursor-pointer text-sm"
                    >
                      <input
                        type="checkbox"
                        checked={filters[category]?.includes(option.value) || false}
                        onChange={(e) => handleCheckBoxChange(category, option.value, e.target.checked)}
                        className="rounded border-gray-300 text-red-500 focus:ring-red-500"
                      />
                      <span className="text-gray-600">
                        {option.label}
                        {option.count && (
                          <span className="text-gray-400 ml-1">({option.count})</span>
                        )}
                      </span>
                    </label>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </aside>
  );
}