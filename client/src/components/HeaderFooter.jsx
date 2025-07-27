// client/src/components/HeaderFooter.jsx
import React, { useState } from 'react';
import { Link, NavLink } from 'react-router-dom';
import { Menu, X, User, ShoppingBag, Heart } from "lucide-react";

// --- Header for Login/Register pages ---
export function LoginHeader() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);
  const closeMenu = () => setIsMenuOpen(false);

  return (
    <header className="fixed top-0 left-0 w-full z-50 bg-gradient-to-r from-pink-200 to-white text-gray-800 p-4 shadow-sm">
      <div className="container mx-auto">
        <div className="flex items-center justify-between">
          <Link to="/" className="flex items-center" onClick={closeMenu}>
            <div className="w-10 h-10 bg-red-500 grid grid-cols-2 gap-1 p-1 rounded">
              <div className="bg-white"></div><div className="bg-white"></div><div className="bg-white"></div><div className="bg-white"></div>
            </div>
            <h1 className="ml-3 text-xl font-bold text-red-500">Kon Khmer Bookstore</h1>
          </Link>

          <nav className="hidden md:flex space-x-10">
            <NavLink to="/about" className={({isActive}) => `text-gray-600 hover:text-red-500 uppercase transition-colors ${isActive ? 'text-red-500' : ''}`}>About</NavLink>
            <NavLink to="/" className={({isActive}) => `text-gray-600 hover:text-red-500 uppercase transition-colors ${isActive ? 'text-red-500' : ''}`}>Books</NavLink>
          </nav>

          <button className="md:hidden text-gray-600 hover:text-red-500" onClick={toggleMenu} aria-label="Toggle menu">
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {isMenuOpen && (
          <div className="md:hidden mt-4 pb-4 border-t border-gray-300">
            <nav className="flex flex-col space-y-3 mt-4">
              <Link to="/about" className="text-gray-600 hover:text-red-500 uppercase py-2 px-2 hover:bg-white/50 rounded" onClick={closeMenu}>About</Link>
              <Link to="/" className="text-gray-600 hover:text-red-500 uppercase py-2 px-2 hover:bg-white/50 rounded" onClick={closeMenu}>Books</Link>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
}

// --- Main Header for the rest of the site ---
// export function HomeHeader() {
//   const [isMenuOpen, setIsMenuOpen] = useState(false);
//   const toggleMenu = () => setIsMenuOpen(!isMenuOpen);
//   const closeMenu = () => setIsMenuOpen(false);

//   return (
//     <header className="w-full bg-white shadow-sm sticky top-0 z-50">
//       <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
//         <div className="flex items-center justify-between">
//           <Link to="/" className="flex items-center" onClick={closeMenu}>
//             <div className="w-8 h-8 md:w-10 md:h-10 bg-red-500 grid grid-cols-2 gap-1 p-1 rounded">
//               <div className="bg-white"></div><div className="bg-white"></div><div className="bg-white"></div><div className="bg-white"></div>
//             </div>
//             <h1 className="ml-2 md:ml-3 text-lg md:text-xl font-bold text-red-500">Kon Khmer</h1>
//           </Link>

//           <nav className="hidden md:flex flex-1 items-center justify-center space-x-6">
//             <NavLink to="/" className={({isActive}) => `font-semibold tracking-widest px-6 transition-colors ${isActive ? 'text-red-500' : 'text-black hover:text-red-500'}`}>HOME</NavLink>
//             <NavLink to="/about" className={({isActive}) => `font-semibold tracking-widest px-6 transition-colors ${isActive ? 'text-red-500' : 'text-black hover:text-red-500'}`}>ABOUT US</NavLink>
//           </nav>

//           <div className="flex items-center gap-4">
//             <div className="hidden md:flex items-center space-x-6">
//               <Link to="/login" className="text-red-500 hover:text-red-600 transition-colors"><User /></Link>
//               <Link to="/cart" className="text-red-500 hover:text-red-600 transition-colors"><ShoppingBag /></Link>
//               <Link to="/wishlist" className="text-red-500 hover:text-red-600 transition-colors"><Heart /></Link>
//             </div>
//             <button className="md:hidden text-gray-600 hover:text-red-500" onClick={toggleMenu} aria-label="Toggle menu">
//               {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
//             </button>
//           </div>
//         </div>

//         {isMenuOpen && (
//           <div className="md:hidden mt-4 pb-4 border-t border-gray-200">
//             <nav className="flex flex-col space-y-3 mt-4">
//               <NavLink to="/" className="font-bold tracking-widest py-2 px-2 hover:bg-gray-50 rounded" onClick={closeMenu}>HOME</NavLink>
//               <NavLink to="/about" className="font-semibold tracking-widest py-2 px-2 hover:bg-gray-50 rounded" onClick={closeMenu}>ABOUT US</NavLink>
//               <div className="pt-3 mt-3 border-t border-gray-200 flex flex-col space-y-3">
//                 <Link to="/login" className="flex items-center space-x-2 py-2 px-2 hover:bg-gray-50 rounded" onClick={closeMenu}><User /><span>Login / Account</span></Link>
//                 <Link to="/cart" className="flex items-center space-x-2 py-2 px-2 hover:bg-gray-50 rounded" onClick={closeMenu}><ShoppingBag /><span>Cart</span></Link>
//                 <Link to="/wishlist" className="flex items-center space-x-2 py-2 px-2 hover:bg-gray-50 rounded" onClick={closeMenu}><Heart /><span>Wishlist</span></Link>
//               </div>
//             </nav>
//           </div>
//         )}
//       </div>
//     </header>
//   );
// }
// --- Paste this into client/src/components/HeaderFooter.jsx ---

// This is the corrected HomeHeader with all the navigation links restored.
export function HomeHeader() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);
  const closeMenu = () => setIsMenuOpen(false);

  return (
    <header className="w-full bg-white shadow-sm sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center flex-shrink-0" onClick={closeMenu}>
            <div className="w-8 h-8 md:w-10 md:h-10 bg-red-500 grid grid-cols-2 gap-1 p-1 rounded">
              <div className="bg-white"></div><div className="bg-white"></div><div className="bg-white"></div><div className="bg-white"></div>
            </div>
            <h1 className="ml-2 md:ml-3 text-lg md:text-xl font-bold text-red-500">Kon Khmer</h1>
          </Link>

          {/* Desktop Navigation - ALL LINKS RESTORED */}
          <nav className="hidden md:flex flex-1 items-center justify-center space-x-2 lg:space-x-6">
            <NavLink to="/" className={({isActive}) => `font-semibold tracking-widest px-3 lg:px-6 transition-colors ${isActive ? 'text-red-500' : 'text-black hover:text-red-500'}`}>HOME</NavLink>
            <NavLink to="/about" className={({isActive}) => `font-semibold tracking-widest px-3 lg:px-6 transition-colors ${isActive ? 'text-red-500' : 'text-black hover:text-red-500'}`}>ABOUT US</NavLink>
            {/* Added a link to the main page for books */}
            <NavLink to="/" className={({isActive}) => `font-semibold tracking-widest px-3 lg:px-6 transition-colors ${isActive ? 'text-red-500' : 'text-black hover:text-red-500'}`}>BOOKS</NavLink>
            <NavLink to="/contact" className={({isActive}) => `font-semibold tracking-widest px-3 lg:px-6 transition-colors ${isActive ? 'text-red-500' : 'text-black hover:text-red-500'}`}>CONTACT US</NavLink>
            <NavLink to="/blog" className={({isActive}) => `font-semibold tracking-widest px-3 lg:px-6 transition-colors ${isActive ? 'text-red-500' : 'text-black hover:text-red-500'}`}>BLOG</NavLink>
          </nav>

          {/* Icons and Mobile Menu Button */}
          <div className="flex items-center gap-4">
            <div className="hidden md:flex items-center space-x-4 lg:space-x-6">
              <Link to="/login" className="text-red-500 hover:text-red-600 transition-colors"><User /></Link>
              <Link to="/cart" className="text-red-500 hover:text-red-600 transition-colors"><ShoppingBag /></Link>
              <Link to="/wishlist" className="text-red-500 hover:text-red-600 transition-colors"><Heart /></Link>
            </div>
            <button className="md:hidden text-gray-600 hover:text-red-500" onClick={toggleMenu} aria-label="Toggle menu">
              {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation Menu - ALL LINKS RESTORED */}
        {isMenuOpen && (
          <div className="md:hidden mt-4 pb-4 border-t border-gray-200">
            <nav className="flex flex-col space-y-2 mt-4">
              <NavLink to="/" className="font-bold tracking-widest py-2 px-2 hover:bg-gray-50 rounded" onClick={closeMenu}>HOME</NavLink>
              <NavLink to="/about" className="font-semibold tracking-widest py-2 px-2 hover:bg-gray-50 rounded" onClick={closeMenu}>ABOUT US</NavLink>
              <NavLink to="/" className="font-semibold tracking-widest py-2 px-2 hover:bg-gray-50 rounded" onClick={closeMenu}>BOOKS</NavLink>
              <NavLink to="/contact" className="font-semibold tracking-widest py-2 px-2 hover:bg-gray-50 rounded" onClick={closeMenu}>CONTACT US</NavLink>
              <NavLink to="/blog" className="font-semibold tracking-widest py-2 px-2 hover:bg-gray-50 rounded" onClick={closeMenu}>BLOG</NavLink>
              
              <div className="pt-3 mt-3 border-t border-gray-200 flex flex-col space-y-3">
                <Link to="/login" className="flex items-center space-x-2 py-2 px-2 hover:bg-gray-50 rounded" onClick={closeMenu}><User /><span>Login / Account</span></Link>
                <Link to="/cart" className="flex items-center space-x-2 py-2 px-2 hover:bg-gray-50 rounded" onClick={closeMenu}><ShoppingBag /><span>Cart</span></Link>
                <Link to="/wishlist" className="flex items-center space-x-2 py-2 px-2 hover:bg-gray-50 rounded" onClick={closeMenu}><Heart /><span>Wishlist</span></Link>
              </div>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
}

// --- Footer for all pages ---
export function Footer() {
  return (
    <footer className="bg-red-500 text-white p-6 md:p-8">
      <div className="container mx-auto grid grid-cols-1 md:grid-cols-3 gap-8 text-center md:text-left">
        <div className="flex flex-col items-center md:items-start">
          <div className="flex items-center mb-3">
            <div className="w-10 h-10 bg-white grid grid-cols-2 gap-1 p-1 rounded">
              <div className="bg-red-500"></div><div className="bg-red-500"></div><div className="bg-red-500"></div><div className="bg-red-500"></div>
            </div>
            <h1 className="ml-3 text-xl font-bold">Kon Khmer Bookstore</h1>
          </div>
          <p className="text-sm">Nostrum exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.</p>
        </div>
        <div>
          <h3 className="text-lg font-semibold mb-3">Company</h3>
          <ul className="space-y-2 text-sm">
            <li><Link to="/" className="hover:underline">Home</Link></li>
            <li><Link to="/about" className="hover:underline">About Us</Link></li>
          </ul>
        </div>
        <div>
          <h3 className="text-lg font-semibold mb-3">Important Links</h3>
          <ul className="space-y-2 text-sm">
            <li><Link to="/privacy" className="hover:underline">Privacy Policy</Link></li>
            <li><Link to="/faq" className="hover:underline">FAQs</Link></li>
          </ul>
        </div>
      </div>
      <div className="mt-8 text-center text-sm border-t border-white/20 pt-4">
        <p>© {new Date().getFullYear()} Kon Khmer Bookstore. All rights reserved.</p>
      </div>
    </footer>
  );
}