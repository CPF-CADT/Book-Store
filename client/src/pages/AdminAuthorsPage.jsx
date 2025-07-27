import React, { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../context/AuthContext';
import {
  fetchAllAuthors,
  createAuthor,
  updateAuthor,
  deleteAuthors,
} from '../services/api';
import { useDebounce } from '../context/useDebounce';
import { Modal } from '../components/admin/Modal';
import { Edit, Trash, PlusCircle } from 'lucide-react';

export function AdminAuthorsPage() {
  const { user } = useAuth();
  const [authors, setAuthors] = useState([]);
  const [pageData, setPageData] = useState({ totalPages: 1 });
  const [loading, setLoading] = useState(true);

  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const debouncedSearch = useDebounce(search, 500);

  // Modal and form state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentAuthor, setCurrentAuthor] = useState(null);
  const [formData, setFormData] = useState({});
  const [formErrors, setFormErrors] = useState(null);
  
  const fetchPageData = useCallback(async () => {
    setLoading(true);
    try {
      const params = { page, searchQuery: debouncedSearch };
      const response = await fetchAllAuthors(params);
      setAuthors(response.data.authors || []);
      setPageData({
          totalPages: response.data.totalPages,
          currentPage: response.data.currentPage
      });
    } catch (error) { console.error("Failed to fetch authors:", error); } 
    finally { setLoading(false); }
  }, [page, debouncedSearch]);

  useEffect(() => {
    fetchPageData();
  }, [fetchPageData]);
  
  const refreshAuthors = () => {
      setPage(1); // Resetting page triggers the useEffect to re-fetch
      fetchPageData(); // Also call directly for immediate feedback
  };

  const openModal = (author = null) => {
    setCurrentAuthor(author);
    setFormErrors(null);
    setFormData(author ? {
      name: author.name,
      bio: author.bio,
      nationality: author.nationality
    } : { name: '', bio: '', nationality: '' });
    setIsModalOpen(true);
  };
  
  const closeModal = () => setIsModalOpen(false);

  const handleFormChange = (e) => setFormData(prev => ({...prev, [e.target.id]: e.target.value}));

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!user) return alert("Authentication error. Please log in again.");
    
    try {
      if (currentAuthor) {
        await updateAuthor(user.id, currentAuthor.id, formData);
      } else {
        await createAuthor(user.id, formData);
      }
      closeModal();
      refreshAuthors();
    } catch (error) {
      setFormErrors(error.response?.data?.message || 'Operation failed.');
    }
  };

  const handleDelete = async (authorId) => {
    if (!user) return alert("Authentication error.");
    if (window.confirm('Are you sure you want to delete this author?')) {
      try {
        await deleteAuthors(user.id, authorId.toString());
        refreshAuthors();
      } catch (error) {
        alert(error.response?.data?.message || 'Failed to delete author.');
      }
    }
  };

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Author Management</h1>
      
      <div className="flex justify-between items-center mb-4">
        <input type="text" placeholder="Search by author name..." value={search} onChange={(e) => setSearch(e.target.value)} className="w-1/3 px-4 py-2 border rounded-md" />
        <button onClick={() => openModal()} className="bg-red-500 text-white px-4 py-2 rounded-md font-semibold hover:bg-red-600">
          <PlusCircle size={20} className="inline mr-2" /> Add New Author
        </button>
      </div>
      
      <div className="bg-white shadow-md rounded-lg overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-gray-100">
            <tr>
              <th className="p-3 text-left">Name</th>
              <th className="p-3 text-left">Nationality</th>
              <th className="p-3 text-left">Bio</th>
              <th className="p-3 text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {!loading && authors.map(author => (
              <tr key={author.id} className="border-b hover:bg-gray-50">
                <td className="p-3 font-medium">{author.name}</td>
                <td className="p-3">{author.nationality}</td>
                <td className="p-3 text-gray-600 truncate max-w-md">{author.bio}</td>
                <td className="p-3">
                  <button onClick={() => openModal(author)} className="text-blue-600 p-2"><Edit size={16}/></button>
                  <button onClick={() => handleDelete(author.id)} className="text-red-600 p-2"><Trash size={16}/></button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {loading && <p className="text-center p-4">Loading authors...</p>}
      </div>

      {/* Pagination Controls Here */}
      
      <Modal isOpen={isModalOpen} onClose={closeModal} title={currentAuthor ? 'Edit Author' : 'Create New Author'}>
        <form onSubmit={handleSubmit} className="space-y-4">
          {formErrors && <p className="text-red-500 p-3 bg-red-50 rounded-md">{formErrors}</p>}
          
          <div>
            <label htmlFor="name">Author Name</label>
            <input id="name" type="text" value={formData.name || ''} onChange={handleFormChange} required className="w-full p-2 border rounded-md"/>
          </div>

          <div>
            <label htmlFor="nationality">Nationality</label>
            <input id="nationality" type="text" value={formData.nationality || ''} onChange={handleFormChange} className="w-full p-2 border rounded-md"/>
          </div>
          
          <div>
            <label htmlFor="bio">Biography</label>
            <textarea id="bio" value={formData.bio || ''} onChange={handleFormChange} rows="4" className="w-full p-2 border rounded-md"></textarea>
          </div>

          <div className="flex justify-end space-x-2 pt-4">
            <button type="button" onClick={closeModal} className="px-4 py-2 bg-gray-200 rounded-md">Cancel</button>
            <button type="submit" className="px-4 py-2 bg-red-500 text-white rounded-md">{currentAuthor ? 'Update Author' : 'Create Author'}</button>
          </div>
        </form>
      </Modal>

    </div>
  );
}