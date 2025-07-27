import React, { useState, useEffect } from 'react';
import { HomeHeader, Footer } from '../components/HeaderFooter';
import { BlogPostCard } from '../components/blog/BlogPostCard';
import { fetchBlogPosts } from '../services/api';

export function BlogListPage() {
  const [pageData, setPageData] = useState({ posts: [], totalPages: 1, currentPage: 1 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadPosts = async (page = 1) => {
      setLoading(true);
      setError(null);
      try {
        const response = await fetchBlogPosts(page);
        setPageData(response.data);
      } catch (err) {
        setError("Failed to load blog posts.");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    loadPosts();
  }, []);

  // For simplicity, we'll reload posts. A better UX could be to add to the existing list.
  const handlePageChange = (newPage) => {
    // Scroll to top
    window.scrollTo(0, 0);
    // Reload posts for the new page
    // ... This would require refactoring the useEffect, but for now we'll keep it simple
  };

  if (loading) return <div>Loading posts...</div>;
  if (error) return <div>{error}</div>;
  
  return (
    <>
      <HomeHeader />
      <div className="bg-gray-50 py-16 md:py-24">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-extrabold text-gray-800">Our Bookstore Blog</h1>
            <p className="mt-4 text-lg text-gray-600">Stories, author interviews, and book recommendations.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {pageData.posts.map(post => (
              <BlogPostCard key={post.id} post={post} />
            ))}
          </div>
          {/* Pagination would go here */}
        </div>
      </div>
      <Footer />
    </>
  );
}