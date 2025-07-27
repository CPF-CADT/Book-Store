import React, { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../context/AuthContext';
import {
  fetchAllCategories,
  createCategory,
  updateCategory,
  deleteCategories,
} from '../services/api';
import { useDebounce } from '../context/useDebounce';
import { Modal } from '../components/admin/Modal';
import { Edit, Trash, PlusCircle } from 'lucide-react';

export function AdminCategoriesPage() {
  const { user } = useAuth();
  const [categories, setCategories] = useState([]);
  const [pageData, setPageData] = useState({ totalPages: 1 });
  const [loading, setLoading] = useState(true);

  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const debouncedSearch = useDebounce(search, 500);
  
  // To populate the "Parent Category" dropdown
  const [parentCategoryOptions, setParentCategoryOptions] = useState([]);

  // Modal and form state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentCategory, setCurrentCategory] = useState(null);
  const [formData, setFormData] = useState({});
  const [formErrors, setFormErrors] = useState(null);
  
  const fetchPageData = useCallback(async () => {
    setLoading(true);
    try {
      const params = { page, searchQuery: debouncedSearch };
      const response = await fetchAllCategories(params);
      setCategories(response.data.categories || []);
      setPageData({
          totalPages: response.data.totalPages,
          currentPage: response.data.currentPage
      });
      // Use this data to populate the parent category dropdown
      setParentCategoryOptions(response.data.categories || []);
    } catch (error) { console.error("Failed to fetch categories:", error); } 
    finally { setLoading(false); }
  }, [page, debouncedSearch]);

  useEffect(() => {
    fetchPageData();
  }, [fetchPageData]);
  
  const refreshCategories = () => {
      // Re-fetch data. Setting page to 1 will trigger the useEffect.
      setPage(1);
      // To get the absolute latest, you could call fetchPageData() directly.
      fetchPageData();
  };

  const openModal = (category = null) => {
    setCurrentCategory(category);
    setFormErrors(null);
    setFormData(category ? {
      name: category.name,
      description: category.description,
      parent_id: category.parent_id || ''
    } : { name: '', description: '', parent_id: '' });
    setIsModalOpen(true);
  };
  
  const closeModal = () => setIsModalOpen(false);

  const handleFormChange = (e) => setFormData(prev => ({...prev, [e.target.id]: e.target.value}));

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!user) return alert("Authentication error. Please log in again.");
    
    try {
      if (currentCategory) {
        await updateCategory(user.id, currentCategory.id, formData);
      } else {
        await createCategory(user.id, formData);
      }
      closeModal();
      refreshCategories();
    } catch (error) {
      setFormErrors(error.response?.data?.message || 'Operation failed.');
    }
  };

  const handleDelete = async (categoryId) => {
    if (!user) return alert("Authentication error.");
    if (window.confirm('Are you sure? Deleting a category can affect associated books.')) {
      try {
        await deleteCategories(user.id, categoryId.toString());
        refreshCategories();
      } catch (error) {
        alert(error.response?.data?.message || 'Failed to delete category.');
      }
    }
  };

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Category Management</h1>
      
      <div className="flex justify-between items-center mb-4">
        <input type="text" placeholder="Search by category name..." value={search} onChange={(e) => setSearch(e.target.value)} className="w-1/3 px-4 py-2 border rounded-md" />
        <button onClick={() => openModal()} className="bg-red-500 text-white px-4 py-2 rounded-md font-semibold hover:bg-red-600">
          <PlusCircle size={20} className="inline mr-2" /> Add New Category
        </button>
      </div>
      
      <div className="bg-white shadow-md rounded-lg overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-gray-100">
            <tr>
              <th className="p-3 text-left">Name</th>
              <th className="p-3 text-left">Slug</th>
              <th className="p-3 text-left">Description</th>
              <th className="p-3 text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {!loading && categories.map(cat => (
              <tr key={cat.id} className="border-b hover:bg-gray-50">
                <td className="p-3 font-medium">{cat.name}</td>
                <td className="p-3">{cat.slug}</td>
                <td className="p-3 text-gray-600 truncate max-w-sm">{cat.description}</td>
                <td className="p-3">
                  <button onClick={() => openModal(cat)} className="text-blue-600 p-2"><Edit size={16}/></button>
                  <button onClick={() => handleDelete(cat.id)} className="text-red-600 p-2"><Trash size={16}/></button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {loading && <p className="text-center p-4">Loading categories...</p>}
      </div>

      {/* Pagination Controls Here */}
      
      <Modal isOpen={isModalOpen} onClose={closeModal} title={currentCategory ? 'Edit Category' : 'Create New Category'}>
        <form onSubmit={handleSubmit} className="space-y-4">
          {formErrors && <p className="text-red-500 p-3 bg-red-50 rounded-md">{formErrors}</p>}
          
          <div>
            <label htmlFor="name">Category Name</label>
            <input id="name" type="text" value={formData.name || ''} onChange={handleFormChange} required className="w-full p-2 border rounded-md"/>
          </div>
          
          <div>
            <label htmlFor="description">Description</label>
            <textarea id="description" value={formData.description || ''} onChange={handleFormChange} rows="3" className="w-full p-2 border rounded-md"></textarea>
          </div>

          <div>
            <label htmlFor="parent_id">Parent Category (optional)</label>
            <select id="parent_id" value={formData.parent_id || ''} onChange={handleFormChange} className="w-full p-2 border rounded-md bg-white">
              <option value="">None (Top-level Category)</option>
              {parentCategoryOptions
                .filter(opt => !currentCategory || opt.id !== currentCategory.id) // Prevent self-parenting
                .map(opt => (
                  <option key={opt.id} value={opt.id}>{opt.name}</option>
              ))}
            </select>
          </div>

          <div className="flex justify-end space-x-2 pt-4">
            <button type="button" onClick={closeModal} className="px-4 py-2 bg-gray-200 rounded-md">Cancel</button>
            <button type="submit" className="px-4 py-2 bg-red-500 text-white rounded-md">{currentCategory ? 'Update Category' : 'Create Category'}</button>
          </div>
        </form>
      </Modal>

    </div>
  );
}