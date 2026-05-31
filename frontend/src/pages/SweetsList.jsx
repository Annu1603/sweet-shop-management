// src/pages/SweetsList.jsx

import {
  useState,
  useEffect,
  useCallback,
} from "react";

import {
  useNavigate,
  useLocation,
} from "react-router-dom";

import { useAuth } from "../context/AuthContext";
import { useToast } from "../context/ToastContext";

import { getAllSweets } from "../services/sweetService";

import SweetCard from "../components/SweetCard";

import {
  SweetCardSkeleton,
  SearchBarSkeleton,
  PageHeaderSkeleton,
} from "../components/ui/Skeleton";

import CategoryFilter from "../components/CategoryFilter";

import { useDark } from "../hooks/useDark";

const SweetsList = () => {

  const { user } = useAuth();

  const { warning } = useToast();

  const navigate = useNavigate();

  const location = useLocation();

  const dark = useDark();

  const [sweets, setSweets] = useState([]);

  const [searchQuery, setSearchQuery] =
    useState("");

  const [loading, setLoading] =
    useState(true);

  const [apiError, setApiError] =
    useState("");

  const [category, setCategory] =
    useState("");

  // Admin check
  const isAdmin =
    user?.role === "admin";

  // Access denied toast
  useEffect(() => {

    if (location.state?.accessDenied) {

      warning(
        "Admin access only",
        "Access Denied"
      );

      // Prevent repeat toast on refresh
      window.history.replaceState({}, "");

    }

  }, []);

  // Fetch sweets
  const fetchSweets = useCallback(async () => {

    setLoading(true);

    setApiError("");

    try {

      const data =
        await getAllSweets(searchQuery);

      setSweets(
        Array.isArray(data)
          ? data
          : data.sweets || []
      );

    } catch (err) {

      setApiError(
        "Failed to load sweets. Please try again."
      );

    } finally {

      setLoading(false);
    }

  }, [searchQuery]);

  // Initial + search fetch
  useEffect(() => {

    const timer = setTimeout(() => {
      fetchSweets();
    }, 400);

    return () => clearTimeout(timer);

  }, [fetchSweets]);

  // Remove deleted sweet instantly
  const handleDelete = (deletedId) => {

    setSweets((prev) =>
      prev.filter(
        (s) => s.id !== deletedId
      )
    );
  };

  // Client-side category filtering
  const visible = category
    ? sweets.filter(
        (s) =>
          s.category?.toLowerCase() ===
          category.toLowerCase()
      )
    : sweets;

  return (
    <div
      className="page-container"
      style={{
        ...styles.page,

        backgroundColor: dark
          ? "#0c0a09"
          : "#fafaf9",
      }}
    >

      {/* Header */}
      {loading ? (

        <PageHeaderSkeleton />

      ) : (

        <div
          className="stack-mobile"
          style={styles.header}
        >

          <div>

            <h1
              style={{
                ...styles.title,

                color: dark
                  ? "#e7e5e4"
                  : "#1c1917",
              }}
            >
              🍬 Our Sweets
            </h1>

            <p
              style={{
                ...styles.subtitle,

                color: dark
                  ? "#a8a29e"
                  : "#78716c",
              }}
            >

              {visible.length} item
              {visible.length !== 1
                ? "s"
                : ""}
              {" "}available

              {category && (
                <span
                  style={styles.categoryLabel}
                >
                  in {category}
                </span>
              )}

            </p>

          </div>

          {isAdmin && (
            <button
              onClick={() =>
                navigate("/sweets/add")
              }
              style={styles.addBtn}
            >
              + Add Sweet
            </button>
          )}

        </div>
      )}

      {/* Search */}
      {loading ? (

        <SearchBarSkeleton />

      ) : (

        <div
          className="full-mobile"
          style={{
            ...styles.searchWrapper,

            backgroundColor: dark
              ? "#1c1917"
              : "#ffffff",

            border: `1.5px solid ${
              dark
                ? "#44403c"
                : "#e0c8a8"
            }`,
          }}
        >

          <span style={styles.searchIcon}>
            🔍
          </span>

          <input
            type="text"

            placeholder="Search sweets by name, category..."

            value={searchQuery}

            onChange={(e) =>
              setSearchQuery(
                e.target.value
              )
            }

            className="search-input"

            style={{
              ...styles.searchInput,

              color: dark
                ? "#e7e5e4"
                : "#1c1917",
            }}
          />

          {searchQuery && (
            <button
              onClick={() =>
                setSearchQuery("")
              }
              style={styles.clearBtn}
            >
              ✕
            </button>
          )}

        </div>
      )}

      {/* Category Filter */}
      {!loading && (
        <CategoryFilter
          selected={category}
          onSelect={setCategory}
        />
      )}

      {/* Loading */}
      {loading ? (

        <div className="sweets-grid">
          {Array.from({ length: 8 }).map(
            (_, i) => (
              <SweetCardSkeleton
                key={i}
              />
            )
          )}
        </div>

      ) : apiError ? (

        <div style={styles.errorBox}>

          <p>{apiError}</p>

          <button
            onClick={fetchSweets}
            style={styles.retryBtn}
          >
            Retry
          </button>

        </div>

      ) : visible.length === 0 ? (

        <div style={styles.centerMessage}>

          <span
            style={{ fontSize: "3rem" }}
          >
            🫙
          </span>

          <p style={styles.emptyText}>

            {searchQuery
              ? `No results for "${searchQuery}"`
              : category
              ? `No sweets in "${category}"`
              : "No sweets available yet"}

          </p>

          {(searchQuery || category) && (
            <button
              onClick={() => {
                setSearchQuery("");
                setCategory("");
              }}
              style={
                styles.clearFiltersBtn
              }
            >
              Clear filters
            </button>
          )}

          {isAdmin &&
            !searchQuery &&
            !category && (
              <button
                onClick={() =>
                  navigate("/sweets/add")
                }
                style={{
                  ...styles.addBtn,
                  marginTop: "16px",
                }}
              >
                + Add First Sweet
              </button>
            )}

        </div>

      ) : (

        <div className="sweets-grid">

          {visible.map((sweet) => (
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
    backgroundColor: "#fafaf9",
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
    color: "#1c1917",
    margin: "0 0 4px",
  },

  subtitle: {
    color: "#78716c",
    margin: 0,
    fontSize: "0.9rem",
  },

  categoryLabel: {
    marginLeft: "8px",
    fontSize: "12px",
    color: "#c97c2e",
    fontWeight: 600,
  },

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
    marginBottom: "24px",
    gap: "10px",
    maxWidth: "520px",
  },

  searchIcon: {
    fontSize: "1rem",
  },

  searchInput: {
    flex: 1,
    padding: "13px 0",
    border: "none",
    outline: "none",
    fontSize: "0.95rem",
    backgroundColor: "transparent",
    color: "#1c1917",
  },

  clearBtn: {
    background: "none",
    border: "none",
    cursor: "pointer",
    color: "#8b6347",
    fontSize: "1rem",
    padding: "4px",
  },

  centerMessage: {
    textAlign: "center",
    padding: "60px 20px",
  },

  emptyText: {
    color: "#8b6347",
    marginTop: "12px",
    fontSize: "1rem",
  },

  clearFiltersBtn: {
    marginTop: "16px",
    padding: "8px 20px",
    borderRadius: "10px",
    border: "1.5px solid #e7e5e4",
    backgroundColor: "#ffffff",
    color: "#57534e",
    fontSize: "13px",
    fontWeight: 600,
    cursor: "pointer",
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

export default SweetsList;