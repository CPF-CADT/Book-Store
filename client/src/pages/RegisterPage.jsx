// client/src/pages/register.jsx
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { registerUser } from '../services/api';

export function RegisterPage() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    email: '',
    password: '',
    phone: ''
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrors({});
    
    const response = await registerUser(formData);
    
    setLoading(false);
    if (response.success) {
        alert("Registration successful! Please log in.");
        navigate("/login");
    } else {
        setErrors({ form: response.message || "An unknown error occurred." });
    }
  };

  return (
    <div className="pt-24 pb-20 bg-white">
      <div className="max-w-5xl mx-auto w-full mt-8 px-4">
        {/* --- THIS IS THE CORRECTED LINE --- */}
        <Link to="/" className="text-sm text-black mb-2 inline-block">
          &lt; Back to Home
        </Link>
        
        <h1 className="text-3xl font-bold mb-4">Create an Account</h1>
        <div className="bg-[#fafafa] rounded-md flex flex-col md:flex-row shadow-sm border-l-4 border-red-500">
          <div className="flex-1 p-8">
            {errors.form && <p className="text-red-600 text-sm mb-4 bg-red-100 p-3 rounded">{errors.form}</p>}
            <form onSubmit={handleSubmit} noValidate>
              <div className="flex flex-col md:flex-row gap-4 mb-4">
                <div className="flex-1">
                  <label className="block text-sm font-medium mb-1" htmlFor="first_name">First Name *</label>
                  <input id="first_name" type="text" value={formData.first_name} onChange={handleChange} className="w-full border rounded px-3 py-2" required />
                </div>
                <div className="flex-1">
                  <label className="block text-sm font-medium mb-1" htmlFor="last_name">Last Name *</label>
                  <input id="last_name" type="text" value={formData.last_name} onChange={handleChange} className="w-full border rounded px-3 py-2" required />
                </div>
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium mb-1" htmlFor="email">Email *</label>
                <input id="email" type="email" value={formData.email} onChange={handleChange} className="w-full border rounded px-3 py-2" required />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium mb-1" htmlFor="password">Password *</label>
                <input id="password" type="password" value={formData.password} onChange={handleChange} className="w-full border rounded px-3 py-2" required />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium mb-1" htmlFor="phone">Phone Number *</label>
                <input id="phone" type="tel" value={formData.phone} onChange={handleChange} className="w-full border rounded px-3 py-2" required />
              </div>
              <button type="submit" disabled={loading} className="bg-red-500 text-white px-6 py-2 rounded-full font-semibold hover:bg-red-600 transition disabled:bg-gray-400">
                {loading ? 'Creating Account...' : 'Create Account'}
              </button>
            </form>
          </div>
          <div className="flex-1 flex items-center justify-center p-8 bg-gray-50 rounded-r-md">
            <span className="text-4xl md:text-5xl font-bold text-black text-center">Kon Khmer <span className="text-red-500 font-semibold">Bookstore</span></span>
          </div>
        </div>
      </div>
    </div>
  );
}