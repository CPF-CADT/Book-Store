import React from 'react'; // Needed for class components
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { UserProfile } from './pages/UserProfile';
import { Login } from "./pages/login";
import { Register } from "./pages/register";
import { Account_detail } from "./pages/account_detail";
import { HomePageLayout } from "./HomePageLayout";
import { useAuth } from "./context/AuthContext";
import { Homepage } from './components/Homepage';
import { AdminDashboard } from './pages/admindashborad';
import { NotFound } from './pages/NotFound'; 
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
          {/* Public routes that use the main layout */}
          <Route element={<HomePageLayout />}>
            <Route path="/" element={<Homepage />} />
          </Route>
          
          {/* Auth routes without the main layout */}
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          
          {/* Protected Routes */}
          <Route
            path="/profile"
            element={
              <ProtectedRoute>
                {/* For consistency, protected pages can also use a layout */}
                <HomePageLayout>
                  <UserProfile />
                </HomePageLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute allowedRoles={['admin', 'vendor']}>
                <AdminDashboard />
              </ProtectedRoute>
            }
          />

          {/* Catch-all 404 Route */}
          <Route path="*" element={<AdminDashboard />} />
        </Routes>
      </ErrorBoundary>
  );
}

export default App;