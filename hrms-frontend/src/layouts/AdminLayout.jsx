// src/layouts/AdminLayout.jsx
import { NavLink, useNavigate } from "react-router-dom";
import {
  FaUsers,
  FaBuilding,
  FaCalendarCheck,
  FaSignOutAlt,
} from "react-icons/fa";
import {
  MdDashboard,
  MdOutlineAssessment,
  MdPaid,
  MdSettings,
} from "react-icons/md";

export default function AdminLayout({ children }) {
  const navigate = useNavigate();

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    navigate("/login");
  };

  const navItemClass =
    "flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium hover:bg-blue-700/60 transition";
  const navItemActive = "bg-blue-900/60";

  return (
    <div className="min-h-screen flex bg-slate-50">
      {/* SIDEBAR */}
      <aside className="w-64 bg-gradient-to-b from-blue-700 to-blue-900 text-white flex flex-col">
        {/* TOP LOGO */}
        <div className="px-6 py-5 border-b border-white/10">
          <p className="text-[11px] tracking-[0.2em] uppercase text-blue-100">
            HRMS PORTAL
          </p>
          <h1 className="text-lg font-bold leading-tight">Management System</h1>
        </div>

        {/* NAV LINKS */}
        <nav className="flex-1 px-3 pt-6 pb-4">
          <div className="flex flex-col gap-3">
            <NavLink
              to="/admin/dashboard"
              className={({ isActive }) =>
                navItemClass + " " + (isActive ? navItemActive : "")
              }
            >
              <MdDashboard /> <span>Dashboard</span>
            </NavLink>

            <NavLink
              to="/admin/employees"
              className={({ isActive }) =>
                navItemClass + " " + (isActive ? navItemActive : "")
              }
            >
              <FaUsers /> <span>Employees</span>
            </NavLink>

            <NavLink
              to="/admin/departments"
              className={({ isActive }) =>
                navItemClass + " " + (isActive ? navItemActive : "")
              }
            >
              <FaBuilding /> <span>Department</span>
            </NavLink>

            <NavLink
              to="/admin/leaves"
              className={({ isActive }) =>
                navItemClass + " " + (isActive ? navItemActive : "")
              }
            >
              <FaCalendarCheck /> <span>Leaves</span>
            </NavLink>

            <NavLink
              to="/admin/attendance"
              className={({ isActive }) =>
                navItemClass + " " + (isActive ? navItemActive : "")
              }
            >
              <FaCalendarCheck /> <span>Attendance</span>
            </NavLink>

            <NavLink
              to="/admin/attendance-reports"
              className={({ isActive }) =>
                navItemClass + " " + (isActive ? navItemActive : "")
              }
            >
              <MdOutlineAssessment /> <span>Attendance Reports</span>
            </NavLink>

            <NavLink
              to="/admin/salary"
              className={({ isActive }) =>
                navItemClass + " " + (isActive ? navItemActive : "")
              }
            >
              <MdPaid /> <span>Salary</span>
            </NavLink>

            <NavLink
              to="/admin/settings"
              className={({ isActive }) =>
                navItemClass + " " + (isActive ? navItemActive : "")
              }
            >
              <MdSettings /> <span>Settings</span>
            </NavLink>
          </div>
        </nav>

        {/* HELP + LOGOUT (BOTTOM) */}
        <div className="px-4 pb-4 space-y-3">
          <button
            onClick={() => navigate("/admin/support")}
            className="w-full rounded-xl bg-blue-800/60 px-4 py-3 text-left text-xs hover:bg-blue-700/70 transition"
          >
            <p className="font-semibold mb-1">Need help?</p>
            <p className="text-blue-100 mb-1">Contact Support</p>
          </button>

          <button
            onClick={logout}
            className="w-full flex items-center justify-center gap-2 py-2 rounded-lg bg-red-600 hover:bg-red-700 text-sm font-semibold"
          >
            <FaSignOutAlt /> Logout
          </button>
        </div>
      </aside>

      {/* MAIN CONTENT */}
      <main className="flex-1 flex flex-col">
        {/* TOP BAR */}
        <header className="h-16 bg-white border-b flex items-center justify-between px-6">
          <div>
            <p className="text-xs text-slate-500">Dashboard</p>
            <p className="text-sm font-semibold">Welcome back, admin</p>
          </div>

          <div className="flex items-center gap-3">
            <div className="text-right text-xs">
              <p className="font-semibold text-slate-800">admin</p>
              <p className="text-slate-400">Admin</p>
            </div>
            <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-blue-500 to-green-500 flex items-center justify-center text-white text-xs font-bold">
              A
            </div>
          </div>
        </header>

        <div className="flex-1 p-6">{children}</div>
      </main>
    </div>
  );
}
