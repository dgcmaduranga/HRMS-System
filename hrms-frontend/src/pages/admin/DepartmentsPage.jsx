// src/pages/admin/DepartmentsPage.jsx
import { useEffect, useMemo, useState } from "react";
import axios from "axios";
import { FiSearch } from "react-icons/fi";
import { FaPlus, FaEdit, FaTrash } from "react-icons/fa";
import AdminLayout from "../../layouts/AdminLayout";

export default function DepartmentsPage() {
  const [departments, setDepartments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [sortOrder, setSortOrder] = useState("latest");
  const [showCreate, setShowCreate] = useState(false);
  const [editDept, setEditDept] = useState(null);

  // ===== LOAD FROM BACKEND =====
  useEffect(() => {
    const fetchDepartments = async () => {
      try {
        const token = localStorage.getItem("token");
        const headers = { Authorization: `Bearer ${token}` };

        const res = await axios.get(
          "http://localhost:4000/api/admin/departments",
          { headers }
        );

        const data = res.data;
        const list = Array.isArray(data)
          ? data
          : Array.isArray(data.departments)
          ? data.departments
          : [];

        setDepartments(list);
      } catch (err) {
        console.error("Get departments error:", err.response?.data || err);
        alert("Failed to load departments");
      } finally {
        setLoading(false);
      }
    };

    fetchDepartments();
  }, []);

  // ===== FILTER + SORT =====
  const filteredDepartments = useMemo(() => {
    const base = Array.isArray(departments) ? departments : [];
    let list = [...base];

    if (search.trim()) {
      const s = search.toLowerCase();
      list = list.filter((d) => {
        const name = d.name?.toLowerCase() || "";
        const code = d.code?.toLowerCase() || "";
        const head = d.head?.toLowerCase() || "";
        const status = d.status?.toLowerCase() || "";
        return (
          name.includes(s) ||
          code.includes(s) ||
          head.includes(s) ||
          status.includes(s)
        );
      });
    }

    if (sortOrder === "name") {
      list.sort((a, b) => (a.name || "").localeCompare(b.name || ""));
    } else if (sortOrder === "latest") {
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
    }

    return list;
  }, [departments, search, sortOrder]);

  // ===== CREATE / UPDATE / DELETE =====

  const handleCreate = async (department) => {
    if (!department) return;

    try {
      const token = localStorage.getItem("token");
      const headers = { Authorization: `Bearer ${token}` };

      const body = {
        name: department.name,
        code: department.code,
        head: department.head,
        status: department.status || "Active",
        description: department.description || "",
      };

      const res = await axios.post(
        "http://localhost:4000/api/admin/departments",
        body,
        { headers }
      );

      const created = res.data?.department || res.data;

      setDepartments((prev) => [created, ...prev]);
      alert("Department created successfully!");
      setShowCreate(false);
    } catch (err) {
      console.error("Create department error:", err.response?.data || err);
      alert(err.response?.data?.msg || "Failed to create department");
    }
  };

  const handleUpdate = async (updated) => {
    if (!updated || !updated._id) return;

    try {
      const token = localStorage.getItem("token");
      const headers = { Authorization: `Bearer ${token}` };

      const body = {
        name: updated.name,
        code: updated.code,
        head: updated.head,
        status: updated.status || "Active",
        description: updated.description || "",
      };

      const res = await axios.put(
        `http://localhost:4000/api/admin/departments/${updated._id}`,
        body,
        { headers }
      );

      const saved = res.data?.department || res.data;

      setDepartments((prev) =>
        prev.map((d) => (d._id === saved._id ? saved : d))
      );
      alert("Department updated successfully!");
      setEditDept(null);
    } catch (err) {
      console.error("Update department error:", err.response?.data || err);
      alert(err.response?.data?.msg || "Failed to update department");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this department?"))
      return;

    try {
      const token = localStorage.getItem("token");
      const headers = { Authorization: `Bearer ${token}` };

      await axios.delete(
        `http://localhost:4000/api/admin/departments/${id}`,
        { headers }
      );

      setDepartments((prev) => prev.filter((d) => d._id !== id));
      alert("Department deleted");
    } catch (err) {
      console.error("Delete department error:", err.response?.data || err);
      alert(err.response?.data?.msg || "Failed to delete department");
    }
  };

  // ===== RENDER =====
  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* TITLE ROW */}
        <div className="flex items-center justify-between">
          <h1 className="text-xl font-semibold">Manage Departments</h1>

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
                <option value="name">Name A–Z</option>
              </select>
            </div>

            {/* Add New */}
            <button
              onClick={() => setShowCreate(true)}
              className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold 
                         bg-gradient-to-r from-blue-600 to-green-500 text-white shadow-sm hover:opacity-90"
            >
              <FaPlus className="text-xs" />
              Add New Department
            </button>
          </div>
        </div>

        {/* SEARCH BAR */}
        <div className="bg-white rounded-2xl shadow-sm border px-4 py-3 flex items-center gap-3 max-w-xl">
          <FiSearch className="text-slate-400 text-lg" />
          <input
            type="text"
            placeholder="Search by department name, code or head"
            className="flex-1 outline-none text-sm"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        {/* LIST */}
        {loading ? (
          <p className="text-sm text-slate-500">Loading departments…</p>
        ) : filteredDepartments.length === 0 ? (
          <p className="text-sm text-slate-500">
            No departments found. Click &quot;Add New Department&quot; to create
            one.
          </p>
        ) : (
          <div className="space-y-3">
            {filteredDepartments.map((dept) => (
              <DepartmentCard
                key={dept._id}
                dept={dept}
                onEdit={() => setEditDept(dept)}
                onDelete={() => handleDelete(dept._id)}
              />
            ))}
          </div>
        )}
      </div>

      {/* MODALS */}
      {showCreate && (
        <DepartmentModal
          title="Create Department"
          initial={{
            name: "",
            code: "",
            head: "",
            status: "Active",
            description: "",
          }}
          onCancel={() => setShowCreate(false)}
          onSave={handleCreate}
        />
      )}

      {editDept && (
        <DepartmentModal
          title="Edit Department"
          initial={editDept}
          onCancel={() => setEditDept(null)}
          onSave={handleUpdate}
        />
      )}
    </AdminLayout>
  );
}

