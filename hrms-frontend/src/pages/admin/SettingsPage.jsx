// src/pages/admin/SettingsPage.jsx
import { useState } from "react";
import { FiSettings, FiLock } from "react-icons/fi";
import AdminLayout from "../../layouts/AdminLayout";

export default function SettingsPage() {
  const [adminName, setAdminName] = useState("Admin User");
  const [adminEmail] = useState("admin@admin.com"); // read-only
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [msg, setMsg] = useState("");

  const handleSave = (e) => {
    e.preventDefault();
    setMsg("");

    if (!currentPassword || !newPassword || !confirmPassword) {
      return setMsg("Please fill all password fields.");
    }

    if (newPassword !== confirmPassword) {
      return setMsg("New password and confirm password do not match.");
    }

    // 🔹 Backend නැති නිසා දැන්ට demo message එකක් විතරයි
    setMsg("Settings updated (demo only – no backend connected).");
    setCurrentPassword("");
    setNewPassword("");
    setConfirmPassword("");
  };

  return (
    <AdminLayout>
      {/* Center card */}
      <div className="min-h-[calc(100vh-5rem)] flex items-center justify-center px-4">
        <div
          className="
            w-full max-w-xl 
            rounded-3xl 
            border border-white/60 
            bg-white/60 
            shadow-xl 
            backdrop-blur-xl 
            px-8 py-7
          "
        >
          {/* Header */}
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-2xl bg-slate-900 flex items-center justify-center">
              <FiSettings className="text-white text-xl" />
            </div>
            <div>
              <h1 className="text-lg font-semibold text-slate-900">
                Admin Settings
              </h1>
              <p className="text-xs text-slate-500">
                Update your profile and security settings.
              </p>
            </div>
          </div>

          <div className="h-px w-full bg-gradient-to-r from-transparent via-slate-300 to-transparent mb-5" />

          <form onSubmit={handleSave} className="space-y-6 text-sm">
            {/* Admin Info */}
            <section className="space-y-3">
              <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide">
                Profile
              </p>

              <div className="space-y-3">
                <div>
                  <label className="block text-xs font-medium text-slate-600 mb-1">
                    Full Name
                  </label>
                  <input
                    type="text"
                    value={adminName}
                    onChange={(e) => setAdminName(e.target.value)}
                    className="w-full rounded-xl border border-slate-200 bg-white/80 px-3 py-2 text-sm outline-none focus:ring-1 focus:ring-slate-400"
                    placeholder="Admin name"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-600 mb-1">
                    Email Address
                  </label>
                  <input
                    type="email"
                    value={adminEmail}
                    disabled
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-500 outline-none cursor-not-allowed"
                  />
                  <p className="text-[11px] text-slate-400 mt-1">
                    Login email cannot be changed from here.
                  </p>
                </div>
              </div>
            </section>

            {/* Password section */}
            <section className="space-y-3">
              <p className="flex items-center gap-2 text-xs font-semibold text-slate-500 uppercase tracking-wide">
                <FiLock className="text-slate-600" />
                Security
              </p>

              <div className="space-y-3">
                <div>
                  <label className="block text-xs font-medium text-slate-600 mb-1">
                    Current Password
                  </label>
                  <input
                    type="password"
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                    className="w-full rounded-xl border border-slate-200 bg-white/80 px-3 py-2 text-sm outline-none focus:ring-1 focus:ring-slate-400"
                    placeholder="Enter current password"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-medium text-slate-600 mb-1">
                      New Password
                    </label>
                    <input
                      type="password"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      className="w-full rounded-xl border border-slate-200 bg-white/80 px-3 py-2 text-sm outline-none focus:ring-1 focus:ring-slate-400"
                      placeholder="Enter new password"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-slate-600 mb-1">
                      Confirm New Password
                    </label>
                    <input
                      type="password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      className="w-full rounded-xl border border-slate-200 bg-white/80 px-3 py-2 text-sm outline-none focus:ring-1 focus:ring-slate-400"
                      placeholder="Re-enter new password"
                    />
                  </div>
                </div>
              </div>
            </section>

            {/* Message */}
            {msg && (
              <p className="text-[11px] text-emerald-600 bg-emerald-50 border border-emerald-100 px-3 py-2 rounded-xl">
                {msg}
              </p>
            )}

            {/* Buttons */}
            <div className="flex justify-end gap-3 pt-1">
              <button
                type="button"
                onClick={() => {
                  setCurrentPassword("");
                  setNewPassword("");
                  setConfirmPassword("");
                  setMsg("");
                }}
                className="px-4 py-2 rounded-xl border border-slate-200 text-xs font-medium text-slate-600 hover:bg-slate-100"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-5 py-2 rounded-xl bg-slate-900 text-white text-xs font-semibold shadow-md hover:bg-black/90"
              >
                Save Changes
              </button>
            </div>
          </form>
        </div>
      </div>
    </AdminLayout>
  );
}