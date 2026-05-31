// src/pages/AdminDashboard.jsx

import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

import { useToast } from "../context/ToastContext";
import { useDark } from "../hooks/useDark";

import {
  getAllSweets,
  deleteSweet,
  restockSweet,
} from "../services/sweetService";

import {
  StatCardSkeleton,
  TableRowSkeleton,
} from "../components/ui/Skeleton";

// ─── Stat Card ────────────────────────────────────────────────────────────────
const StatCard = ({
  label,
  value,
  sub,
  emoji,
  borderColor,
  dark,
}) => (
  <div
    style={{
      backgroundColor: dark
        ? "#1c1917"
        : "#ffffff",

      borderRadius: "14px",

      border: `1px solid ${
        dark
          ? "#292524"
          : "#f0e0c8"
      }`,

      borderLeft: `4px solid ${borderColor}`,

      padding: "20px",

      boxShadow:
        "0 2px 8px rgba(59,31,10,0.06)",
    }}
  >
    <div
      style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "flex-start",
      }}
    >
      <div>

        <p
          style={{
            margin: "0 0 6px",

            fontSize: "11px",

            fontWeight: 700,

            color: dark
              ? "#a8a29e"
              : "#78716c",

            textTransform: "uppercase",

            letterSpacing: "0.6px",
          }}
        >
          {label}
        </p>

        <p
          style={{
            margin: 0,

            fontSize: "32px",

            fontWeight: 900,

            color: dark
              ? "#e7e5e4"
              : "#1c1917",

            lineHeight: 1,
          }}
        >
          {value}
        </p>

        {sub && (
          <p
            style={{
              margin: "6px 0 0",

              fontSize: "12px",

              color: dark
                ? "#57534e"
                : "#a8a29e",
            }}
          >
            {sub}
          </p>
        )}

      </div>

      <span style={{ fontSize: "28px" }}>
        {emoji}
      </span>

    </div>
  </div>
);

// ─── Stock pill ───────────────────────────────────────────────────────────────
const StockPill = ({ qty }) => {

  const cfg =
    qty <= 0
      ? {
          bg: "#fee2e2",
          color: "#dc2626",
          label: "Out of stock",
        }
      : qty <= 5
      ? {
          bg: "#fef3c7",
          color: "#d97706",
          label: `${qty} left`,
        }
      : {
          bg: "#dcfce7",
          color: "#16a34a",
          label: `${qty} in stock`,
        };

  return (
    <span
      style={{
        padding: "3px 10px",

        borderRadius: "999px",

        fontSize: "11px",

        fontWeight: 700,

        backgroundColor: cfg.bg,

        color: cfg.color,
      }}
    >
      {cfg.label}
    </span>
  );
};

