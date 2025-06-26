import { useState } from "react";
import { Link } from "react-router-dom";

const ProductCard = ({book}) => {
  const [imageLoading, setImageLoading] = useState(true);
  const [imageError, setImageError] = useState(false);
  const [isAddingToCart, setIsAddingToCart] = useState(false);

  const handleAddToCart = async (e) => {
    e.preventDefault();
    e.stopPropagation();

    setIsAddingToCart(true);

    try{
      //API called add to cart
      const respone = await fetch('/api/cart/add', {
        method: 'POST',
        headers:{
          'Content-type' : 'application/json',
        },
        body: JSON.stringify({
          bookId: book.id,
          quantity: 1
        })
      });

      if ( respone.ok) console.log('Add to cart successfully');
      else throw new Error('Failed to add to cart');

    }catch (error) {
      console.error('Error adding to cart:', error);
      // You might want to show an error notification here
    } finally {
      setIsAddingToCart(false);
    }
  };

  const handleImageLoad = () =>{
    setImageLoading(false);
  };

  const handleImageError = () => {
    setImageLoading(false);
    setImageError(true);
  };

  return ( 
    <div className="bg-white rounded-lg p-6 flex flex-col items-center group hover:shadow-lg transition-shadow duration-300 border border-gray-100">
      <Link to={`/book/${book.id}`} className="block w-full">
        <div className="relative w-full h-56 flex items-center justify-center mb-4 overflow-hidden rounded">
          {imageLoading && (
            <div className="absolute inset-0 bg-gray-200 animate-pulse rounded"></div>
          )}

          {imageError ? (
            <div className="w-full h-full bg-gray-100 flex items-center justify-center rounded">
              <div className="text-center text-gray-400">
                <svg 
                  className="mx-auto h-8 w-8 mb-2"
                  fill="none"
                  viewBox="0 0 24 24"   
                  stroke="currentColor"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
            </div>
          ) : (
            <img 
              src="book.imageUrl || book.img" 
              alt="book.title" 
              className="object-cover w-full h-full rounded group-hover:scale-105 transition-transform duration-300" 
              onLoad={handleImageLoad}
              onError={handleImageError}
              style={{display: imageError ? 'none' : 'block'}}
            />
          )}

          <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-10 transition-all duration-300 rounded"></div>
        </div>

        <div className="text-center">
          <h3 className="font-semibold text-lg mb-1 text-gray-800 group-hover:text-red-600 transition-colors line-clamp-2">
            {book.title}
          </h3>
          <p className="text-gray-500 mb-1 text-sm">
            {book.author}
          </p>

          {book.rating && (
            <div className="flex items-center justify-center mb-2">
              <div className="flex items-center">
                {[...Array(5).map((_, i) => (
                  <svg
                    key={i}
                    className={`h-4 w-4 ${
                      i < Math.floor(book.rating) ? 'text-yellow-400' : 'text-gray-300'
                    }`} 
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                     <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                ))]}
                <span className="ml-1 text-sm text-gray-500">({book.rating})</span>
              </div>
            </div>
          )}

          <div className="flex items-center justify-center space-x-2 mb-3">
            {book.originalPrice && book.originalPrice > book.price && (
              <span className="text-gray-400 line-throguh text-sm">
                ${book.originalPrice.toFixed(2)}
              </span>
            )}
            <p className="text-red-500 font-semibold text-xl">
              ${book.price.toFixed(2)}
            </p>
          </div>

          {book.stock !== undefined  && (
            <div className="mb-3">
              {book.stock > 0 ? (
                <span className="text-green-600 text-sm">
                  {book.stock < 5 ? `Only ${book.stock} left!` : 'In Stock'}
                </span>
              ) : (
                <span className="text-red-500 text-sm">Out of Stock</span>
              )}
            </div>
          )}
        </div>
      </Link>

      <button 
        onClick={handleAddToCart}
        disabled={isAddingToCart || (book.stock !== undefined && book.stock === 0 )}
        className="w-full bg-red-500 text-white px-6 py-2 font-semibold shadow hover:bg-red-600 transition-colors disabled:bg-gray-400 disabled:cursoe-not-allowed"
      >
        {isAddingToCart ? (
          <span className="flex items-center justify-center">
            <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            Adding...
          </span>
        ) : book.stock === 0 ? (
          'OUT OF STOCK'
        ) : (
          'ADD TO CART'
        )}
      </button>
    </div>
  );
}

export default ProductCard