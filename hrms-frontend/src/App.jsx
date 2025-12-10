// src/App.jsx
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import LoginPage from "./pages/auth/LoginPage.jsx";

// Admin pages
import AdminDashboard from "./pages/admin/AdminDashboard.jsx";
import EmployeesPage from "./pages/admin/EmployeesPage.jsx";
import DepartmentsPage from "./pages/admin/DepartmentsPage.jsx";
import LeavesPage from "./pages/admin/LeavesPage.jsx";
import AttendancePage from "./pages/admin/AttendancePage.jsx";
import AttendanceReportsPage from "./pages/admin/AttendanceReportsPage.jsx";
import SalaryPage from "./pages/admin/SalaryPage.jsx";
import SettingsPage from "./pages/admin/SettingsPage.jsx";
import SupportPage from "./pages/admin/SupportPage.jsx";

// Employee pages
import EmployeeDashboard from "./pages/employee/EmployeeDashboard.jsx";
import MyProfilePage from "./pages/employee/MyProfilePage.jsx";
import EmployeeLeavesPage from "./pages/employee/employeeLeavesPage.jsx";
import EmployeeSalaryPage from "./pages/employee/EmployeeSalarypage.jsx";
import EmployeeSettingsPage from "./pages/employee/EmployeeSettingsPage.jsx"; // ⬅️ NEW

import ProtectedRoute from "./components/ProtectedRoute.jsx";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Auth */}
        <Route path="/login" element={<LoginPage />} />

        {/* ===== ADMIN ROUTES ===== */}
        <Route
          path="/admin/dashboard"
          element={
            <ProtectedRoute allowedRole="admin">
              <AdminDashboard />
            </ProtectedRoute>
          }
        />

        <Route
          path="/admin/employees"
          element={
            <ProtectedRoute allowedRole="admin">
              <EmployeesPage />
            </ProtectedRoute>
          }
        />

        <Route
          path="/admin/departments"
          element={
            <ProtectedRoute allowedRole="admin">
              <DepartmentsPage />
            </ProtectedRoute>
          }
        />

        <Route
          path="/admin/leaves"
          element={
            <ProtectedRoute allowedRole="admin">
              <LeavesPage />
            </ProtectedRoute>
          }
        />

        <Route
          path="/admin/attendance"
          element={
            <ProtectedRoute allowedRole="admin">
              <AttendancePage />
            </ProtectedRoute>
          }
        />

        <Route
          path="/admin/attendance-reports"
          element={
            <ProtectedRoute allowedRole="admin">
              <AttendanceReportsPage />
            </ProtectedRoute>
          }
        />

        <Route
          path="/admin/salary"
          element={
            <ProtectedRoute allowedRole="admin">
              <SalaryPage />
            </ProtectedRoute>
          }
        />

        <Route
          path="/admin/settings"
          element={
            <ProtectedRoute allowedRole="admin">
              <SettingsPage />
            </ProtectedRoute>
          }
        />

        <Route
          path="/admin/support"
          element={
            <ProtectedRoute allowedRole="admin">
              <SupportPage />
            </ProtectedRoute>
          }
        />

        {/* ===== EMPLOYEE ROUTES ===== */}
        <Route
          path="/employee/dashboard"
          element={
            <ProtectedRoute allowedRole="employee">
              <EmployeeDashboard />
            </ProtectedRoute>
          }
        />

        <Route
          path="/employee/profile"
          element={
            <ProtectedRoute allowedRole="employee">
              <MyProfilePage />
            </ProtectedRoute>
          }
        />

        <Route
          path="/employee/leaves"
          element={
            <ProtectedRoute allowedRole="employee">
              <EmployeeLeavesPage />
            </ProtectedRoute>
          }
        />

        <Route
          path="/employee/salary"
          element={
            <ProtectedRoute allowedRole="employee">
              <EmployeeSalaryPage />
            </ProtectedRoute>
          }
        />

        <Route
          path="/employee/settings"
          element={
            <ProtectedRoute allowedRole="employee">
              <EmployeeSettingsPage />
            </ProtectedRoute>
          }
        />

        {/* Default */}
        <Route path="*" element={<Navigate to="/login" />} />
      </Routes>
    </BrowserRouter>
  );
}