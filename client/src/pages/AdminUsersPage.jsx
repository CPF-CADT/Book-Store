import React, { useState, useEffect, useCallback } from 'react';
import { adminFetchUsers, adminCreateUser, adminUpdateUser, adminDeleteUser } from '../services/api';
import { useDebounce } from '../context/useDebounce'; 
import { Modal } from '../components/admin/Modal'; 
import { Edit, Trash, PlusCircle } from 'lucide-react'; // For action buttons

// A reusable input component for the form
const FormInput = ({ label, id, ...props }) => (
  <div>
    <label htmlFor={id} className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
    <input id={id} {...props} className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-red-500 focus:border-red-500" />
  </div>
);

export function AdminUsersPage() {
  const [users, setUsers] = useState([]);
  const [pageData, setPageData] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const debouncedSearch = useDebounce(search, 500);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [formData, setFormData] = useState({});
  const [formErrors, setFormErrors] = useState(null);

  // Main data fetching function
  // const fetchUsers = useCallback(async () => {
  //   setLoading(true);
  //   try {
  //     const params = { page, searchQuery: debouncedSearch };
  //     const response = await adminFetchUsers(params);
  //     setUsers(response.data.users);
  //     setPageData({
  //         totalPages: response.data.totalPages,
  //         currentPage: response.data.currentPage,
  //         totalItems: response.data.totalItems,
  //     });
  //   } catch (error) { console.error("Failed to fetch users:", error); } 
  //   finally { setLoading(false); }
  // }, [page, debouncedSearch]);

  useEffect(() => {
    const loadUsers = async () => {
        setLoading(true);
        setError(null);
        try {
            const params = { page, searchQuery: debouncedSearch };
            const response = await adminFetchUsers(params);
            setUsers(response.data.users || []); // Default to empty array
            setPageData({
                totalPages: response.data.totalPages,
                currentPage: response.data.currentPage,
                totalItems: response.data.totalItems,
            });
        } catch (error) {
            setError("Failed to fetch users.");
            console.error("Failed to fetch users:", error);
        } finally {
            setLoading(false);
        }
    };
    
    loadUsers();
  }, [page, debouncedSearch]);// This effect re-runs when page or debouncedSearch changes.

  // The `fetchUsers` function is now a simple handler to manually trigger a refresh.
  // It no longer needs to be memoized with useCallback.
  const refreshUsers = () => {
      // Just re-fetching the current page and search term
      setPage(1); // Usually you want to go back to page 1 on a manual refresh
      // const loadUsers = async () => {
      //   //... (logic is the same as above)
      // }
      // loadUsers();
  };

  // Modal and form handlers
  const openModal = (user = null) => {
    setCurrentUser(user);
    setFormErrors(null);
    // Set form data based on whether we are creating or editing
    setFormData(user ? {
      first_name: user.first_name || '',
      last_name: user.last_name || '',
      phone: user.phone || '',
      role: user.role || 'customer',
    } : { // Defaults for a new user
      email: '',
      password: '',
      first_name: '',
      last_name: '',
      phone: '',
      role: 'customer',
    });
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setCurrentUser(null);
  };
  
  const handleFormChange = (e) => {
    setFormData({...formData, [e.target.id]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormErrors(null);
    try {
      if (currentUser) {
        // Update user (email and password cannot be changed here)
        await adminUpdateUser(currentUser.id, formData);
      } else {
        // Create new user (password is required)
        if (!formData.password || formData.password.length < 6) {
          setFormErrors("Password is required and must be at least 6 characters.");
          return;
        }
        await adminCreateUser(formData);
      }
      closeModal();
      refreshUsers(); // Refresh the list of users
    } catch (error) {
      setFormErrors(error.response?.data?.message || 'Operation failed. Please try again.');
    }
  };

  // Delete handler
 const handleDelete = async (userId) => {
    if(window.confirm('Are you sure you want to delete this user? This action cannot be undone.')){
        try {
            await adminDeleteUser(userId);
            refreshUsers(); // Refresh list on delete
        } catch (error) {
            alert(error.response?.data?.message || 'Failed to delete user.');
        }
    }
  };
    const handlePageChange = (newPage) => {
      if (newPage > 0 && newPage <= pageData.totalPages) {
          setPage(newPage);
      }
  };

  return (
      <div>
        <h1 className="text-3xl font-bold mb-6 text-gray-800">User Management</h1>

        <div className="flex flex-col md:flex-row justify-between items-center mb-4 gap-4">
          <input
            type="text"
            placeholder="Search by name or email..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full md:w-1/3 px-4 py-2 border rounded-md"
          />
          <button onClick={() => openModal()} className="w-full md:w-auto flex items-center justify-center bg-red-500 text-white px-4 py-2 rounded-md font-semibold hover:bg-red-600 transition">
            <PlusCircle size={20} className="mr-2" />
            Add New User
          </button>
        </div>
        
        {/* User Table (placeholder content) */}
        <div className="bg-white shadow-md rounded-lg overflow-x-auto">
            <table className="w-full">
                {/* ... thead here ... */}
                <tbody>
                  {users.map(user => (
                      <tr key={user.id}>
                        {/* ... td for user data ... */}
                        <td>{user.first_name} {user.last_name}</td>
                        <td>{user.email}</td>
                        <td>{user.role}</td>
                        {/* ... other tds ... */}
                        <td>
                          <button onClick={() => openModal(user)} className="text-blue-500 p-2"><Edit size={16}/></button>
                          <button onClick={() => handleDelete(user.id)} className="text-red-500 p-2"><Trash size={16}/></button>
                        </td>
                      </tr>
                  ))}
                </tbody>
            </table>
        </div>
        {/* ... Pagination would go here ... */}

        {/* --- The Modal for Creating/Editing Users --- */}
        <Modal isOpen={isModalOpen} onClose={closeModal} title={currentUser ? `Edit User: ${currentUser.email}` : 'Create New User'}>
            <form onSubmit={handleSubmit} className="space-y-4">
              
              {formErrors && <p className="text-red-600 bg-red-100 p-3 rounded-md">{formErrors}</p>}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormInput label="First Name" id="first_name" type="text" value={formData.first_name || ''} onChange={handleFormChange} required />
                <FormInput label="Last Name" id="last_name" type="text" value={formData.last_name || ''} onChange={handleFormChange} required />
              </div>
              
              {/* Only show Email and Password fields for NEW users */}
              {!currentUser && (
                <>
                  <FormInput label="Email Address" id="email" type="email" value={formData.email || ''} onChange={handleFormChange} required />
                  <FormInput label="Password" id="password" type="password" value={formData.password || ''} onChange={handleFormChange} required placeholder="Min. 6 characters" />
                </>
              )}

              <FormInput label="Phone Number" id="phone" type="tel" value={formData.phone || ''} onChange={handleFormChange} />

              <div>
                  <label htmlFor="role" className="block text-sm font-medium text-gray-700 mb-1">Role</label>
                   <select
                    id="role"
                    value={formData.role} // Now just use formData.role directly
                    onChange={handleFormChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-red-500 focus:border-red-500"
                  >
                      <option value="customer">Customer</option>
                      <option value="vendor">Vendor</option>
                      <option value="admin">Admin</option>
                  </select>
              </div>

              <div className="flex justify-end space-x-3 pt-4">
                <button type="button" onClick={closeModal} className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md font-semibold hover:bg-gray-300">
                  Cancel
                </button>
                <button type="submit" className="px-4 py-2 bg-red-500 text-white rounded-md font-semibold hover:bg-red-600">
                  {currentUser ? 'Update User' : 'Create User'}
                </button>
              </div>
            </form>
        </Modal>
      </div>
  );
}