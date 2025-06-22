import { Link } from "react-router-dom";
import { FaUser, FaShoppingBag, FaHeart } from "react-icons/fa";
export function LoginHeader() {
  return (
    <header className="fixed top-0 left-0 w-full z-50 bg-gradient-to-r from-pink-200 to-white text-gray-800 p-4">
      <div className="container mx-auto flex flex-col md:flex-row items-center justify-between">
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
        {/* Navigation */}
        <nav className="mt-2 md:mt-0 flex space-x-4">
          <a href="/" className="text-gray-600 hover:text-red-500 uppercase">Home</a>
          <a href="/about" className="text-gray-600 hover:text-red-500 uppercase">About Us</a>
          <a href="/books" className="text-gray-600 hover:text-red-500 uppercase">Book</a>
          <a href="/new-release" className="text-gray-600 hover:text-red-500 uppercase">New Release</a>
          <a href="/contact" className="text-gray-600 hover:text-red-500 uppercase">Contact Us</a>
          <a href="/blog" className="text-gray-600 hover:text-red-500 uppercase">Blog</a>
        </nav>
        {/* Icons (Cart and Login) */}
        <div className="flex space-x-3">
          <a href="store" className="text-gray-600 hover:text-red-500">
            🛒 store
          </a>
          <a href="/login" className="text-gray-600 hover:text-red-500">
            👤 Login
          </a>
        </div>
      </div>
    </header>
  );
}


export function HomeHeader() {
  return (
    <header className="w-full bg-white shadow-sm">
      <div className="max-w-7xl mx-auto flex items-center justify-between py-4 px-6">
        {/* Avatar */}
        <div className="flex items-center">
          <img
            src="/avatar.png"
            alt="avatar"
            className="w-16 h-16 rounded-full border object-cover"
          />
        </div>
        {/* Navigation */}
        <nav className="flex-1 flex items-center justify-center space-x-6">
          <Link
            to="/"
            className="text-red-500 font-bold tracking-widest border-r border-gray-200 pr-6"
          >
            HOME
          </Link>
          <Link
            to="/about"
            className="text-black font-semibold tracking-widest hover:text-red-500 border-r border-gray-200 px-6"
          >
            ABOUT US
          </Link>
          <Link
            to="/books"
            className="text-black font-semibold tracking-widest hover:text-red-500 border-r border-gray-200 px-6"
          >
            BOOKS
          </Link>
          <Link
            to="/new-release"
            className="text-black font-semibold tracking-widest hover:text-red-500 border-r border-gray-200 px-6"
          >
            NEW RELEASE
          </Link>
          <Link
            to="/contact"
            className="text-black font-semibold tracking-widest hover:text-red-500 border-r border-gray-200 px-6"
          >
            CONTACT US
          </Link>
          <Link
            to="/blog"
            className="text-black font-semibold tracking-widest hover:text-red-500 px-6"
          >
            BLOG
          </Link>
        </nav>
        {/* Icons */}
        <div className="flex items-center space-x-6">
          <Link to="/profile" className="text-red-500 text-xl hover:text-red-200">
            <FaUser />
          </Link>
          <span className="border-r border-gray-200 h-6"></span>
          <Link to="/cart" className="text-red-500 text-xl hover:text-red-200">
            <FaShoppingBag />
          </Link>
          <span className="border-r border-gray-200 h-6"></span>
          <Link to="/wishlist" className="text-red-500 text-xl hover:text-red-200">
            <FaHeart />
          </Link>
        </div>
      </div>
    </header>
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
            <li><a href="/" className="hover:underline">Home</a></li>
            <li><a href="/about" className="hover:underline">About Us</a></li>
            <li><a href="/books" className="hover:underline">Books</a></li>
            <li><a href="/new-release" className="hover:underline">New Release</a></li>
            <li><a href="/contact" className="hover:underline">Contact Us</a></li>
            <li><a href="/blog" className="hover:underline">Blog</a></li>
          </ul>
        </div>
        {/* Important Links */}
        <div>
          <h3 className="text-lg font-semibold mb-3">Important Links</h3>
          <ul className="space-y-2">
            <li><a href="/privacy" className="hover:underline">Privacy Policy</a></li>
            <li><a href="/faq" className="hover:underline">FAQs</a></li>
            <li><a href="/terms" className="hover:underline">Terms of Service</a></li>
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