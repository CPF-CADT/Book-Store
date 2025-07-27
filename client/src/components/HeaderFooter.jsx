import React, { useState } from 'react';
// import { Menu, X, User, ShoppingBag, Heart } from 'lucide-react';
import { Menu, X, User, ShoppingBag, Heart } from "lucide-react";
import { Link } from "react-router-dom";
import { useAuth } from '../context/AuthContext'; 
import { FaUser, FaShoppingBag, FaHeart, FaSignInAlt, FaSignOutAlt } from 'react-icons/fa';
import { useNavigate } from "react-router-dom";
import { NavLink } from 'react-router-dom';
// import HeaderFooter from './components/HeaderFooter';



// Mock FontAwesome icons - replace with your actual imports


export function LoginHeader() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const handleLinkClick = () => {
    setIsMenuOpen(false);
  };

  return (
    <header className="fixed top-0 left-0 w-full z-50 bg-gradient-to-r from-pink-200 to-white text-gray-800 p-4 shadow-sm">
      <div className="container mx-auto">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center">
            <div className="w-10 h-10 bg-red-500 grid grid-cols-2 gap-1 p-1 rounded">
              <div className="bg-white"></div>
              <div className="bg-white"></div>
              <div className="bg-white"></div>
              <div className="bg-white"></div>
            </div>
            <h1 className="ml-3 text-xl font-bold text-red-500">Kon Khmer Bookstore</h1>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <Link to="/books" className="text-gray-600 hover:text-red-500 uppercase transition-colors">
              Book
            </Link>
            <Link to="/new-release" className="text-gray-600 hover:text-red-500 uppercase transition-colors">
              New Release
            </Link>
            <Link to="/" className="text-gray-600 hover:text-red-500 uppercase transition-colors">
              Home
            </Link>
            <Link to="/blog" className="text-gray-600 hover:text-red-500 uppercase transition-colors">
              Blog
            </Link>
            <Link to="/contact" className="text-gray-600 hover:text-red-500 uppercase transition-colors">
              Contact Us
            </Link>
            <Link to="/about" className="text-gray-600 hover:text-red-500 uppercase transition-colors">
              About Us
            </Link>
          </nav>

          {/* FIX: Login/Register Buttons for Desktop */}
          <div className="hidden md:flex items-center space-x-4">
            <Link 
              to="/login" 
              className="text-gray-600 hover:text-red-500 font-semibold uppercase transition-colors"
            >
              Login
            </Link>
            <Link 
              to="/register" 
              className="bg-red-500 text-white px-4 py-2 rounded-full font-semibold uppercase hover:bg-red-600 transition-colors"
            >
              Register
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden text-gray-600 hover:text-red-500 transition-colors"
            onClick={toggleMenu}
            aria-label="Toggle menu"
          >
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile Navigation Menu */}
        {isMenuOpen && (
          <div className="md:hidden mt-4 pb-4 border-t border-gray-300">
            <nav className="flex flex-col space-y-3 mt-4">
              <Link 
                to="/books" 
                className="text-gray-600 hover:text-red-500 uppercase transition-colors py-2 px-2 hover:bg-white hover:bg-opacity-50 rounded"
                onClick={handleLinkClick}
              >
                Book
              </Link>
              {/* ... other mobile links ... */}
              <Link 
                to="/new-release" 
                className="text-gray-600 hover:text-red-500 uppercase transition-colors py-2 px-2 hover:bg-white hover:bg-opacity-50 rounded"
                onClick={handleLinkClick}
              >
                New Release
              </Link>
              <Link 
                to="/" 
                className="text-gray-600 hover:text-red-500 uppercase transition-colors py-2 px-2 hover:bg-white hover:bg-opacity-50 rounded"
                onClick={handleLinkClick}
              >
                Home
              </Link>
              <Link 
                to="/blog" 
                className="text-gray-600 hover:text-red-500 uppercase transition-colors py-2 px-2 hover:bg-white hover:bg-opacity-50 rounded"
                onClick={handleLinkClick}
              >
                Blog
              </Link>
              <Link 
                to="/contact" 
                className="text-gray-600 hover:text-red-500 uppercase transition-colors py-2 px-2 hover:bg-white hover:bg-opacity-50 rounded"
                onClick={handleLinkClick}
              >
                Contact Us
              </Link>
              <Link 
                to="/about" 
                className="text-gray-600 hover:text-red-500 uppercase transition-colors py-2 px-2 hover:bg-white hover:bg-opacity-50 rounded"
                onClick={handleLinkClick}
              >
                About Us
              </Link>
              
              {/* FIX: Login/Register Buttons for Mobile */}
              <div className="pt-4 mt-4 border-t border-gray-300 flex flex-col space-y-3">
                <Link
                  to="/login"
                  onClick={handleLinkClick}
                  className="w-full text-center bg-gray-200 text-gray-800 px-4 py-2 rounded-full font-semibold uppercase hover:bg-gray-300 transition-colors"
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  onClick={handleLinkClick}
                  className="w-full text-center bg-red-500 text-white px-4 py-2 rounded-full font-semibold uppercase hover:bg-red-600 transition-colors"
                >
                  Register
                </Link>
              </div>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
}

export function HomeHeader() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { user, logout } = useAuth();

  const handleLinkClick = () => {
    setIsMenuOpen(false);
  };

  const handleLogout = () => {
    handleLinkClick(); // Close mobile menu if open
    logout();
  };

  // Consistent link styling
  const linkStyles = "text-gray-600 font-semibold tracking-wide hover:text-red-500 transition-colors";
  const activeLinkStyles = "text-red-500";
  const mobileLinkStyles = "block py-3 px-4 text-lg font-semibold rounded-md hover:bg-gray-100 transition-colors text-gray-700";

  return (
    <header className="w-full bg-white shadow-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="relative flex items-center justify-between h-20">

          {/* --- MOBILE: Menu Button (Far Left) --- */}
          <div className="absolute inset-y-0 left-0 flex items-center md:hidden">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-600 hover:text-red-500"
              aria-label="Toggle menu"
            >
              {isMenuOpen ? <X size={28} /> : <Menu size={28} />}
            </button>
          </div>

          {/* --- Center Section: Logo (Mobile) and Full Nav (Desktop) --- */}
          <div className="flex-1 flex items-center justify-center md:items-stretch md:justify-start">
            
            {/* Logo */}
            <Link to="/" className="flex-shrink-0 flex items-center">
              <img
                src="https://images.unsplash.com/photo-1532012197267-da84d127e765?q=80&w=1887&auto=format&fit=crop"
                alt="Kon Khmer Bookstore Logo"
                className="w-12 h-12 rounded-full border-2 border-red-500 object-cover"
              />
              <span className="ml-3 hidden sm:block text-2xl font-bold text-gray-800">
                Kon <span className="text-red-500">Khmer</span>
              </span>
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex ml-10 items-center space-x-8">
              <NavLink to="/" className={({ isActive }) => `${linkStyles} ${isActive ? activeLinkStyles : ''}`} end>Home</NavLink>
              {/* Added a placeholder /books route */}
              <NavLink to="/books" className={({ isActive }) => `${linkStyles} ${isActive ? activeLinkStyles : ''}`}>Books</NavLink>
              <NavLink to="/about" className={({ isActive }) => `${linkStyles} ${isActive ? activeLinkStyles : ''}`}>About</NavLink>
              <NavLink to="/blog" className={({ isActive }) => `${linkStyles} ${isActive ? activeLinkStyles : ''}`}>Blog</NavLink>
              <NavLink to="/contact" className={({ isActive }) => `${linkStyles} ${isActive ? activeLinkStyles : ''}`}>Contact</NavLink>
            </nav>
          </div>

          {/* --- Right Side: Icons & Auth (Desktop) --- */}
          <div className="hidden md:flex items-center space-x-5">
            <Link to="/cart" aria-label="Cart" className="text-gray-500 hover:text-red-500 transition-colors"><FaShoppingBag size={22} /></Link>
            <Link to="/wishlist" aria-label="Wishlist" className="text-gray-500 hover:text-red-500 transition-colors"><FaHeart size={22} /></Link>

            {user ? (
              // If logged in on desktop
              <>
                <Link to="/profile" aria-label="My Profile" className="text-gray-500 hover:text-red-500 transition-colors"><FaUser size={22} /></Link>
                <button onClick={logout} title="Logout" aria-label="Logout" className="text-gray-500 hover:text-red-500 transition-colors">
                  <FaSignOutAlt size={22} />
                </button>
              </>
            ) : (
              // If guest on desktop
              <Link to="/login" className="flex items-center bg-red-500 text-white px-4 py-2 rounded-md font-semibold text-sm hover:bg-red-600 transition">
                <FaSignInAlt className="mr-2" /> Login
              </Link>
            )}
          </div>

        </div>
      </div>

      {/* --- Mobile Navigation Menu (Slide-in Panel) --- */}
      {isMenuOpen && (
        <div className="md:hidden">
          <nav className="px-2 pt-2 pb-3 space-y-1">
            <Link to="/" className={mobileLinkStyles} onClick={handleLinkClick}>Home</Link>
            <Link to="/books" className={mobileLinkStyles} onClick={handleLinkClick}>Books</Link>
            <Link to="/about" className={mobileLinkStyles} onClick={handleLinkClick}>About</Link>
            <Link to="/blog" className={mobileLinkStyles} onClick={handleLinkClick}>Blog</Link>
            <Link to="/contact" className={mobileLinkStyles} onClick={handleLinkClick}>Contact</Link>
            
            <hr className="my-4" />
            
            {user ? (
                // If logged in on mobile
                <>
                  <Link to="/profile" className={`${mobileLinkStyles} flex items-center`} onClick={handleLinkClick}><FaUser className="mr-3" /> My Profile</Link>
                  <Link to="/cart" className={`${mobileLinkStyles} flex items-center`} onClick={handleLinkClick}><FaShoppingBag className="mr-3" /> My Cart</Link>
                  <Link to="/wishlist" className={`${mobileLinkStyles} flex items-center`} onClick={handleLinkClick}><FaHeart className="mr-3" /> My Wishlist</Link>
                  <button onClick={handleLogout} className={`${mobileLinkStyles} text-red-500 flex items-center w-full`}><FaSignOutAlt className="mr-3" /> Logout</button>
                </>
            ) : (
                // If guest on mobile
                 <Link to="/login" className={`${mobileLinkStyles} text-red-500 flex items-center`} onClick={handleLinkClick}><FaSignInAlt className="mr-3" /> Login / Register</Link>
            )}
          </nav>
        </div>
      )}
    </header>
  );
}

