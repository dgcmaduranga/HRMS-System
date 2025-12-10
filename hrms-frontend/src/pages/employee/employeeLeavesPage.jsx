// src/pages/employee/EmployeeLeavesPage.jsx
import { useEffect, useMemo, useState } from "react";
import EmployeeLayout from "../../layouts/EmployeeLayout";
import { FiSearch, FiClock, FiCheckCircle, FiXCircle } from "react-icons/fi";
import { FaCalendarPlus, FaEdit, FaTrash } from "react-icons/fa";

const LS_KEY = "leaves"; // ⬅️ ADMIN PAGE එකේ ഉള്ള එකම key

export default function EmployeeLeavesPage() {
  // ─── current logged employee (login වෙද්දි set කළ "employeeUser") ───
  const [employee, setEmployee] = useState(null);

  useEffect(() => {
    try {
      const raw = localStorage.getItem("employeeUser");
      if (!raw) return;
      const e = JSON.parse(raw);
      setEmployee(e);
    } catch (err) {
      console.error("Load employeeUser error:", err);
    }
  }, []);

  // ─── all leaves from localStorage (employees + admin) ───
  const [allLeaves, setAllLeaves] = useState(() => {
    try {
      if (typeof window === "undefined") return [];
      const raw = localStorage.getItem(LS_KEY);
      if (!raw) return [];
      const parsed = JSON.parse(raw);
      return Array.isArray(parsed) ? parsed : [];
    } catch (err) {
      console.error("Load leaves from localStorage error:", err);
      return [];
    }
  });

  const [search, setSearch] = useState("");
  const [sortOrder, setSortOrder] = useState("latest");
  const [showCreate, setShowCreate] = useState(false);
  const [editLeave, setEditLeave] = useState(null);

  // save helper → **ALL** leaves save කරන එක
  const saveAllLeaves = (list) => {
    setAllLeaves(list);
    try {
      localStorage.setItem(LS_KEY, JSON.stringify(list));
    } catch (err) {
      console.error("Save leaves to localStorage error:", err);
    }
  };

  // ─── employeeට අයත් leaves පමණක් filter කරගන්න ───
  const myLeaves = useMemo(() => {
    if (!employee) return [];

    const empEmail = (employee.email || "").toLowerCase();
    const empId = (employee.employeeId || "").toLowerCase();
    const empName = (employee.name || "").toLowerCase();

    return allLeaves.filter((l) => {
      const lEmail = (l.employeeEmail || "").toLowerCase();
      const lId = (l.employeeId || "").toLowerCase();
      const lName = (l.employeeName || "").toLowerCase();

      return (
        (empEmail && lEmail === empEmail) ||
        (empId && lId === empId) ||
        (empName && lName === empName)
      );
    });
  }, [allLeaves, employee]);

  // ─── STATS ───
  const stats = useMemo(() => {
    const total = myLeaves.length;
    const approved = myLeaves.filter(
      (l) => (l.status || "").toLowerCase() === "approved"
    ).length;
    const pending = myLeaves.filter(
      (l) => (l.status || "").toLowerCase() === "pending"
    ).length;
    const rejected = myLeaves.filter(
      (l) => (l.status || "").toLowerCase() === "rejected"
    ).length;
    return { total, approved, pending, rejected };
  }, [myLeaves]);

  // ─── FILTER + SORT (ui list එකට) ───
  const filteredLeaves = useMemo(() => {
    let list = [...myLeaves];

    if (search.trim()) {
      const s = search.toLowerCase();
      list = list.filter((l) => {
        const type = l.type?.toLowerCase() || "";
        const status = l.status?.toLowerCase() || "";
        const reason = l.reason?.toLowerCase() || "";
        return type.includes(s) || status.includes(s) || reason.includes(s);
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
    } else if (sortOrder === "upcoming") {
      list.sort(
        (a, b) =>
          new Date(a.fromDate || 0).getTime() -
          new Date(b.fromDate || 0).getTime()
      );
    }

    return list;
  }, [myLeaves, search, sortOrder]);

  // ─── ID generator (crypto වැරදි වුනාමත් ක්‍රියා කරන්න) ───
  const makeId = () => `lv_${Date.now()}_${Math.floor(Math.random() * 100000)}`;

  // ─── HANDLERS ───
  const handleCreate = (leave) => {
    if (!leave || !employee) return;

    const now = new Date().toISOString();
    const newLeave = {
      // employee info auto-fill (adminට බලන්න)
      employeeName: employee.name || "Employee",
      employeeEmail: employee.email || "",
      employeeId: employee.employeeId || leave.employeeId || "",
      department: employee.department || leave.department || "No department",

      // form data
      ...leave,

      id: makeId(),
      status: (leave.status || "pending").toLowerCase(),
      createdAt: now,
      updatedAt: now,
    };

    saveAllLeaves([newLeave, ...allLeaves]);
    setShowCreate(false);
  };

  const handleUpdate = (updated) => {
    if (!updated) return;
    const list = allLeaves.map((l) =>
      l.id === updated.id
        ? {
            ...l,
            ...updated,
            status: (updated.status || l.status || "pending").toLowerCase(),
            updatedAt: new Date().toISOString(),
          }
        : l
    );
    saveAllLeaves(list);
    setEditLeave(null);
  };

  const handleDelete = (id) => {
    if (!window.confirm("Are you sure you want to delete this leave request?"))
      return;
    const list = allLeaves.filter((l) => l.id !== id);
    saveAllLeaves(list);
  };

  return (
    <EmployeeLayout>
      <div className="space-y-8">
        {/* HEADER */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-xl font-semibold">My Leaves</h1>
            <p className="text-xs text-slate-500">
              View and manage your leave requests.
            </p>
          </div>

          <div className="flex items-center gap-4">
            {/* Sort */}
            <div className="flex items-center text-xs text-slate-500 gap-2">
              <span>Sort:</span>
              <select
                className="border rounded-lg px-3 py-1 text-xs bg-white"
                value={sortOrder}
                onChange={(e) => setSortOrder(e.target.value)}
              >
                <option value="latest">Latest first</option>
                <option value="oldest">Oldest first</option>
                <option value="upcoming">Upcoming first</option>
              </select>
            </div>

            {/* Add new leave */}
            <button
              onClick={() => setShowCreate(true)}
              className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold 
                         bg-gradient-to-r from-blue-600 to-green-500 text-white shadow-sm hover:opacity-90"
            >
              <FaCalendarPlus className="text-xs" />
              Apply for Leave
            </button>
          </div>
        </div>

        {/* SEARCH */}
        <div className="bg-white rounded-2xl shadow-sm border px-4 py-3 flex items-center gap-3 max-w-xl">
          <FiSearch className="text-slate-400 text-lg" />
          <input
            type="text"
            placeholder="Search by type, status or reason"
            className="flex-1 outline-none text-sm"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        {/* STATS */}
        <section>
          <h2 className="text-sm font-semibold text-slate-700 mb-3">
            Leave Summary
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <SummaryCard
              label="Leaves Applied"
              value={stats.total}
              icon={<FiClock />}
              color="bg-orange-50 text-orange-600 border-orange-200"
            />
            <SummaryCard
              label="Leaves Approved"
              value={stats.approved}
              icon={<FiCheckCircle />}
              color="bg-emerald-50 text-emerald-600 border-emerald-200"
            />
            <SummaryCard
              label="Leaves Pending"
              value={stats.pending}
              icon={<FiClock />}
              color="bg-amber-50 text-amber-600 border-amber-200"
            />
            <SummaryCard
              label="Leaves Rejected"
              value={stats.rejected}
              icon={<FiXCircle />}
              color="bg-red-50 text-red-600 border-red-200"
            />
          </div>
        </section>

        {/* LIST */}
        <section>
          <h2 className="text-sm font-semibold text-slate-700 mb-3">
            Leave History
          </h2>

          {filteredLeaves.length === 0 ? (
            <p className="text-xs text-slate-500">
              No leave requests found. Click{" "}
              <span className="font-semibold">Apply for Leave</span> to create
              one.
            </p>
          ) : (
            <div className="space-y-3">
              {filteredLeaves.map((leave) => (
                <LeaveCard
                  key={leave.id}
                  leave={leave}
                  onEdit={() => setEditLeave(leave)}
                  onDelete={() => handleDelete(leave.id)}
                />
              ))}
            </div>
          )}
        </section>
      </div>

      {/* MODALS */}
      {showCreate && (
        <LeaveModal
          title="Apply for Leave"
          initial={{
            type: "Annual",
            fromDate: "",
            toDate: "",
            reason: "",
            status: "pending",
            employeeId: employee?.employeeId || "",
            department: employee?.department || "",
          }}
          onCancel={() => setShowCreate(false)}
          onSave={handleCreate}
        />
      )}

      {editLeave && (
        <LeaveModal
          title="Edit Leave Request"
          initial={editLeave}
          onCancel={() => setEditLeave(null)}
          onSave={handleUpdate}
        />
      )}
    </EmployeeLayout>
  );
}

/* ---------- Small components ---------- */

function SummaryCard({ label, value, icon, color }) {
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

function LeaveCard({ leave, onEdit, onDelete }) {
  const { type, fromDate, toDate, status, reason } = leave;

  const from = fromDate ? new Date(fromDate) : null;
  const to = toDate ? new Date(toDate) : null;

  let days = "-";
  if (from && to && !isNaN(from) && !isNaN(to)) {
    const diff =
      (to.setHours(0, 0, 0, 0) - from.setHours(0, 0, 0, 0)) /
        (1000 * 60 * 60 * 24) +
      1;
    days = diff > 0 ? diff : 1;
  }

  const statusLower = (status || "pending").toLowerCase();
  const statusColor =
    statusLower === "approved"
      ? "bg-emerald-100 text-emerald-700"
      : statusLower === "rejected"
      ? "bg-red-100 text-red-700"
      : statusLower === "cancelled"
      ? "bg-slate-100 text-slate-700"
      : "bg-amber-100 text-amber-700";

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-100 px-5 py-4 flex flex-col md:flex-row md:items-center md:justify-between gap-3">
      <div>
        <p className="text-sm font-semibold text-slate-900">
          {type || "Leave"}
        </p>
        <p className="text-xs text-slate-500">
          {fromDate || "—"} {toDate && "→"} {toDate || ""}
          {days !== "-" && (
            <span className="ml-2 text-[11px] text-slate-400">
              ({days} day{days === 1 ? "" : "s"})
            </span>
          )}
        </p>
        {reason && (
          <p className="text-xs text-slate-500 mt-1 line-clamp-2">
            Reason: {reason}
          </p>
        )}
      </div>

      <div className="flex items-center gap-3 justify-between md:justify-end">
        <span
          className={`px-3 py-1 rounded-full text-[11px] font-medium ${statusColor}`}
        >
          {statusLower.charAt(0).toUpperCase() + statusLower.slice(1)}
        </span>

        <div className="flex items-center gap-2 text-xs">
          <button
            onClick={onEdit}
            className="flex items-center gap-1 px-3 py-1 rounded-full bg-amber-400 text-white hover:bg-amber-500"
          >
            <FaEdit /> Edit
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
  );
}

function LeaveModal({ title, initial, onCancel, onSave }) {
  const [form, setForm] = useState({
    id: initial.id,
    type: initial.type || "Annual",
    fromDate: initial.fromDate || "",
    toDate: initial.toDate || "",
    reason: initial.reason || "",
    status: initial.status || "pending",
    employeeId: initial.employeeId || "",
    department: initial.department || "",
    createdAt: initial.createdAt,
    updatedAt: initial.updatedAt,
  });

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
      type: form.type.trim(),
      reason: form.reason.trim(),
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
          {/* Employee ID */}
          <Field label="Employee ID">
            <input
              type="text"
              name="employeeId"
              value={form.employeeId}
              onChange={handleChange}
              placeholder="e.g. EMP0009"
              className="w-full border rounded-lg px-3 py-2 text-xs bg-white outline-none focus:ring-1 focus:ring-blue-500"
            />
          </Field>

          {/* Department */}
          <Field label="Department">
            <input
              type="text"
              name="department"
              value={form.department}
              onChange={handleChange}
              placeholder="e.g. IT"
              className="w-full border rounded-lg px-3 py-2 text-xs bg-white outline-none focus:ring-1 focus:ring-blue-500"
            />
          </Field>

          <Field label="Leave Type">
            <select
              name="type"
              value={form.type}
              onChange={handleChange}
              className="w-full border rounded-lg px-3 py-2 text-xs bg-white outline-none focus:ring-1 focus:ring-blue-500"
            >
              <option value="Annual">Annual Leave</option>
              <option value="Casual">Casual Leave</option>
              <option value="Sick">Sick Leave</option>
              <option value="Half Day">Half Day</option>
              <option value="Other">Other</option>
            </select>
          </Field>

          <Field label="Status">
            <select
              name="status"
              value={form.status}
              onChange={handleChange}
              className="w-full border rounded-lg px-3 py-2 text-xs bg-white outline-none focus:ring-1 focus:ring-blue-500"
            >
              <option value="pending">Pending</option>
              <option value="approved">Approved</option>
              <option value="rejected">Rejected</option>
              <option value="cancelled">Cancelled</option>
            </select>
          </Field>

          <Field label="From Date">
            <input
              type="date"
              name="fromDate"
              value={form.fromDate}
              onChange={handleChange}
              className="w-full border rounded-lg px-3 py-2 text-xs bg-white outline-none focus:ring-1 focus:ring-blue-500"
              required
            />
          </Field>

          <Field label="To Date">
            <input
              type="date"
              name="toDate"
              value={form.toDate}
              onChange={handleChange}
              className="w-full border rounded-lg px-3 py-2 text-xs bg-white outline-none focus:ring-1 focus:ring-blue-500"
              required
            />
          </Field>

          <div className="md:col-span-2">
            <Field label="Reason">
              <textarea
                name="reason"
                rows={3}
                placeholder="Brief description of your leave request"
                value={form.reason}
                onChange={handleChange}
                className="w-full border rounded-lg px-3 py-2 text-xs bg-white outline-none focus:ring-1 focus:ring-blue-500 resize-none"
              />
            </Field>
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

function Field({ label, children }) {
  return (
    <div>
      <label className="block text-xs font-medium text-slate-600 mb-1">
        {label}
      </label>
      {children}
    </div>
  );
}