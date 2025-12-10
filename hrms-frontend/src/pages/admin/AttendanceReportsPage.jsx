// src/pages/admin/AttendanceReportsPage.jsx
import { useMemo, useState } from "react";
import { FiSearch } from "react-icons/fi";
import { FaDownload } from "react-icons/fa";
import AdminLayout from "../../layouts/AdminLayout";

const ATT_LS_KEY = "attendance";

export default function AttendanceReportsPage() {
  const [records] = useState(() => {
    try {
      if (typeof window === "undefined") return [];
      const raw = localStorage.getItem(ATT_LS_KEY);
      if (!raw) return [];
      const parsed = JSON.parse(raw);
      return Array.isArray(parsed) ? parsed : [];
    } catch (e) {
      console.error("Load attendance error", e);
      return [];
    }
  });

  const [search, setSearch] = useState("");
  const [dateFilter, setDateFilter] = useState(""); // yyyy-mm-dd

  // summary per date + employee counts
  const filtered = useMemo(() => {
    let list = [...records];

    if (dateFilter) {
      list = list.filter((r) => (r.date || "").slice(0, 10) === dateFilter);
    }

    if (search.trim()) {
      const s = search.toLowerCase();
      list = list.filter((r) => {
        const name = r.employeeName?.toLowerCase() || "";
        const empId = r.employeeId?.toLowerCase() || "";
        const dept = r.department?.toLowerCase() || "";
        return name.includes(s) || empId.includes(s) || dept.includes(s);
      });
    }

    return list;
  }, [records, search, dateFilter]);

  const summaryByDate = useMemo(() => {
    const map = {};
    filtered.forEach((r) => {
      const d = (r.date || "").slice(0, 10) || "Unknown";
      if (!map[d]) {
        map[d] = { total: 0, present: 0, absent: 0, late: 0 };
      }
      map[d].total += 1;
      const st = (r.status || "Present").toLowerCase();
      if (st === "present") map[d].present += 1;
      else if (st === "absent") map[d].absent += 1;
      else if (st === "late") map[d].late += 1;
    });

    return Object.entries(map)
      .map(([date, v]) => ({ date, ...v }))
      .sort(
        (a, b) =>
          new Date(b.date || 0).getTime() -
          new Date(a.date || 0).getTime()
      );
  }, [filtered]);

  const downloadCsv = () => {
    if (!filtered.length) {
      alert("No attendance data to export.");
      return;
    }

    const headers = [
      "Employee Name",
      "Employee ID",
      "Department",
      "Date",
      "Status",
      "Check-in",
      "Check-out",
    ];

    const rows = filtered.map((r) => [
      `"${r.employeeName || ""}"`,
      `"${r.employeeId || ""}"`,
      `"${r.department || ""}"`,
      `"${(r.date || "").slice(0, 10)}"`,
      `"${r.status || ""}"`,
      `"${r.checkInTime || ""}"`,
      `"${r.checkOutTime || ""}"`,
    ]);

    const csv = [headers.join(","), ...rows.map((r) => r.join(","))].join(
      "\n"
    );

    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = url;
    a.download = "attendance_report.csv";
    a.click();

    URL.revokeObjectURL(url);
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Title row */}
        <div className="flex items-center justify-between">
          <h1 className="text-xl font-semibold">Attendance Reports</h1>

          <button
            onClick={downloadCsv}
            className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold 
                       bg-gradient-to-r from-emerald-600 to-lime-500 text-white shadow-sm hover:opacity-90"
          >
            <FaDownload className="text-xs" />
            Download CSV
          </button>
        </div>

        {/* Filters */}
        <div className="flex flex-col md:flex-row gap-4 md:items-center">
          <div className="bg-white rounded-2xl shadow-sm border px-4 py-3 flex items-center gap-3 max-w-xl flex-1">
            <FiSearch className="text-slate-400 text-lg" />
            <input
              type="text"
              placeholder="Search by employee, ID or department"
              className="flex-1 outline-none text-sm"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          <div className="flex items-center gap-2 text-xs text-slate-500">
            <span>Date:</span>
            <input
              type="date"
              className="border rounded-lg px-3 py-2 text-xs bg-white outline-none focus:ring-1 focus:ring-blue-500"
              value={dateFilter}
              onChange={(e) => setDateFilter(e.target.value)}
            />
            {dateFilter && (
              <button
                className="text-[11px] px-2 py-1 border rounded-lg"
                onClick={() => setDateFilter("")}
              >
                Clear
              </button>
            )}
          </div>
        </div>

        {/* Summary cards */}
        {summaryByDate.length === 0 ? (
          <p className="text-sm text-slate-500">
            No attendance data available for reporting.
          </p>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {summaryByDate.map((s) => (
              <div
                key={s.date}
                className="bg-white rounded-2xl shadow-sm border border-slate-100 p-4"
                style={{ borderTopWidth: "4px", borderTopColor: "#22c55e" }}
              >
                <p className="text-sm font-semibold text-slate-900 mb-1">
                  {new Date(s.date).toLocaleDateString()}
                </p>
                <p className="text-[11px] text-slate-500 mb-3">
                  Summary of attendance for this day
                </p>
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <SummaryRow label="Total" value={s.total} />
                  <SummaryRow label="Present" value={s.present} />
                  <SummaryRow label="Absent" value={s.absent} />
                  <SummaryRow label="Late" value={s.late} />
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </AdminLayout>
  );
}

function SummaryRow({ label, value }) {
  return (
    <div className="flex justify-between bg-slate-50 rounded-lg px-3 py-2">
      <span className="text-slate-500">{label}</span>
      <span className="font-semibold text-slate-800">{value}</span>
    </div>
  );
}