// Demo component to show both headers
export default function HeaderDemo() {
  const [currentHeader, setCurrentHeader] = useState('login');

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header Switcher */}
      <div className="fixed top-0 right-4 z-50 mt-2">
        <div className="bg-white rounded-lg shadow-lg p-2 flex space-x-2">
          <button
            onClick={() => setCurrentHeader('login')}
            className={`px-3 py-1 rounded text-sm font-medium transition-colors ${
              currentHeader === 'login' 
                ? 'bg-red-500 text-white' 
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            Login Header
          </button>
          <button
            onClick={() => setCurrentHeader('home')}
            className={`px-3 py-1 rounded text-sm font-medium transition-colors ${
              currentHeader === 'home' 
                ? 'bg-red-500 text-white' 
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            Home Header
          </button>
        </div>
      </div>

      {/* Display current header */}
      {currentHeader === 'login' ? <LoginHeader /> : <HomeHeader />}
      
      {/* Demo Content */}
      <div className={`${currentHeader === 'login' ? 'pt-24' : 'pt-20'} px-4`}>
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold text-gray-800 mb-6">
            {currentHeader === 'login' ? 'Login Header Demo' : 'Home Header Demo'}
          </h2>
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h3 className="text-xl font-semibold mb-4">Mobile Features:</h3>
            <ul className="space-y-2 text-gray-700">
              <li>• Hamburger menu appears on mobile devices</li>
              <li>• Menu automatically closes when a link is clicked</li>
              <li>• All navigation links route to their respective pages</li>
              <li>• Smooth transitions and hover effects</li>
              <li>• Touch-friendly interface with proper spacing</li>
              <li>• Responsive design that works on all screen sizes</li>
            </ul>
            <div className="mt-4 p-4 bg-blue-50 rounded-lg">
              <p className="text-sm text-blue-800">
                <strong>Note:</strong> In this demo, clicking links will log the navigation to console. 
                In your actual app, replace the mock Link component with your React Router Link component.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export function Footer() {
  return (
    <footer className=" bottom-0 left-0 w-full z-50 bg-red-500 text-white p-6">
      <div className="container mx-auto grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Company Info */}
        <div>
          <div className="flex items-center mb-3">
            <div className="w-10 h-10 bg-white grid grid-cols-2 gap-1 p-1 rounded">
              <div className="bg-red-500"></div>
              <div className="bg-red-500"></div>
              <div className="bg-red-500"></div>
              <div className="bg-red-500"></div>
            </div>
            <h1 className="ml-3 text-xl font-bold">Kon Khmer Bookstore</h1>
          </div>
          <p className="text-sm">
            Nostrum exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
          </p>
          {/* Social Icons */}
          <div className="flex space-x-3 mt-3">
          
          </div>
        </div>
        {/* Company Links */}
        <div>
          <h3 className="text-lg font-semibold mb-3">Company</h3>
          <ul className="space-y-2">
            <li><Link to="/" className="hover:underline">Home</Link></li>
            <li><Link to="/about" className="hover:underline">About Us</Link></li>
            <li><Link to="/books" className="hover:underline">Books</Link></li>
            <li><Link to="/new-release" className="hover:underline">New Release</Link></li>
            <li><Link to="/contact" className="hover:underline">Contact Us</Link></li>
            <li><Link to="/blog" className="hover:underline">Blog</Link></li>
          </ul>
        </div>
        {/* Important Links */}
        <div>
          <h3 className="text-lg font-semibold mb-3">Important Links</h3>
          <ul className="space-y-2">
            <li><Link to="/privacy" className="hover:underline">Privacy Policy</Link></li>
            <li><Link to="/faq" className="hover:underline">FAQs</Link></li>
            <li><Link to="/terms" className="hover:underline">Terms of Service</Link></li>
          </ul>
        </div>
      </div>
      {/* Copyright */}
      <div className="mt-6 text-center text-sm border-t border-white/20 pt-3">
        <p>© {new Date().getFullYear()} Kon Khmer Bookstore. All rights reserved.</p>
      </div>
    </footer>
  );
}