// client/src/components/ProductGrid.jsx
import ProductCard from "./ProductCard";

const ProductGrid = ({ books, loading = false, viewMode = "grid" }) => {
  const skeletonCount = 12;

  if (loading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {[...Array(skeletonCount)].map((_, index) => (
          <div key={index} className="bg-white rounded-lg p-4 animate-pulse border">
            <div className="w-full h-56 bg-gray-200 rounded mb-4"></div>
            <div className="space-y-3">
              <div className="h-4 bg-gray-200 rounded w-3/4"></div>
              <div className="h-3 bg-gray-200 rounded w-1/2"></div>
              <div className="h-10 bg-gray-200 rounded w-full mt-4"></div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (!books || books.length === 0) {
    return (
      <div className="text-center py-20 bg-gray-50 rounded-lg">
        <h3 className="mt-2 text-lg font-medium text-gray-900">No Books Found</h3>
        <p className="mt-1 text-sm text-gray-500">Try adjusting your search or filters.</p>
      </div>
    );
  }

  const gridClasses = viewMode === 'grid'
    ? 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6'
    : 'grid grid-cols-1 gap-4';

  return (
    <div className={gridClasses}>
      {books.map((book) => (
        <ProductCard key={book.id} book={book} viewMode={viewMode} />
      ))}
    </div>
  );
};
export default ProductGrid;