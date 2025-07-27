import React, { useState, Fragment } from 'react';
import { NavLink, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

// Import Icons
import {
  LayoutDashboard,
  Book,
  Users,
  Tag,
  PenSquare,
  MessageSquare,
  Library,
  ChevronDown,
  LogOut,
  X,
  Menu,
} from 'lucide-react';
import { FaUserCircle } from 'react-icons/fa'; // For a user icon fallback

// --- Reusable NavLink Component to reduce repetition ---
const AdminNavLink = ({ to, icon, children, onClick }) => (
  <NavLink
    to={to}
    onClick={onClick}
    className={({ isActive }) =>
      `flex items-center p-2 rounded-lg text-gray-300 hover:bg-red-800 hover:text-white transition-colors ${
        isActive ? 'bg-red-900 text-white' : ''
      }`
    }
  >
    {icon}
    <span className="ml-3">{children}</span>
  </NavLink>
);

export function AdminHeader() {
  const { user, logout } = useAuth();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);

  // Define navigation items in an array for easy mapping
  const navItems = [
    { to: '/dashboard', icon: <LayoutDashboard size={20} />, label: 'Dashboard' },
    { to: '/admin/books', icon: <Book size={20} />, label: 'Books' },
    { to: '/admin/categories', icon: <Library size={20} />, label: 'Categories' },
    { to: '/admin/authors', icon: <PenSquare size={20} />, label: 'Authors' },
    { to: '/admin/tags', icon: <Tag size={20} />, label: 'Tags' },
    { to: '/admin/users', icon: <Users size={20} />, label: 'Users' },
    { to: '/admin/blog', icon: <MessageSquare size={20} />, label: 'Blog Posts' },
    // Add other links like '/admin/contacts' as needed
  ];

  return (
    <>
      {/* --- Main Header Bar --- */}
      <header className="sticky top-0 z-40 bg-gray-900 text-white shadow-lg">
        <div className="flex items-center justify-between h-16 px-4 md:px-6">
          
          {/* Left Side: Logo & Mobile Menu Toggle */}
          <div className="flex items-center">
            <button
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              className="md:hidden mr-4 p-2 rounded-md hover:bg-gray-700"
              aria-label="Open sidebar"
            >
              <Menu size={24} />
            </button>
            <Link to="/dashboard" className="text-xl font-bold text-red-500">
              Kon Khmer Admin
            </Link>
          </div>
          
          {/* Right Side: User Dropdown */}
          <div className="relative">
            <button
              onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
              className="flex items-center space-x-2 p-2 rounded-lg hover:bg-gray-700"
            >
              <FaUserCircle size={24} className="text-gray-400" />
              <span className="hidden sm:inline font-medium">{user?.first_name || 'Admin'}</span>
              <ChevronDown size={16} className={`transition-transform ${isUserMenuOpen ? 'rotate-180' : ''}`} />
            </button>
            
            {/* User Dropdown Menu */}
            {isUserMenuOpen && (
              <div className="absolute right-0 mt-2 w-48 bg-white text-black rounded-md shadow-lg py-1">
                <Link to="/profile" className="block px-4 py-2 text-sm hover:bg-gray-100">My Profile</Link>
                <button
                  onClick={logout}
                  className="w-full text-left flex items-center px-4 py-2 text-sm text-red-600 hover:bg-red-50"
                >
                  <LogOut size={16} className="mr-2" />
                  Logout
                </button>
              </div>
            )}
          </div>
        </div>
      </header>
      
      {/* --- Sidebar Navigation for Mobile (Drawer) --- */}
      <div
        className={`fixed inset-0 z-50 transition-opacity duration-300 md:hidden ${
          isSidebarOpen ? 'bg-black bg-opacity-50' : 'bg-opacity-0 pointer-events-none'
        }`}
        onClick={() => setIsSidebarOpen(false)}
      >
        <nav
          className={`absolute inset-y-0 left-0 w-64 bg-gray-900 text-white p-4 transform transition-transform duration-300 ${
            isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
          }`}
          onClick={(e) => e.stopPropagation()} // Prevent closing when clicking inside the nav
        >
          <div className="flex justify-between items-center mb-6">
              <span className="text-xl font-bold text-red-500">Menu</span>
              <button onClick={() => setIsSidebarOpen(false)}><X/></button>
          </div>
          <div className="space-y-2">
            {navItems.map(item => (
                <AdminNavLink key={item.to} to={item.to} icon={item.icon} onClick={() => setIsSidebarOpen(false)}>
                    {item.label}
                </AdminNavLink>
            ))}
          </div>
        </nav>
      </div>
    </>
  );
}