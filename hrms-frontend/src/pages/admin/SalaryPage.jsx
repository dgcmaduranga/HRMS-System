// src/pages/admin/SalaryPage.jsx
import { useMemo, useState } from "react";
import { FiSearch } from "react-icons/fi";
import { FaPlus, FaTrash, FaMoneyBillWave } from "react-icons/fa";
import AdminLayout from "../../layouts/AdminLayout";

// 👇 Admin & Employee දෙන්නම share කරගන්න single key එක
const SALARY_LS_KEY = "hrms_salaries";

export default function SalaryPage() {
  const [salaries, setSalaries] = useState(() => {
    try {
      if (typeof window === "undefined") return [];
      const raw = localStorage.getItem(SALARY_LS_KEY);
      if (!raw) return [];
      const parsed = JSON.parse(raw);
      return Array.isArray(parsed) ? parsed : [];
    } catch (e) {
      console.error("Load salaries error", e);
      return [];
    }
  });

  const [search, setSearch] = useState("");
  const [monthFilter, setMonthFilter] = useState("");
  const [yearFilter, setYearFilter] = useState("");
  const [showCreate, setShowCreate] = useState(false);

  const saveSalaries = (list) => {
    setSalaries(list);
    try {
      localStorage.setItem(SALARY_LS_KEY, JSON.stringify(list));
    } catch (e) {
      console.error("Save salaries error", e);
    }
  };

  const filtered = useMemo(() => {
    let list = [...salaries];

    if (search.trim()) {
      const s = search.toLowerCase();
      list = list.filter((sal) => {
        const name = sal.employeeName?.toLowerCase() || "";
        const empId = sal.employeeId?.toLowerCase() || "";
        const dept = sal.department?.toLowerCase() || "";
        const email = sal.employeeEmail?.toLowerCase() || "";
        return (
          name.includes(s) ||
          empId.includes(s) ||
          dept.includes(s) ||
          email.includes(s)
        );
      });
    }

    if (monthFilter) {
      list = list.filter((s) => String(s.month || "") === monthFilter);
    }
    if (yearFilter) {
      list = list.filter((s) => String(s.year || "") === yearFilter);
    }

    list.sort((a, b) => {
      const keyA = `${a.year || ""}-${a.month || ""}`;
      const keyB = `${b.year || ""}-${b.month || ""}`;
      return keyB.localeCompare(keyA);
    });

    return list;
  }, [salaries, search, monthFilter, yearFilter]);

  const handleCreate = (data) => {
    if (!data) return;
    const now = new Date().toISOString();

    const basic = Number(data.basicSalary) || 0;
    const allowances = Number(data.allowances) || 0;
    const deductions = Number(data.deductions) || 0;
    const net = basic + allowances - deductions;

    const withMeta = {
      ...data,
      basicSalary: basic,
      allowances,
      deductions,
      netSalary: net,
      id: crypto.randomUUID ? crypto.randomUUID() : Date.now().toString(),
      createdAt: now,
      updatedAt: now,
    };

    saveSalaries([withMeta, ...salaries]);
    setShowCreate(false);
  };

  const deleteSalary = (id) => {
    if (!window.confirm("Delete this salary record?")) return;
    saveSalaries(salaries.filter((s) => s.id !== id));
  };

  const totalForFilters = filtered.reduce(
    (sum, s) => sum + (Number(s.netSalary) || 0),
    0
  );

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Title row */}
        <div className="flex items-center justify-between">
          <h1 className="text-xl font-semibold">Manage Salary</h1>

          <div className="flex items-center gap-4 text-xs">
            <div className="hidden md:flex items-center gap-2 text-slate-500">
              <span>Total Net:</span>
              <span className="font-semibold text-emerald-600">
                Rs{" "}
                {totalForFilters.toLocaleString("en-LK", {
                  maximumFractionDigits: 2,
                })}
              </span>
            </div>

            <button
              onClick={() => setShowCreate(true)}
              className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold 
                         bg-gradient-to-r from-blue-600 to-green-500 text-white shadow-sm hover:opacity-90"
            >
              <FaPlus className="text-xs" />
              Add Salary
            </button>
          </div>
        </div>

        {/* Filters */}
        <div className="flex flex-col md:flex-row gap-4 md:items-center">
          <div className="bg-white rounded-2xl shadow-sm border px-4 py-3 flex items-center gap-3 max-w-xl flex-1">
            <FiSearch className="text-slate-400 text-lg" />
            <input
              type="text"
              placeholder="Search by employee, ID, department or email"
              className="flex-1 outline-none text-sm"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          <div className="flex items-center gap-2 text-xs text-slate-500">
            <span>Month:</span>
            <select
              className="border rounded-lg px-3 py-2 text-xs bg-white outline-none focus:ring-1 focus:ring-blue-500"
              value={monthFilter}
              onChange={(e) => setMonthFilter(e.target.value)}
            >
              <option value="">All</option>
              {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map((m) => (
                <option key={m} value={m}>
                  {m.toString().padStart(2, "0")}
                </option>
              ))}
            </select>

            <span>Year:</span>
            <input
              type="number"
              className="border rounded-lg px-3 py-2 text-xs bg-white outline-none focus:ring-1 focus:ring-blue-500 w-24"
              value={yearFilter}
              onChange={(e) => setYearFilter(e.target.value)}
              placeholder="2025"
            />
          </div>
        </div>

        {/* List */}
        {filtered.length === 0 ? (
          <p className="text-sm text-slate-500">No salary records found.</p>
        ) : (
          <div className="space-y-3">
            {filtered.map((s) => (
              <SalaryCard
                key={s.id}
                salary={s}
                onDelete={() => deleteSalary(s.id)}
              />
            ))}
          </div>
        )}
      </div>

      {showCreate && (
        <SalaryModal
          title="Add Salary"
          initial={{
            employeeName: "",
            employeeId: "",
            employeeEmail: "",
            department: "",
            month: new Date().getMonth() + 1,
            year: new Date().getFullYear(),
            basicSalary: "10000", // ⬅️ default basic salary
            allowances: "",
            deductions: "",
          }}
          onCancel={() => setShowCreate(false)}
          onSave={handleCreate}
        />
      )}
    </AdminLayout>
  );
}

