// src/components/ProtectedRoute.jsx
import { Navigate } from "react-router-dom";

export default function ProtectedRoute({ children, allowedRoles = [] }) {
  const token = localStorage.getItem("token");
  const role = localStorage.getItem("role");

  // token නැත්තම් login page එකට
  if (!token) {
    return <Navigate to="/login" replace />;
  }

  // allowedRoles ලබාදීලා තියෙනව නම්, ඒකට match වෙන්න ඕන
  if (allowedRoles.length > 0 && !allowedRoles.includes(role)) {
    return <Navigate to="/login" replace />;
  }

  return children;
}
