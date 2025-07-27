import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { HomeHeader, Footer } from '../components/HeaderFooter';
import { fetchBookById } from '../services/api';
import { ProductImageGallery } from '../components/Books/ProductImageGallery.jsx';
import { ProductInfo } from '../components/Books/ProductInfo.jsx';

export function BookDetailPage() {
  const { id } = useParams(); // Get the book ID from the URL
  const [book, setBook] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadBookData = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await fetchBookById(id);
        setBook(response.data);
      } catch (err) {
        console.error("Failed to fetch book:", err);
        setError("Could not find the book you were looking for.");
      } finally {
        setLoading(false);
      }
    };

    loadBookData();
  }, [id]); // Re-run the effect if the ID in the URL changes

  const renderContent = () => {
    if (loading) {
      return <div className="text-center p-12">Loading book details...</div>;
    }
    
    if (error) {
      return (
        <div className="text-center p-12 text-red-600">
            <p>{error}</p>
            <Link to="/" className="text-red-500 hover:underline mt-4 inline-block">Go back home</Link>
        </div>
      );
    }
    
    if (book) {
      return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12">
          {/* Left Side: Image */}
          <div>
            <ProductImageGallery imageUrl={book.image_url} title={book.title} />
          </div>
          {/* Right Side: Info */}
          <div>
            <ProductInfo book={book} />
          </div>
        </div>
      );
    }
    
    return null;
  };
  
  return (
    <>
      <HomeHeader />
      <main className="bg-white py-12 md:py-20">
        <div className="max-w-6xl mx-auto px-4">
          {renderContent()}
        </div>
      </main>
      <Footer />
    </>
  );
}