import { useState } from "react";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import axios from "axios"; 

export function Register() {
    // State to hold form data
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        confirmPassword: '',
        phone: ''
    });

    // State to hold validation errors
    const [errors, setErrors] = useState({});

    // Handle input changes and update state
    const handleChange = (e) => {
        const { id, value } = e.target;
        setFormData(prevState => ({
            ...prevState,
            [id]: value
        }));
    };

    // Validate the form before submission
    const validateForm = () => {
        const newErrors = {};

        // Name validation
        if (!formData.name.trim()) newErrors.name = "Name is required.";
        
        // Email validation
        if (!formData.email.trim()) {
            newErrors.email = "Email is required.";
        } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
            newErrors.email = "Email address is invalid.";
        }

        // Password validation
        if (!formData.password) newErrors.password = "Password is required.";
        
        // Confirm Password validation
        if (!formData.confirmPassword) {
            newErrors.confirmPassword = "Please confirm your password.";
        } else if (formData.password !== formData.confirmPassword) {
            newErrors.confirmPassword = "Passwords do not match.";
        }

        // Phone number validation
        if (!formData.phone.trim()) newErrors.phone = "Phone number is required.";

        return newErrors;
    };

    const navigate = useNavigate();
    // Handle the form submission
    const handleSubmit = async (e) => {
        e.preventDefault();

        const validateErrors = validateForm();
        setErrors(validateErrors);

        if (Object.keys(validateErrors).length === 0) {
            try {
                const res = await axios.post("http://localhost:3000/api/register", {
                    name: formData.name,
                    email: formData.email,
                    password: formData.password,
                    phone: formData.phone
                });

                if (res.data.success) {
                    alert("Registration successful!");
                    navigate("/login");
                } else {
                    alert(res.data.message || "Registration failed.");
                }
            } catch (error) {
                console.error("Registration error:");
                // alert("Something went wrong.");
            }
        }
    };
    return (
        <>
            <div className="pt-24 pb-40 min-h-dvh bg-white flex flex-col">
                <div className="max-w-5xl mx-auto w-full mt-8 px-4">
                    <Link to="/" className="text-sm text-black mb-2 inline-block">&lt; Back to Home</Link>
                    <h1 className="text-3xl font-bold mb-4">Register</h1>
                    <div className="bg-[#fafafa] rounded-md flex flex-col md:flex-row shadow-sm border-l-4 border-red-500">
                        {/* Left: Register Form */}
                        <div className="flex-1 p-8">
                            <h2 className="text-lg font-semibold mb-2">Create Your Account</h2>
                            <p className="text-gray-500 mb-6 text-sm">
                                Please fill in the information below to create your account.
                            </p>
                            <form onSubmit={handleSubmit} noValidate>
                                <div className="mb-4">
                                    <label className="block text-sm font-medium mb-1" htmlFor="name">
                                        Name *
                                    </label>
                                    <input
                                        id="name"
                                        type="text"
                                        placeholder="Your Name"
                                        className={`w-full border ${errors.name ? 'border-red-500' : 'border-gray-300'} rounded px-3 py-2 focus:outline-none focus:border-red-400`}
                                        value={formData.name}
                                        onChange={handleChange}
                                    />
                                    {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
                                </div>
                                <div className="mb-4">
                                    <label className="block text-sm font-medium mb-1" htmlFor="email">
                                        Email *
                                    </label>
                                    <input
                                        id="email"
                                        type="email"
                                        placeholder="Your Email"
                                        className={`w-full border ${errors.email ? 'border-red-500' : 'border-gray-300'} rounded px-3 py-2 focus:outline-none focus:border-red-400`}
                                        value={formData.email}
                                        onChange={handleChange}
                                    />
                                    {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
                                </div>
                                <div className="mb-4">
                                    <label className="block text-sm font-medium mb-1" htmlFor="password">
                                        Password *
                                    </label>
                                    <input
                                        id="password"
                                        type="password"
                                        placeholder="Password"
                                        className={`w-full border ${errors.password ? 'border-red-500' : 'border-gray-300'} rounded px-3 py-2 focus:outline-none focus:border-red-400`}
                                        value={formData.password}
                                        onChange={handleChange}
                                    />
                                    {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password}</p>}
                                </div>
                                <div className="mb-4">
                                    <label className="block text-sm font-medium mb-1" htmlFor="confirmPassword">
                                        Confirm Password *
                                    </label>
                                    <input
                                        id="confirmPassword"
                                        type="password"
                                        placeholder="Confirm Password"
                                        className={`w-full border ${errors.confirmPassword ? 'border-red-500' : 'border-gray-300'} rounded px-3 py-2 focus:outline-none focus:border-red-400`}
                                        value={formData.confirmPassword}
                                        onChange={handleChange}
                                    />
                                    {errors.confirmPassword && <p className="text-red-500 text-xs mt-1">{errors.confirmPassword}</p>}
                                </div>
                                <div className="mb-4">
                                    <label className="block text-sm font-medium mb-1" htmlFor="phone">
                                        Phone Number *
                                    </label>
                                    <input
                                        id="phone"
                                        type="tel"
                                        placeholder="Phone Number"
                                        className={`w-full border ${errors.phone ? 'border-red-500' : 'border-gray-300'} rounded px-3 py-2 focus:outline-none focus:border-red-400`}
                                        onInput={e => e.target.value = e.target.value.replace(/[^0-9]/g, '')}
                                        value={formData.phone}
                                        onChange={handleChange}
                                    />
                                    {errors.phone && <p className="text-red-500 text-xs mt-1">{errors.phone}</p>}
                                </div>
                                <div className="flex items-center justify-between mb-4">
                                    <button
                                        type="submit"
                                        className="bg-red-500 text-white px-6 py-2 rounded-full font-semibold hover:bg-red-600 transition"
                                    >
                                        Register
                                    </button>
                                    <Link to="/login" className="text-red-400 text-sm hover:underline">
                                        Already have an account?
                                    </Link>
                                </div>
                            </form>
                        </div>
                        {/* Right: Logo/Brand */}
                        <div className="flex-1 flex items-center justify-center p-8 bg-gray-50 rounded-r-md">
                            <span className="text-4xl md:text-5xl font-bold text-black text-center">
                                Kon Khmer <span className="text-red-500 font-semibold">Bookstore</span>
                            </span>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}