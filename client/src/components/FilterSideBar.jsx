import React from 'react'; // Simplified imports
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { LayoutDashboard, X } from "lucide-react";

// --- Reusable Dropdown Component ---
// This sub-component helps keep the main return statement clean.
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
        {/* Safely map over options, even if it's undefined initially */}
        {options && options.map(option => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </div>
  );
}


// --- Main FilterSideBar Component ---
export default function FilterSideBar({
  filters,
  filterOptions,
  onFilterChange,
  isMobileOpen,   // Prop to control visibility on mobile
  onMobileClose,  // Prop to handle closing on mobile
}) {
  const { user } = useAuth();

  // --- Handler functions to update the parent's state ---
  // No local state is needed here, making the component simpler and less prone to bugs.
  // The parent (Homepage) is the single source of truth for the filter values.

  const handlePriceChange = (field, value) => {
    // Sanitize input to only allow numbers and decimals
    const sanitizedValue = value.replace(/[^0-9.]/g, '');
    onFilterChange({ ...filters, priceRange: { ...filters.priceRange, [field]: sanitizedValue } });
  };

  const handleSearchChange = (value) => {
    onFilterChange({ ...filters, searchQuery: value });
  };

  const handleDropdownChange = (filterKey, value) => {
    onFilterChange({ ...filters, [filterKey]: value });
  };

  // --- The shared JSX for both desktop and mobile views ---
  const sidebarContent = (
    <div className="bg-white p-6 h-full shadow-lg lg:shadow-sm lg:border space-y-6">

      {/* Mobile-only Header with a "Close" button */}
      <div className="flex justify-between items-center lg:hidden border-b -mx-6 -mt-6 px-6 pt-6 pb-4">
        <h2 className="text-xl font-bold text-gray-800">Filters</h2>
        <button onClick={onMobileClose} className="p-2 -mr-2 text-gray-500 hover:text-red-500">
          <X size={24} />
        </button>
      </div>

      {/* "Go to Dashboard" button for Admins/Vendors */}
      {user && (user.role === 'admin' || user.role === 'vendor') && (
        <div className="pb-4 border-b">
          <Link
            to="/dashboard"
            className="w-full flex items-center justify-center bg-gray-800 text-white font-semibold py-2 px-4 rounded-lg hover:bg-gray-700 transition-colors text-sm"
          >
            <LayoutDashboard size={16} className="mr-2" />
            Go to Dashboard
          </Link>
        </div>
      )}

      {/* Search Bar */}
      <div>
        <label htmlFor="search-filter" className="font-semibold mb-2 text-gray-800 block">Search</label>
        <input
          id="search-filter"
          type="text"
          placeholder="e.g., The Great Gatsby"
          value={filters.searchQuery || ''}
          onChange={(e) => handleSearchChange(e.target.value)}
          className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-red-500 focus:border-red-500"
        />
      </div>

      {/* Dynamic Dropdown Filters */}
      <div className="border-t pt-6 space-y-4">
        <FilterDropdown
          label="Category"
          value={filters.categoryId || ''}
          options={filterOptions.categories}
          onChange={(e) => handleDropdownChange('categoryId', e.target.value)}
        />
        <FilterDropdown
          label="Author"
          value={filters.authorId || ''}
          options={filterOptions.authors}
          onChange={(e) => handleDropdownChange('authorId', e.target.value)}
        />
        <FilterDropdown
          label="Tag"
          value={filters.tagId || ''}
          options={filterOptions.tags}
          onChange={(e) => handleDropdownChange('tagId', e.target.value)}
        />
      </div>

      {/* Price Filter */}
      <div className="border-t pt-6">
        <h3 className="font-semibold mb-3 text-gray-800">Price Range</h3>
        <div className="flex items-center space-x-2">
          <input
            type="text"
            placeholder="Min"
            value={filters.priceRange.min || ''}
            onChange={(e) => handlePriceChange('min', e.target.value)}
            className="w-full border border-gray-300 rounded px-2 py-1 text-sm text-center"
          />
          <span className="text-gray-500">to</span>
          <input
            type="text"
            placeholder="Max"
            value={filters.priceRange.max || ''}
            onChange={(e) => handlePriceChange('max', e.target.value)}
            className="w-full border border-gray-300 rounded px-2 py-1 text-sm text-center"
          />
        </div>
      </div>
    </div>
  );

  return (
    <>
      {/* --- Desktop: Static Sidebar --- */}
      <aside className="w-64 hidden lg:block pr-8">
        {sidebarContent}
      </aside>
      
      {/* --- Mobile: Slide-in Drawer --- */}
      
      {/* 1. The Overlay (darkens the background) */}
      <div
        className={`fixed inset-0 z-40 transition-opacity duration-300 lg:hidden ${
          isMobileOpen ? 'bg-black bg-opacity-50' : 'bg-opacity-0 pointer-events-none'
        }`}
        onClick={onMobileClose} // Closes the drawer when clicked
      >
      </div>

      {/* 2. The Drawer Content */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 w-80 max-w-full transform transition-transform duration-300 ease-in-out lg:hidden ${
          isMobileOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="h-full overflow-y-auto">
            {sidebarContent}
        </div>
      </aside>
    </>
  );
}