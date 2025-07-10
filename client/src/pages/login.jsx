import { Link } from "react-router-dom";

export function Login() {
  return (
    <>
    
    <div className="pt-24 pb-40 min-h-dvh mt-10 bg-white flex flex-col">
      <div className="max-w-5xl mx-auto w-full mt-8">
        <Link to="/" className="text-sm text-black mb-2 inline-block">&lt; Back</Link>
        <h1 className="text-3xl font-bold mb-4">Login</h1>
        <div className="bg-[#fafafa] rounded-md flex flex-col md:flex-row shadow-sm border-l-4 border-red-500">
          {/* Left: Login Form */}
          <div className="flex-1 p-8">
            <h2 className="text-lg font-semibold mb-2">Hello, Registered Customer, Wellcome back!</h2>
            <p className="text-gray-500 mb-6 text-sm">
              If you have a registered account, sign in with your email address or phone number.
            </p>
            <form>
              <div className="mb-4">
                <label className="block text-sm font-medium mb-1" htmlFor="email">
                  Email *
                </label>
                <input
                  id="email"
                  type="text"
                  placeholder="Your Email / Phone Number"
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
          {/* Right: Logo/Brand */}
          <div className="flex-1 flex items-center justify-center p-8">
            <span className="text-4xl md:text-5xl font-bold text-black">
              Kon Khmer <span className="text-red-500 font-semibold">Bookstore</span>
            </span>
          </div>
        </div>
        <div className="mt-8 text-lg font-medium">New Customer? <Link to="/register" className="text-red-500 hover:underline">Register Now</Link></div>
      </div>
    </div>
    </>
  );
}