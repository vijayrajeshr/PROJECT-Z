import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const AdminLogin = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [currentPage, setCurrentPage] = useState("login");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("user");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const roles = [
    { value: "user", label: "User", icon: "👤" },
    { value: "admin", label: "Administrator", icon: "👨‍💼" },
    { value: "moderator", label: "Moderator", icon: "🛡️" },
    { value: "kitchenOwner", label: "Kitchen Owner", icon: "👨‍🍳" },
    { value: "restaurantOwner", label: "Restaurant Owner", icon: "🏪" },
    { value: "eventCreator", label: "Event Creator", icon: "🎪" },
    { value: "marketingPerson", label: "Marketing", icon: "📊" },
  ];

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      try {
        setIsLoggedIn(true);
      } catch (error) {
        console.error("Invalid token:", error);
        localStorage.removeItem("token");
        setIsLoggedIn(false);
      }
    }
  }, []);

  const handleSignup = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    try {
      const url = `${import.meta.env.VITE_SERVER_URL}/api/dashboard/sign`;
      const response = await axios.post(
        url,
        { name, email, password, role },
        { withCredentials: true }
      );
      const data = response.data;

      if (response.status === 200 || response.status === 201) {
        setMessage(data.message);
        setName("");
        setEmail("");
        setPassword("");
        setRole("user");
        setCurrentPage("login");
      } else {
        setMessage(data.message || "Signup failed");
      }
    } catch (error) {
      console.error("Error during signup:", error);
      setMessage(
        error.response?.data?.message ||
        "An error occurred during signup. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    try {
      const url = `${import.meta.env.VITE_SERVER_URL}/api/dashboard/login`;
      const response = await axios.post(
        url,
        { email, password, role },
        { withCredentials: true }
      );
      const data = response.data;

      if (response.status === 200) {
        localStorage.setItem("token", data.token);
        setIsLoggedIn(true);
        setMessage("Login successful!");

        if (role === "marketingPerson") {
          navigate("/dashboard/marketing/home");
        } else if (data.url) {
          navigate(data.url); // Soft navigate (No page reload)
        } else {
          setCurrentPage("dashboard");
        }
      } else {
        setMessage(data.message || "Login failed");
      }
    } catch (error) {
      console.error("Error during login:", error);
      setMessage(
        error.response?.data?.message ||
        "An error occurred during login. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    setIsLoggedIn(false);
    setCurrentPage("login");
    setName("");
    setEmail("");
    setPassword("");
    setRole("user");
    setMessage("You have been logged out.");
    navigate("/"); // Redirect to home on logout
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      {/* Simple Login Card */}
      {currentPage === "login" && (
        <div className="bg-white bg-opacity-90 rounded-xl shadow-lg p-8 w-full max-w-md">
          {/* Logo */}
          <div className="text-center mb-8">
            <div className="w-12 h-12 bg-[#02757A] rounded-lg flex items-center justify-center mx-auto mb-4">
              <span className="text-white font-bold text-xl">Z</span>
            </div>
            <h2 className="text-2xl font-bold text-gray-900">Admin Login</h2>
            <p className="text-gray-600 mt-2">Sign in to your dashboard</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            {message && (
              <div className={`p-3 rounded-lg text-sm ${message.includes("success")
                ? "bg-green-50 text-green-700 border border-green-200"
                : "bg-red-50 text-red-700 border border-red-200"
                }`}>
                {message}
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Email
              </label>
              <input
                type="email"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#02757A] focus:border-transparent"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Password
              </label>
              <input
                type="password"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#02757A] focus:border-transparent"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Role
              </label>
              <select
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#02757A] focus:border-transparent"
                value={role}
                onChange={(e) => setRole(e.target.value)}
                required
              >
                {roles.map((r) => (
                  <option key={r.value} value={r.value}>
                    {r.label}
                  </option>
                ))}
              </select>
            </div>

            <button
              type="submit"
              disabled={loading || !email || !password || !role}
              className="w-full bg-[#02757A] text-white py-2 px-4 rounded-md hover:bg-[#02676c] focus:outline-none focus:ring-2 focus:ring-[#02757A] focus:ring-offset-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? "Signing In..." : "Sign In"}
            </button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-gray-600 text-sm">
              Don't have an account?{" "}
              <button
                onClick={() => {
                  setCurrentPage("signup");
                  setMessage("");
                  setEmail("");
                  setPassword("");
                }}
                className="text-[#02757A] hover:underline font-medium"
              >
                Sign up
              </button>
            </p>
          </div>
        </div>
      )}

      {/* Simple Signup Card */}
      {currentPage === "signup" && (
        <div className="bg-white bg-opacity-90 rounded-xl shadow-lg p-8 w-full max-w-md">
          <div className="text-center mb-8">
            <div className="w-12 h-12 bg-[#02757A] rounded-lg flex items-center justify-center mx-auto mb-4">
              <span className="text-white font-bold text-xl">Z</span>
            </div>
            <h2 className="text-2xl font-bold text-gray-900">Create Account</h2>
            <p className="text-gray-600 mt-2">Join as admin user</p>
          </div>

          <form onSubmit={handleSignup} className="space-y-4">
            {message && (
              <div className={`p-3 rounded-lg text-sm ${message.includes("success")
                ? "bg-green-50 text-green-700 border border-green-200"
                : "bg-red-50 text-red-700 border border-red-200"
                }`}>
                {message}
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Full Name
              </label>
              <input
                type="text"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#02757A] focus:border-transparent"
                placeholder="Enter your full name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Email
              </label>
              <input
                type="email"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#02757A] focus:border-transparent"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Password
              </label>
              <input
                type="password"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#02757A] focus:border-transparent"
                placeholder="Create a password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Role
              </label>
              <select
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#02757A] focus:border-transparent"
                value={role}
                onChange={(e) => setRole(e.target.value)}
                required
              >
                {roles.map((r) => (
                  <option key={r.value} value={r.value}>
                    {r.label}
                  </option>
                ))}
              </select>
            </div>

            <button
              type="submit"
              disabled={loading || !name || !email || !password || !role}
              className="w-full bg-[#02757A] text-white py-2 px-4 rounded-md hover:bg-[#02676c] focus:outline-none focus:ring-2 focus:ring-[#02757A] focus:ring-offset-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? "Creating Account..." : "Create Account"}
            </button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-gray-600 text-sm">
              Already have an account?{" "}
              <button
                onClick={() => {
                  setCurrentPage("login");
                  setMessage("");
                  setEmail("");
                  setPassword("");
                }}
                className="text-[#02757A] hover:underline font-medium"
              >
                Sign in
              </button>
            </p>
          </div>
        </div>
      )}

      {/* Simple Dashboard */}
      {currentPage === "dashboard" && isLoggedIn && (
        <div className="bg-white rounded-lg shadow-md p-8 w-full max-w-2xl">
          <div className="text-center">
            <div className="w-16 h-16 bg-[#02757A] rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>

            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Welcome to Dashboard!
            </h1>

            <p className="text-gray-600 mb-8">
              You're signed in as <span className="font-semibold text-[#02757A]">{role}</span>
            </p>

            <div className="grid grid-cols-2 gap-4 mb-8">
              <div className="bg-[#E6F1F2] p-4 rounded-lg text-center">
                <div className="text-lg font-semibold text-[#02757A]">Orders</div>
                <div className="text-2xl font-bold text-gray-900">24</div>
              </div>
              <div className="bg-[#E6F1F2] p-4 rounded-lg text-center">
                <div className="text-lg font-semibold text-[#02757A]">Revenue</div>
                <div className="text-2xl font-bold text-gray-900">₹12.4K</div>
              </div>
            </div>

            <div className="space-y-3 mb-8">
              <button className="w-full bg-[#02757A] text-white py-2 px-4 rounded-md hover:bg-[#02676c] transition-colors">
                Go to Main Dashboard
              </button>
              <button className="w-full border border-[#02757A] text-[#02757A] py-2 px-4 rounded-md hover:bg-[#E6F1F2] transition-colors">
                Manage Settings
              </button>
            </div>

            <button
              onClick={handleLogout}
              className="text-gray-600 hover:text-gray-800 text-sm font-medium"
            >
              Sign Out
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminLogin;