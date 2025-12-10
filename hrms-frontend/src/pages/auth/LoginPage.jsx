// src/pages/auth/LoginPage.jsx
import { useState } from "react";
import { FaUser, FaLock } from "react-icons/fa";
import api from "../../api/axios"; // <- axios instance (baseURL: http://localhost:4000/api)

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("employee"); // "admin" | "employee"
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const isAdmin = role === "admin";

  const handleSubmit = async (e) => {
    e.preventDefault(); // 🛑 page refresh නවත්තන line එක
    setError("");

    try {
      setLoading(true);

      // backend: POST /api/auth/login
      const res = await api.post("/auth/login", {
        email,
        password,
        role, // "admin" or "employee"
      });

      const { token, user } = res.data || {};

      if (!token || !user) {
        setError("Invalid response from server");
        return;
      }

      // Common token (ඕනනම් admin axios calls use කරන්න)
      localStorage.setItem("token", token);
      localStorage.setItem("role", role);

      if (role === "admin") {
        // admin specific
        localStorage.setItem("adminToken", token);
        localStorage.setItem("adminUser", JSON.stringify(user));
        window.location.href = "/admin/dashboard";
      } else {
        // employee specific
        localStorage.setItem("employeeToken", token);
        localStorage.setItem("employeeUser", JSON.stringify(user));
        window.location.href = "/employee/dashboard";
      }
    } catch (err) {
      console.error("Login error:", err.response?.data || err);
      setError(err.response?.data?.msg || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white flex flex-col items-center justify-start pt-10 px-6">
      {/* TITLE */}
      <div className="text-center mt-20">
        <p className="text-xs tracking-widest text-gray-500">
          {isAdmin ? "ADMIN PORTAL" : "EMPLOYEE PORTAL"}
        </p>

        <h1 className="text-4xl font-bold mb-1">
          <span className="bg-gradient-to-r from-blue-600 to-pink-500 bg-clip-text text-transparent">
            Employee
          </span>{" "}
          <span className="text-gray-800">Management System</span>
        </h1>

        <p className="text-gray-500 text-sm">
          Access your attendance, leave and salary details.
        </p>
      </div>

      {/* LOGIN CARD */}
      <div className="w-full max-w-md mt-12 bg-white/30 backdrop-blur-xl shadow-xl rounded-2xl border border-white/50 p-8">
        {/* ROLE TABS */}
        <div className="flex mb-5 text-sm bg-slate-100 rounded-lg p-1">
          <button
            type="button"
            onClick={() => {
              setRole("admin");
              setEmail("");
              setPassword("");
              setError("");
            }}
            className={
              "flex-1 py-2 rounded-md transition " +
              (isAdmin
                ? "bg-white shadow font-semibold text-gray-900"
                : "text-gray-500 hover:text-gray-800")
            }
          >
            Admin Login
          </button>
          <button
            type="button"
            onClick={() => {
              setRole("employee");
              setEmail("");
              setPassword("");
              setError("");
            }}
            className={
              "flex-1 py-2 rounded-md transition " +
              (!isAdmin
                ? "bg-white shadow font-semibold text-gray-900"
                : "text-gray-500 hover:text-gray-800")
            }
          >
            Employee Login
          </button>
        </div>

        <h2 className="text-xl font-semibold text-gray-800 mb-4">
          {isAdmin ? "Admin Login" : "Employee Login"}
        </h2>

        {/* ERROR */}
        {error && (
          <p className="text-red-600 bg-red-100 px-3 py-2 rounded text-sm mb-4">
            {error}
          </p>
        )}

        {/* FORM */}
        <form onSubmit={handleSubmit} className="space-y-5">
          {/* EMAIL */}
          <div>
            <label className="block text-sm font-semibold mb-1 text-gray-700">
              Email
            </label>
            <div className="flex items-center border p-3 rounded-lg bg-white/60">
              <FaUser className="text-gray-500 mr-2" />
              <input
                type="email"
                className="w-full bg-transparent outline-none"
                placeholder={
                  isAdmin ? "admin@example.com" : "employee@example.com"
                }
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
          </div>

          {/* PASSWORD */}
          <div>
            <label className="block text-sm font-semibold mb-1 text-gray-700">
              Password
            </label>
            <div className="flex items-center border p-3 rounded-lg bg-white/60">
              <FaLock className="text-gray-500 mr-2" />
              <input
                type="password"
                className="w-full bg-transparent outline-none"
                placeholder={
                  isAdmin ? "Enter admin password" : "Enter your password"
                }
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
          </div>

          {/* REMEMBER + FORGOT */}
          <div className="flex justify-between text-sm">
            <label className="flex items-center gap-2 text-gray-600">
              <input type="checkbox" /> Remember me
            </label>
            <button type="button" className="text-blue-600 hover:underline">
              Forgot password?
            </button>
          </div>

          {/* LOGIN BUTTON */}
          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 rounded-lg bg-gradient-to-r from-blue-600 to-green-500 text-white font-semibold shadow-md hover:opacity-90 transition disabled:opacity-60"
          >
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>
      </div>
    </div>
  );
}
