// src/components/SweetCard.jsx

import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useCart } from "../context/CartContext";
import { useToast } from "../context/ToastContext";
import { useDark } from "../hooks/useDark";
import { deleteSweet } from "../services/sweetService";

// ─── Emoji map ────────────────────────────────────────────────────────────────
const getEmoji = (str = "") => {
  const map = {
    chocolate: "🍫",
    candy: "🍬",
    cake: "🍰",
    cookie: "🍪",
    lollipop: "🍭",
    ice: "🍦",
    donut: "🍩",
    cupcake: "🧁",
    barfi: "🟨",
    ladoo: "🟠",
    halwa: "🍮",
    indian: "🪔",
    bengali: "🌸",
    premium: "👑",
    mithai: "🎁",
  };

  const key = str.toLowerCase();

  for (const [word, emoji] of Object.entries(map)) {
    if (key.includes(word)) return emoji;
  }

  return "🍬";
};

// ─── Stock badge ──────────────────────────────────────────────────────────────
const StockBadge = ({ qty }) => {
  if (qty <= 0)
    return (
      <span
        style={{
          fontSize: "11px",
          fontWeight: 700,
          padding: "2px 8px",
          borderRadius: "999px",
          backgroundColor: "#fee2e2",
          color: "#dc2626",
          letterSpacing: "0.3px",
        }}
      >
        Out of stock
      </span>
    );

  if (qty <= 5)
    return (
      <span
        style={{
          fontSize: "11px",
          fontWeight: 700,
          padding: "2px 8px",
          borderRadius: "999px",
          backgroundColor: "#fef3c7",
          color: "#d97706",
          letterSpacing: "0.3px",
        }}
      >
        Only {qty} left
      </span>
    );

  return (
    <span
      style={{
        fontSize: "11px",
        fontWeight: 700,
        padding: "2px 8px",
        borderRadius: "999px",
        backgroundColor: "#dcfce7",
        color: "#16a34a",
        letterSpacing: "0.3px",
      }}
    >
      {qty} in stock
    </span>
  );
};

