import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import {
  fetchAllBooks, // Reuse the public fetch for the list
  adminCreateBook,
  adminUpdateBook,
  adminDeleteBooks,
  // You will also need to fetch categories/authors/tags for the dropdowns
  fetchAllCategories, 
  fetchAllAuthorsForFilter, 
  fetchAllTags 
} from '../services/api';
import { useDebounce } from '../context/useDebounce';
import { Modal } from '../components/admin/Modal';
import { Edit, Trash, PlusCircle } from 'lucide-react';

export function AdminBooksPage() {
  const { user } = useAuth(); // Get the logged-in user to pass their ID
  const [books, setBooks] = useState([]);
  const [pageData, setPageData] = useState({ totalPages: 1 });
  const [loading, setLoading] = useState(true);
  
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const debouncedSearch = useDebounce(search, 500);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentBook, setCurrentBook] = useState(null); // null for new, object for edit
  const [formData, setFormData] = useState({});
  const [formErrors, setFormErrors] = useState(null);

  // State to hold options for dropdowns in the form
  const [selectOptions, setSelectOptions] = useState({ categories: [], authors: [], tags: [] });

  // --- DATA FETCHING ---

  // Fetch books for the table
  useEffect(() => {
    const loadBooks = async () => {
      setLoading(true);
      try {
        const params = { page, searchQuery: debouncedSearch };
        const response = await fetchAllBooks(params);
        setBooks(response.data.books || []);
        setPageData({ totalPages: response.data.totalPages, currentPage: response.data.currentPage });
      } catch (error) { console.error("Failed to fetch books:", error); }
      finally { setLoading(false); }
    };
    loadBooks();
  }, [page, debouncedSearch]);

  // Fetch options for the form's select dropdowns ONCE
  useEffect(() => {
    const loadSelectOptions = async () => {
      try {
        const [catRes, authRes, tagRes] = await Promise.all([
          fetchAllCategories(),
          fetchAllAuthorsForFilter(),
          fetchAllTags(),
        ]);
        setSelectOptions({
          categories: catRes.data.categories,
          authors: authRes.data.authors,
          tags: tagRes.data.tags,
        });
      } catch (error) {
        console.error("Failed to load form options:", error);
      }
    };
    loadSelectOptions();
  }, []);
  
  // --- HANDLERS ---
  const refreshBooks = () => setPage(1);

  const openModal = (book = null) => {
    setCurrentBook(book);
    setFormErrors(null);
    setFormData(book ? {
        title: book.title,
        description: book.description,
        price: book.price,
        stock: book.stock,
        category_id: book.category_id,
        // ... set author and tag IDs if available on the book object
    } : { /* Defaults for new book */ });
    setIsModalOpen(true);
  };
  
  const closeModal = () => setIsModalOpen(false);

  const handleFormChange = (e) => setFormData(prev => ({...prev, [e.target.id]: e.target.value}));

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!user) return alert("Authentication error.");

    try {
      if (currentBook) {
        await adminUpdateBook(user.id, currentBook.id, formData);
      } else {
        await adminCreateBook(user.id, formData);
      }
      closeModal();
      refreshBooks();
    } catch (error) {
      setFormErrors(error.response?.data?.message || 'Operation failed.');
    }
  };

  const handleDelete = async (bookId) => {
    if (!user) return alert("Authentication error.");
    if (window.confirm('Are you sure you want to delete this book?')) {
      try {
        await adminDeleteBooks(user.id, bookId.toString());
        refreshBooks();
      } catch (error) {
        alert(error.response?.data?.message || 'Failed to delete book.');
      }
    }
  };

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Book Management</h1>

      <div className="flex justify-between items-center mb-4">
        <input type="text" placeholder="Search by title..." value={search} onChange={(e) => setSearch(e.target.value)} className="w-1/3 px-4 py-2 border rounded-md" />
        <button onClick={() => openModal()} className="bg-red-500 text-white px-4 py-2 rounded-md font-semibold hover:bg-red-600">
          <PlusCircle size={20} className="inline mr-2" /> Add New Book
        </button>
      </div>

      <div className="bg-white shadow-md rounded-lg overflow-x-auto">
        <table className="w-full text-sm">
            <thead className="bg-gray-100">
                <tr>
                    <th className="p-3 text-left">Title</th>
                    <th className="p-3 text-left">Price</th>
                    <th className="p-3 text-left">Stock</th>
                    <th className="p-3 text-left">Actions</th>
                </tr>
            </thead>
            <tbody>
                {!loading && books.map(book => (
                    <tr key={book.id} className="border-b hover:bg-gray-50">
                        <td className="p-3 font-medium">{book.title}</td>
                        <td className="p-3">${parseFloat(book.price).toFixed(2)}</td>
                        <td className="p-3">{book.stock}</td>
                        <td className="p-3">
                            <button onClick={() => openModal(book)} className="text-blue-600 p-2"><Edit size={16}/></button>
                            <button onClick={() => handleDelete(book.id)} className="text-red-600 p-2"><Trash size={16}/></button>
                        </td>
                    </tr>
                ))}
            </tbody>
        </table>
        {loading && <p className="text-center p-4">Loading books...</p>}
      </div>

      {/* ... Pagination Controls ... */}

      <Modal isOpen={isModalOpen} onClose={closeModal} title={currentBook ? 'Edit Book' : 'Create New Book'}>
        <form onSubmit={handleSubmit} className="space-y-4">
            {formErrors && <p className="text-red-500 p-3 bg-red-50 rounded-md">{formErrors}</p>}

            <div>
              <label htmlFor="title">Title</label>
              <input id="title" type="text" value={formData.title || ''} onChange={handleFormChange} required className="w-full p-2 border rounded-md" />
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label htmlFor="price">Price</label>
                <input id="price" type="number" step="0.01" value={formData.price || ''} onChange={handleFormChange} required className="w-full p-2 border rounded-md" />
              </div>
              <div>
                <label htmlFor="stock">Stock</label>
                <input id="stock" type="number" value={formData.stock || ''} onChange={handleFormChange} required className="w-full p-2 border rounded-md" />
              </div>
            </div>

            <div>
              <label htmlFor="category_id">Category</label>
              <select id="category_id" value={formData.category_id || ''} onChange={handleFormChange} className="w-full p-2 border rounded-md">
                  <option value="">Select a Category</option>
                  {selectOptions.categories.map(cat => <option key={cat.id} value={cat.id}>{cat.name}</option>)}
              </select>
            </div>
            
            {/* You would add similar dropdowns for authors and tags */}

            <div>
              <label htmlFor="description">Description</label>
              <textarea id="description" value={formData.description || ''} onChange={handleFormChange} rows="4" className="w-full p-2 border rounded-md"></textarea>
            </div>

            <div className="flex justify-end space-x-2 pt-4">
              <button type="button" onClick={closeModal} className="px-4 py-2 bg-gray-200 rounded-md">Cancel</button>
              <button type="submit" className="px-4 py-2 bg-red-500 text-white rounded-md">{currentBook ? 'Update Book' : 'Create Book'}</button>
            </div>
        </form>
      </Modal>

    </div>
  );
}