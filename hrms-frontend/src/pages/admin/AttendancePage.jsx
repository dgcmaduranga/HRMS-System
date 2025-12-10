// src/pages/admin/AttendancePage.jsx
import { useMemo, useState } from "react";
import { FiSearch } from "react-icons/fi";
import { FaPlus, FaTrash } from "react-icons/fa";
import AdminLayout from "../../layouts/AdminLayout";

const LS_KEY = "attendance";

export default function AttendancePage() {
  const [records, setRecords] = useState(() => {
    try {
      if (typeof window === "undefined") return [];
      const raw = localStorage.getItem(LS_KEY);
      if (!raw) return [];
      const parsed = JSON.parse(raw);
      return Array.isArray(parsed) ? parsed : [];
    } catch (e) {
      console.error("Load attendance error", e);
      return [];
    }
  });

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [sortOrder, setSortOrder] = useState("latest");
  const [showCreate, setShowCreate] = useState(false);

  const saveRecords = (list) => {
    setRecords(list);
    try {
      localStorage.setItem(LS_KEY, JSON.stringify(list));
    } catch (e) {
      console.error("Save attendance error", e);
    }
  };

  const filteredRecords = useMemo(() => {
    let list = [...records];

    if (search.trim()) {
      const s = search.toLowerCase();
      list = list.filter((r) => {
        const name = r.employeeName?.toLowerCase() || "";
        const empId = r.employeeId?.toLowerCase() || "";
        const dept = r.department?.toLowerCase() || "";
        return name.includes(s) || empId.includes(s) || dept.includes(s);
      });
    }

    if (statusFilter !== "all") {
      list = list.filter(
        (r) => (r.status || "Present").toLowerCase() === statusFilter
      );
    }

    if (sortOrder === "latest") {
      list.sort(
        (a, b) =>
          new Date(b.date || 0).getTime() -
          new Date(a.date || 0).getTime()
      );
    } else if (sortOrder === "oldest") {
      list.sort(
        (a, b) =>
          new Date(a.date || 0).getTime() -
          new Date(b.date || 0).getTime()
      );
    } else if (sortOrder === "name") {
      list.sort((a, b) =>
        (a.employeeName || "").localeCompare(b.employeeName || "")
      );
    }

    return list;
  }, [records, search, statusFilter, sortOrder]);

  const handleCreate = (data) => {
    if (!data) return;
    const now = new Date().toISOString();
    const withMeta = {
      ...data,
      id: crypto.randomUUID ? crypto.randomUUID() : Date.now().toString(),
      createdAt: now,
      updatedAt: now,
    };
    saveRecords([withMeta, ...records]);
    setShowCreate(false);
  };

  const deleteRecord = (id) => {
    if (!window.confirm("Delete this attendance record?")) return;
    saveRecords(records.filter((r) => r.id !== id));
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Title row */}
        <div className="flex items-center justify-between">
          <h1 className="text-xl font-semibold">Manage Attendance</h1>

          <div className="flex items-center gap-4 text-xs">
            <div className="flex items-center gap-2 text-slate-500">
              <span>Status:</span>
              <select
                className="border rounded-lg px-3 py-1 bg-white"
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
              >
                <option value="all">All</option>
                <option value="present">Present</option>
                <option value="absent">Absent</option>
                <option value="late">Late</option>
              </select>
            </div>
            <div className="flex items-center gap-2 text-slate-500">
              <span>Sort:</span>
              <select
                className="border rounded-lg px-3 py-1 bg-white"
                value={sortOrder}
                onChange={(e) => setSortOrder(e.target.value)}
              >
                <option value="latest">Latest first</option>
                <option value="oldest">Oldest first</option>
                <option value="name">Name A–Z</option>
              </select>
            </div>

            <button
              onClick={() => setShowCreate(true)}
              className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold 
                         bg-gradient-to-r from-blue-600 to-green-500 text-white shadow-sm hover:opacity-90"
            >
              <FaPlus className="text-xs" />
              Mark Attendance
            </button>
          </div>
        </div>

        {/* Search */}
        <div className="bg-white rounded-2xl shadow-sm border px-4 py-3 flex items-center gap-3 max-w-xl">
          <FiSearch className="text-slate-400 text-lg" />
          <input
            type="text"
            placeholder="Search by employee, ID or department"
            className="flex-1 outline-none text-sm"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        {/* List */}
        {filteredRecords.length === 0 ? (
          <p className="text-sm text-slate-500">No attendance records found.</p>
        ) : (
          <div className="space-y-3">
            {filteredRecords.map((r) => (
              <AttendanceCard
                key={r.id}
                record={r}
                onDelete={() => deleteRecord(r.id)}
              />
            ))}
          </div>
        )}
      </div>

      {showCreate && (
        <AttendanceModal
          title="Mark Attendance"
          initial={{
            employeeName: "",
            employeeId: "",
            department: "",
            date: new Date().toISOString().slice(0, 10),
            status: "Present",
            checkInTime: "",
            checkOutTime: "",
          }}
          onCancel={() => setShowCreate(false)}
          onSave={handleCreate}
        />
      )}
    </AdminLayout>
  );
}

