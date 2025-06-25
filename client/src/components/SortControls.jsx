import React from "react";
import { FaSearch, FaBars, FaTh  } from "react-icons/fa";

const SortControls = ({
    sortBy,
    itemPerPage,
    totalItems,
    startIndex,
    endIndex,
    onSortChange,
    onItemsPerPageChange
}) => {
    const [ viewMode, setViewMode] = React.useState('grid');

    const sortOptions = [
        { value: 'alphabetical-asc', label: 'Alphabetically, A-Z' },
        { value: 'alphabetical-desc', label: 'Alphabetically, Z-A' },
        { value: 'price-low-high', label: 'Price, Low to High' },
        { value: 'price-high-low', label: 'Price, High to Low' },
        { value: 'newest', label: 'Newest First' },
        { value: 'rating', label: 'Highest Rated' }
    ];

    const itemPerPageOptions = [12, 24, 36, 48];

    return ( 
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6 pb-4 border-b border-gray-200">
            <div className="flex items-center space-x-4 mb-4 md:mb-0">
                <span className="font-semibold text-sm text-gray-700">Sort by:</span>
                <select 
                    value={sortBy}
                    onChange={(e)=> onSortChange(e.target.value)}
                    className="border border-gray-300 rounded px-3 py-1 text-sm font-medium text-gray-700 bg-white focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500"
                >
                    {sortOptions.map( option => (
                        <option key={option.value} value={option.value}>
                            {option.label}
                        </option>
                    ))}
                </select>
            </div>

            <div className="flex items-center space-x-4">
                <span className="text-sm text-gray-600">
                    Showing {startIndex + 1} - {endIndex} of {totalItems} results
                </span>
            </div>

            <div className="flex items-center space-x-2">
                <span className="font-semibold text-sm text-gray-700">Show:</span>
                <select 
                    value={itemPerPage}
                    onChange={(e) => onItemsPerPageChange(Number(e.target.value))}
                    className="border border-gray-300 rounded px-2 py-1 text-sm font-medium text-gray-700 bg-white focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500"
                >   
                    {itemPerPageOptions.map(option => (
                        <option key={option.value} value={option.value}>
                            {option}
                        </option>
                    ))}
                </select>
            </div>

            <div className="flex items-center space-x-2 border-l border-gray-300 pl-4">
                <button 
                    onClick={() => setViewMode('grid')}
                    className={`p-2 rounded ${
                        viewMode === 'grid'
                            ? 'bg-red-500 text-white'
                            : 'text-gray-700 hover:bg-gray-00'
                    }`}
                    title="Grid view"
                >
                    <FaTh className="text-sm" />
                </button>

                <button 
                    onClick={() => setViewMode('list')}
                    className={`p-2 rounded ${
                        viewMode === 'list'
                            ? 'bg-red-500 text-white'
                            : 'text-gray-700 hover:bg-gray-00'
                    }`}
                    title="Grid view"
                >
                    <FaBars className="text-sm" />
                </button>
            </div>
            <button className="p-2 text-gray-700 hover:bg-gray-100 rounded" title="Search">
                <FaSearch className="text-sm" />
            </button>
        </div>
    );
};

export default SortControls;