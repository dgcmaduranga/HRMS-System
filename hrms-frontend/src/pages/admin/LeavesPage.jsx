// src/pages/admin/LeavesPage.jsx
import { useMemo, useState } from "react";
import { FiSearch } from "react-icons/fi";
import { FaCheck, FaTimes, FaTrash, FaPlus } from "react-icons/fa";
import AdminLayout from "../../layouts/AdminLayout";

// EmployeeLeavesPage එකේ use කරන key එකම
const LS_KEY = "leaves";

export default function LeavesPage() {
  const [leaves, setLeaves] = useState(() => {
    try {
      if (typeof window === "undefined") return [];
      const raw = localStorage.getItem(LS_KEY);
      if (!raw) return [];
      const parsed = JSON.parse(raw);
      return Array.isArray(parsed) ? parsed : [];
    } catch (e) {
      console.error("Load leaves error", e);
      return [];
    }
  });

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [sortOrder, setSortOrder] = useState("latest");
  const [showCreate, setShowCreate] = useState(false);

  // ------ helpers ------
  const saveLeaves = (list) => {
    setLeaves(list);
    try {
      localStorage.setItem(LS_KEY, JSON.stringify(list));
    } catch (e) {
      console.error("Save leaves error", e);
    }
  };

  // ------ filter + sort ------
  const filteredLeaves = useMemo(() => {
    let list = Array.isArray(leaves) ? [...leaves] : [];

    if (search.trim()) {
      const s = search.toLowerCase();
      list = list.filter((lv) => {
        const name = lv.employeeName?.toLowerCase() || "";
        const empId = lv.employeeId?.toLowerCase() || "";
        const dept = lv.department?.toLowerCase() || "";
        const type = lv.type?.toLowerCase() || "";
        const reason = lv.reason?.toLowerCase() || "";
        return (
          name.includes(s) ||
          empId.includes(s) ||
          dept.includes(s) ||
          type.includes(s) ||
          reason.includes(s)
        );
      });
    }

    if (statusFilter !== "all") {
      list = list.filter((lv) => {
        const st = (lv.status || "pending").toLowerCase();
        return st === statusFilter;
      });
    }

    if (sortOrder === "latest") {
      list.sort(
        (a, b) =>
          new Date(b.createdAt || 0).getTime() -
          new Date(a.createdAt || 0).getTime()
      );
    } else if (sortOrder === "oldest") {
      list.sort(
        (a, b) =>
          new Date(a.createdAt || 0).getTime() -
          new Date(b.createdAt || 0).getTime()
      );
    } else if (sortOrder === "fromDate") {
      list.sort(
        (a, b) =>
          new Date(a.fromDate || 0).getTime() -
          new Date(b.fromDate || 0).getTime()
      );
    }

    return list;
  }, [leaves, search, statusFilter, sortOrder]);

  // ------ actions ------
  const handleCreate = (data) => {
    if (!data) return;
    const now = new Date().toISOString();

    const withMeta = {
      ...data,
      id:
        data.id ||
        (window.crypto?.randomUUID
          ? window.crypto.randomUUID()
          : Date.now().toString()),
      status: (data.status || "pending").toLowerCase(),
      createdAt: data.createdAt || now,
      updatedAt: now,
    };

    const newList = [withMeta, ...leaves];
    saveLeaves(newList);
    setShowCreate(false);
  };

  const updateStatus = (id, status) => {
    const list = leaves.map((lv) =>
      lv.id === id
        ? { ...lv, status: status.toLowerCase(), updatedAt: new Date().toISOString() }
        : lv
    );
    saveLeaves(list);
  };

  const deleteLeave = (id) => {
    if (!window.confirm("Delete this leave request?")) return;
    saveLeaves(leaves.filter((lv) => lv.id !== id));
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* TITLE ROW */}
        <div className="flex items-center justify-between">
          <h1 className="text-xl font-semibold">Manage Leaves</h1>

          <div className="flex items-center gap-4 text-xs">
            {/* STATUS FILTER */}
            <div className="flex items-center gap-2 text-slate-500">
              <span>Status:</span>
              <select
                className="border rounded-lg px-3 py-1 bg-white"
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
              >
                <option value="all">All</option>
                <option value="pending">Pending</option>
                <option value="approved">Approved</option>
                <option value="rejected">Rejected</option>
              </select>
            </div>

            {/* SORT */}
            <div className="flex items-center gap-2 text-slate-500">
              <span>Sort:</span>
              <select
                className="border rounded-lg px-3 py-1 bg-white"
                value={sortOrder}
                onChange={(e) => setSortOrder(e.target.value)}
              >
                <option value="latest">Latest first</option>
                <option value="oldest">Oldest first</option>
                <option value="fromDate">From date</option>
              </select>
            </div>

            {/* ADD LEAVE */}
            <button
              onClick={() => setShowCreate(true)}
              className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold 
                         bg-gradient-to-r from-blue-600 to-green-500 text-white shadow-sm hover:opacity-90"
            >
              <FaPlus className="text-xs" />
              Add Leave
            </button>
          </div>
        </div>

        {/* SEARCH */}
        <div className="bg-white rounded-2xl shadow-sm border px-4 py-3 flex items-center gap-3 max-w-xl">
          <FiSearch className="text-slate-400 text-lg" />
          <input
            type="text"
            placeholder="Search by employee, department, type or reason"
            className="flex-1 outline-none text-sm"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        {/* LIST */}
        {filteredLeaves.length === 0 ? (
          <p className="text-sm text-slate-500">No leave requests found.</p>
        ) : (
          <div className="space-y-3">
            {filteredLeaves.map((lv) => (
              <LeaveCard
                key={lv.id}
                leave={lv}
                onApprove={() => updateStatus(lv.id, "approved")}
                onReject={() => updateStatus(lv.id, "rejected")}
                onDelete={() => deleteLeave(lv.id)}
              />
            ))}
          </div>
        )}
      </div>

      {/* CREATE MODAL */}
      {showCreate && (
        <LeaveModal
          title="Create Leave"
          initial={{
            employeeName: "",
            employeeId: "",
            department: "",
            type: "Annual",
            fromDate: "",
            toDate: "",
            reason: "",
            status: "pending",
          }}
          onCancel={() => setShowCreate(false)}
          onSave={handleCreate}
        />
      )}
    </AdminLayout>
  );
}