// ===== DEPARTMENT CARD UI =====
function DepartmentCard({ dept, onEdit, onDelete }) {
  const { name, code, head, status, description } = dept;

  const statusColor =
    status === "Active"
      ? "bg-emerald-100 text-emerald-700"
      : "bg-slate-100 text-slate-700";

  return (
    <div
      className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden"
      style={{ borderTopWidth: "4px", borderTopColor: "#3b82f6" }}
    >
      <div className="flex items-center justify-between px-5 py-4">
        {/* LEFT INFO */}
        <div className="space-y-1 text-sm">
          <p className="font-semibold text-slate-900">
            {name || "Unnamed Department"}
          </p>
          <p className="text-xs text-slate-500">
            Code: <span className="font-medium text-slate-700">{code || "—"}</span>{" "}
            · Head: <span className="font-medium text-slate-700">{head || "—"}</span>
          </p>
          {description && (
            <p className="text-xs text-slate-500 line-clamp-2">
              {description}
            </p>
          )}
        </div>

        {/* RIGHT SIDE */}
        <div className="flex items-center gap-3">
          <span
            className={`px-3 py-1 rounded-full text-[11px] font-medium ${statusColor}`}
          >
            {status || "Active"}
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
    </div>
  );
}

// ===== MODAL COMPONENT (Create / Edit) =====
function DepartmentModal({ title, initial, onCancel, onSave }) {
  const [form, setForm] = useState({
    _id: initial._id,
    name: initial.name || "",
    code: initial.code || "",
    head: initial.head || "",
    status: initial.status || "Active",
    description: initial.description || "",
  });

  const [saving, setSaving] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);

    const trimmed = {
      ...form,
      name: form.name.trim(),
      code: form.code.trim(),
      head: form.head.trim(),
      description: form.description.trim(),
    };

    await onSave(trimmed);
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
            label="Department Name"
            name="name"
            placeholder="e.g. IT"
            value={form.name}
            onChange={handleChange}
            required
          />
          <Field
            label="Department Code"
            name="code"
            placeholder="e.g. D001"
            value={form.code}
            onChange={handleChange}
          />
          <Field
            label="Head of Department"
            name="head"
            placeholder="e.g. John Doe"
            value={form.head}
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
              <option value="Active">Active</option>
              <option value="Inactive">Inactive</option>
            </select>
          </div>

          <div className="md:col-span-2">
            <label className="block text-xs font-medium text-slate-600 mb-1">
              Description
            </label>
            <textarea
              name="description"
              rows={3}
              placeholder="Short description about this department"
              value={form.description}
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
              {saving ? "Saving..." : "Save Department"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// ===== SMALL INPUT COMPONENT =====
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