function SalaryCard({ salary, onDelete }) {
  const {
    employeeName,
    employeeId,
    employeeEmail,
    department,
    month,
    year,
    basicSalary,
    allowances,
    deductions,
    netSalary,
  } = salary;

  const money = (v) =>
    `Rs ${Number(v || 0).toLocaleString("en-LK", {
      maximumFractionDigits: 2,
    })}`;

  return (
    <div
      className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden"
      style={{ borderTopWidth: "4px", borderTopColor: "#f97316" }}
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
            {department || "No department"} · {month?.toString().padStart(2, "0")}
            /{year}
          </p>
          {employeeEmail && (
            <p className="text-xs text-slate-500">{employeeEmail}</p>
          )}
          <p className="text-xs text-slate-500">
            Basic: {money(basicSalary)} · Allowances: {money(allowances)} ·
            Deductions: {money(deductions)}
          </p>
          <p className="text-xs font-semibold text-emerald-600">
            Net Salary: {money(netSalary)}
          </p>
        </div>

        <button
          onClick={onDelete}
          className="flex items-center gap-1 px-3 py-1 rounded-full bg-red-500 text-white text-xs hover:bg-red-600"
        >
          <FaTrash /> Delete
        </button>
      </div>
    </div>
  );
}

function SalaryModal({ title, initial, onCancel, onSave }) {
  const [form, setForm] = useState(initial);
  const [saving, setSaving] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setSaving(true);
    onSave(form);
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

        <h2 className="text-lg font-semibold mb-1">
          <FaMoneyBillWave className="inline mr-2" />
          {title}
        </h2>
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
            label="Employee Email"
            name="employeeEmail"
            placeholder="e.g. prakash@example.com"
            value={form.employeeEmail}
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
            label="Month (1-12)"
            name="month"
            type="number"
            value={form.month}
            onChange={handleChange}
          />
          <Field
            label="Year"
            name="year"
            type="number"
            value={form.year}
            onChange={handleChange}
          />

          <Field
            label="Basic Salary"
            name="basicSalary"
            type="number"
            value={form.basicSalary}
            onChange={handleChange}
          />
          <Field
            label="Allowances"
            name="allowances"
            type="number"
            value={form.allowances}
            onChange={handleChange}
          />
          <Field
            label="Deductions"
            name="deductions"
            type="number"
            value={form.deductions}
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
              {saving ? "Saving..." : "Save Salary"}
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
