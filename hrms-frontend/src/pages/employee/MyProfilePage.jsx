// src/pages/employee/EmployeeProfilePage.jsx
import { useEffect, useState } from "react";
import axios from "axios";
import EmployeeLayout from "../../layouts/EmployeeLayout";

export default function EmployeeProfilePage() {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = localStorage.getItem("token");
        const headers = { Authorization: `Bearer ${token}` };

        const res = await axios.get(
          "http://localhost:4000/api/employee/me",
          { headers }
        );

        setProfile(res.data);
      } catch (err) {
        console.error("My profile load error:", err.response?.data || err);
        setError(err.response?.data?.msg || "Failed to load profile");
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  // avatar localStorage එකෙන් ගන්න එක
  let avatarUrl = "";
  if (profile && typeof window !== "undefined") {
    const stored = localStorage.getItem("avatar_" + profile._id);
    if (stored) avatarUrl = stored;
  }

  const name = profile?.name || "";
  const firstLetter = name ? name.charAt(0).toUpperCase() : "E";

  const monthlySalary = profile?.salary
    ? `Rs ${Number(profile.salary).toLocaleString("en-LK")}`
    : "Rs 0";

  const joinedOn = profile?.createdAt
    ? new Date(profile.createdAt).toLocaleDateString()
    : "-";

  return (
    <EmployeeLayout>
      <div className="px-6 py-6 space-y-6">
        {/* TOP TITLE */}
        <div>
          <p className="text-xs text-slate-500 mb-1">Dashboard</p>
          <h1 className="text-lg font-semibold text-slate-900">
            Welcome back, {name || "employee"} 👋
          </h1>
          <p className="text-xs text-slate-500 mt-2">
            My Profile – View your personal and employment details.
          </p>
        </div>

        {loading ? (
          <p className="text-sm text-slate-500">Loading profile…</p>
        ) : error ? (
          <p className="text-sm text-red-600 bg-red-50 inline-block px-3 py-2 rounded">
            {error}
          </p>
        ) : !profile ? (
          <p className="text-sm text-slate-500">Profile not found.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* LEFT – big avatar + basic */}
            <div className="bg-white rounded-2xl shadow-sm border px-6 py-8 flex flex-col items-center">
              <div className="w-20 h-20 rounded-full bg-slate-100 flex items-center justify-center overflow-hidden mb-3">
                {avatarUrl ? (
                  <img
                    src={avatarUrl}
                    alt={name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <span className="text-2xl font-semibold text-slate-600">
                    {firstLetter}
                  </span>
                )}
              </div>
              <p className="font-semibold text-slate-900">{name}</p>
              <p className="text-xs text-slate-500 mb-4">
                {profile.designation || "employee"}
              </p>

              <div className="w-full text-xs text-slate-600 space-y-1">
                <Row label="Employee ID" value={profile.employeeId || "N/A"} />
                <Row label="Email" value={profile.email || "no-email@example.com"} />
                <Row label="Status" value={profile.status || "Active"} />
              </div>
            </div>

            {/* MIDDLE – employment details */}
            <div className="bg-white rounded-2xl shadow-sm border px-6 py-6">
              <h2 className="text-sm font-semibold text-slate-900 mb-4">
                Employment Details
              </h2>
              <div className="space-y-2 text-xs text-slate-600">
                <Row label="Department" value={profile.department || "N/A"} />
                <Row
                  label="Designation"
                  value={profile.designation || "employee"}
                />
                <Row label="Monthly Salary" value={monthlySalary} />
                <Row label="Joined On" value={joinedOn} />
              </div>
            </div>

            {/* RIGHT – personal details */}
            <div className="bg-white rounded-2xl shadow-sm border px-6 py-6">
              <h2 className="text-sm font-semibold text-slate-900 mb-4">
                Personal Details
              </h2>
              <div className="space-y-2 text-xs text-slate-600">
                <Row label="Full Name" value={profile.name || "-"} />
                <Row
                  label="Date of Birth"
                  value={
                    profile.dob
                      ? new Date(profile.dob).toLocaleDateString()
                      : "-"
                  }
                />
                <Row
                  label="Gender"
                  value={
                    profile.gender
                      ? profile.gender.toString().toUpperCase()
                      : "-"
                  }
                />
                <Row
                  label="Marital Status"
                  value={
                    profile.maritalStatus
                      ? profile.maritalStatus.toString().toUpperCase()
                      : "-"
                  }
                />
              </div>
            </div>
          </div>
        )}
      </div>
    </EmployeeLayout>
  );
}

function Row({ label, value }) {
  return (
    <div className="flex justify-between border-b border-slate-100 py-1">
      <span className="font-medium text-slate-500">{label}</span>
      <span className="text-slate-800">{value}</span>
    </div>
  );
}
