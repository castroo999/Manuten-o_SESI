import { Navigate } from "react-router-dom";
import { readStoredUser } from "../services/auth.js";

export default function AdminRoute({ children }) {
  const user = readStoredUser();

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
