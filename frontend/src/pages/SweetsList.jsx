// src/pages/SweetsList.jsx

import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { getAllSweets } from "../services/sweetService";
import SweetCard from "../components/SweetCard";

const SweetsList = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [sweets, setSweets] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // true if current user is admin
  const isAdmin = user?.role === "admin";

  // Fetch sweets — re-runs when searchQuery changes
  const fetchSweets = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const data = await getAllSweets(searchQuery);
      // Handle both { sweets: [...] } and plain array responses
      setSweets(Array.isArray(data) ? data : data.sweets || []);
    } catch (err) {
      setError("Failed to load sweets. Please try again.");
    } finally {
      setLoading(false);
    }
  }, [searchQuery]);

  // Run on first load and whenever searchQuery changes
  useEffect(() => {
    // Debounce: wait 400ms after user stops typing before searching
    const timer = setTimeout(() => {
      fetchSweets();
    }, 400);
    return () => clearTimeout(timer); // cleanup on re-render
  }, [fetchSweets]);

  // Called by SweetCard after deletion — removes card from UI instantly
  const handleDelete = (deletedId) => {
    setSweets((prev) => prev.filter((s) => s.id !== deletedId));
  };

  return (
    <div style={styles.page}>
      {/* Page Header */}
      <div style={styles.header}>
        <div>
          <h1 style={styles.title}>🍬 Our Sweets</h1>
          <p style={styles.subtitle}>
            {sweets.length} item{sweets.length !== 1 ? "s" : ""} available
          </p>
        </div>

        {/* Admin-only: Add Sweet button */}
        {isAdmin && (
          <button
            onClick={() => navigate("/sweets/add")}
            style={styles.addBtn}
          >
            + Add Sweet
          </button>
        )}
      </div>

      {/* Search Bar */}
      <div style={styles.searchWrapper}>
        <span style={styles.searchIcon}>🔍</span>
        <input
          type="text"
          placeholder="Search sweets by name, category..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          style={styles.searchInput}
        />
        {searchQuery && (
          <button
            onClick={() => setSearchQuery("")}
            style={styles.clearBtn}
          >
            ✕
          </button>
        )}
      </div>

      {/* States: Loading / Error / Empty / Grid */}
      {loading ? (
        <div style={styles.centerMessage}>
          <div style={styles.spinner} />
          <p style={{ color: "#8b6347", marginTop: "16px" }}>Loading sweets...</p>
        </div>
      ) : error ? (
        <div style={styles.errorBox}>
          <p>{error}</p>
          <button onClick={fetchSweets} style={styles.retryBtn}>
            Retry
          </button>
        </div>
      ) : sweets.length === 0 ? (
        <div style={styles.centerMessage}>
          <span style={{ fontSize: "3rem" }}>🫙</span>
          <p style={{ color: "#8b6347", marginTop: "12px" }}>
            {searchQuery
              ? `No sweets found for "${searchQuery}"`
              : "No sweets added yet."}
          </p>
          {isAdmin && !searchQuery && (
            <button
              onClick={() => navigate("/sweets/add")}
              style={{ ...styles.addBtn, marginTop: "16px" }}
            >
              + Add First Sweet
            </button>
          )}
        </div>
      ) : (
        <div style={styles.grid}>
          {sweets.map((sweet) => (
            <SweetCard
              key={sweet.id}
              sweet={sweet}
              onDelete={handleDelete}
            />
          ))}
        </div>
      )}
    </div>
  );
};

const styles = {
  page: {
    maxWidth: "1200px",
    margin: "0 auto",
    padding: "32px 20px",
    minHeight: "calc(100vh - 64px)",
    backgroundColor: "#fdf6ec",
  },
  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: "28px",
    flexWrap: "wrap",
    gap: "12px",
  },
  title: {
    fontSize: "2rem",
    fontWeight: "800",
    color: "#3b1f0a",
    margin: "0 0 4px",
  },
  subtitle: { color: "#8b6347", margin: 0, fontSize: "0.9rem" },
  addBtn: {
    backgroundColor: "#c97c2e",
    color: "#fff",
    border: "none",
    padding: "12px 22px",
    borderRadius: "10px",
    fontSize: "0.95rem",
    fontWeight: "700",
    cursor: "pointer",
    whiteSpace: "nowrap",
  },
  searchWrapper: {
    display: "flex",
    alignItems: "center",
    backgroundColor: "#fff",
    border: "1.5px solid #e0c8a8",
    borderRadius: "12px",
    padding: "0 16px",
    marginBottom: "32px",
    gap: "10px",
  },
  searchIcon: { fontSize: "1rem" },
  searchInput: {
    flex: 1,
    padding: "13px 0",
    border: "none",
    outline: "none",
    fontSize: "0.95rem",
    backgroundColor: "transparent",
    color: "#3b1f0a",
  },
  clearBtn: {
    background: "none",
    border: "none",
    cursor: "pointer",
    color: "#8b6347",
    fontSize: "1rem",
    padding: "4px",
  },
  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))",
    gap: "24px",
  },
  centerMessage: {
    textAlign: "center",
    padding: "60px 20px",
  },
  spinner: {
    width: "40px",
    height: "40px",
    border: "4px solid #f0e0c8",
    borderTop: "4px solid #c97c2e",
    borderRadius: "50%",
    animation: "spin 0.8s linear infinite",
    margin: "0 auto",
  },
  errorBox: {
    textAlign: "center",
    padding: "40px",
    color: "#c0392b",
  },
  retryBtn: {
    backgroundColor: "#c97c2e",
    color: "#fff",
    border: "none",
    padding: "10px 20px",
    borderRadius: "8px",
    cursor: "pointer",
    fontWeight: "600",
    marginTop: "12px",
  },
};

// Add spinner keyframe to document (runs once)
const styleTag = document.createElement("style");
styleTag.textContent = `@keyframes spin { to { transform: rotate(360deg); } }`;
document.head.appendChild(styleTag);

export default SweetsList;