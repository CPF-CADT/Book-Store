import React, { useState } from 'react';

export function ProductImageGallery({ imageUrl, title }) {
  const [hasError, setHasError] = useState(false);

  if (hasError || !imageUrl) {
    return (
      <div className="w-full h-96 bg-gray-200 flex items-center justify-center rounded-lg">
        <span className="text-gray-500">No Image Available</span>
      </div>
    );
  }

  return (
    <div className="w-full">
      <img
        src={imageUrl}
        alt={`Cover of ${title}`}
        className="w-full h-auto object-cover rounded-lg shadow-lg"
        onError={() => setHasError(true)}
      />
    </div>
  );
}