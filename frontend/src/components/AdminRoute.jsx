// src/components/AdminRoute.jsx
import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function AdminRoute({ children }) {
  const { user, isAuthenticated, loading } = useAuth();
  const location = useLocation();

  // Wait for auth hydration
  if (loading) {
    return (
      <div style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "#fafaf9",
      }}>
        <div style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: "16px",
        }}>
          <div style={{
            width: "40px",
            height: "40px",
            borderRadius: "50%",
            border: "3px solid #f5ebe0",
            borderTopColor: "#c97c2e",
            animation: "spin 0.7s linear infinite",
          }} />
          <p style={{
            margin: 0,
            fontSize: "14px",
            color: "#78716c",
            fontWeight: 600,
          }}>
            Verifying access…
          </p>
        </div>
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      </div>
    );
  }

  // Not logged in at all — send to login
  if (!isAuthenticated) {
    return (
      <Navigate
        to="/login"
        state={{ from: location.pathname }}
        replace
      />
    );
  }

  // Logged in but not admin — send to sweets with a clear message
  if (user?.role !== "admin") {
    return <Navigate to="/sweets" state={{ accessDenied: true }} replace />;
  }

  // Admin confirmed — render the page
  return children;
}