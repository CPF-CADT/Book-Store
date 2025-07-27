import React from 'react'; // Needed for class components
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { UserProfile } from './pages/UserProfile';
import { Login } from "./pages/login";
import { Register } from "./pages/register";
import { Account_detail } from "./pages/account_detail";
import { HomePageLayout } from "./HomePageLayout.jsx";
import { useAuth } from "./context/AuthContext";
import { Homepage } from './components/Homepage';
import { AdminDashboard } from './pages/admindashborad';
import { NotFound } from './pages/NotFound'; 
import { BookDetailPage } from './pages/BookDetailPage';
import { AboutUsPage } from './pages/AboutUsPage.jsx';
import { ContactPage } from './pages/ContactPage.jsx';
import { BlogDetailPage } from './pages/BlogDetailPage.jsx';
import { BlogListPage } from './pages/BlogListPage.jsx';
import { AdminLayout } from './components/admin/AdminLayout.jsx';
import { AdminUsersPage } from './pages/AdminUsersPage.jsx';
import { AdminBooksPage } from './pages/AdminBooksPage.jsx';
import { AdminCategoriesPage } from './pages/AdminCategoriesPage.jsx';
import { AdminAuthorsPage } from './pages/AdminAuthorsPage.jsx';
import { AdminTagsPage } from './pages/AdminTagsPage.jsx';
import { AdminBlogPage } from './pages/AdminBlogPage.jsx';
// import { Homepage } from './components/Homepage';
// import FilterSideBar from "./components/FilterSideBar";
class ErrorBoundary extends React.Component {
  // ... (your existing ErrorBoundary code is fine) ...
  constructor(props) { super(props); this.state = { hasError: false, error: null }; }
  static getDerivedStateFromError(error) { return { hasError: true, error }; }
  render() {
    if (this.state.hasError) {
      return <div><h2>Something went wrong.</h2><pre>{this.state.error?.stack}</pre></div>;
    }
    return this.props.children;
  }
}

// --- The ProtectedRoute, now with the Navigate import ---
function ProtectedRoute({ allowedRoles, children }) {
    const { user, loading } = useAuth();

    // While the context is validating the token, don't render anything
    if (loading) {
      return <div>Loading...</div>;
    }

    if (!user) {
        // Redirect to login if not authenticated
        return <Navigate to="/login" replace />;
    }

    if (allowedRoles && !allowedRoles.includes(user.role)) {
        // Redirect to home if the user's role is not allowed
        return <Navigate to="/" replace />;
    }

    return children;
}

// --- Main App Component with Improved Routing ---
function App() {
  return (
       <ErrorBoundary>
        <Routes>

          {/* ===== 1. PUBLIC ROUTES (with Header/Footer) ===== */}
          <Route path="/" element={<HomePageLayout />}>
            <Route index element={<Homepage />} />
            <Route path="about" element={<AboutUsPage />} />
            <Route path="contact" element={<ContactPage />} />
            <Route path="blog" element={<BlogListPage />} />
            <Route path="blog/:slug" element={<BlogDetailPage />} />
            <Route path="book/:id" element={<BookDetailPage />} /> 
          </Route>

          {/* ===== 2. AUTH ROUTES (standalone) ===== */}
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          
          {/* ===== 3. PROTECTED USER ROUTES ===== */}
          <Route
            path="/profile"
            element={
              <ProtectedRoute>
                {/* UserProfile uses the public layout for consistency */}
                <HomePageLayout>
                  <UserProfile />
                </HomePageLayout>
              </ProtectedRoute>
            }
          />
          
          {/* ===== 4. PROTECTED ADMIN & VENDOR ROUTES ===== */}
          {/* All routes for admins/vendors will now have the AdminHeader/Sidebar */}
          <Route
            path="/"
            element={
              <ProtectedRoute allowedRoles={['admin', 'vendor']}>
                <AdminLayout />
              </ProtectedRoute>
            }
          >
            {/* These routes are now relative to the parent "/" path */}
            <Route path="dashboard" element={<AdminDashboard />} />
            <Route path="admin/users" element={<AdminUsersPage />} />
            {/* Example: Your future book management page */}
            <Route path="/admin/books" element={<AdminBooksPage />}/> 
            <Route path="admin/categories" element={<AdminCategoriesPage />} />
             <Route path="admin/authors" element={<AdminAuthorsPage />} />
             <Route path="admin/tags" element={<AdminTagsPage />} />
             <Route path="admin/blog" element={<AdminBlogPage />} />
            {/* Add all your other admin-specific pages here */}
            {/* <Route path="admin/users" element={<AdminUsersPage />} /> */}
          </Route>


          {/* ===== 5. CATCH-ALL 404 ROUTE ===== */}
          {/* This should be the very last route */}
          <Route path="*" element={<NotFound />} />

        </Routes>
      </ErrorBoundary>
  );
}

export default App;