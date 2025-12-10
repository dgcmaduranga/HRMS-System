// src/pages/employee/EmployeeDashboard.jsx
import { useEffect, useState } from "react";
import axios from "axios";
import EmployeeLayout from "../../layouts/EmployeeLayout";
import { FaCalendarCheck, FaCalendarTimes, FaMoneyBillWave } from "react-icons/fa";
import { FiClock, FiCheckCircle, FiXCircle } from "react-icons/fi";

export default function EmployeeDashboard() {
  // 🔹 Demo values (screenshot ගන්න / backend නැති වෙලාවට)
  const [stats, setStats] = useState({
    totalAttendanceDays: 18,
    presentThisMonth: 15,
    lateCount: 2,
    totalLeaves: 4,
    approvedLeaves: 2,
    pendingLeaves: 1,
    rejectedLeaves: 1,
    monthlySalary: 100000,
  });

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) return;

        const res = await axios.get(
          "http://localhost:4000/api/employee/dashboard-stats",
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        // backend එකෙන් ආව data එක demo values උඩට override වෙනවා
        if (res.data && typeof res.data === "object") {
          setStats((prev) => ({ ...prev, ...res.data }));
        }
      } catch (err) {
        console.error(
          "Employee dashboard stats error:",
          err.response?.data || err
        );
        // Error උනාට demo values ඒක නිසා UI එක 0 නොවෙයි
      }
    };

    fetchStats();
  }, []);

  const currency = (v) =>
    `Rs ${Number(v || 0).toLocaleString("en-LK", {
      maximumFractionDigits: 0,
    })}`;

  return (
    <EmployeeLayout>
      <div className="space-y-8">
        {/* OVERVIEW CARDS */}
        <section>
          <h2 className="text-sm font-semibold text-slate-700 mb-3">
            Overview
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Attendance this month */}
            <Card
              title="Attendance this month"
              value={`${stats.presentThisMonth} days`}
              icon={<FaCalendarCheck />}
              barColor="from-blue-500 to-sky-400"
              subtitle={`${stats.lateCount} late arrivals`}
            />

            {/* Leaves */}
            <Card
              title="Total Leaves"
              value={stats.totalLeaves}
              icon={<FaCalendarTimes />}
              barColor="from-emerald-500 to-lime-400"
              subtitle={`${stats.approvedLeaves} approved, ${stats.pendingLeaves} pending`}
            />

            {/* Salary */}
            <Card
              title="Monthly Salary"
              value={currency(stats.monthlySalary)}
              icon={<FaMoneyBillWave />}
              barColor="from-purple-500 to-pink-500"
              subtitle="Based on latest payroll"
            />
          </div>
        </section>

        {/* LEAVE DETAILS */}
        <section>
          <h2 className="text-sm font-semibold text-slate-700 mb-3">
            Leave Details
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <SmallCard
              label="Leaves Applied"
              value={stats.totalLeaves}
              icon={<FiClock />}
              color="bg-orange-50 text-orange-600 border-orange-200"
            />
            <SmallCard
              label="Leaves Approved"
              value={stats.approvedLeaves}
              icon={<FiCheckCircle />}
              color="bg-emerald-50 text-emerald-600 border-emerald-200"
            />
            <SmallCard
              label="Leaves Pending"
              value={stats.pendingLeaves}
              icon={<FiClock />}
              color="bg-amber-50 text-amber-600 border-amber-200"
            />
            <SmallCard
              label="Leaves Rejected"
              value={stats.rejectedLeaves}
              icon={<FiXCircle />}
              color="bg-red-50 text-red-600 border-red-200"
            />
          </div>
        </section>

        {/* ATTENDANCE SUMMARY */}
        <section>
          <h2 className="text-sm font-semibold text-slate-700 mb-3">
            Attendance Summary
          </h2>
          <div className="bg-white rounded-2xl shadow-sm border border-slate-100 px-6 py-4 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <p className="text-xs font-medium text-slate-500 mb-1">
                Total Attendance Recorded
              </p>
              <p className="text-2xl font-semibold text-slate-900">
                {stats.totalAttendanceDays} days
              </p>
            </div>
            <p className="text-xs text-slate-500 max-w-md">
              Keep your attendance up-to-date. Any missing days or corrections
              can be requested from the HR team through the{" "}
              <span className="font-medium text-slate-700">Leaves</span> or{" "}
              <span className="font-medium text-slate-700">Support</span> pages.
            </p>
          </div>
        </section>
      </div>
    </EmployeeLayout>
  );
}

/* ---------- Reusable UI components ---------- */

function Card({ title, value, subtitle, icon, barColor }) {
  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-100 px-5 py-4 flex flex-col justify-between">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-xs text-slate-500 mb-1">{title}</p>
          <p className="text-xl font-semibold text-slate-900">{value}</p>
          {subtitle && (
            <p className="text-[11px] text-slate-500 mt-1">{subtitle}</p>
          )}
        </div>
        <div className="w-9 h-9 rounded-full bg-slate-100 flex items-center justify-center text-slate-600 text-lg">
          {icon}
        </div>
      </div>
      <div className={`mt-4 h-1 rounded-full bg-gradient-to-r ${barColor}`} />
    </div>
  );
}

function SmallCard({ label, value, icon, color }) {
  return (
    <div
      className={`rounded-2xl px-4 py-3 border text-xs flex items-center justify-between ${color}`}
    >
      <div>
        <p className="mb-1">{label}</p>
        <p className="text-lg font-semibold">{value}</p>
      </div>
      <div className="text-lg opacity-80">{icon}</div>
    </div>
  );
}
