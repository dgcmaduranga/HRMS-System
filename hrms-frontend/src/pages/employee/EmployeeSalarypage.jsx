// src/pages/employee/EmployeeSalaryPage.jsx
import { useMemo, useState } from "react";
import EmployeeLayout from "../../layouts/EmployeeLayout";
import { FaMoneyBillWave } from "react-icons/fa";

const SALARY_LS_KEY = "hrms_salaries";

export default function EmployeeSalaryPage() {
  const [allSalaries] = useState(() => {
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

  const myEmail =
    typeof window !== "undefined"
      ? localStorage.getItem("email") || localStorage.getItem("userEmail") || ""
      : "";

  const mySalaries = useMemo(() => {
    if (!myEmail) return allSalaries;
    return allSalaries.filter(
      (s) => (s.employeeEmail || "").toLowerCase() === myEmail.toLowerCase()
    );
  }, [allSalaries, myEmail]);

  const totalNet = mySalaries.reduce(
    (sum, s) => sum + (Number(s.netSalary) || 0),
    0
  );

  const money = (v) =>
    `Rs ${Number(v || 0).toLocaleString("en-LK", {
      maximumFractionDigits: 2,
    })}`;

  return (
    <EmployeeLayout>
      <div className="space-y-6">
        {/* HEADER */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-xl font-semibold">My Salary</h1>
            <p className="text-xs text-slate-500">
              View your monthly salary details and history.
            </p>
          </div>

          <div className="text-right text-xs text-slate-500">
            <p>Total Net Received</p>
            <p className="text-sm font-semibold text-emerald-600">
              {money(totalNet)}
            </p>
          </div>
        </div>

        {/* CURRENT MONTH SUMMARY (last record) */}
        <section>
          <h2 className="text-sm font-semibold text-slate-700 mb-3">
            Latest Payroll
          </h2>

          {mySalaries.length === 0 ? (
            <p className="text-xs text-slate-500">
              No salary records found yet. Once HR processes your payroll it
              will appear here.
            </p>
          ) : (
            <LatestSalaryCard salary={mySalaries[0]} />
          )}
        </section>

        {/* HISTORY */}
        <section>
          <h2 className="text-sm font-semibold text-slate-700 mb-3">
            Salary History
          </h2>

          {mySalaries.length === 0 ? (
            <p className="text-xs text-slate-500">
              No history available yet.
            </p>
          ) : (
            <div className="space-y-3">
              {mySalaries.map((s) => (
                <HistoryCard key={s.id} salary={s} />
              ))}
            </div>
          )}
        </section>
      </div>
    </EmployeeLayout>
  );
}

function LatestSalaryCard({ salary }) {
  const { month, year, basicSalary, allowances, deductions, netSalary } =
    salary;

  const money = (v) =>
    `Rs ${Number(v || 0).toLocaleString("en-LK", {
      maximumFractionDigits: 2,
    })}`;

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-100 px-6 py-4 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-600 text-xl">
          <FaMoneyBillWave />
        </div>
        <div>
          <p className="text-sm font-semibold text-slate-900">
            {month?.toString().padStart(2, "0")}/{year}
          </p>
          <p className="text-xs text-slate-500">
            Basic: {money(basicSalary)} · Allowances: {money(allowances)} ·
            Deductions: {money(deductions)}
          </p>
        </div>
      </div>

      <div className="text-right">
        <p className="text-xs text-slate-500 mb-1">Net Salary</p>
        <p className="text-xl font-semibold text-emerald-600">
          {money(netSalary)}
        </p>
      </div>
    </div>
  );
}

function HistoryCard({ salary }) {
  const { month, year, netSalary } = salary;
  const money = (v) =>
    `Rs ${Number(v || 0).toLocaleString("en-LK", {
      maximumFractionDigits: 2,
    })}`;

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-100 px-5 py-3 flex items-center justify-between text-sm">
      <div>
        <p className="font-medium text-slate-900">
          {month?.toString().padStart(2, "0")}/{year}
        </p>
      </div>
      <p className="font-semibold text-emerald-600">{money(netSalary)}</p>
    </div>
  );
}
