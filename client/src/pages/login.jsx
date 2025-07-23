import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import axios from "axios"; // Make sure axios is installed

export function Login() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Simple frontend validation
    if (!formData.email || !formData.password) {
      setError("Please fill in all fields.");
      return;
    }

    try {
      // Replace this URL with your actual login API
      const response = await axios.post("http://localhost:3001/api/login", formData);

      if (response.data.success) {
        // Redirect to homepage after successful login
        navigate("/");
      } else {
        setError(response.data.message || "Invalid credentials.");
      }
    } catch (err) {
      setError("Login failed. Please try again.", err.message);
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
            {error && <div className="text-red-600 mb-4 text-sm">{error}</div>}

            <form onSubmit={handleSubmit}>
              <div className="mb-4">
                <label htmlFor="email" className="block text-sm font-medium mb-1">Email *</label>
                <input
                  id="email"
                  type="text"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="Your Email / Phone Number"
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
