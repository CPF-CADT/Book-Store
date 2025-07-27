// import React from "react";
import ProductCard from "./ProductCard";

const ProductGrid = ({ books, loading = false}) => {
    if (loading){
        return (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
                {[...Array(6)].map((_, index) => (
                    <div key={index} className="bg-white rounded-lg p-6 animate-pulse">
                        <div className="w-full h-56 bg-gray-200 rounded mb-4"></div>
                        <div className="space-y-2">
                            <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                            <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                            <div className="h-4 bg-gray-200 rounded w-1/4"></div>
                            <div className="h-8 bg-gray-200 rounded w-full mt-4"></div>
                        </div>
                    </div>
                ))}
            </div>
        );
    }

    if (!books || books.length === 0){
        return ( 
            <div className="text-center py-12">
                <div className="text-gray-400 mb-4">
                <svg className="mx-auto h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">No books found</h3>
                <p className="text-gray-500">Try adjusting your filters or search criteria</p>
            </div>
        )
    }

    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
            {books.map((book) => (
                <ProductCard key={book.id} book={book} />
            ))}
        </div>
    );
}
export default ProductGrid; 