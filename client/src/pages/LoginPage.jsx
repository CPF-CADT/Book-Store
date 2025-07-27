// client/src/pages/login.jsx
import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import { loginUser } from '../services/api';

export function LoginPage() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.email || !formData.password) {
      setError("Please fill in all fields.");
      return;
    }
    setLoading(true);
    setError("");

    const response = await loginUser(formData);

    setLoading(false);
    if (response.success) {
      console.log("Login successful:", response.user);
      navigate("/");
    } else {
      setError(response.message || "Invalid credentials.");
    }
  };

  return (
    <div className="pt-24 pb-20 min-h-dvh bg-white flex flex-col">
      <div className="max-w-5xl mx-auto w-full mt-8 px-4">
        {/* --- THIS IS THE CORRECTED LINE --- */}
        <Link to="/" className="text-sm text-black mb-2 inline-block">
          &lt; Back to Home
        </Link>
        
        <h1 className="text-3xl font-bold mb-4">Login</h1>
        <div className="bg-[#fafafa] rounded-md flex flex-col md:flex-row shadow-sm border-l-4 border-red-500">
          <div className="flex-1 p-8">
            <h2 className="text-lg font-semibold mb-2">Hello, Welcome back!</h2>
            <p className="text-gray-500 mb-6 text-sm">Sign in with your email address.</p>
            {error && <div className="text-red-600 mb-4 text-sm p-2 bg-red-100 rounded">{error}</div>}
            <form onSubmit={handleSubmit}>
              <div className="mb-4">
                  <label htmlFor="email" className="block text-sm font-medium mb-1">Email *</label>
                  <input id="email" type="text" value={formData.email} onChange={handleChange} placeholder="Your Email" className="w-full border border-gray-300 rounded px-3 py-2"/>
              </div>
              <div className="mb-4">
                  <label htmlFor="password" className="block text-sm font-medium mb-1">Password *</label>
                  <input id="password" type="password" value={formData.password} onChange={handleChange} placeholder="Password" className="w-full border border-gray-300 rounded px-3 py-2"/>
              </div>
              <div className="flex items-center justify-between mb-4">
                <button type="submit" disabled={loading} className="bg-red-500 text-white px-6 py-2 rounded-full font-semibold hover:bg-red-600 transition disabled:bg-gray-400">
                  {loading ? "Signing In..." : "Sign In"}
                </button>
                <Link to="/forgot-password" className="text-red-400 text-sm hover:underline">
                  Forgot Your Password?
                </Link>
              </div>
            </form>
          </div>
          <div className="flex-1 flex items-center justify-center p-8 bg-gray-50 rounded-r-md">
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