function AttendanceCard({ record, onDelete }) {
  const {
    employeeName,
    employeeId,
    department,
    date,
    status = "Present",
    checkInTime,
    checkOutTime,
  } = record;

  const dateStr = date ? new Date(date).toLocaleDateString() : "-";

  const statusColor =
    status === "Present"
      ? "bg-emerald-100 text-emerald-700"
      : status === "Late"
      ? "bg-amber-100 text-amber-700"
      : "bg-red-100 text-red-700";

  return (
    <div
      className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden"
      style={{ borderTopWidth: "4px", borderTopColor: "#6366f1" }}
    >
      <div className="flex items-center justify-between px-5 py-4">
        <div className="space-y-1 text-sm">
          <p className="font-semibold text-slate-900">
            {employeeName || "Employee"}{" "}
            {employeeId && (
              <span className="text-xs text-slate-500">· {employeeId}</span>
            )}
          </p>
          <p className="text-xs text-slate-500">
            {department || "No department"} · {dateStr}
          </p>
          <p className="text-xs text-slate-500">
            In: {checkInTime || "--:--"} · Out: {checkOutTime || "--:--"}
          </p>
        </div>

        <div className="flex items-center gap-3">
          <span
            className={`px-3 py-1 rounded-full text-[11px] font-medium ${statusColor}`}
          >
            {status}
          </span>
          <button
            onClick={onDelete}
            className="flex items-center gap-1 px-3 py-1 rounded-full bg-red-500 text-white text-xs hover:bg-red-600"
          >
            <FaTrash /> Delete
          </button>
        </div>
      </div>
    </div>
  );
}

function AttendanceModal({ title, initial, onCancel, onSave }) {
  const [form, setForm] = useState(initial);
  const [saving, setSaving] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setSaving(true);

    const trimmed = {
      ...form,
      employeeName: form.employeeName.trim(),
      employeeId: form.employeeId.trim(),
      department: form.department.trim(),
    };

    onSave(trimmed);
    setSaving(false);
  };

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-white w-full max-w-3xl rounded-2xl shadow-xl p-8 relative">
        <button
          onClick={onCancel}
          className="absolute top-3 right-4 text-slate-400 hover:text-slate-600 text-xl"
        >
          ×
        </button>

        <h2 className="text-lg font-semibold mb-1">{title}</h2>
        <div className="h-0.5 w-32 bg-slate-800 mb-6" />

        <form
          onSubmit={handleSubmit}
          className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm"
        >
          <Field
            label="Employee Name"
            name="employeeName"
            placeholder="e.g. Prakash"
            value={form.employeeName}
            onChange={handleChange}
            required
          />
          <Field
            label="Employee ID"
            name="employeeId"
            placeholder="e.g. EMP0001"
            value={form.employeeId}
            onChange={handleChange}
          />
          <Field
            label="Department"
            name="department"
            placeholder="e.g. IT"
            value={form.department}
            onChange={handleChange}
          />
          <Field
            label="Date"
            name="date"
            type="date"
            value={form.date}
            onChange={handleChange}
          />
          <div>
            <label className="block text-xs font-medium text-slate-600 mb-1">
              Status
            </label>
            <select
              name="status"
              value={form.status}
              onChange={handleChange}
              className="w-full border rounded-lg px-3 py-2 text-xs bg-white outline-none focus:ring-1 focus:ring-blue-500"
            >
              <option value="Present">Present</option>
              <option value="Late">Late</option>
              <option value="Absent">Absent</option>
            </select>
          </div>
          <Field
            label="Check-in Time"
            name="checkInTime"
            type="time"
            value={form.checkInTime}
            onChange={handleChange}
          />
          <Field
            label="Check-out Time"
            name="checkOutTime"
            type="time"
            value={form.checkOutTime}
            onChange={handleChange}
          />

          <div className="md:col-span-2 flex justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={onCancel}
              className="px-4 py-2 rounded-lg border text-sm text-slate-600 hover:bg-slate-100"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={saving}
              className="px-5 py-2 rounded-lg bg-gradient-to-r from-blue-600 to-green-500 text-white text-sm font-semibold disabled:opacity-60"
            >
              {saving ? "Saving..." : "Save Attendance"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

function Field({ label, ...rest }) {
  return (
    <div>
      <label className="block text-xs font-medium text-slate-600 mb-1">
        {label}
      </label>
      <input
        className="w-full border rounded-lg px-3 py-2 text-xs bg-white outline-none focus:ring-1 focus:ring-blue-500"
        {...rest}
      />
    </div>
  );
}