/* ---------- Card Component ---------- */

function LeaveCard({ leave, onApprove, onReject, onDelete }) {
  const {
    employeeName, // data තියෙනවා, UI එකේ use කරන්නෙ නෑ
    employeeId,
    department,
    type,
    fromDate,
    toDate,
    reason,
    status = "pending",
  } = leave;

  const fromStr = fromDate ? new Date(fromDate).toLocaleDateString() : "-";
  const toStr = toDate ? new Date(toDate).toLocaleDateString() : "-";

  const days =
    fromDate && toDate
      ? Math.round(
          (new Date(toDate) - new Date(fromDate)) / (1000 * 60 * 60 * 24)
        ) + 1
      : 1;

  const statusLower = status.toLowerCase();

  const statusColor =
    statusLower === "approved"
      ? "bg-emerald-100 text-emerald-700"
      : statusLower === "rejected"
      ? "bg-red-100 text-red-700"
      : "bg-amber-100 text-amber-700"; // pending

  return (
    <div
      className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden"
      style={{ borderTopWidth: "4px", borderTopColor: "#22c55e" }}
    >
      <div className="flex items-center justify-between px-5 py-4">
        {/* LEFT */}
        <div className="space-y-1 text-sm">
          {/* 🔹 Name අයින් – ID විතරයි */}
          <p className="font-semibold text-slate-900">
            {employeeId || "Employee"}
          </p>

          <p className="text-xs text-slate-500">
            {department || "No department"} · {type || "Annual"} leave
          </p>
          <p className="text-xs text-slate-500">
            {fromStr} – {toStr} ({days} day{days > 1 ? "s" : ""})
          </p>
          {reason && (
            <p className="text-xs text-slate-500 line-clamp-2">
              Reason: {reason}
            </p>
          )}
        </div>

        {/* RIGHT */}
        <div className="flex items-center gap-3">
          <span
            className={`px-3 py-1 rounded-full text-[11px] font-medium ${statusColor}`}
          >
            {statusLower.charAt(0).toUpperCase() + statusLower.slice(1)}
          </span>

          <div className="flex items-center gap-2 text-xs">
            <button
              onClick={onApprove}
              className="flex items-center gap-1 px-3 py-1 rounded-full bg-emerald-500 text-white hover:bg-emerald-600"
            >
              <FaCheck /> Approve
            </button>
            <button
              onClick={onReject}
              className="flex items-center gap-1 px-3 py-1 rounded-full bg-amber-500 text-white hover:bg-amber-600"
            >
              <FaTimes /> Reject
            </button>
            <button
              onClick={onDelete}
              className="flex items-center gap-1 px-3 py-1 rounded-full bg-red-500 text-white hover:bg-red-600"
            >
              <FaTrash /> Delete
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ---------- Modal ---------- */

function LeaveModal({ title, initial, onCancel, onSave }) {
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
      type: form.type.trim(),
      reason: form.reason.trim(),
      status: (form.status || "pending").toLowerCase(),
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
            placeholder="e.g. Charith"
            value={form.employeeName}
            onChange={handleChange}
          />
          <Field
            label="Employee ID"
            name="employeeId"
            placeholder="e.g. EMP0009"
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
          <div>
            <label className="block text-xs font-medium text-slate-600 mb-1">
              Leave Type
            </label>
            <select
              name="type"
              value={form.type}
              onChange={handleChange}
              className="w-full border rounded-lg px-3 py-2 text-xs bg-white outline-none focus:ring-1 focus:ring-blue-500"
            >
              <option value="Annual">Annual</option>
              <option value="Casual">Casual</option>
              <option value="Medical">Medical</option>
              <option value="Other">Other</option>
            </select>
          </div>

          <Field
            label="From Date"
            name="fromDate"
            type="date"
            value={form.fromDate}
            onChange={handleChange}
          />
          <Field
            label="To Date"
            name="toDate"
            type="date"
            value={form.toDate}
            onChange={handleChange}
          />

          <div className="md:col-span-2">
            <label className="block text-xs font-medium text-slate-600 mb-1">
              Reason
            </label>
            <textarea
              name="reason"
              rows={3}
              placeholder="Short reason"
              value={form.reason}
              onChange={handleChange}
              className="w-full border rounded-lg px-3 py-2 text-xs bg-white outline-none focus:ring-1 focus:ring-blue-500 resize-none"
            />
          </div>

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
              {saving ? "Saving..." : "Save Leave"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

/* ---------- Small input ---------- */
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