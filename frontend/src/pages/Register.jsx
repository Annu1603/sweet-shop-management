// src/pages/Register.jsx

import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import API from "../api/axios";

const Register = () => {
  const { login, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  // Redirect if already logged in
  if (isAuthenticated) {
    navigate("/sweets");
    return null;
  }

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Frontend validation
    if (formData.password !== formData.confirmPassword) {
      return setError("Passwords do not match.");
    }
    if (formData.password.length < 6) {
      return setError("Password must be at least 6 characters.");
    }

    setLoading(true);
    setError("");

    try {
      // POST to your backend register endpoint
      // We don't send confirmPassword to the backend
      const response = await API.post("/auth/register", {
        name: formData.name,
        email: formData.email,
        password: formData.password,
      });

      const { token } = response.data;

// Decode JWT payload
const payload = JSON.parse(
  atob(token.split(".")[1])
);

// Build frontend user object
const user = {
  id: payload.userId,
  is_admin: payload.isAdmin,
};

login(user, token);
      navigate("/sweets");
    } catch (err) {

  const backendMessage =
    err.response?.data?.message ||
    err.response?.data?.error;

  setError(
    backendMessage ||
    "Registration failed. Please try again."
  );
}finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.page}>
      <div style={styles.card}>
        <div style={styles.header}>
          <span style={styles.icon}>🍰</span>
          <h2 style={styles.title}>Create Account</h2>
          <p style={styles.subtitle}>Join your Sweet Shop Management System</p>
        </div>

        {error && <div style={styles.error}>{error}</div>}

        <form onSubmit={handleSubmit} style={styles.form}>
          <div style={styles.field}>
            <label style={styles.label}>Full Name</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              placeholder="John Doe"
              style={styles.input}
            />
          </div>

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
              placeholder="Min. 6 characters"
              style={styles.input}
            />
          </div>

          <div style={styles.field}>
            <label style={styles.label}>Confirm Password</label>
            <input
              type="password"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              required
              placeholder="Re-enter password"
              style={styles.input}
            />
          </div>

          <button type="submit" disabled={loading} style={styles.button}>
            {loading ? "Creating Account..." : "Create Account"}
          </button>
        </form>

        <p style={styles.footerText}>
          Already have an account?{" "}
          <Link to="/login" style={styles.footerLink}>
            Sign in
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
  title: { fontSize: "1.7rem", fontWeight: "700", color: "#3b1f0a", margin: "8px 0 4px" },
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
  form: { display: "flex", flexDirection: "column", gap: "16px" },
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
  },
  footerText: { textAlign: "center", marginTop: "20px", color: "#8b6347", fontSize: "0.9rem" },
  footerLink: { color: "#c97c2e", fontWeight: "600", textDecoration: "none" },
};

export default Register;