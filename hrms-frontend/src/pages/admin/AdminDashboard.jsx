// src/pages/admin/AdminDashboard.jsx
import { useEffect, useState } from "react";
import {
  FaUsers,
  FaBuilding,
  FaClipboardList,
  FaCheckCircle,
  FaClock,
  FaTimesCircle,
} from "react-icons/fa";
import { MdPaid } from "react-icons/md";
import AdminLayout from "../../layouts/AdminLayout";

// localStorage keys – SalaryPage & LeavesPages use කරන ඒවම
const LS_SALARIES = "salaries";
const LS_LEAVES = "leaves";

// 💵 Rs format
const formatCurrency = (value) =>
  `Rs ${Number(value || 0).toLocaleString("en-LK", {
    maximumFractionDigits: 0,
  })}`;

export default function AdminDashboard() {
  const [stats, setStats] = useState({
    totalEmployees: 5,    // demo values
    totalDepartments: 6,  // demo values
    monthlySalary: 0,
    leaveApplied: 0,
    leaveApproved: 0,
    leavePending: 0,
    leaveRejected: 0,
  });

  useEffect(() => {
    if (typeof window === "undefined") return;

    try {
      // ================= SALARIES =================
      let monthlySalary = 0;
      const rawSal = localStorage.getItem(LS_SALARIES);

      if (rawSal) {
        const salaries = JSON.parse(rawSal);
        if (Array.isArray(salaries) && salaries.length > 0) {
          const now = new Date();
          const m = now.getMonth() + 1;
          const y = now.getFullYear();

          // current month + year එකට filter
          const currentMonth = salaries.filter(
            (s) => Number(s.month) === m && Number(s.year) === y
          );

          if (currentMonth.length > 0) {
            monthlySalary = currentMonth.reduce(
              (sum, s) => sum + (Number(s.netSalary) || 0),
              0
            );
          } else {
            // fallback: සියලු salary එකතු
            monthlySalary = salaries.reduce(
              (sum, s) => sum + (Number(s.netSalary) || 0),
              0
            );
          }
        }
      }

      // demo fallback (salary records නෑනම්)
      if (!monthlySalary) {
        monthlySalary = 250000; // තෝරගන්න පුළුවන් demo value එක
      }

      // ================= LEAVES =================
      let applied = 0;
      let approved = 0;
      let pending = 0;
      let rejected = 0;

      const rawLeaves = localStorage.getItem(LS_LEAVES);
      if (rawLeaves) {
        const leaves = JSON.parse(rawLeaves);
        if (Array.isArray(leaves)) {
          applied = leaves.length;
          leaves.forEach((lv) => {
            const st = (lv.status || "pending").toLowerCase();
            if (st === "approved") approved += 1;
            else if (st === "rejected") rejected += 1;
            else pending += 1;
          });
        }
      }

      // demo fallback (leave records නෑනම්)
      if (applied === 0 && approved === 0 && pending === 0 && rejected === 0) {
        applied = 4;
        approved = 2;
        pending = 1;
        rejected = 1;
      }

      setStats((prev) => ({
        ...prev,
        monthlySalary,
        leaveApplied: applied,
        leaveApproved: approved,
        leavePending: pending,
        leaveRejected: rejected,
      }));
    } catch (err) {
      console.error("Dashboard stats error:", err);
    }
  }, []);

  const overviewCards = [
    {
      label: "Total Employees",
      value: stats.totalEmployees,
      icon: <FaUsers />,
      borderColor: "#3b82f6", // blue-500
    },
    {
      label: "Total Departments",
      value: stats.totalDepartments,
      icon: <FaBuilding />,
      borderColor: "#22c55e", // green-500
    },
    {
      label: "Monthly Salary",
      value: formatCurrency(stats.monthlySalary),
      icon: <MdPaid />,
      borderColor: "#a855f7", // purple-500
    },
  ];

  const leaveCards = [
    {
      label: "Leave Applied",
      value: stats.leaveApplied,
      icon: <FaClipboardList />,
      borderColor: "#f97316",
    },
    {
      label: "Leave Approved",
      value: stats.leaveApproved,
      icon: <FaCheckCircle />,
      borderColor: "#22c55e",
    },
    {
      label: "Leave Pending",
      value: stats.leavePending,
      icon: <FaClock />,
      borderColor: "#eab308",
    },
    {
      label: "Leave Rejected",
      value: stats.leaveRejected,
      icon: <FaTimesCircle />,
      borderColor: "#ef4444",
    },
  ];

  const Card = ({ card }) => (
    <div
      className="flex items-center justify-between rounded-2xl bg-white shadow-sm hover:shadow-md 
                 border border-slate-100 transition hover:-translate-y-0.5"
      style={{ borderTopWidth: "4px", borderTopColor: card.borderColor }}
    >
      <div className="p-4">
        <p className="text-xs text-slate-500">{card.label}</p>
        <p className="text-2xl font-bold text-slate-900 mt-1">{card.value}</p>
      </div>
      <div className="p-4">
        <div
          className="w-10 h-10 rounded-full flex items-center justify-center text-white"
          style={{ backgroundColor: card.borderColor }}
        >
          {card.icon}
        </div>
      </div>
    </div>
  );

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Dashboard Overview */}
        <section className="bg-white rounded-2xl shadow-sm border p-5">
          <h2 className="text-sm font-semibold mb-4 text-center">
            Dashboard Overview
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            {overviewCards.map((c) => (
              <Card key={c.label} card={c} />
            ))}
          </div>
        </section>

        {/* Leave Details */}
        <section className="bg-white rounded-2xl shadow-sm border p-5">
          <h2 className="text-sm font-semibold mb-4 text-center">
            Leave Details
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-6">
            {leaveCards.map((c) => (
              <Card key={c.label} card={c} />
            ))}
          </div>
        </section>
      </div>
    </AdminLayout>
  );
}