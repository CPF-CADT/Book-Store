import React from 'react';
import { Outlet } from 'react-router-dom';
import { NavLink } from 'react-router-dom';
import { AdminHeader } from '../admin/AdminHeader';

// Icons for the desktop sidebar
import {
  LayoutDashboard,
  Book,
  Users,
  Tag,
  PenSquare,
  MessageSquare,
  Library,
} from 'lucide-react';

// --- Reusable NavLink Component for Desktop Sidebar ---
const AdminNavLink = ({ to, icon, children }) => (
  <NavLink
    to={to}
    className={({ isActive }) =>
      `flex items-center p-3 rounded-lg text-gray-300 hover:bg-gray-700 hover:text-white transition-colors text-sm font-medium ${
        isActive ? 'bg-red-800 text-white' : ''
      }`
    }
  >
    {icon}
    <span className="ml-3">{children}</span>
  </NavLink>
);


export function AdminLayout() {
  const navItems = [
    { to: '/dashboard', icon: <LayoutDashboard size={18} />, label: 'Dashboard' },
    { to: '/admin/books', icon: <Book size={18} />, label: 'Books' },
    { to: '/admin/categories', icon: <Library size={18} />, label: 'Categories' },
    { to: '/admin/authors', icon: <PenSquare size={18} />, label: 'Authors' },
    { to: '/admin/tags', icon: <Tag size={18} />, label: 'Tags' },
    { to: '/admin/users', icon: <Users size={18} />, label: 'Users' },
    { to: '/admin/blog', icon: <MessageSquare size={18} />, label: 'Blog Posts' },
  ];

  return (
    <div className="flex min-h-screen bg-gray-100">
      
      {/* --- Desktop Sidebar --- */}
      <aside className="hidden md:flex flex-col w-64 bg-gray-800 text-white shadow-xl">
          <div className="flex items-center justify-center h-16 border-b border-gray-700">
            <span className="text-2xl font-bold text-white">Dashboard</span>
          </div>
          <nav className="flex-grow p-4 space-y-2">
            {navItems.map(item => (
                <AdminNavLink key={item.to} to={item.to} icon={item.icon}>
                    {item.label}
                </AdminNavLink>
            ))}
          </nav>
      </aside>

      {/* --- Main Content Area --- */}
      <div className="flex flex-col flex-1">
        <AdminHeader />
        <main className="flex-1 p-4 md:p-6 lg:p-8">
          {/* The content of your admin pages will be rendered here */}
          <Outlet />
        </main>
      </div>
    </div>
  );
}