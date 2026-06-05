// src/pages/Login.jsx

import { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

import API from "../api/axios";

const Login = () => {
  const { login, isAuthenticated } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();


  // Form state
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [error, setError] = useState(""); // Show error messages
  const [loading, setLoading] = useState(false);

  // If user is already logged in, redirect them to dashboard
  if (isAuthenticated) {

  navigate("/sweets");

  return null;
}

  // Handle input changes
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError(""); // Clear error when user types
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      // POST to your backend login endpoint
      const response = await API.post("/auth/login", formData);

console.log("LOGIN RESPONSE:", response.data);

      const { token } = response.data;

// Decode JWT payload safely
const payload = JSON.parse(
  atob(token.split(".")[1])
);

// Build frontend user object
const user = {
  id: payload.userId,
  is_admin: payload.isAdmin,
};

login(user, token);
      // Redirect to dashboard
      // Redirect safely after login

const fromState =
  location.state?.from;

const fromStorage =
  sessionStorage.getItem(
    "redirectAfterLogin"
  );

const destination =
  fromState ||
  fromStorage ||
  "/sweets";

// Clear redirect storage
sessionStorage.removeItem(
  "redirectAfterLogin"
);

navigate(destination, {
  replace: true,
});
   } catch (err) {
      // Show error from backend or a fallback
      setError(err.response?.data?.message || "Login failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.page}>
      <div style={styles.card}>
        {/* Header */}
        <div style={styles.header}>
          <span style={styles.icon}>🍭</span>
          <h2 style={styles.title}>Welcome Back</h2>
          <p style={styles.subtitle}>Sign in to your Sweet Shop account</p>
        </div>

        {/* Error Message */}
        {error && <div style={styles.error}>{error}</div>}

        {/* Login Form */}
        <form onSubmit={handleSubmit} style={styles.form}>
          <div style={styles.field}>
            <label style={styles.label}>Email Address</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              placeholder="you@example.com"
              style={styles.input}
            />
          </div>

          <div style={styles.field}>
            <label style={styles.label}>Password</label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
              placeholder="••••••••"
              style={styles.input}
            />
          </div>

          <button type="submit" disabled={loading} style={styles.button}>
            {loading ? "Signing in..." : "Sign In"}
          </button>
        </form>

        {/* Footer Link */}
        <p style={styles.footerText}>
          Don't have an account?{" "}
          <Link to="/register" style={styles.footerLink}>
            Register here
          </Link>
        </p>
      </div>
    </div>
  );
};

const styles = {
  page: {
    minHeight: "100vh",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#fdf6ec",
    padding: "20px",
  },
  card: {
    backgroundColor: "#fff",
    borderRadius: "16px",
    padding: "40px",
    width: "100%",
    maxWidth: "420px",
    boxShadow: "0 8px 32px rgba(59, 31, 10, 0.12)",
    border: "1px solid #f0e0c8",
  },
  header: { textAlign: "center", marginBottom: "28px" },
  icon: { fontSize: "2.5rem" },
  title: {
    fontSize: "1.7rem",
    fontWeight: "700",
    color: "#3b1f0a",
    margin: "8px 0 4px",
  },
  subtitle: { color: "#8b6347", fontSize: "0.9rem", margin: 0 },
  error: {
    backgroundColor: "#fde8e8",
    color: "#c0392b",
    padding: "10px 14px",
    borderRadius: "8px",
    marginBottom: "16px",
    fontSize: "0.88rem",
    border: "1px solid #f5c6c6",
  },
  form: { display: "flex", flexDirection: "column", gap: "18px" },
  field: { display: "flex", flexDirection: "column", gap: "6px" },
  label: { fontSize: "0.88rem", fontWeight: "600", color: "#5a3a1a" },
  input: {
    padding: "11px 14px",
    borderRadius: "8px",
    border: "1.5px solid #e0c8a8",
    fontSize: "0.95rem",
    outline: "none",
    backgroundColor: "#fffdf9",
    color: "#3b1f0a",
    transition: "border-color 0.2s",
  },
  button: {
    backgroundColor: "#c97c2e",
    color: "#fff",
    padding: "13px",
    border: "none",
    borderRadius: "8px",
    fontSize: "1rem",
    fontWeight: "700",
    cursor: "pointer",
    marginTop: "4px",
    letterSpacing: "0.3px",
  },
  footerText: { textAlign: "center", marginTop: "20px", color: "#8b6347", fontSize: "0.9rem" },
  footerLink: { color: "#c97c2e", fontWeight: "600", textDecoration: "none" },
};

export default Login;