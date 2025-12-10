// src/routes/employeeRoutes.js
import { Routes, Route } from "react-router-dom";
import ProtectedRoute from "../components/ProtectedRoute";
import EmployeeLayout from "../layouts/EmployeeLayout";
import EmployeeDashboard from "../pages/employee/EmployeeDashboard";
// TODO: තව pages add කරන්න
// import EmployeeProfile from "../pages/employee/ProfilePage"; ...

export default function EmployeeRoutes() {
  return (
    <Routes>
      <Route
        path="/employee"
        element={
          <ProtectedRoute role="employee">
            <EmployeeLayout />
          </ProtectedRoute>
        }
      >
        <Route path="dashboard" element={<EmployeeDashboard />} />
        {/* <Route path="profile" element={<EmployeeProfile />} /> */}
        {/* <Route path="leaves" element={<EmployeeLeavesPage />} /> */}
        {/* <Route path="salary" element={<EmployeeSalaryPage />} /> */}
        {/* <Route path="settings" element={<EmployeeSettingsPage />} /> */}
      </Route>
    </Routes>
  );
}
