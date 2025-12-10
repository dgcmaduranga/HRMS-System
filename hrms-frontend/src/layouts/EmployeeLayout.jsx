// src/layouts/EmployeeLayout.jsx
import { NavLink, useNavigate } from "react-router-dom";
import { useMemo, useState } from "react";
import { RxDashboard } from "react-icons/rx";
import {
  FaUser,
  FaCalendarAlt,
  FaMoneyBillWave,
  FaSignOutAlt,
} from "react-icons/fa";
import { FiSettings, FiHelpCircle, FiMail, FiPhone } from "react-icons/fi";

export default function EmployeeLayout({ children }) {
  const navigate = useNavigate();
  const [showSupport, setShowSupport] = useState(false);

  // user info from localStorage (login වෙද්දි set කරපු එක)
  const user = useMemo(() => {
    try {
      const raw = localStorage.getItem("employeeUser");
      return raw ? JSON.parse(raw) : null;
    } catch {
      return null;
    }
  }, []);

  const name = user?.name || "Employee";
  const email = user?.email || "";
  const initial = name.charAt(0).toUpperCase();

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    localStorage.removeItem("employeeUser");
    navigate("/login", { replace: true });
  };

  const linkClasses =
    "flex items-center gap-3 px-4 py-2 rounded-lg text-sm font-medium cursor-pointer";
  const inactive =
    "text-slate-200/80 hover:bg-slate-800 hover:text-white transition";
  const active = "bg-white text-slate-900 shadow-sm";

  return (
    <div className="min-h-screen flex bg-slate-100">
      {/* ========== SIDEBAR ========== */}
      <aside className="w-64 bg-gradient-to-b from-slate-950 to-slate-900 text-white flex flex-col">
        {/* Logo / title */}
        <div className="px-5 pt-5 pb-4 border-b border-white/10">
          <p className="text-[11px] tracking-[0.2em] text-slate-400 mb-1">
            EMPLOYEE PORTAL
          </p>
          <h1 className="text-lg font-bold leading-snug">
            <span className="bg-gradient-to-r from-blue-500 to-pink-500 bg-clip-text text-transparent">
              Employee
            </span>{" "}
            Management System
          </h1>
        </div>

        {/* Nav links */}
        <nav className="flex-1 px-3 py-4 space-y-1 text-sm">
          <NavLink
            to="/employee/dashboard"
            className={({ isActive }) =>
              `${linkClasses} ${isActive ? active : inactive}`
            }
          >
            <RxDashboard className="text-lg" />
            <span>Dashboard</span>
          </NavLink>

          <NavLink
            to="/employee/profile"
            className={({ isActive }) =>
              `${linkClasses} ${isActive ? active : inactive}`
            }
          >
            <FaUser className="text-lg" />
            <span>My Profile</span>
          </NavLink>

          <NavLink
            to="/employee/leaves"
            className={({ isActive }) =>
              `${linkClasses} ${isActive ? active : inactive}`
            }
          >
            <FaCalendarAlt className="text-lg" />
            <span>Leaves</span>
          </NavLink>

          <NavLink
            to="/employee/salary"
            className={({ isActive }) =>
              `${linkClasses} ${isActive ? active : inactive}`
            }
          >
            <FaMoneyBillWave className="text-lg" />
            <span>Salary</span>
          </NavLink>

          <NavLink
            to="/employee/settings"
            className={({ isActive }) =>
              `${linkClasses} ${isActive ? active : inactive}`
            }
          >
            <FiSettings className="text-lg" />
            <span>Settings</span>
          </NavLink>
        </nav>

        {/* Need help box + Logout */}
        <div className="px-4 pb-3">
          <div className="bg-slate-800/70 rounded-xl px-4 py-3 mb-3 text-xs text-slate-200 flex items-start gap-2">
            <FiHelpCircle className="mt-0.5 text-lg" />
            <div>
              <p className="font-semibold text-[11px] uppercase tracking-wide">
                Need help?
              </p>
              <button
                type="button"
                onClick={() => setShowSupport(true)}
                className="underline text-sky-300 hover:text-sky-200"
              >
                Contact Support
              </button>
            </div>
          </div>

          {/* Logout button */}
          <button
            onClick={handleLogout}
            className="w-full flex items-center justify-center gap-2 py-2.5 rounded-lg bg-red-500 hover:bg-red-600 text-sm font-semibold shadow"
          >
            <FaSignOutAlt />
            Logout
          </button>
        </div>
      </aside>

      {/* ========== MAIN AREA ========== */}
      <div className="flex-1 flex flex-col bg-gradient-to-br from-slate-100 via-slate-50 to-slate-100">
        {/* Top bar */}
        <header className="h-16 bg-white/80 backdrop-blur border-b border-slate-200 flex items-center justify-between px-6">
          <div className="text-xs text-slate-500">
            <p className="font-medium text-slate-700">Dashboard</p>
            <p>
              Welcome back,{" "}
              {name.toLowerCase() !== "employee" ? name : "employee"} 👋
            </p>
          </div>

          <div className="flex items-center gap-3">
            <div className="text-right text-xs">
              <p className="font-semibold text-slate-800">{name}</p>
              <p className="text-slate-500 text-[11px]">
                {email || "Employee"}
              </p>
            </div>
            <div className="w-9 h-9 rounded-full bg-gradient-to-br from-blue-500 to-green-500 flex items-center justify-center text-white font-semibold text-sm">
              {initial}
            </div>
          </div>
        </header>

        {/* Page content with liquid glass card */}
        <main className="flex-1 p-6 md:p-8">
          <div className="max-w-6xl mx-auto">
            <div className="rounded-3xl bg-white/60 border border-white/70 shadow-[0_20px_45px_rgba(15,23,42,0.18)] backdrop-blur-2xl px-6 py-6 md:px-8 md:py-7">
              {children}
            </div>
          </div>
        </main>
      </div>

      {/* ========== SUPPORT MODAL (Need help) ========== */}
      {showSupport && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="relative w-full max-w-xl mx-4 rounded-3xl bg-white/80 backdrop-blur-2xl shadow-2xl border border-white/70 px-8 py-7">
            {/* close btn */}
            <button
              onClick={() => setShowSupport(false)}
              className="absolute top-3 right-4 text-slate-400 hover:text-slate-600 text-xl"
            >
              ×
            </button>

            <h2 className="text-lg font-semibold text-slate-900 mb-1">
              Contact Support
            </h2>
            <p className="text-xs text-slate-500 mb-4">
              If you have any issue with your attendance, leaves or salary,
              contact the HR / Admin team using the details below.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5 text-sm">
              <div className="space-y-2">
                <p className="font-semibold text-slate-800 text-xs uppercase">
                  HR Contact
                </p>
                <div className="flex items-center gap-2 text-slate-600">
                  <FiMail />
                  <a
                    href="mailto:hr@example.com"
                    className="underline text-sky-600 hover:text-sky-500"
                  >
                    hr@example.com
                  </a>
                </div>
                <div className="flex items-center gap-2 text-slate-600">
                  <FiPhone />
                  <span>+94 77 123 4567</span>
                </div>
              </div>

              <div className="space-y-2">
                <p className="font-semibold text-slate-800 text-xs uppercase">
                  Quick note
                </p>
                <p className="text-xs text-slate-500">
                  When you email support, remember to mention your{" "}
                  <span className="font-semibold">Employee ID</span> and a short
                  description of the problem. This helps them respond faster.
                </p>
              </div>
            </div>

            <div className="flex justify-end gap-3 mt-6 text-sm">
              <button
                onClick={() => setShowSupport(false)}
                className="px-4 py-2 rounded-lg border text-slate-600 hover:bg-slate-100"
              >
                Close
              </button>
              <a
                href="mailto:hr@example.com?subject=Support%20Request&body=Hi%20HR%20Team,%0D%0A%0D%0AEmployee%20ID:%20_____%0D%0AIssue:%20_____"
                className="px-5 py-2 rounded-lg bg-gradient-to-r from-blue-600 to-green-500 text-white font-semibold hover:opacity-90"
              >
                Email HR
              </a>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}