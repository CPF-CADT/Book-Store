import React, { useState, useEffect, useCallback } from 'react';
import { fetchBlogPosts, adminCreateBlogPost, adminUpdateBlogPost, adminDeleteBlogPost } from '../services/api';
import { useDebounce } from '../context/useDebounce';
import { Modal } from '../components/admin/Modal';
import { Edit, Trash, PlusCircle } from 'lucide-react';

export function AdminBlogPage() {
  const [posts, setPosts] = useState([]);
  const [pageData, setPageData] = useState({ totalPages: 1 });
  const [loading, setLoading] = useState(true);

  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const debouncedSearch = useDebounce(search, 500);

  // Modal and form state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentPost, setCurrentPost] = useState(null);
  const [formData, setFormData] = useState({});
  const [formErrors, setFormErrors] = useState(null);
  
  const fetchPageData = useCallback(async () => {
    setLoading(true);
    try {
      // Your public fetch might exclude drafts, you may need an admin-specific fetch later
      const response = await fetchBlogPosts(page); 
      setPosts(response.data.posts || []);
      setPageData({ totalPages: response.data.totalPages, currentPage: response.data.currentPage });
    } catch (error) { console.error("Failed to fetch posts:", error); } 
    finally { setLoading(false); }
  }, [page, debouncedSearch]);

  useEffect(() => {
    fetchPageData();
  }, [fetchPageData]);
  
  const refreshPosts = () => fetchPageData();

  const openModal = (post = null) => {
    setCurrentPost(post);
    setFormErrors(null);
    setFormData(post ? {
      title: post.title,
      content: post.content,
      excerpt: post.excerpt,
      featured_image_url: post.featured_image_url,
      status: post.status,
    } : { status: 'draft' }); // Default new posts to 'draft'
    setIsModalOpen(true);
  };
  
  const closeModal = () => setIsModalOpen(false);
  const handleFormChange = (e) => setFormData(prev => ({...prev, [e.target.id]: e.target.value}));

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (currentPost) {
        await adminUpdateBlogPost(currentPost.id, formData);
      } else {
        await adminCreateBlogPost(formData);
      }
      closeModal();
      refreshPosts();
    } catch (error) {
      setFormErrors(error.response?.data?.message || 'Operation failed.');
    }
  };

  const handleDelete = async (postId) => {
    if (window.confirm('Are you sure you want to delete this blog post?')) {
      try {
        await adminDeleteBlogPost(postId);
        refreshPosts();
      } catch (error) {
        alert(error.response?.data?.message || 'Failed to delete post.');
      }
    }
  };

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Blog Management</h1>
      
      <div className="flex justify-between items-center mb-4">
        <input type="text" placeholder="Search by title..." value={search} onChange={(e) => setSearch(e.target.value)} className="w-1/3 px-4 py-2 border rounded-md" />
        <button onClick={() => openModal()} className="bg-red-500 text-white px-4 py-2 rounded-md font-semibold hover:bg-red-600">
          <PlusCircle size={20} className="inline mr-2" /> Add New Post
        </button>
      </div>
      
      <div className="bg-white shadow-md rounded-lg overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-gray-100">
            <tr>
              <th className="p-3 text-left">Title</th>
              <th className="p-3 text-left">Status</th>
              <th className="p-3 text-left">Published Date</th>
              <th className="p-3 text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {!loading && posts.map(post => (
              <tr key={post.id} className="border-b hover:bg-gray-50">
                <td className="p-3 font-medium">{post.title}</td>
                <td className="p-3"><span className={`px-2 py-1 text-xs rounded-full ${post.status === 'published' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>{post.status}</span></td>
                <td className="p-3">{new Date(post.published_at).toLocaleDateString()}</td>
                <td className="p-3">
                  <button onClick={() => openModal(post)} className="text-blue-600 p-2"><Edit size={16}/></button>
                  <button onClick={() => handleDelete(post.id)} className="text-red-600 p-2"><Trash size={16}/></button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {loading && <p className="text-center p-4">Loading posts...</p>}
      </div>
      
      <Modal isOpen={isModalOpen} onClose={closeModal} title={currentPost ? 'Edit Blog Post' : 'Create New Post'}>
        <form onSubmit={handleSubmit} className="space-y-4">
          {formErrors && <p className="text-red-500">{formErrors}</p>}
          
          <div>
            <label htmlFor="title">Title</label>
            <input id="title" type="text" value={formData.title || ''} onChange={handleFormChange} required className="w-full p-2 border rounded-md"/>
          </div>
          <div>
            <label htmlFor="excerpt">Excerpt (Short Summary)</label>
            <textarea id="excerpt" value={formData.excerpt || ''} onChange={handleFormChange} rows="3" className="w-full p-2 border rounded-md"></textarea>
          </div>
          <div>
            <label htmlFor="content">Content (can use HTML)</label>
            <textarea id="content" value={formData.content || ''} onChange={handleFormChange} rows="10" required className="w-full p-2 border rounded-md"></textarea>
            <p className="text-xs text-gray-500 mt-1">For a better experience, consider integrating a Rich Text Editor like TinyMCE or Quill.js.</p>
          </div>
          <div>
            <label htmlFor="featured_image_url">Featured Image URL</label>
            <input id="featured_image_url" type="text" value={formData.featured_image_url || ''} onChange={handleFormChange} className="w-full p-2 border rounded-md"/>
          </div>
          <div>
            <label htmlFor="status">Status</label>
            <select id="status" value={formData.status || 'draft'} onChange={handleFormChange} className="w-full p-2 border rounded-md bg-white">
              <option value="draft">Draft</option>
              <option value="published">Published</option>
            </select>
          </div>

          <div className="flex justify-end space-x-2 pt-4">
            <button type="button" onClick={closeModal} className="px-4 py-2 bg-gray-200 rounded-md">Cancel</button>
            <button type="submit" className="px-4 py-2 bg-red-500 text-white rounded-md">{currentPost ? 'Update Post' : 'Create Post'}</button>
          </div>
        </form>
      </Modal>
    </div>
  );
}