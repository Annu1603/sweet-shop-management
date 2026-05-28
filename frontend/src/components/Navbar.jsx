// src/components/Navbar.jsx

import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const Navbar = () => {
  const { isAuthenticated, user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login"); // Redirect to login after logout
  };

  return (
    <nav style={styles.nav}>
      {/* Brand / Logo */}
      <Link to="/" style={styles.brand}>
        🍬 Sweet Shop
      </Link>

      {/* Navigation Links */}
      <div style={styles.links}>
        {isAuthenticated ? (
          <>
            <span style={styles.welcome}>Welcome, {user?.name || "User"}!</span>
            <Link to="/dashboard" style={styles.link}>Dashboard</Link>
            <button onClick={handleLogout} style={styles.logoutBtn}>
              Logout
            </button>
          </>
        ) : (
          <>
            <Link to="/login" style={styles.link}>Login</Link>
            <Link to="/register" style={styles.link}>Register</Link>
          </>
        )}
      </div>
    </nav>
  );
};

// Inline styles for the Navbar
const styles = {
  nav: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "14px 32px",
    backgroundColor: "#3b1f0a",
    boxShadow: "0 2px 8px rgba(0,0,0,0.3)",
  },
  brand: {
    color: "#f5c842",
    fontSize: "1.4rem",
    fontWeight: "700",
    textDecoration: "none",
    letterSpacing: "0.5px",
  },
  links: {
    display: "flex",
    alignItems: "center",
    gap: "20px",
  },
  link: {
    color: "#f5e6c8",
    textDecoration: "none",
    fontSize: "0.95rem",
    fontWeight: "500",
    transition: "color 0.2s",
  },
  welcome: {
    color: "#f5c842",
    fontSize: "0.9rem",
    fontWeight: "500",
  },
  logoutBtn: {
    backgroundColor: "#c0392b",
    color: "#fff",
    border: "none",
    padding: "8px 16px",
    borderRadius: "6px",
    cursor: "pointer",
    fontWeight: "600",
    fontSize: "0.88rem",
  },
};

export default Navbar;