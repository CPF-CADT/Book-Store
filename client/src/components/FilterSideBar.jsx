import { useState} from "react";

const FilterSideBar =({ filters, filterOptions, onFilterChange}) => {
    const [expandedSections, setExpandedSections] = useState({
        productType: false,
        availability: false,
        brand: false,
        color: false,
        materail: false 
    });

    const handlePriceChange = (field, value) => {
        onFilterChange({
            ...filters,
            priceRange:{
                ...filters.priceRange,
                [field]: value
            }
        });
    };

    const handleCheckBoxChange = (category, value, check) => {
        const currentValue = filters[category] || [];
        const newValue = check  
            ? [...currentValue, value]
            : currentValue.filter(v =>  v !== value);
        
        onFilterChange({
            ...filters,
            [category]: newValue
        });
    };

    const toggleSection= (section) => {
        setExpandedSections(prev => ({
            ...prev,
            [section]: !prev[section]
        }));;
    };

    const clearFilters = () => {
        onFilterChange({
            priceRange: {min: '', max: ''},
            productType: [],
            availability: [],
            brand: [],
            color: [],
            materail: []
        });
    };

    const hashActiveFilters = () => {
        return filters.priceRange.min ||
                filters.priceRange.max ||
                Object.values(filters).some(filter =>
                    Array.isArray(filter) && filter.length > 0
                );
    };

    return (
        <aside className="w-64 hidden lg:block pr-8">
      <div className="bg-white rounded p-6 shadow-sm border">
        {/* Clear Filters Button */}
        {hashActiveFilters() && (
          <div className="mb-4">
            <button
              onClick={clearFilters}
              className="text-red-500 text-sm underline hover:text-red-600"
            >
              Clear all filters
            </button>
          </div>
        )}

        {/* Price Filter */}
        <div className="mb-6">
          <h3 className="font-semibold mb-3 text-gray-800">Price</h3>
          <div className="flex items-center mb-3">
            <input
              type="number"
              placeholder="Min"
              value={filters.priceRange.min}
              onChange={(e) => handlePriceChange('min', e.target.value)}
              className="w-20 border border-gray-300 rounded px-2 py-1 text-sm"
              min="0"
            />
            <span className="mx-2 text-gray-500">to</span>
            <input
              type="number"
              placeholder="Max"
              value={filters.priceRange.max}
              onChange={(e) => handlePriceChange('max', e.target.value)}
              className="w-20 border border-gray-300 rounded px-2 py-1 text-sm"
              min="0"
            />
          </div>
        </div>

        <div className="border-t pt-4">
          {/* Dynamic Filter Sections */}
          {Object.entries(filterOptions).map(([category, options]) => (
            <div key={category} className="mb-4">
              <div
                className="flex justify-between items-center cursor-pointer py-2 hover:bg-gray-50 rounded px-2"
                onClick={() => toggleSection(category)}
              >
                <span className="font-medium capitalize text-gray-700">
                  {category.replace(/([A-Z])/g, ' $1').toLowerCase()}
                  {filters[category]?.length > 0 && (
                    <span className="ml-2 bg-red-500 text-white rounded-full px-2 py-1 text-xs">
                      {filters[category].length}
                    </span>
                  )}
                </span>
                <span className="text-gray-500 font-mono">
                  {expandedSections[category] ? '−' : '+'}
                </span>
              </div>
              
              {expandedSections[category] && (
                <div className="mt-2 ml-4 space-y-2">
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

export default FilterSideBar;