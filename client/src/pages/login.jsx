import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import { useAuth } from "../context/AuthContext"; 

export function Login() {
  const navigate = useNavigate();
   const { login } = useAuth(); 
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
    setError(""); // Clear error on change
    
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    // Simple frontend validation
    if (!formData.email || !formData.password) {
      setError("Please fill in all fields.");
      return;
    }

    try {
      // The login function from the context now handles EVERYTHING:
      // - Calling the API
      // - Storing the token
      // - Setting the user state
      // - Navigating on success
      console.log('Sumit',formData);
      await login(formData);
        
      
      // Navigation is now handled inside the context, but you can keep it here too.

    } catch (err) {
      // The context re-throws the error so we can catch it here
      // and display the specific message from the server.
      const errorMessage = err.response?.data?.message || "Login failed. Please check your credentials.";
      setError(errorMessage);
      console.error("Login component error:", err);
    }
  };

  return (
    <div className="pt-24 pb-40 min-h-dvh mt-10 bg-white flex flex-col">
      <div className="max-w-5xl mx-auto w-full mt-8">
        <Link to="/" className="text-sm text-black mb-2 inline-block">&lt; Back</Link>
        <h1 className="text-3xl font-bold mb-4">Login</h1>
        <div className="bg-[#fafafa] rounded-md flex flex-col md:flex-row shadow-sm border-l-4 border-red-500">
          <div className="flex-1 p-8">
            <h2 className="text-lg font-semibold mb-2">Hello, Registered Customer, Welcome back!</h2>
            <p className="text-gray-500 mb-6 text-sm">
              If you have a registered account, sign in with your email address or phone number.
            </p>

            {/* Error message */}
            {error && (
               <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4" role="alert">
                  {error}
              </div>
            )}

            <form onSubmit={handleSubmit}  noValidate>
              <div className="mb-4">
                <label htmlFor="email" className="block text-sm font-medium mb-1">Email *</label>
                <input
                type="email"
                  id="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="Your Email "
                  className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:border-red-400"
                />
              </div>
              <div className="mb-4">
                <label htmlFor="password" className="block text-sm font-medium mb-1">Password *</label>
                <input
                  id="password"
                  type="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="Password"
                  className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:border-red-400"
                />
              </div>
              <div className="flex items-center justify-between mb-4">
                <button
                  type="submit"
                  className="bg-red-500 text-white px-6 py-2 rounded-full font-semibold hover:bg-red-600 transition"
                >
                  Sign In
                </button>
                <Link to="/forgot-password" className="text-red-400 text-sm hover:underline">
                  Forgot Your Password?
                </Link>
              </div>
            </form>
          </div>

          <div className="flex-1 flex items-center justify-center p-8">
            <span className="text-4xl md:text-5xl font-bold text-black">
              Kon Khmer <span className="text-red-500 font-semibold">Bookstore</span>
            </span>
          </div>
        </div>
        <div className="mt-8 text-lg font-medium">
          New Customer? <Link to="/register" className="text-red-500 hover:underline">Register Now</Link>
        </div>
      </div>
    </div>
  );
}
