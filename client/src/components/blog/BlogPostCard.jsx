import React from 'react';
import { Link } from 'react-router-dom';

export function BlogPostCard({ post }) {
  const publishDate = new Date(post.published_at).toLocaleDateString('en-US', {
    year: 'numeric', month: 'long', day: 'numeric'
  });

  return (
    <Link to={`/blog/${post.slug}`} className="block group bg-white rounded-lg shadow-md hover:shadow-xl transition-shadow duration-300 overflow-hidden">
      <div className="h-48 w-full overflow-hidden">
        <img
          src={post.featured_image_url || 'https://via.placeholder.com/400x200/CCCCCC/FFFFFF?text=Kon+Khmer'}
          alt={post.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
        />
      </div>
      <div className="p-6">
        <p className="text-sm text-gray-500 mb-1">{publishDate}</p>
        <h3 className="text-xl font-bold text-gray-800 group-hover:text-red-600 transition-colors mb-2 line-clamp-2">
          {post.title}
        </h3>
        <p className="text-gray-600 line-clamp-3 mb-4">{post.excerpt}</p>
        <div className="text-sm font-semibold text-red-500 group-hover:underline">
          Read More →
        </div>
      </div>
    </Link>
  );
}