// ─── Main component ───────────────────────────────────────────────────────────
export default function SweetCard({ sweet, onDelete }) {
  const dark = useDark();

  const { user } = useAuth();
  const { addToCart, cartItems } = useCart();
  const { success, error: toastError } = useToast();

  const navigate = useNavigate();

  const [deleting, setDeleting] = useState(false);
  const [addFlash, setAddFlash] = useState(false);
  const [hovered, setHovered] = useState(false);

  const isAdmin = user?.role === "admin";

  const inCart =
    cartItems.find((i) => i.id === sweet.id)?.cartQty || 0;

  const isOutOfStock =
    !sweet.quantity || sweet.quantity <= 0;

  const isMaxed =
    inCart >= sweet.quantity;

  // ── Add to cart ─────────────────────────────────────────────────────────────
  const handleAddToCart = () => {
    if (isOutOfStock || isMaxed) return;

    addToCart(sweet);

    setAddFlash(true);

    setTimeout(() => {
      setAddFlash(false);
    }, 1400);

    success(`${sweet.name} added to cart! 🛒`);
  };

  // ── Delete ─────────────────────────────────────────────────────────────────
  const handleDelete = async () => {
    if (
      !window.confirm(
        `Delete "${sweet.name}"? This cannot be undone.`
      )
    )
      return;

    setDeleting(true);

    try {
      await deleteSweet(sweet.id);

      onDelete?.(sweet.id);

      success(`"${sweet.name}" deleted successfully`);
    } catch {
      toastError(`Failed to delete "${sweet.name}"`);
    } finally {
      setDeleting(false);
    }
  };

  // ── Button label ────────────────────────────────────────────────────────────
  const cartBtnLabel = () => {
    if (addFlash) return "✓ Added!";

    if (isOutOfStock) return "Out of Stock";

    if (isMaxed) return "Cart Full";

    return "🛒 Add to Cart";
  };

  const cartBtnColor = () => {
    if (addFlash) return "#16a34a";

    if (isOutOfStock || isMaxed)
      return "#d4b896";

    return hovered
      ? "#a8621f"
      : "#c97c2e";
  };

  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        backgroundColor: dark
          ? "#1c1917"
          : "#ffffff",

        borderRadius: "16px",

        border: `1px solid ${
          dark ? "#292524" : "#f0e0c8"
        }`,

        overflow: "hidden",

        display: "flex",
        flexDirection: "column",

        transition:
          "transform 0.2s ease, box-shadow 0.2s ease",

        transform: hovered
          ? "translateY(-4px)"
          : "translateY(0)",

        boxShadow: hovered
          ? "0 12px 32px rgba(59,31,10,0.15)"
          : "0 2px 8px rgba(59,31,10,0.07)",
      }}
    >
      {/* ── Image area ───────────────────────────────────────────── */}
      <div
        style={{
          position: "relative",

          backgroundColor: dark
            ? "#292524"
            : "#fdf0d8",

          height: "148px",

          display: "flex",
          alignItems: "center",
          justifyContent: "center",

          overflow: "hidden",
        }}
      >
        {/* Emoji */}
        <span
          style={{
            fontSize: "56px",
            lineHeight: 1,
            userSelect: "none",

            transition: "transform 0.3s ease",

            transform: hovered
              ? "scale(1.12)"
              : "scale(1)",
          }}
        >
          {getEmoji(sweet.category || sweet.name)}
        </span>

        {/* Category badge */}
        {sweet.category && (
          <span
            style={{
              position: "absolute",
              top: "10px",
              left: "10px",

              fontSize: "10px",
              fontWeight: 800,
              letterSpacing: "0.6px",
              textTransform: "uppercase",

              padding: "3px 8px",

              borderRadius: "999px",

              backgroundColor: dark
                ? "rgba(28,25,23,0.92)"
                : "rgba(255,255,255,0.92)",

              color: "#c97c2e",

              boxShadow:
                "0 1px 4px rgba(0,0,0,0.08)",
            }}
          >
            {sweet.category}
          </span>
        )}

        {/* Cart badge */}
        {inCart > 0 && (
          <span
            style={{
              position: "absolute",
              top: "10px",
              right: "10px",

              fontSize: "10px",
              fontWeight: 800,

              padding: "3px 8px",

              borderRadius: "999px",

              backgroundColor: "#c97c2e",
              color: "#ffffff",

              boxShadow:
                "0 1px 4px rgba(0,0,0,0.15)",
            }}
          >
            {inCart} in cart
          </span>
        )}

        {/* Out of stock */}
        {isOutOfStock && (
          <div
            style={{
              position: "absolute",
              inset: 0,

              backgroundColor:
                "rgba(255,255,255,0.6)",

              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <span
              style={{
                fontSize: "12px",
                fontWeight: 800,

                color: "#dc2626",

                backgroundColor: "#fee2e2",

                padding: "4px 12px",

                borderRadius: "999px",

                letterSpacing: "0.5px",
                textTransform: "uppercase",
              }}
            >
              Sold Out
            </span>
          </div>
        )}
      </div>

      {/* ── Body ─────────────────────────────────────────────── */}
      <div
        style={{
          padding: "16px",

          display: "flex",
          flexDirection: "column",

          gap: "10px",

          flexGrow: 1,
        }}
      >
        {/* Name */}
        <h3
          style={{
            margin: 0,

            fontSize: "15px",
            fontWeight: 700,

            color: dark
              ? "#e7e5e4"
              : "#1c1917",

            lineHeight: 1.3,
          }}
        >
          {sweet.name}
        </h3>

        {/* Description */}
        {sweet.description && (
          <p
            style={{
              margin: 0,

              fontSize: "12px",

              color: dark
                ? "#a8a29e"
                : "#78716c",

              lineHeight: 1.5,

              display: "-webkit-box",

              WebkitLineClamp: 2,
              WebkitBoxOrient: "vertical",

              overflow: "hidden",
            }}
          >
            {sweet.description}
          </p>
        )}

        {/* Price row */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",

            marginTop: "2px",
          }}
        >
          <span
            style={{
              fontSize: "20px",
              fontWeight: 800,

              color: "#c97c2e",

              letterSpacing: "-0.3px",
            }}
          >
            ₹{Number(sweet.price || 0).toFixed(2)}
          </span>

          <StockBadge qty={sweet.quantity} />
        </div>

        {/* Cart indicator */}
        {inCart > 0 && (
          <p
            style={{
              margin: 0,

              fontSize: "12px",

              color: "#16a34a",

              fontWeight: 600,
            }}
          >
            ✓ {inCart} already in your cart
          </p>
        )}

        {/* Add to cart */}
        <button
          onClick={handleAddToCart}
          disabled={isOutOfStock || isMaxed}
          style={{
            width: "100%",

            padding: "12px",

            minHeight: "44px",

            borderRadius: "10px",

            border: "none",

            backgroundColor: cartBtnColor(),

            color:
              isOutOfStock || isMaxed
                ? "#92400e"
                : "#ffffff",

            fontSize: "14px",
            fontWeight: 700,

            cursor:
              isOutOfStock || isMaxed
                ? "not-allowed"
                : "pointer",

            transition:
              "background-color 0.2s ease",

            marginTop: "2px",
          }}
        >
          {cartBtnLabel()}
        </button>

        {/* Admin controls */}
        {isAdmin && (
          <div
            style={{
              display: "flex",

              gap: "8px",

              paddingTop: "10px",

              borderTop: `1px solid ${
                dark ? "#292524" : "#f5ebe0"
              }`,

              marginTop: "2px",
            }}
          >
            {/* Edit */}
            <button
              onClick={() =>
                navigate(`/sweets/update/${sweet.id}`)
              }
              style={{
                flex: 1,

                padding: "8px",

                minHeight: "40px",

                borderRadius: "8px",

                border: `1.5px solid ${
                  dark
                    ? "#44403c"
                    : "#e7e5e4"
                }`,

                backgroundColor: dark
                  ? "#292524"
                  : "#ffffff",

                color: dark
                  ? "#e7e5e4"
                  : "#1c1917",

                fontSize: "12px",
                fontWeight: 700,

                cursor: "pointer",

                transition: "all 0.15s ease",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor =
                  dark ? "#3f3f46" : "#f5f5f4";

                e.currentTarget.style.borderColor =
                  "#c97c2e";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor =
                  dark ? "#292524" : "#ffffff";

                e.currentTarget.style.borderColor =
                  dark ? "#44403c" : "#e7e5e4";
              }}
            >
              ✏️ Edit
            </button>

            {/* Delete */}
            <button
              onClick={handleDelete}
              disabled={deleting}
              style={{
                flex: 1,

                padding: "8px",

                minHeight: "40px",

                borderRadius: "8px",

                border: "1.5px solid #fecaca",

                backgroundColor: "#fff1f2",

                color: "#dc2626",

                fontSize: "12px",
                fontWeight: 700,

                cursor: deleting
                  ? "not-allowed"
                  : "pointer",

                opacity: deleting ? 0.6 : 1,

                transition: "all 0.15s ease",
              }}
              onMouseEnter={(e) => {
                if (!deleting) {
                  e.currentTarget.style.backgroundColor =
                    "#fee2e2";

                  e.currentTarget.style.borderColor =
                    "#f87171";
                }
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor =
                  "#fff1f2";

                e.currentTarget.style.borderColor =
                  "#fecaca";
              }}
            >
              {deleting
                ? "Deleting…"
                : "🗑️ Delete"}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}