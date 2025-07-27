import React, { useState } from 'react';
import { FaShoppingCart, FaStar, FaRegStar } from 'react-icons/fa';
import { addToCart } from '../../services/api'; // Assuming you have this API function

// A simple star rating component
const StarRating = ({ rating = 0, reviewCount = 0 }) => {
    const totalStars = 5;
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0; // Not used yet, but could be implemented
  
    return (
      <div className="flex items-center space-x-1">
        {[...Array(totalStars)].map((_, i) => (
          i < fullStars 
            ? <FaStar key={i} className="text-yellow-400" /> 
            : <FaRegStar key={i} className="text-gray-300" />
        ))}
        {reviewCount > 0 && <span className="text-sm text-gray-500 ml-2">({reviewCount} reviews)</span>}
      </div>
    );
  };
  

export function ProductInfo({ book }) {
  const [quantity, setQuantity] = useState(1);
  const [isAddingToCart, setIsAddingToCart] = useState(false);

  const handleAddToCart = async () => {
    setIsAddingToCart(true);
    try {
      await addToCart(book.id, quantity);
      alert(`${quantity} "${book.title}" added to cart!`);
    } catch (error) {
      alert(error.response?.data?.message || 'Failed to add to cart.');
    } finally {
      setIsAddingToCart(false);
    }
  };

  return (
    <div className="flex flex-col space-y-4">
      {/* Category */}
      {book.category && (
        <span className="text-sm font-semibold text-red-500 uppercase">{book.category.name}</span>
      )}
      
      {/* Title */}
      <h1 className="text-3xl lg:text-4xl font-bold text-gray-800">{book.title}</h1>
      
      {/* Author and Rating */}
      <div className="flex items-center space-x-4">
        {book.authors && book.authors.length > 0 && (
          <p className="text-md text-gray-600">by {book.authors.map(a => a.name).join(', ')}</p>
        )}
        <StarRating rating={book.rating} reviewCount={book.review_count} />
      </div>

      {/* Price */}
      <div className="flex items-baseline space-x-2">
        <p className="text-3xl font-bold text-red-600">${parseFloat(book.price).toFixed(2)}</p>
        {book.original_price && parseFloat(book.original_price) > parseFloat(book.price) && (
            <p className="text-lg text-gray-400 line-through">${parseFloat(book.original_price).toFixed(2)}</p>
        )}
      </div>

      {/* Description */}
      <p className="text-gray-700 leading-relaxed pt-2">{book.description}</p>
      
      {/* Add to Cart Section */}
      <div className="flex items-center space-x-4 pt-4">
        <input
            type="number"
            value={quantity}
            onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value)))}
            min="1"
            className="w-20 border-2 border-gray-300 rounded-md text-center py-2 focus:ring-red-500 focus:border-red-500"
        />
        <button
          onClick={handleAddToCart}
          disabled={isAddingToCart}
          className="flex-grow bg-red-500 text-white font-bold py-3 px-6 rounded-lg hover:bg-red-600 transition disabled:bg-gray-400 flex items-center justify-center"
        >
          <FaShoppingCart className="mr-2" />
          {isAddingToCart ? 'Adding...' : 'Add to Cart'}
        </button>
      </div>
    </div>
  );
}