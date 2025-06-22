import { LoginHeader, Footer } from "../components/HeaderFooter";
// import React from "react";
import { Link } from "react-router-dom";

export function Register() {
    return (
        <>
            <LoginHeader />

            <div className=" pt-24 pb-40 min-h-dvh mt-10 bg-white flex flex-col">
                <div className="max-w-5xl mx-auto w-full mt-8">
                    <Link to="/" className="text-sm text-black mb-2 inline-block">&lt; Back</Link>
                    <h1 className="text-3xl font-bold mb-4">Register</h1>
                    <div className="bg-[#fafafa] rounded-md flex flex-col md:flex-row shadow-sm border-l-4 border-red-500">
                        {/* Left: Register Form */}
                        <div className="flex-1 p-8">
                            <h2 className="text-lg font-semibold mb-2">Create Your Account</h2>
                            <p className="text-gray-500 mb-6 text-sm">
                                Please fill in the information below to create your account.
                            </p>
                            <form>
                                <div className="mb-4">
                                    <label className="block text-sm font-medium mb-1" htmlFor="name">
                                        Name *
                                    </label>
                                    <input
                                        id="name"
                                        type="text"
                                        placeholder="Your Name"
                                        className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:border-red-400"
                                    />
                                </div>
                                <div className="mb-4">
                                    <label className="block text-sm font-medium mb-1" htmlFor="email">
                                        Email *
                                    </label>
                                    <input
                                        id="email"
                                        type="email"
                                        placeholder="Your Email"
                                        className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:border-red-400"
                                    />
                                </div>
                                <div className="mb-4">
                                    <label className="block text-sm font-medium mb-1" htmlFor="password">
                                        Password *
                                    </label>
                                    <input
                                        id="password"
                                        type="password"
                                        placeholder="Password"
                                        className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:border-red-400"
                                    />
                                </div>
                                <div className="mb-4">
                                    <label className="block text-sm font-medium mb-1" htmlFor="confirmPassword">
                                        Confirm Password *
                                    </label>
                                    <input
                                        id="confirmPassword"
                                        type="password"
                                        placeholder="Confirm Password"
                                        className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:border-red-400"
                                    />
                                </div>
                                <div className="mb-4">
                                    <label className="block text-sm font-medium mb-1" htmlFor="phoneNumber">
                                        Phone Number *
                                    </label>
                                    <input
                                        id="phone"
                                        type="tel"
                                        pattern="[0-9]*"
                                        inputMode="numeric"
                                        placeholder="phoneNumber"
                                        className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:border-red-400"
                                        onInput={e => e.target.value = e.target.value.replace(/[^0-9]/g, '')}
                                    />
                                </div>
                                <div className="flex items-center justify-between mb-4">
                                    <button
                                        type="submit"
                                        className="bg-red-500 text-white px-6 py-2 rounded-full font-semibold hover:bg-red-600 transition"
                                    >
                                        Register
                                    </button>
                                    {/* <Link to="/login" className="text-red-400 text-sm hover:underline">
                                        Already have an account?
                                    </Link> */}
                                </div>
                            </form>
                        </div>
                        {/* Right: Logo/Brand */}
                        <div className="flex-1 flex items-center justify-center p-8">
                            <span className="text-4xl md:text-5xl font-bold text-black">
                                Kon Khmer <span className="text-red-500 font-semibold">Bookstore</span>
                            </span>
                        </div>
                    </div>
                    <div className="mt-8 text-lg font-medium">Already a customer? <Link to="/login" className="text-red-500 hover:underline">Sign In</Link></div>
                </div>
            </div>
            <Footer />
        </>
    );
}