import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { HomeHeader, Footer } from '../components/HeaderFooter';
import { fetchBlogPostBySlug } from '../services/api';

export function BlogDetailPage() {
  const { slug } = useParams(); // Get slug from URL
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadPost = async () => {
      try {
        const response = await fetchBlogPostBySlug(slug);
        setPost(response.data);
      } catch (err) {
        console.error("Failed to load post:", err);
      } finally {
        setLoading(false);
      }
    };
    loadPost();
  }, [slug]);

  if (loading) return <div>Loading post...</div>;
  if (!post) return <div>Post not found.</div>;
  
  const publishDate = new Date(post.published_at).toLocaleDateString('en-US', {
    year: 'numeric', month: 'long', day: 'numeric'
  });
  
  return (
    <>
      <HomeHeader />
      <div className="bg-white py-12 md:py-20">
        <article className="max-w-4xl mx-auto px-4">
          <header className="text-center mb-12">
            <h1 className="text-3xl md:text-5xl font-extrabold text-gray-900 leading-tight">
              {post.title}
            </h1>
            <div className="mt-4 text-gray-500">
              <span>By {post.author.first_name} {post.author.last_name}</span>
              <span className="mx-2">•</span>
              <span>{publishDate}</span>
            </div>

          </header>
          {post.featured_image_url && (
            <img 
              src={post.featured_image_url} 
              alt={post.title} 
              className="w-full h-auto max-h-96 object-cover rounded-lg shadow-lg mb-12"
            />
          )}
          {/* Use dangerouslySetInnerHTML if your content is HTML from a rich text editor.
              Be careful with this and ensure you sanitize your HTML on the backend to prevent XSS attacks.
          */}
          <div
            className="prose lg:prose-xl mx-auto"
            dangerouslySetInnerHTML={{ __html: post.content }}
          />

           <div className="text-center mt-16">
                <Link to="/blog" className="text-red-500 font-semibold hover:underline">
                    ← Back to All Posts
                </Link>
           </div>
        </article>
      </div>
      <Footer />
    </>
  );
}