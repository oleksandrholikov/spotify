import { Navigate, Outlet } from "react-router-dom";

const ProtectedRoute = () => {
  const cookies = document.cookie.split("; ").find((row) => row.startsWith("userId="));
  const isAuthenticated = !!cookies; // true, если userId есть

  return isAuthenticated ? <Outlet /> : <Navigate to="/login" replace />;
};

export default ProtectedRoute;