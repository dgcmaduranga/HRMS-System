// src/pages/admin/EmployeesPage.jsx
import { useEffect, useMemo, useState } from "react";
import axios from "axios";
import { FiSearch } from "react-icons/fi";
import {
  FaDollarSign,
  FaEdit,
  FaEye,
  FaTrash,
  FaUserCircle,
} from "react-icons/fa";
import AdminLayout from "../../layouts/AdminLayout";

export default function EmployeesPage() {
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [sortOrder, setSortOrder] = useState("latest");
  const [showCreate, setShowCreate] = useState(false);

  const [viewEmployee, setViewEmployee] = useState(null);
  const [editEmployee, setEditEmployee] = useState(null);
  const [salaryEmployee, setSalaryEmployee] = useState(null);

  // ========= LOAD EMPLOYEES =========
  useEffect(() => {
    const fetchEmployees = async () => {
      try {
        const token = localStorage.getItem("token");
        const headers = { Authorization: `Bearer ${token}` };

        const res = await axios.get(
          "http://localhost:4000/api/admin/employees",
          { headers }
        );

        const data = res.data;
        const list = Array.isArray(data)
          ? data
          : Array.isArray(data.employees)
          ? data.employees
          : [];

        setEmployees(list);
      } catch (err) {
        console.error("Employees load error:", err.response?.data || err);
        alert("Failed to load employees");
      } finally {
        setLoading(false);
      }
    };

    fetchEmployees();
  }, []);

  // ========= SEARCH + SORT =========
  const filteredEmployees = useMemo(() => {
    const base = Array.isArray(employees) ? employees : [];
    let list = [...base];

    if (search.trim()) {
      const s = search.toLowerCase();
      list = list.filter((e) => {
        const name = e.name?.toLowerCase() || "";
        const email = e.email?.toLowerCase() || "";
        const dept = e.department?.toLowerCase() || "";
        const empId = e.employeeId?.toLowerCase() || "";
        return (
          name.includes(s) ||
          email.includes(s) ||
          dept.includes(s) ||
          empId.includes(s)
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
  }, [employees, search, sortOrder]);

  // ========= ACTIONS =========
  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this employee?"))
      return;

    try {
      const token = localStorage.getItem("token");
      const headers = { Authorization: `Bearer ${token}` };

      await axios.delete(
        `http://localhost:4000/api/admin/employees/${id}`,
        { headers }
      );

      setEmployees((prev) => prev.filter((e) => e._id !== id));
    } catch (err) {
      console.error("Delete error:", err.response?.data || err);
      alert("Failed to delete employee");
    }
  };

  const handleAddNew = () => setShowCreate(true);

  const handleEmployeeCreated = (created) => {
    if (!created) return;
    setEmployees((prev) => [created, ...prev]); // newest first
    setShowCreate(false);
  };

  const handleEmployeeUpdated = (updated) => {
    if (!updated) return;
    setEmployees((prev) =>
      prev.map((e) => (e._id === updated._id ? updated : e))
    );
    setEditEmployee(null);
  };

  const handleSalaryUpdated = (updated) => {
    if (!updated) return;
    setEmployees((prev) =>
      prev.map((e) => (e._id === updated._id ? updated : e))
    );
    setSalaryEmployee(null);
  };

  // ========= RENDER =========
  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* TITLE ROW */}
        <div className="flex items-center justify-between">
          <h1 className="text-xl font-semibold">Manage Employees</h1>

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

            {/* Add new */}
            <button
              onClick={handleAddNew}
              className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold 
                        bg-gradient-to-r from-blue-600 to-green-500 text-white shadow-sm hover:opacity-90"
            >
              <span className="text-lg leading-none">+</span>
              Add New Employee
            </button>
          </div>
        </div>

        {/* SEARCH BOX */}
        <div className="bg-white rounded-2xl shadow-sm border px-4 py-3 flex items-center gap-3 max-w-xl">
          <FiSearch className="text-slate-400 text-lg" />
          <input
            type="text"
            placeholder="Search by employee name or department"
            className="flex-1 outline-none text-sm"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        {/* LIST */}
        {loading ? (
          <p className="text-sm text-slate-500">Loading employees…</p>
        ) : filteredEmployees.length === 0 ? (
          <p className="text-sm text-slate-500">
            No employees found. Click &quot;Add New Employee&quot; to create one.
          </p>
        ) : (
          <div className="space-y-3">
            {filteredEmployees.map((emp) => (
              <EmployeeCard
                key={emp._id}
                emp={emp}
                onView={() => setViewEmployee(emp)}
                onEdit={() => setEditEmployee(emp)}
                onSalary={() => setSalaryEmployee(emp)}
                onDelete={() => handleDelete(emp._id)}
              />
            ))}
          </div>
        )}
      </div>

      {/* MODALS */}
      {showCreate && (
        <CreateEmployeeModal
          onClose={() => setShowCreate(false)}
          onCreated={handleEmployeeCreated}
        />
      )}

      {viewEmployee && (
        <ViewEmployeeModal
          employee={viewEmployee}
          onClose={() => setViewEmployee(null)}
        />
      )}

      {editEmployee && (
        <EditEmployeeModal
          employee={editEmployee}
          onClose={() => setEditEmployee(null)}
          onUpdated={handleEmployeeUpdated}
        />
      )}

      {salaryEmployee && (
        <SalaryModal
          employee={salaryEmployee}
          onClose={() => setSalaryEmployee(null)}
          onUpdated={handleSalaryUpdated}
        />
      )}
    </AdminLayout>
  );
}

// ========= EMPLOYEE CARD =========

function EmployeeCard({ emp, onView, onEdit, onSalary, onDelete }) {
  const name = emp.name || "Employee";
  const email = emp.email || "no-email@example.com";
  const dept = emp.department || "N/A";
  const position = emp.designation || emp.role || "Employee";
  const empId = emp.employeeId || emp._id?.slice(-6) || "—";
  const salaryStr = emp.salary
    ? `Rs ${Number(emp.salary).toLocaleString("en-LK")}`
    : "Rs 0";

  const initial = name.charAt(0).toUpperCase();

  // localStorage avatar read
  let avatarUrl = emp.avatarUrl || "";
  if (!avatarUrl && typeof window !== "undefined" && emp._id) {
    const stored = localStorage.getItem("avatar_" + emp._id);
    if (stored) avatarUrl = stored;
  }

  return (
    <div
      className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden"
      style={{ borderTopWidth: "4px", borderTopColor: "#a855f7" }}
    >
      <div className="flex items-center justify-between px-5 py-4">
        {/* left info */}
        <div className="flex items-center gap-4">
          {avatarUrl ? (
            <img
              src={avatarUrl}
              alt={name}
              className="w-12 h-12 rounded-full object-cover border"
            />
          ) : (
            <div className="w-12 h-12 rounded-full bg-slate-200 flex items-center justify-center text-slate-700 font-semibold text-lg">
              {initial}
            </div>
          )}

          <div className="text-sm">
            <p className="font-semibold text-slate-900">{name}</p>
            <p className="text-xs text-slate-500">
              {position} · ID: {empId}
            </p>
            <p className="text-xs text-slate-500">
              Dept: {dept} · Salary: {salaryStr}
            </p>
            <p className="text-xs text-blue-600">{email}</p>
          </div>
        </div>

        {/* actions */}
        <div className="flex items-center gap-2 text-xs">
          <button
            onClick={onView}
            className="flex items-center gap-1 px-3 py-1 rounded-full bg-sky-500 text-white hover:bg-sky-600"
          >
            <FaEye /> View
          </button>
          <button
            onClick={onEdit}
            className="flex items-center gap-1 px-3 py-1 rounded-full bg-amber-400 text-white hover:bg-amber-500"
          >
            <FaEdit /> Edit
          </button>
          <button
            onClick={onSalary}
            className="flex items-center gap-1 px-3 py-1 rounded-full bg-emerald-500 text-white hover:bg-emerald-600"
          >
            <FaDollarSign /> Salary
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

// ========= CREATE EMPLOYEE MODAL =========

function CreateEmployeeModal({ onClose, onCreated }) {
  const [form, setForm] = useState({
    name: "",
    email: "",
    employeeId: "",
    department: "",
    designation: "",
    salary: "",
    dob: "",
    gender: "",
    maritalStatus: "",
    password: "",
  });

  const [photoDataUrl, setPhotoDataUrl] = useState("");
  const [saving, setSaving] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handlePhotoChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = () => {
      setPhotoDataUrl(reader.result.toString());
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);

    try {
      const token = localStorage.getItem("token");
      const headers = {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      };

      const body = {
        name: form.name,
        email: form.email,
        employeeId: form.employeeId,
        department: form.department,
        designation: form.designation,
        salary: Number(form.salary) || 0,
        dob: form.dob,
        gender: form.gender,
        maritalStatus: form.maritalStatus,
        password: form.password,
      };

      const res = await axios.post(
        "http://localhost:4000/api/admin/employees",
        body,
        { headers }
      );

      let created = res.data?.employee || res.data;

      // avatar preview localStorage
      if (photoDataUrl && created?._id) {
        localStorage.setItem("avatar_" + created._id, photoDataUrl);
        created.avatarUrl = photoDataUrl;
      }

      alert("Employee created successfully!");
      onCreated(created);
    } catch (err) {
      console.error("Create employee error:", err.response?.data || err);
      alert(err.response?.data?.msg || "Failed to create employee");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-white w-full max-w-4xl rounded-2xl shadow-xl p-8 relative">
        <button
          onClick={onClose}
          className="absolute top-3 right-4 text-slate-400 hover:text-slate-600 text-xl"
        >
          ×
        </button>

        <h2 className="text-lg font-semibold mb-1">Create Employee Profile</h2>
        <div className="h-0.5 w-32 bg-slate-800 mb-6" />

        <form
          onSubmit={handleSubmit}
          className="grid grid-cols-1 md:grid-cols-3 gap-6"
        >
          {/* LEFT: PHOTO */}
          <div className="flex flex-col items-center gap-3">
            <div className="w-28 h-28 rounded-full bg-slate-100 flex items-center justify-center overflow-hidden">
              {photoDataUrl ? (
                <img
                  src={photoDataUrl}
                  alt={form.name || "avatar"}
                  className="w-full h-full object-cover"
                />
              ) : (
                <FaUserCircle className="text-slate-400 text-4xl" />
              )}
            </div>
            <label className="cursor-pointer px-4 py-2 rounded-full bg-slate-800 text-white text-xs font-semibold">
              Upload Photo
              <input
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handlePhotoChange}
              />
            </label>
            <p className="text-[11px] text-slate-400">
              JPG / PNG — square image looks best.
            </p>
          </div>

          {/* MIDDLE COL */}
          <div className="space-y-4 text-sm">
            <Field
              label="Name"
              name="name"
              placeholder="Enter full name"
              value={form.name}
              onChange={handleChange}
              required
            />
            <Field
              label="Employee ID"
              name="employeeId"
              placeholder="e.g. EMP001"
              value={form.employeeId}
              onChange={handleChange}
            />
            <Field
              label="Designation"
              name="designation"
              placeholder="e.g. Software Engineer"
              value={form.designation}
              onChange={handleChange}
            />
            <Field
              label="Salary (per month)"
              name="salary"
              type="number"
              placeholder="e.g. 60000"
              value={form.salary}
              onChange={handleChange}
            />
          </div>

          {/* RIGHT COL */}
          <div className="space-y-4 text-sm">
            <Field
              label="Email"
              name="email"
              type="email"
              placeholder="Enter email address"
              value={form.email}
              onChange={handleChange}
              required
            />
            <Field
              label="Date of Birth"
              name="dob"
              type="date"
              value={form.dob}
              onChange={handleChange}
            />
            <SelectField
              label="Gender"
              name="gender"
              value={form.gender}
              onChange={handleChange}
              options={["male", "female", "other"]}
              placeholder="Select gender"
            />
            <SelectField
              label="Marital Status"
              name="maritalStatus"
              value={form.maritalStatus}
              onChange={handleChange}
              options={["single", "married", "other"]}
              placeholder="Select status"
            />
            <Field
              label="Department"
              name="department"
              placeholder="e.g. IT / HR"
              value={form.department}
              onChange={handleChange}
            />
            <Field
              label="Initial Password"
              name="password"
              type="password"
              placeholder="default password for employee"
              value={form.password}
              onChange={handleChange}
            />
          </div>

          {/* BUTTONS */}
          <div className="md:col-span-3 flex justify-end gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-lg border text-sm text-slate-600 hover:bg-slate-100"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={saving}
              className="px-5 py-2 rounded-lg bg-gradient-to-r from-blue-600 to-green-500 text-white text-sm font-semibold disabled:opacity-60"
            >
              {saving ? "Saving..." : "Save Employee"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// ========= VIEW MODAL =========

function ViewEmployeeModal({ employee, onClose }) {
  const name = employee.name || "Employee";
  const email = employee.email || "no-email@example.com";
  const dept = employee.department || "N/A";
  const position = employee.designation || employee.role || "Employee";
  const empId = employee.employeeId || employee._id?.slice(-6) || "—";
  const salaryStr = employee.salary
    ? `Rs ${Number(employee.salary).toLocaleString("en-LK")}`
    : "Rs 0";

  let avatarUrl = employee.avatarUrl || "";
  if (!avatarUrl && typeof window !== "undefined" && employee._id) {
    const stored = localStorage.getItem("avatar_" + employee._id);
    if (stored) avatarUrl = stored;
  }

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-white w-full max-w-lg rounded-2xl shadow-xl p-6 relative">
        <button
          onClick={onClose}
          className="absolute top-3 right-4 text-slate-400 hover:text-slate-600 text-xl"
        >
          ×
        </button>

        <div className="flex flex-col items-center gap-3 mb-4">
          {avatarUrl ? (
            <img
              src={avatarUrl}
              alt={name}
              className="w-20 h-20 rounded-full object-cover border"
            />
          ) : (
            <div className="w-20 h-20 rounded-full bg-slate-200 flex items-center justify-center text-slate-700 font-semibold text-2xl">
              {name.charAt(0).toUpperCase()}
            </div>
          )}
          <h2 className="text-lg font-semibold">{name}</h2>
          <p className="text-xs text-slate-500">{position}</p>
        </div>

        <div className="space-y-2 text-sm">
          <Row label="Employee ID" value={empId} />
          <Row label="Email" value={email} />
          <Row label="Department" value={dept} />
          <Row
            label="Date of Birth"
            value={
              employee.dob
                ? new Date(employee.dob).toLocaleDateString()
                : "—"
            }
          />
          <Row
            label="Gender"
            value={employee.gender ? employee.gender.toUpperCase() : "—"}
          />
          <Row
            label="Marital Status"
            value={
              employee.maritalStatus
                ? employee.maritalStatus.toUpperCase()
                : "—"
            }
          />
          <Row label="Salary" value={salaryStr} />
          <Row label="Status" value={employee.status || "Active"} />
        </div>

        <div className="mt-5 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-lg border text-sm text-slate-600 hover:bg-slate-100"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}

// ========= EDIT MODAL =========

function EditEmployeeModal({ employee, onClose, onUpdated }) {
  const [form, setForm] = useState({
    name: employee.name || "",
    email: employee.email || "",
    department: employee.department || "",
    designation: employee.designation || employee.role || "",
    salary: employee.salary || "",
    dob: employee.dob ? employee.dob.slice(0, 10) : "",
    gender: employee.gender || "",
    maritalStatus: employee.maritalStatus || "",
    status: employee.status || "Active",
  });

  const [photoDataUrl, setPhotoDataUrl] = useState(() => {
    if (employee.avatarUrl) return employee.avatarUrl;
    if (typeof window !== "undefined" && employee._id) {
      return localStorage.getItem("avatar_" + employee._id) || "";
    }
    return "";
  });

  const [saving, setSaving] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handlePhotoChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = () => {
      setPhotoDataUrl(reader.result.toString());
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);

    try {
      const token = localStorage.getItem("token");
      const headers = { Authorization: `Bearer ${token}` };

      const body = {
        name: form.name,
        email: form.email,
        department: form.department,
        designation: form.designation,
        salary: Number(form.salary) || 0,
        dob: form.dob,
        gender: form.gender,
        maritalStatus: form.maritalStatus,
        status: form.status,
      };

      const res = await axios.put(
        `http://localhost:4000/api/admin/employees/${employee._id}`,
        body,
        { headers }
      );

      let updated = res.data?.employee || res.data;

      if (photoDataUrl && updated?._id) {
        localStorage.setItem("avatar_" + updated._id, photoDataUrl);
        updated.avatarUrl = photoDataUrl;
      }

      alert("Employee updated successfully!");
      onUpdated(updated);
    } catch (err) {
      console.error("Update employee error:", err.response?.data || err);
      alert(err.response?.data?.msg || "Failed to update employee");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-white w-full max-w-4xl rounded-2xl shadow-xl p-8 relative">
        <button
          onClick={onClose}
          className="absolute top-3 right-4 text-slate-400 hover:text-slate-600 text-xl"
        >
          ×
        </button>

        <h2 className="text-lg font-semibold mb-1">Edit Employee</h2>
        <div className="h-0.5 w-24 bg-slate-800 mb-6" />

        <form
          onSubmit={handleSubmit}
          className="grid grid-cols-1 md:grid-cols-3 gap-6"
        >
          {/* LEFT: PHOTO */}
          <div className="flex flex-col items-center gap-3">
            <div className="w-28 h-28 rounded-full bg-slate-100 flex items-center justify-center overflow-hidden">
              {photoDataUrl ? (
                <img
                  src={photoDataUrl}
                  alt={form.name}
                  className="w-full h-full object-cover"
                />
              ) : (
                <span className="text-slate-400 text-3xl">👤</span>
              )}
            </div>
            <label className="cursor-pointer px-4 py-2 rounded-full bg-slate-800 text-white text-xs font-semibold">
              Change Photo
              <input
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handlePhotoChange}
              />
            </label>
          </div>

          {/* MIDDLE COL */}
          <div className="space-y-4 text-sm">
            <Field
              label="Name"
              name="name"
              placeholder="Enter full name"
              value={form.name}
              onChange={handleChange}
              required
            />
            <Field
              label="Department"
              name="department"
              placeholder="e.g. IT / HR"
              value={form.department}
              onChange={handleChange}
            />
            <Field
              label="Designation"
              name="designation"
              placeholder="e.g. Software Engineer"
              value={form.designation}
              onChange={handleChange}
            />
            <Field
              label="Salary (per month)"
              name="salary"
              type="number"
              placeholder="e.g. 60000"
              value={form.salary}
              onChange={handleChange}
            />
          </div>

          {/* RIGHT COL */}
          <div className="space-y-4 text-sm">
            <Field
              label="Email"
              name="email"
              type="email"
              placeholder="Enter email address"
              value={form.email}
              onChange={handleChange}
              required
            />
            <Field
              label="Date of Birth"
              name="dob"
              type="date"
              value={form.dob}
              onChange={handleChange}
            />
            <SelectField
              label="Gender"
              name="gender"
              value={form.gender}
              onChange={handleChange}
              options={["male", "female", "other"]}
              placeholder="Select gender"
            />
            <SelectField
              label="Marital Status"
              name="maritalStatus"
              value={form.maritalStatus}
              onChange={handleChange}
              options={["single", "married", "other"]}
              placeholder="Select status"
            />
            <SelectField
              label="Status"
              name="status"
              value={form.status}
              onChange={handleChange}
              options={["Active", "Inactive"]}
              placeholder="Select status"
            />
          </div>

          {/* BUTTONS */}
          <div className="md:col-span-3 flex justify-end gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-lg border text-sm text-slate-600 hover:bg-slate-100"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={saving}
              className="px-5 py-2 rounded-lg bg-gradient-to-r from-blue-600 to-green-500 text-white text-sm font-semibold disabled:opacity-60"
            >
              {saving ? "Saving..." : "Save Changes"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// ========= SALARY MODAL =========

function SalaryModal({ employee, onClose, onUpdated }) {
  const [salary, setSalary] = useState(employee.salary || "");
  const [saving, setSaving] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);

    try {
      const token = localStorage.getItem("token");
      const headers = { Authorization: `Bearer ${token}` };

      const body = { salary: Number(salary) || 0 };

      const res = await axios.put(
        `http://localhost:4000/api/admin/employees/${employee._id}`,
        body,
        { headers }
      );

      const updated = res.data?.employee || res.data;
      alert("Salary updated successfully!");
      onUpdated(updated);
    } catch (err) {
      console.error("Salary update error:", err.response?.data || err);
      alert(err.response?.data?.msg || "Failed to update salary");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-white w-full max-w-md rounded-2xl shadow-xl p-6 relative">
        <button
          onClick={onClose}
          className="absolute top-3 right-4 text-slate-400 hover:text-slate-600 text-xl"
        >
          ×
        </button>

        <h2 className="text-lg font-semibold mb-1">Update Salary</h2>
        <p className="text-xs text-slate-500 mb-4">
          {employee.name} · {employee.department || "N/A"}
        </p>

        <form onSubmit={handleSubmit} className="space-y-4 text-sm">
          <Field
            label="Monthly Salary (Rs)"
            name="salary"
            type="number"
            placeholder="e.g. 80000"
            value={salary}
            onChange={(e) => setSalary(e.target.value)}
            required
          />

          <div className="flex justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-lg border text-sm text-slate-600 hover:bg-slate-100"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={saving}
              className="px-5 py-2 rounded-lg bg-gradient-to-r from-blue-600 to-green-500 text-white text-sm font-semibold disabled:opacity-60"
            >
              {saving ? "Saving..." : "Save Salary"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// ========= SMALL INPUT HELPERS =========

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

function SelectField({ label, options, placeholder, ...rest }) {
  return (
    <div>
      <label className="block text-xs font-medium text-slate-600 mb-1">
        {label}
      </label>
      <select
        className="w-full border rounded-lg px-3 py-2 text-xs bg-white outline-none focus:ring-1 focus:ring-blue-500"
        {...rest}
      >
        <option value="">{placeholder}</option>
        {options.map((opt) => (
          <option key={opt} value={opt}>
            {opt}
          </option>
        ))}
      </select>
    </div>
  );
}

function Row({ label, value }) {
  return (
    <div className="flex justify-between text-xs text-slate-600 border-b py-1">
      <span className="font-medium">{label}</span>
      <span className="text-slate-800">{value}</span>
    </div>
  );
}
