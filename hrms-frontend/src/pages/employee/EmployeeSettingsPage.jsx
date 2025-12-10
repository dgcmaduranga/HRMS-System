// src/pages/employee/EmployeeSettingsPage.jsx
import { useEffect, useState } from "react";
import EmployeeLayout from "../../layouts/EmployeeLayout";
import { FiUser, FiMail, FiLock } from "react-icons/fi";

const LS_KEY = "employee_settings";
const USER_KEY = "employeeUser";

export default function EmployeeSettingsPage() {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("charithgamage@gmail.com"); // fixed email
  const [theme, setTheme] = useState("light");

  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  // ---------------- LOAD DATA ----------------
  useEffect(() => {
    try {
      const saved = localStorage.getItem(LS_KEY);
      if (saved) {
        const data = JSON.parse(saved);
        if (data.fullName) setFullName(data.fullName);
        if (data.theme) setTheme(data.theme);
      }

      const userRaw = localStorage.getItem(USER_KEY);
      if (userRaw) {
        const user = JSON.parse(userRaw);
        if (user.email) setEmail(user.email);
      }
    } catch (err) {
      console.error("Settings load error:", err);
    }
  }, []);

  // ---------------- SAVE ACCOUNT INFO ----------------
  const handleSaveAccount = () => {
    localStorage.setItem(
      LS_KEY,
      JSON.stringify({
        fullName,
        theme,
      })
    );
    alert("Account information saved!");
  };

  // ---------------- UPDATE PASSWORD (DEMO) ----------------
  const handleUpdatePassword = (e) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      alert("Passwords do not match!");
      return;
    }
    alert("Demo only — connect backend to update password.");
    setCurrentPassword("");
    setNewPassword("");
    setConfirmPassword("");
  };

  // ---------------- SAVE APPEARANCE ----------------
  const handleSaveAppearance = () => {
    localStorage.setItem(
      LS_KEY,
      JSON.stringify({
        fullName,
        theme,
      })
    );
    alert("Appearance saved!");
  };

  return (
    <EmployeeLayout>
      {/* ❌ vertical-center නැහැ – top padding ටිකක් විතරයි */}
      <div className="px-4 py-8">
        <div className="w-full max-w-5xl mx-auto bg-white border border-slate-200 rounded-2xl shadow-md px-10 py-8">
          {/* HEADER */}
          <div className="mb-6">
            <h1 className="text-xl font-semibold text-slate-900">Settings</h1>
            <p className="text-xs text-slate-500 mt-1">
              Manage your account preferences. Your official email address is
              managed by HR.
            </p>
          </div>

          {/* TWO COLUMN GRID */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
            {/* LEFT SIDE — ACCOUNT INFO */}
            <div>
              <h2 className="text-sm font-semibold text-slate-700 mb-3">
                Account Information
              </h2>

              {/* FULL NAME */}
              <label className="flex items-center gap-2 text-[11px] font-medium text-slate-600 mb-1">
                <FiUser /> Full Name
              </label>
              <input
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="Your display name"
                className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm mb-4 outline-none focus:ring focus:ring-blue-300"
              />

              {/* EMAIL (READ ONLY) */}
              <label className="flex items-center gap-2 text-[11px] font-medium text-slate-600 mb-1">
                <FiMail /> Email Address (read-only)
              </label>
              <input
                type="text"
                value={email}
                readOnly
                className="w-full bg-slate-100 border border-slate-300 rounded-lg px-3 py-2 text-sm mb-2 cursor-not-allowed text-slate-600"
              />
              <p className="text-[11px] text-slate-500 mb-5">
                To change your email, contact the HR/admin team.
              </p>

              <button
                onClick={handleSaveAccount}
                className="px-4 py-2 text-xs font-semibold rounded-lg bg-blue-600 hover:bg-blue-700 text-white shadow"
              >
                Save Changes
              </button>
            </div>

            {/* RIGHT SIDE — PASSWORD */}
            <div>
              <h2 className="text-sm font-semibold text-slate-700 mb-3">
                Change Password
              </h2>

              {/* CURRENT PASSWORD */}
              <label className="flex items-center gap-2 text-[11px] font-medium text-slate-600 mb-1">
                <FiLock /> Current Password
              </label>
              <input
                type="password"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                placeholder="Enter current password"
                className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm mb-4 outline-none focus:ring-blue-300"
              />

              <form onSubmit={handleUpdatePassword}>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="text-[11px] font-medium text-slate-600 mb-1 block">
                      New Password
                    </label>
                    <input
                      type="password"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm outline-none focus:ring-blue-300"
                    />
                  </div>

                  <div>
                    <label className="text-[11px] font-medium text-slate-600 mb-1 block">
                      Confirm Password
                    </label>
                    <input
                      type="password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm outline-none focus:ring-blue-300"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  className="mt-4 px-4 py-2 text-xs font-semibold rounded-lg bg-emerald-500 hover:bg-emerald-600 text-white shadow"
                >
                  Update Password
                </button>

                <p className="text-[11px] text-slate-500 mt-1">
                  Demo only — connect backend to enable real password updates.
                </p>
              </form>
            </div>
          </div>

          {/* APPEARANCE */}
          <div className="mt-8 pt-5 border-t border-slate-200">
            <h2 className="text-sm font-semibold text-slate-700 mb-3">
              Appearance
            </h2>

            <div className="flex items-center gap-4 text-xs mb-3">
              <label className="flex items-center gap-2">
                <input
                  type="radio"
                  name="theme"
                  checked={theme === "light"}
                  onChange={() => setTheme("light")}
                />{" "}
                Light Mode
              </label>

              <label className="flex items-center gap-2">
                <input
                  type="radio"
                  name="theme"
                  checked={theme === "dark"}
                  onChange={() => setTheme("dark")}
                />{" "}
                Dark Mode
              </label>
            </div>

            <button
              onClick={handleSaveAppearance}
              className="px-4 py-2 text-xs font-semibold rounded-lg bg-blue-600 hover:bg-blue-700 text-white shadow"
            >
              Save Appearance
            </button>
          </div>
        </div>
      </div>
    </EmployeeLayout>
  );
}