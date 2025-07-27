// client/src/pages/BookDetailPage.jsx
import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { fetchBookById } from '../services/api';
import { Heart, ShoppingCart } from 'lucide-react';

export function BookDetailPage() {
  const { bookId } = useParams();
  const [book, setBook] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadBook = async () => {
      try {
        setLoading(true);
        const data = await fetchBookById(bookId);
        setBook(data);
      } catch (err) {
        setError('Failed to load book details. It might not exist.',err);
      } finally {
        setLoading(false);
      }
    };
    loadBook();
  }, [bookId]);

  if (loading) {
    return <div className="text-center p-10">Loading book...</div>;
  }

  if (error) {
    return <div className="text-center p-10 text-red-500">{error}</div>;
  }

  if (!book) {
    return <div className="text-center p-10">Book not found.</div>;
  }

  return (
    <div className="container mx-auto p-8">
      <div className="mb-4">
        <Link to="/" className="text-red-500 hover:underline">&lt; Back to all books</Link>
      </div>
      <div className="flex flex-col md:flex-row gap-8">
        <div className="md:w-1/3">
          <img src={book.imageUrl || 'https://placehold.co/400x600'} alt={book.title} className="w-full rounded-lg shadow-lg" />
        </div>
        <div className="md:w-2/3">
          <h1 className="text-4xl font-bold mb-2">{book.title}</h1>
          <p className="text-xl text-gray-600 mb-4">by {book.author}</p>
          <div className="flex items-center mb-4">
            <span className="text-yellow-500">{'★'.repeat(Math.round(book.rating))}{'☆'.repeat(5 - Math.round(book.rating))}</span>
            <span className="ml-2 text-gray-500">({book.rating} rating)</span>
          </div>
          <p className="text-3xl font-light text-red-600 mb-4">${book.price}</p>
          <div className="mb-6">
            <span className={`px-3 py-1 text-sm rounded-full ${book.availability === 'In Stock' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
              {book.availability}
            </span>
          </div>
          <p className="text-gray-700 mb-6 leading-relaxed">{book.description}</p>
          <div className="flex items-center gap-4">
            <button className="flex items-center gap-2 bg-red-500 text-white px-6 py-3 rounded-lg font-semibold hover:bg-red-600 transition">
              <ShoppingCart size={20} /> Add to Cart
            </button>
            <button className="flex items-center gap-2 border border-gray-300 px-4 py-3 rounded-lg hover:bg-gray-100 transition">
              <Heart size={20} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}