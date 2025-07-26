import React from 'react';
import { Link } from 'react-router-dom';
import { FaExclamationTriangle } from 'react-icons/fa'; // Using react-icons for a nice visual touch

export function NotFound() {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center text-center p-4">
      <div className="max-w-md w-full">
        {/* Optional: An icon to draw attention */}
        <FaExclamationTriangle className="mx-auto text-yellow-400 text-6xl mb-4" />

        <h1 className="text-8xl md:text-9xl font-extrabold text-red-500 tracking-wider">
          404
        </h1>
        
        <h2 className="text-2xl md:text-3xl font-bold text-gray-800 mt-4">
          Page Not Found
        </h2>
        
        <p className="text-gray-600 mt-2 mb-6">
          Sorry, we couldn't find the page you're looking for. It might have been moved, deleted, or you may have typed the URL incorrectly.
        </p>
        
        {/* The essential "Go Home" button */}
        <Link
          to="/"
          className="inline-block bg-red-500 text-white font-bold py-3 px-8 rounded-lg hover:bg-red-600 transition-colors duration-300 shadow-lg"
        >
          Go Back to Homepage
        </Link>
      </div>
    </div>
  );
}