import React, { useState, useEffect, useCallback } from 'react';
// Note: We don't need useAuth here for API calls, as the token is handled by the API service.
import {
  fetchAllTags,
  createTag,
  updateTag,
  deleteTags,
} from '../services/api';
import { useDebounce } from '../context/useDebounce';
import { Modal } from '../components/admin/Modal';
import { Edit, Trash, PlusCircle } from 'lucide-react';

export function AdminTagsPage() {
  const [tags, setTags] = useState([]);
  const [pageData, setPageData] = useState({ totalPages: 1 });
  const [loading, setLoading] = useState(true);

  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const debouncedSearch = useDebounce(search, 500);

  // Modal and form state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentTag, setCurrentTag] = useState(null);
  const [formData, setFormData] = useState({});
  const [formErrors, setFormErrors] = useState(null);
  
  const fetchPageData = useCallback(async () => {
    setLoading(true);
    try {
      const params = { page, searchQuery: debouncedSearch };
      const response = await fetchAllTags(params);
      setTags(response.data.tags || []);
      setPageData({
          totalPages: response.data.totalPages,
          currentPage: response.data.currentPage,
          totalItems: response.data.totalItems,
      });
    } catch (error) { console.error("Failed to fetch tags:", error); } 
    finally { setLoading(false); }
  }, [page, debouncedSearch]);

  useEffect(() => {
    fetchPageData();
  }, [fetchPageData]);
  
  const refreshTags = () => {
      setPage(1);
      fetchPageData();
  };

  const openModal = (tag = null) => {
    setCurrentTag(tag);
    setFormErrors(null);
    setFormData(tag ? { name: tag.name } : { name: '' });
    setIsModalOpen(true);
  };
  
  const closeModal = () => setIsModalOpen(false);

  const handleFormChange = (e) => setFormData(prev => ({...prev, [e.target.id]: e.target.value}));

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (currentTag) {
        // No userId needed for the secure API call
        await updateTag(currentTag.id, formData);
      } else {
        await createTag(formData);
      }
      closeModal();
      refreshTags();
    } catch (error) {
      setFormErrors(error.response?.data?.message || 'Operation failed.');
    }
  };

  const handleDelete = async (tagId) => {
    if (window.confirm('Are you sure you want to delete this tag?')) {
      try {
        await deleteTags(tagId.toString());
        refreshTags();
      } catch (error) {
        alert(error.response?.data?.message || 'Failed to delete tag.');
      }
    }
  };

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Tag Management</h1>
      
      <div className="flex justify-between items-center mb-4">
        <input type="text" placeholder="Search by tag name..." value={search} onChange={(e) => setSearch(e.target.value)} className="w-1/3 px-4 py-2 border rounded-md" />
        <button onClick={() => openModal()} className="bg-red-500 text-white px-4 py-2 rounded-md font-semibold hover:bg-red-600">
          <PlusCircle size={20} className="inline mr-2" /> Add New Tag
        </button>
      </div>
      
      <div className="bg-white shadow-md rounded-lg overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-gray-100">
            <tr>
              <th className="p-3 text-left">Name</th>
              <th className="p-3 text-left">Slug</th>
              <th className="p-3 text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {!loading && tags.map(tag => (
              <tr key={tag.id} className="border-b hover:bg-gray-50">
                <td className="p-3 font-medium">{tag.name}</td>
                <td className="p-3 text-gray-500 font-mono">{tag.slug}</td>
                <td className="p-3">
                  <button onClick={() => openModal(tag)} className="text-blue-600 p-2"><Edit size={16}/></button>
                  <button onClick={() => handleDelete(tag.id)} className="text-red-600 p-2"><Trash size={16}/></button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {loading && <p className="text-center p-4">Loading tags...</p>}
      </div>

      {/* Pagination Controls Here */}
      
      <Modal isOpen={isModalOpen} onClose={closeModal} title={currentTag ? 'Edit Tag' : 'Create New Tag'}>
        <form onSubmit={handleSubmit} className="space-y-4">
          {formErrors && <p className="text-red-500 p-3 bg-red-50 rounded-md">{formErrors}</p>}
          
          <div>
            <label htmlFor="name" className="block text-sm font-medium mb-1">Tag Name</label>
            <input id="name" type="text" value={formData.name || ''} onChange={handleFormChange} required className="w-full p-2 border rounded-md"/>
            <p className="text-xs text-gray-500 mt-1">The slug will be generated automatically from the name.</p>
          </div>

          <div className="flex justify-end space-x-2 pt-4">
            <button type="button" onClick={closeModal} className="px-4 py-2 bg-gray-200 rounded-md">Cancel</button>
            <button type="submit" className="px-4 py-2 bg-red-500 text-white rounded-md">{currentTag ? 'Update Tag' : 'Create Tag'}</button>
          </div>
        </form>
      </Modal>

    </div>
  );
}