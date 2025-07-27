import React, { useState, useEffect } from "react";
import { FaSearch, FaBars, FaTh, FaSpinner } from "react-icons/fa";

const SortControls = ({
    sortBy,
    itemPerPage,
    totalItems,
    currentPage,
    onSortChange,
    onItemsPerPageChange,
    onViewModeChange,
    onSearch,
    loading = false,
    searchTerm = ""
}) => {
    const [viewMode, setViewMode] = useState('grid');
    const [searchInput, setSearchInput] = useState(searchTerm);
    const [showSearch, setShowSearch] = useState(false);

    const sortOptions = [
        { value: 'name_asc', label: 'Name: A to Z' },
        { value: 'name_desc', label: 'Name: Z to A' },
        { value: 'price_asc', label: 'Price: Low to High' },
        { value: 'price_desc', label: 'Price: High to Low' },
        { value: 'created_at_desc', label: 'Newest First' },
        { value: 'created_at_asc', label: 'Oldest First' },
        { value: 'rating_desc', label: 'Highest Rated' },
        { value: 'rating_asc', label: 'Lowest Rated' }
    ];

    const itemPerPageOptions = [12, 24, 36, 48];

    const startIndex = (currentPage - 1) * itemPerPage;
    const endIndex = Math.min(startIndex + itemPerPage, totalItems);

    const handleViewModeChange = (mode) => {
        setViewMode(mode);
        onViewModeChange?.(mode);
    };

    const handleSearchSubmit = (e) => {
        e.preventDefault();
        onSearch?.(searchInput);
    };

    const handleSearchToggle = () => {
        setShowSearch(!showSearch);
        if (showSearch && searchInput) {
            setSearchInput('');
            onSearch?.('');
        }
    };

    useEffect(() => {
        setSearchInput(searchTerm);
    }, [searchTerm]);

    return (
        <div className="bg-white border-b border-gray-200 py-4 px-6">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                <div className="flex items-center gap-3">
                    <span className="text-sm font-medium text-gray-700 whitespace-nowrap">Sort by:</span>
                    <select
                        value={sortBy}
                        onChange={(e) => onSortChange(e.target.value)}
                        disabled={loading}
                        className="min-w-[180px] border border-gray-300 rounded-md px-3 py-2 text-sm text-gray-700 bg-white"
                    >
                        {sortOptions.map(option => (
                            <option key={option.value} value={option.value}>
                                {option.label}
                            </option>
                        ))}
                    </select>
                </div>

                <div className="flex items-center justify-center">
                    {loading ? (
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                            <FaSpinner className="animate-spin" />
                            Loading...
                        </div>
                    ) : (
                        <span className="text-sm text-gray-600 font-medium">
                            Showing {totalItems > 0 ? startIndex + 1 : 0} - {endIndex} of {totalItems} results
                        </span>
                    )}
                </div>

                <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2">
                        {showSearch && (
                            <div className="flex items-center gap-2">
                                <input
                                    type="text"
                                    value={searchInput}
                                    onChange={(e) => setSearchInput(e.target.value)}
                                    onKeyDown={(e) => e.key === 'Enter' && handleSearchSubmit(e)}
                                    placeholder="Search books..."
                                    className="w-48 border border-gray-300 rounded-md px-3 py-2 text-sm"
                                />
                                <button
                                    onClick={handleSearchSubmit}
                                    className="px-3 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 text-sm"
                                >
                                    Go
                                </button>
                            </div>
                        )}
                        <button
                            onClick={handleSearchToggle}
                            className={`p-2.5 rounded-md border ${
                                showSearch
                                    ? 'bg-red-500 text-white border-red-500'
                                    : 'text-gray-600 hover:bg-gray-100 border-gray-300'
                            }`}
                            title={showSearch ? "Close search" : "Open search"}
                        >
                            <FaSearch className="text-sm" />
                        </button>
                    </div>

                    <div className="flex items-center gap-2">
                        <span className="text-sm font-medium text-gray-700 whitespace-nowrap">Show:</span>
                        <select
                            value={itemPerPage}
                            onChange={(e) => onItemsPerPageChange(Number(e.target.value))}
                            disabled={loading}
                            className="border border-gray-300 rounded-md px-3 py-2 text-sm min-w-[70px]"
                        >
                            {itemPerPageOptions.map(option => (
                                <option key={option} value={option}>{option}</option>
                            ))}
                        </select>
                    </div>

                    <div className="flex items-center border border-gray-300 rounded-md overflow-hidden">
                        <button
                            onClick={() => handleViewModeChange('grid')}
                            disabled={loading}
                            className={`p-2.5 ${
                                viewMode === 'grid' ? 'bg-red-500 text-white' : 'text-gray-600 hover:bg-gray-50'
                            }`}
                            title="Grid view"
                        >
                            <FaTh className="text-sm" />
                        </button>
                        <button
                            onClick={() => handleViewModeChange('list')}
                            disabled={loading}
                            className={`p-2.5 ${
                                viewMode === 'list' ? 'bg-red-500 text-white' : 'text-gray-600 hover:bg-gray-50'
                            }`}
                            title="List view"
                        >
                            <FaBars className="text-sm" />
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

const BookListPage = () => {
    const [books, setBooks] = useState([]);
    const [loading, setLoading] = useState(false);
    const [sortBy, setSortBy] = useState('name_asc');
    const [itemPerPage, setItemPerPage] = useState(12);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalItems, setTotalItems] = useState(0);
    const [searchTerm, setSearchTerm] = useState('');
    const [viewMode, setViewMode] = useState('grid');

    const fetchBooks = async (params = {}) => {
        setLoading(true);
        try {
            const query = new URLSearchParams({
                sort: params.sort || sortBy,
                limit: params.limit || itemPerPage,
                page: params.page || currentPage,
                search: params.search || ''
            }).toString();

            const response = await fetch(`http://localhost:3000/api/books?${query}`);
            const data = await response.json();

            setBooks(data.books || []);
            setTotalItems(data.total || 0);
        } catch (error) {
            console.error('Error fetching books from backend:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchBooks({
            sort: sortBy,
            limit: itemPerPage,
            page: currentPage,
            search: searchTerm
        });
    }, [sortBy, itemPerPage, currentPage, searchTerm]);

    const handleSortChange = (newSort) => {
        setSortBy(newSort);
        setCurrentPage(1);
    };

    const handleItemsPerPageChange = (newLimit) => {
        setItemPerPage(newLimit);
        setCurrentPage(1);
    };

    const handleSearch = (term) => {
        setSearchTerm(term);
        setCurrentPage(1);
    };

    const handleViewModeChange = (mode) => {
        setViewMode(mode);
    };

    return (
        <div className="bg-gray-50 min-h-screen">
            <div className="max-w-6xl mx-auto">
                <SortControls
                    sortBy={sortBy}
                    itemPerPage={itemPerPage}
                    totalItems={totalItems}
                    currentPage={currentPage}
                    onSortChange={handleSortChange}
                    onItemsPerPageChange={handleItemsPerPageChange}
                    onViewModeChange={handleViewModeChange}
                    onSearch={handleSearch}
                    loading={loading}
                    searchTerm={searchTerm}
                />

                <div className="p-6">
                    {loading ? (
                        <div className="flex items-center justify-center py-12">
                            <FaSpinner className="animate-spin text-red-500 text-xl" />
                            <span className="ml-2 text-gray-600">Loading books...</span>
                        </div>
                    ) : (
                        <div className={`grid gap-4 ${
                            viewMode === 'grid'
                                ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4'
                                : 'grid-cols-1'
                        }`}>
                            {books.map(book => (
                                <div key={book.id} className={`bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow ${
                                    viewMode === 'list' ? 'flex' : ''
                                }`}>
                                    <img
                                        src={book.image}
                                        alt={book.title}
                                        className={`${viewMode === 'list' ? 'w-32 h-32' : 'w-full h-48'} object-cover`}
                                    />
                                    <div className="p-4 flex-1">
                                        <h3 className="font-medium text-gray-900 mb-2">{book.title}</h3>
                                        <p className="text-sm text-gray-600 mb-2">{book.author}</p>
                                        <div className="flex items-center justify-between">
                                            <span className="text-lg font-semibold text-red-600">${book.price}</span>
                                            <div className="flex items-center gap-1">
                                                {Array.from({ length: book.rating }, (_, i) => (
                                                    <span key={i} className="text-yellow-400">★</span>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default BookListPage;
