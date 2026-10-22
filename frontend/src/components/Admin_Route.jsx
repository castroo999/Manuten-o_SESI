import { Navigate } from "react-router-dom";

export default function AdminRoute({ children }) {
  const user = JSON.parse(localStorage.getItem("user") || "null");

  if (!user) {
    return <Navigate to="/login" />;
  }

  const role = String(user.role || "").trim().toLowerCase().replace(/\s+/g, "");
  const isAdmin = role === "admin" || role === "superadmin";

  if (!isAdmin) {
    return <Navigate to="/dashboard" />;
  }

  return children;
}
