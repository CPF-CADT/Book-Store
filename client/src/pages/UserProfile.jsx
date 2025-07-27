import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { updateUserProfile } from "../services/api";// Or '../services/api'
import { HomeHeader, Footer } from "../components/HeaderFooter";

// A smaller, reusable component for displaying individual profile fields cleanly.
function ProfileField({ label, value, isVerified = null }) {
  let valueStyles = "text-gray-800";
  let displayValue = value;

  if (label === "Email Verified" && isVerified !== null) {
    valueStyles = isVerified
      ? "bg-green-100 text-green-800 text-xs font-medium px-2.5 py-1 rounded-full"
      : "bg-yellow-100 text-yellow-800 text-xs font-medium px-2.5 py-1 rounded-full";
    displayValue = isVerified ? "Verified" : "Not Verified";
  } else if (label === "Role") {
      displayValue = value.charAt(0).toUpperCase() + value.slice(1);
  }

  return (
    <div>
      <label className="block text-sm font-medium text-gray-500">{label}</label>
      <p className={`mt-1 text-md ${valueStyles}`}>{displayValue}</p>
    </div>
  );
}

// Main User Profile Page Component
export function UserProfile() {
  const { user, setUser } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    first_name: "",
    last_name: "",
    email: "",
    phone: "",
    password: "", // For changing the password
    confirmPassword: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState({ type: "", text: "" });

  // When the component loads or the global `user` object changes,
  // pre-fill the form with the latest data.
  useEffect(() => {
    if (user) {
      setFormData({
        first_name: user.first_name || "",
        last_name: user.last_name || "",
        email: user.email || "",
        phone: user.phone || "",
        password: "",
        confirmPassword: "",
      });
    }
  }, [user]);

  // A guard clause in case the user data is still loading from AuthContext
  if (!user) {
    return <div>Loading profile...</div>;
  }

  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData((prev) => ({ ...prev, [id]: value }));
  };

  const handleEditToggle = () => {
    setIsEditing(!isEditing);
    setMessage({ type: "", text: "" }); // Clear any messages when toggling mode
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage({ type: "", text: "" });

    // Frontend validation
    if (formData.password && formData.password !== formData.confirmPassword) {
      setMessage({ type: "error", text: "Passwords do not match." });
      return;
    }

    setIsLoading(true);

    // Construct the payload to send to the API
    const payload = {
      first_name: formData.first_name,
      last_name: formData.last_name,
      phone: formData.phone,
    };
    // Only include the password if the user typed one
    if (formData.password) {
      // Your backend should expect `password` or `password_hash`
      payload.password = formData.password; 
    }

    try {
      const response = await updateUserProfile(payload);
      // Update the global user state with the fresh data from the server
      setUser(prevUser => ({ ...prevUser, ...response.data })); 
      setMessage({ type: "success", text: "Profile updated successfully!" });
      setIsEditing(false); // Switch back to view mode
    } catch (err) {
      const errorMsg = err.response?.data?.message || "Failed to update profile.";
      setMessage({ type: "error", text: errorMsg });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <HomeHeader />
      <main className="bg-gray-50 py-12 md:py-20 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white shadow-lg rounded-lg p-6 md:p-8">
            <div className="flex justify-between items-center mb-6 border-b pb-4">
              <h1 className="text-2xl md:text-3xl font-bold text-gray-800">
                My Profile
              </h1>
              <button
                onClick={handleEditToggle}
                className="text-sm font-semibold text-red-500 hover:text-red-700 transition"
              >
                {isEditing ? "Cancel" : "Edit Profile"}
              </button>
            </div>

            {message.text && (
              <div
                className={`p-4 mb-4 text-sm rounded-lg ${
                  message.type === 'success' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                }`}
              >
                {message.text}
              </div>
            )}

            {!isEditing ? (
              // --- VIEW MODE ---
              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
                <ProfileField label="First Name" value={user.first_name} />
                <ProfileField label="Last Name" value={user.last_name} />
                <ProfileField label="Email Address" value={user.email} />
                <ProfileField label="Phone Number" value={user.phone} />
                <ProfileField label="Role" value={user.role} />
                <ProfileField label="Email Verified" isVerified={user.email_verified} />
              </div>
            ) : (
              // --- EDIT MODE ---
              <form onSubmit={handleSubmit}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
                  {/* First Name */}
                  <div>
                    <label htmlFor="first_name" className="block text-sm font-medium text-gray-700">First Name</label>
                    <input type="text" id="first_name" value={formData.first_name} onChange={handleChange} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-red-500 focus:border-red-500"/>
                  </div>
                  {/* Last Name */}
                  <div>
                    <label htmlFor="last_name" className="block text-sm font-medium text-gray-700">Last Name</label>
                    <input type="text" id="last_name" value={formData.last_name} onChange={handleChange} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-red-500 focus:border-red-500"/>
                  </div>
                  {/* Email (Read Only) */}
                  <div className="md:col-span-2">
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email Address (Cannot be changed)</label>
                    <input type="email" id="email" value={formData.email} readOnly className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 bg-gray-100 cursor-not-allowed"/>
                  </div>
                  {/* Phone Number */}
                  <div className="md:col-span-2">
                    <label htmlFor="phone" className="block text-sm font-medium text-gray-700">Phone Number</label>
                    <input type="tel" id="phone" value={formData.phone} onChange={handleChange} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-red-500 focus:border-red-500"/>
                  </div>
                  {/* Divider */}
                  <hr className="md:col-span-2 my-2"/>
                  {/* New Password */}
                  <div>
                    <label htmlFor="password" className="block text-sm font-medium text-gray-700">New Password (optional)</label>
                    <input type="password" id="password" value={formData.password} onChange={handleChange} placeholder="Leave blank to keep current" className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-red-500 focus:border-red-500"/>
                  </div>
                  {/* Confirm New Password */}
                  <div>
                    <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700">Confirm New Password</label>
                    <input type="password" id="confirmPassword" value={formData.confirmPassword} onChange={handleChange} placeholder="Confirm your new password" className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-red-500 focus:border-red-500"/>
                  </div>
                </div>
                <div className="mt-8 flex justify-end">
                  <button
                    type="submit"
                    disabled={isLoading}
                    className="bg-red-500 text-white font-bold py-2 px-6 rounded-lg hover:bg-red-600 transition disabled:bg-gray-400 disabled:cursor-not-allowed"
                  >
                    {isLoading ? "Saving..." : "Save Changes"}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}