// ─── Main Dashboard ───────────────────────────────────────────────────────────
export default function AdminDashboard() {

  const dark = useDark();

  const navigate = useNavigate();

  const {
    success,
    error: toastErr,
  } = useToast();

  const [sweets, setSweets] =
    useState([]);

  const [loading, setLoading] =
    useState(true);

  const [search, setSearch] =
    useState("");

  const [deletingId, setDeletingId] =
    useState(null);

  // Fetch sweets
  useEffect(() => {

    const load = async () => {

      try {

        const data =
          await getAllSweets();

        const list =
          Array.isArray(data)
            ? data
            : data.sweets ?? [];

        setSweets(list);

      } catch {

        toastErr(
          "Failed to load sweets for dashboard"
        );

      } finally {

        setLoading(false);
      }
    };

    load();

  }, []);

  const totalProducts =
    sweets.length;

  const totalStock =
    sweets.reduce(
      (n, s) =>
        n +
        (Number(s.quantity) || 0),
      0
    );

  const lowStockCount =
    sweets.filter(
      (s) =>
        s.quantity > 0 &&
        s.quantity <= 5
    ).length;

  const outOfStock =
    sweets.filter(
      (s) => s.quantity <= 0
    ).length;

  const filtered =
    sweets.filter(
      (s) =>
        s.name
          ?.toLowerCase()
          .includes(
            search.toLowerCase()
          ) ||

        s.category
          ?.toLowerCase()
          .includes(
            search.toLowerCase()
          )
    );

  const handleDelete = async (
    sweet
  ) => {

    if (
      !window.confirm(
        `Delete "${sweet.name}"?`
      )
    ) return;

    setDeletingId(sweet.id);

    try {

      await deleteSweet(sweet.id);

      setSweets((prev) =>
        prev.filter(
          (s) =>
            s.id !== sweet.id
        )
      );

      success(
        `"${sweet.name}" deleted`
      );

    } catch {

      toastErr(
        `Failed to delete "${sweet.name}"`
      );

    } finally {

      setDeletingId(null);
    }
  };

  return (
    <div
      style={{
        maxWidth: "1200px",

        margin: "0 auto",

        padding: "32px 20px",

        minHeight:
          "calc(100vh - 64px)",

        backgroundColor: dark
          ? "#0c0a09"
          : "#fafaf9",
      }}
    >

      {/* Header */}
      <div
        className="stack-mobile"
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-start",
          marginBottom: "28px",
          gap: "12px",
          flexWrap: "wrap",
        }}
      >

        <div>

          <h1
            style={{
              margin: "0 0 6px",

              color: dark
                ? "#e7e5e4"
                : "#1c1917",
            }}
          >
            📊 Admin Dashboard
          </h1>

          <p
            style={{
              margin: 0,
              fontSize: "14px",

              color: dark
                ? "#a8a29e"
                : "#78716c",
            }}
          >
            Manage sweets inventory, stock, and pricing
          </p>

        </div>

        <button
          onClick={() =>
            navigate("/sweets/add")
          }

          style={{
            backgroundColor: "#c97c2e",

            color: "#ffffff",

            border: "none",

            borderRadius: "10px",

            padding: "12px 18px",

            fontSize: "14px",

            fontWeight: 700,

            cursor: "pointer",

            whiteSpace: "nowrap",
          }}
        >
          + Add Sweet
        </button>

      </div>

      {/* Stats */}
      {loading ? (

        <div
          className="stats-grid"
          style={{ marginBottom: "28px" }}
        >

          {Array.from({ length: 4 }).map(
            (_, i) => (
              <StatCardSkeleton key={i} />
            )
          )}

        </div>

      ) : (

        <div
          className="stats-grid"
          style={{ marginBottom: "28px" }}
        >

          <StatCard
            label="Total Products"
            value={totalProducts}
            sub="Active sweet listings"
            emoji="🍬"
            borderColor="#c97c2e"
            dark={dark}
          />

          <StatCard
            label="Total Inventory"
            value={totalStock}
            sub="Units currently in stock"
            emoji="📦"
            borderColor="#16a34a"
            dark={dark}
          />

          <StatCard
            label="Low Stock"
            value={lowStockCount}
            sub="Need restocking soon"
            emoji="⚠️"
            borderColor="#d97706"
            dark={dark}
          />

          <StatCard
            label="Out of Stock"
            value={outOfStock}
            sub="Unavailable items"
            emoji="❌"
            borderColor="#dc2626"
            dark={dark}
          />

        </div>
      )}

      {/* Search */}
      <div
        style={{
          marginBottom: "20px",
        }}
      >

        <input
          type="text"

          placeholder="Search sweets by name or category..."

          value={search}

          onChange={(e) =>
            setSearch(e.target.value)
          }

          style={{
            width: "100%",
            maxWidth: "420px",

            padding: "12px 14px",

            borderRadius: "10px",

            backgroundColor: dark
              ? "#1c1917"
              : "#ffffff",

            border: `1.5px solid ${
              dark
                ? "#44403c"
                : "#e7e5e4"
            }`,

            color: dark
              ? "#e7e5e4"
              : "#1c1917",

            outline: "none",

            fontSize: "14px",
          }}
        />

      </div>

      {/* Table */}
      <div className="table-scroll">

        <div
          style={{
            minWidth: "760px",

            borderRadius: "16px",

            overflow: "hidden",

            backgroundColor: dark
              ? "#1c1917"
              : "#ffffff",

            border: `1px solid ${
              dark
                ? "#292524"
                : "#f0e0c8"
            }`,
          }}
        >

          {/* Table Head */}
          <div
            style={{
              display: "grid",

              gridTemplateColumns:
                "2fr 1fr 1fr 1fr 1fr",

              padding: "14px 18px",

              backgroundColor: dark
                ? "#141110"
                : "#fdf6ec",

              borderBottom: `1px solid ${
                dark
                  ? "#292524"
                  : "#f5ebe0"
              }`,
            }}
          >

            {[
              "Sweet",
              "Category",
              "Price",
              "Stock",
              "Actions",
            ].map((h) => (

              <div
                key={h}

                style={{
                  fontSize: "12px",

                  fontWeight: 800,

                  textTransform: "uppercase",

                  letterSpacing: "0.6px",

                  color: "#78716c",
                }}
              >
                {h}
              </div>
            ))}

          </div>

          {/* Rows */}
          {loading ? (

            Array.from({ length: 6 }).map(
              (_, i) => (
                <TableRowSkeleton key={i} />
              )
            )

          ) : filtered.length === 0 ? (

            <div
              style={{
                padding: "40px",

                textAlign: "center",

                color: dark
                  ? "#a8a29e"
                  : "#78716c",
              }}
            >
              No sweets found
            </div>

          ) : (

            filtered.map((sweet) => (

              <div
                key={sweet.id}

                style={{
                  display: "grid",

                  gridTemplateColumns:
                    "2fr 1fr 1fr 1fr 1fr",

                  padding: "16px 18px",

                  alignItems: "center",

                  borderBottom: `1px solid ${
                    dark
                      ? "#292524"
                      : "#fdf0d8"
                  }`,
                }}
              >

                <div
                  style={{
                    fontWeight: 700,

                    color: dark
                      ? "#e7e5e4"
                      : "#1c1917",
                  }}
                >
                  {sweet.name}
                </div>

                <div>{sweet.category}</div>

                <div>
                  ₹{Number(sweet.price).toFixed(2)}
                </div>

                <div>
                  <StockPill
                    qty={sweet.quantity}
                  />
                </div>

                <div
                  style={{
                    display: "flex",
                    gap: "8px",
                  }}
                >

                  <button
                    onClick={() =>
                      navigate(
                        `/sweets/update/${sweet.id}`
                      )
                    }

                    style={{
                      backgroundColor: dark
                        ? "#292524"
                        : "#ffffff",

                      color: dark
                        ? "#d4ccc8"
                        : "#1c1917",

                      border: `1.5px solid ${
                        dark
                          ? "#44403c"
                          : "#e7e5e4"
                      }`,

                      padding: "8px 12px",

                      borderRadius: "8px",

                      cursor: "pointer",

                      fontWeight: 700,
                    }}
                  >
                    Edit
                  </button>

                  <button
                    onClick={() =>
                      handleDelete(sweet)
                    }

                    disabled={
                      deletingId === sweet.id
                    }

                    style={{
                      backgroundColor: "#dc2626",

                      color: "#ffffff",

                      border: "none",

                      padding: "8px 12px",

                      borderRadius: "8px",

                      cursor: "pointer",

                      fontWeight: 700,
                    }}
                  >
                    {deletingId === sweet.id
                      ? "Deleting..."
                      : "Delete"}
                  </button>

                </div>

              </div>
            ))
          )}

        </div>

      </div>

    </div>
  );
}