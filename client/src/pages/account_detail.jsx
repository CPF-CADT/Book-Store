    import { useState, useEffect } from "react";
    import { useAuth } from "../context/AuthContext";
    import { updateUserProfile } from "../services/api";
    import { HomeHeader, Footer } from "../components/HeaderFooter";

    // A small component for individual profile fields to reduce repetition
    function ProfileField({ label, value, isVerified }) {
        let valueClasses = "text-gray-800";
        let displayValue = value;

        if (label === "Email Verified") {
            valueClasses = isVerified
                ? "bg-green-100 text-green-800 text-xs font-medium me-2 px-2.5 py-0.5 rounded-full"
                : "bg-yellow-100 text-yellow-800 text-xs font-medium me-2 px-2.5 py-0.5 rounded-full";
            displayValue = isVerified ? "Verified" : "Not Verified";
        }

        return (
            <div>
                <label className="block text-sm font-medium text-gray-500">{label}</label>
                <p className={`mt-1 text-md ${valueClasses}`}>{displayValue}</p>
            </div>
        );
    }

    // Main Profile Component
    export function Account_detail() {
        const { user, setUser } = useAuth(); // Get user and a function to update the global state
        const [isEditing, setIsEditing] = useState(false);
        const [formData, setFormData] = useState({
            first_name: "",
            last_name: "",
            email: "",
            phone: "",
            password: "",
            confirmPassword: "",
        });
        const [isLoading, setIsLoading] = useState(false);
        const [message, setMessage] = useState({ type: "", text: "" });

        // Pre-fill the form with user data when the component loads or user changes
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

        if (!user) {
            return <div>Loading profile...</div>; // Or redirect to login
        }

        const handleChange = (e) => {
            const { id, value } = e.target;
            setFormData((prev) => ({ ...prev, [id]: value }));
        };

        const handleEditToggle = () => {
            setIsEditing(!isEditing);
            setMessage({ type: "", text: "" }); // Clear messages when toggling
        };

        const handleSubmit = async (e) => {
            e.preventDefault();
            setMessage({ type: "", text: "" });

            if (formData.password && formData.password !== formData.confirmPassword) {
                setMessage({ type: "error", text: "Passwords do not match." });
                return;
            }

            setIsLoading(true);

            // Prepare payload, only include password if it's being changed
            const payload = {
                first_name: formData.first_name,
                last_name: formData.last_name,
                phone: formData.phone,
            };
            if (formData.password) {
                payload.password = formData.password;
            }

            try {
                const response = await updateUserProfile(user.id, user.role, payload);
                // Update the global user state in AuthContext with the new data
                setUser(response.data);
                console.log("✅ Profile update response:", response); 
                setMessage({ type: "success", text: "Profile updated successfully!" });
                setIsEditing(false);
            } catch (err) {
                console.error("❌ Profile update error:", err);
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
                        <div className="bg-white shadow-md rounded-lg p-6 md:p-8">
                            <div className="flex justify-between items-center mb-6">
                                <h1 className="text-2xl md:text-3xl font-bold text-gray-800">
                                    My Account
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
                                    className={`p-4 mb-4 text-sm rounded-lg ${message.type === 'success' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                                        }`}
                                >
                                    {message.text}
                                </div>
                            )}

                            {!isEditing ? (
                                // --- VIEW MODE ---
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <ProfileField label="First Name" value={user.first_name} />
                                    <ProfileField label="Last Name" value={user.last_name} />
                                    <ProfileField label="Email Address" value={user.email} />
                                    <ProfileField label="Phone Number" value={user.phone} />
                                    <ProfileField label="Role" value={user.role.charAt(0).toUpperCase() + user.role.slice(1)} />
                                    <ProfileField label="Email Verified" isVerified={user.email_verified} />
                                </div>
                            ) : (
                                // --- EDIT MODE ---
                                <form onSubmit={handleSubmit}>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        {/* First Name */}
                                        <div>
                                            <label htmlFor="first_name" className="block text-sm font-medium text-gray-700">First Name</label>
                                            <input type="text" id="first_name" value={formData.first_name} onChange={handleChange} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-red-500 focus:border-red-500" />
                                        </div>
                                        {/* Last Name */}
                                        <div>
                                            <label htmlFor="last_name" className="block text-sm font-medium text-gray-700">Last Name</label>
                                            <input type="text" id="last_name" value={formData.last_name} onChange={handleChange} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-red-500 focus:border-red-500" />
                                        </div>
                                        {/* Email (Read Only) */}
                                        <div>
                                            <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email Address</label>
                                            <input type="email" id="email" value={formData.email} readOnly className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 bg-gray-100 cursor-not-allowed" />
                                        </div>
                                        {/* Phone Number */}
                                        <div>
                                            <label htmlFor="phone" className="block text-sm font-medium text-gray-700">Phone Number</label>
                                            <input type="tel" id="phone" value={formData.phone} onChange={handleChange} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-red-500 focus:border-red-500" />
                                        </div>
                                        {/* New Password */}
                                        <div>
                                            <label htmlFor="password" className="block text-sm font-medium text-gray-700">New Password (optional)</label>
                                            <input type="password" id="password" value={formData.password} onChange={handleChange} placeholder="Leave blank to keep current" className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-red-500 focus:border-red-500" />
                                        </div>
                                        {/* Confirm New Password */}
                                        <div>
                                            <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700">Confirm New Password</label>
                                            <input type="password" id="confirmPassword" value={formData.confirmPassword} onChange={handleChange} placeholder="Confirm your new password" className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-red-500 focus:border-red-500" />
                                        </div>
                                    </div>
                                    <div className="mt-8 text-right">
                                        <button
                                            type="submit"
                                            disabled={isLoading}
                                            className="bg-red-500 text-white font-bold py-2 px-6 rounded-lg hover:bg-red-600 transition disabled:bg-gray-400"
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