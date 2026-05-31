// src/components/Navbar.jsx

import { Link, useNavigate } from "react-router-dom";

import { useAuth } from "../context/AuthContext";
import { useCart } from "../context/CartContext";
import { useTheme } from "../context/ThemeContext";

import { useState } from "react";

import CartSidebar from "./CartSidebar";

export default function Navbar() {

  const { user, isAuthenticated, logout } = useAuth();

  const { totalItems } = useCart();

  const { dark, toggleDark } = useTheme();

  const [cartOpen, setCartOpen] = useState(false);

  const navigate = useNavigate();

  // Logout
  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  // Display name
  const displayName =
    user?.name ||
    user?.username ||
    user?.email ||
    "User";

  // Initials
  const initials = displayName
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  return (
    <nav
      style={{
        position: "sticky",
        top: 0,
        zIndex: 1000,
        width: "100%",
        backgroundColor: "rgba(255,255,255,0.96)",
        borderBottom: "1px solid #e7e5e4",
        boxShadow: "0 1px 4px rgba(0,0,0,0.06)",
        backdropFilter: "blur(8px)",
      }}
    >

      <div
        style={{
          maxWidth: "1400px",
          margin: "0 auto",
          padding: "0 20px",
        }}
      >

        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            minHeight: "70px",
            gap: "20px",
            flexWrap: "wrap",
          }}
        >

          {/* LEFT */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "24px",
              flexWrap: "wrap",
            }}
          >

            {/* Logo */}
            <Link
              to="/sweets"
              style={{
                display: "flex",
                alignItems: "center",
                gap: "10px",
                textDecoration: "none",
              }}
            >
              <span style={{ fontSize: "28px" }}>
                🍬
              </span>

              <span
                style={{
                  fontSize: "24px",
                  fontWeight: "800",
                  color: "#78350f",
                }}
              >
                SweetShop
              </span>
            </Link>

            {/* Links */}
            {isAuthenticated && (
              <>
                <Link
                  to="/sweets"
                  style={styles.link}
                >
                  Browse
                </Link>

                {user?.role === "admin" && (
                  <Link
                    to="/admin"
                    style={styles.link}
                  >
                    Dashboard
                  </Link>
                )}
              </>
            )}
          </div>

          {/* RIGHT */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "14px",
              flexWrap: "wrap",
            }}
          >

            {/* Dark mode */}
            <button
              onClick={toggleDark}
              style={styles.iconButton}
            >
              {dark ? "☀️" : "🌙"}
            </button>

            {/* Cart button */}
            {isAuthenticated && (
              <button
                onClick={() => setCartOpen(true)}
                aria-label={`Cart, ${totalItems} item${
                  totalItems !== 1 ? "s" : ""
                }`}
                style={{
                  position: "relative",
                  padding: "10px",
                  borderRadius: "10px",
                  border: "1px solid #e5e7eb",
                  backgroundColor: "#ffffff",
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: "#57534e",
                  minHeight: "42px",
                  minWidth: "42px",
                }}
              >

                {/* Cart SVG */}
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  style={{
                    display: "block",
                  }}
                >
                  <circle cx="9" cy="21" r="1" />

                  <circle cx="20" cy="21" r="1" />

                  <path d="M1 1h4l2.68 13.39a2 2 0 001.98 1.61h9.72a2 2 0 001.98-1.68l1.62-9.72H6" />
                </svg>

                {/* Badge */}
                {totalItems > 0 && (
                  <span
                    style={{
                      position: "absolute",
                      top: "2px",
                      right: "2px",
                      minWidth: "16px",
                      height: "16px",
                      padding: "0 3px",
                      borderRadius: "999px",
                      backgroundColor: "#c97c2e",
                      color: "#ffffff",
                      fontSize: "9px",
                      fontWeight: 900,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      lineHeight: 1,
                    }}
                  >
                    {totalItems > 99
                      ? "99+"
                      : totalItems}
                  </span>
                )}
              </button>
            )}

            {/* Auth */}
            {isAuthenticated ? (
              <>

                {/* Avatar */}
                <div
                  style={{
                    width: "40px",
                    height: "40px",
                    borderRadius: "50%",
                    backgroundColor: "#f59e0b",
                    color: "white",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontWeight: "700",
                    fontSize: "14px",
                  }}
                >
                  {initials}
                </div>

                {/* Name */}
                <span
                  style={{
                    fontWeight: "600",
                    color: "#374151",
                  }}
                >
                  {displayName}
                </span>

                {/* Logout */}
                <button
                  onClick={handleLogout}
                  style={{
                    backgroundColor: "#ef4444",
                    color: "white",
                    border: "none",
                    padding: "10px 16px",
                    minHeight: "42px",
                    borderRadius: "8px",
                    cursor: "pointer",
                    fontWeight: "600",
                  }}
                >
                  Logout
                </button>
              </>

            ) : (
              <>
                <Link
                  to="/login"
                  style={styles.authBtn}
                >
                  Login
                </Link>

                <Link
                  to="/register"
                  style={{
                    ...styles.authBtn,
                    backgroundColor: "#f59e0b",
                    color: "white",
                    border: "none",
                  }}
                >
                  Register
                </Link>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Cart Sidebar */}
      <CartSidebar
        open={cartOpen}
        onClose={() => setCartOpen(false)}
      />
    </nav>
  );
}

const styles = {
  link: {
    textDecoration: "none",
    color: "#374151",
    fontWeight: "600",
    fontSize: "15px",
    padding: "10px 6px",
  },

  iconButton: {
    border: "1px solid #d1d5db",
    background: "white",
    borderRadius: "8px",
    padding: "10px 12px",
    minHeight: "42px",
    minWidth: "42px",
    cursor: "pointer",
  },

  authBtn: {
    textDecoration: "none",
    border: "1px solid #d1d5db",
    padding: "12px 16px",
    minHeight: "42px",
    borderRadius: "8px",
    color: "#374151",
    fontWeight: "600",
  },
};