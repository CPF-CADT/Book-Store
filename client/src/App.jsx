import { BrowserRouter, Routes, Route } from "react-router-dom";
import { MainLayout } from "./layouts/MainLayout";
import { AuthLayout } from "./layouts/AuthLayout";
import { Homepage } from "./components/Homepage";
import { LoginPage } from "./pages/LoginPage";
import { RegisterPage } from "./pages/RegisterPage";
import { AccountDetail } from "./pages/AccountDetail";
import { AboutPage } from "./pages/AboutPage";
import { BookDetailPage } from "./pages/BookDetailPage";
import { NotFoundPage } from "./pages/NotFoundPage";
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
    <BrowserRouter>
      <Routes>
        <Route element={<MainLayout />}>
          <Route path="/" element={<Homepage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/book/:bookId" element={<BookDetailPage />} />
          <Route path="/account-details" element={<AccountDetail />} />
        </Route>
        <Route element={<AuthLayout />}>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
        </Route>
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </BrowserRouter>
  );
}
export default App;