import { Navigate } from "react-router-dom";

export default function AdminRoute({ children }) {
  const user = JSON.parse(localStorage.getItem("user") || "null");

  if (!user) {
    return <Navigate to="/login" />;
  }

  const isAdmin =
    user.role === "admin" ||
    user.role === "superadmin";

  if (!isAdmin) {
    return <Navigate to="/dashboard" />;
  }

  return children;
}