// src/components/CartSidebar.jsx

import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import { useCart } from "../context/CartContext";
import { useToast } from "../context/ToastContext";

import { useDark } from "../hooks/useDark";

// ─── Emoji helper ─────────────────────────────────────────────────────────────
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
    indian: "🪔",
    bengali: "🌸",
    premium: "👑",
    ladoo: "🟠",
  };

  const key = str.toLowerCase();

  for (const [word, emoji] of Object.entries(map)) {
    if (key.includes(word)) return emoji;
  }

  return "🍬";
};

// ─── Quantity control ─────────────────────────────────────────────────────────
const QtyControl = ({
  item,
  onIncrease,
  onDecrease,
  dark,
}) => {

  const isMin =
    item.cartQty <= 1;

  const isMaxed =
    item.cartQty >= item.quantity;

  return (
    <div
      style={{
        display: "inline-flex",
        alignItems: "center",

        border: `1.5px solid ${
          dark ? "#44403c" : "#e7e5e4"
        }`,

        borderRadius: "8px",

        overflow: "hidden",

        backgroundColor: dark
          ? "#1c1917"
          : "#ffffff",
      }}
    >

      {/* Minus */}
      <button
        onClick={onDecrease}
        disabled={isMin}
        style={{
          width: "28px",
          height: "28px",

          border: `1px solid ${
            dark ? "#44403c" : "transparent"
          }`,

          backgroundColor: isMin
            ? dark
              ? "#1c1917"
              : "#f5f5f4"
            : dark
            ? "#292524"
            : "#fdf0d8",

          color: isMin
            ? dark
              ? "#57534e"
              : "#c4b5a5"
            : dark
            ? "#e7e5e4"
            : "#3b1f0a",

          fontSize: "16px",
          fontWeight: 700,

          cursor: isMin
            ? "not-allowed"
            : "pointer",

          display: "flex",
          alignItems: "center",
          justifyContent: "center",

          transition:
            "background-color 0.15s",
        }}
      >
        −
      </button>

      {/* Qty */}
      <span
        style={{
          minWidth: "28px",

          textAlign: "center",

          fontSize: "13px",
          fontWeight: 700,

          color: dark
            ? "#e7e5e4"
            : "#1c1917",

          padding: "0 2px",
        }}
      >
        {item.cartQty}
      </span>

      {/* Plus */}
      <button
        onClick={onIncrease}
        disabled={isMaxed}
        style={{
          width: "28px",
          height: "28px",

          border: `1px solid ${
            dark ? "#44403c" : "transparent"
          }`,

          backgroundColor: isMaxed
            ? dark
              ? "#1c1917"
              : "#f5f5f4"
            : dark
            ? "#292524"
            : "#fdf0d8",

          color: isMaxed
            ? dark
              ? "#57534e"
              : "#c4b5a5"
            : dark
            ? "#e7e5e4"
            : "#3b1f0a",

          fontSize: "16px",
          fontWeight: 700,

          cursor: isMaxed
            ? "not-allowed"
            : "pointer",

          display: "flex",
          alignItems: "center",
          justifyContent: "center",

          transition:
            "background-color 0.15s",
        }}
      >
        +
      </button>
    </div>
  );
};

// ─── Main component ───────────────────────────────────────────────────────────
export default function CartSidebar({
  open,
  onClose,
}) {

  const dark = useDark();

  const navigate = useNavigate();

  const { info } = useToast();

  const {
    cartItems,
    increaseQty,
    decreaseQty,
    removeFromCart,
    clearCart,
    totalItems,
    totalPrice,
  } = useCart();

  // Animate in/out
  const [visible, setVisible] =
    useState(false);

  useEffect(() => {

    if (open) {

      requestAnimationFrame(() =>
        setVisible(true)
      );

    } else {

      setVisible(false);
    }

  }, [open]);

  // Lock body scroll
  useEffect(() => {

    document.body.style.overflow =
      open ? "hidden" : "";

    return () => {
      document.body.style.overflow = "";
    };

  }, [open]);

  // Escape close
  useEffect(() => {

    const handler = (e) => {

      if (e.key === "Escape") {
        onClose();
      }
    };

    window.addEventListener(
      "keydown",
      handler
    );

    return () =>
      window.removeEventListener(
        "keydown",
        handler
      );

  }, [onClose]);

  const handleClearAll = () => {

    clearCart();

    info("Cart cleared");
  };

  const handleCheckout = () => {

    onClose();

    navigate("/cart");
  };

  const subtotal = totalPrice;

  const canCheckout =
    cartItems.length > 0;

  return (
    <>

      {/* Backdrop */}
      <div
        onClick={onClose}
        style={{
          position: "fixed",
          inset: 0,
          zIndex: 99,

          backgroundColor:
            "rgba(0,0,0,0.45)",

          backdropFilter: "blur(2px)",

          opacity: visible ? 1 : 0,

          pointerEvents: open
            ? "auto"
            : "none",

          transition:
            "opacity 0.3s ease",
        }}
      />

      {/* Drawer */}
      <aside
        style={{
          position: "fixed",
          top: 0,
          right: 0,
          bottom: 0,

          zIndex: 100,

          width: "100%",
          maxWidth: "380px",

          backgroundColor: dark
            ? "#1c1917"
            : "#ffffff",

          boxShadow:
            "-8px 0 32px rgba(0,0,0,0.12)",

          display: "flex",
          flexDirection: "column",

          transform: visible
            ? "translateX(0)"
            : "translateX(100%)",

          transition:
            "transform 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
        }}
      >

        {/* Header */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",

            padding: "18px 20px",

            borderBottom: `1px solid ${
              dark
                ? "#292524"
                : "#f5ebe0"
            }`,

            flexShrink: 0,
          }}
        >

          <div>

            <h2
              style={{
                margin: 0,

                fontSize: "17px",
                fontWeight: 800,

                color: dark
                  ? "#e7e5e4"
                  : "#1c1917",
              }}
            >
              🛒 Your Cart
            </h2>

            {totalItems > 0 && (
              <p
                style={{
                  margin: "2px 0 0",

                  fontSize: "12px",

                  color: dark
                    ? "#a8a29e"
                    : "#78716c",
                }}
              >
                {totalItems} item
                {totalItems !== 1
                  ? "s"
                  : ""}
              </p>
            )}

          </div>

          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "8px",
            }}
          >

            {cartItems.length > 0 && (
              <button
                onClick={handleClearAll}
                style={{
                  padding: "5px 10px",

                  borderRadius: "6px",

                  border:
                    "1px solid #fecaca",

                  backgroundColor:
                    "#fff1f2",

                  color: "#dc2626",

                  fontSize: "11px",
                  fontWeight: 700,

                  cursor: "pointer",
                }}
              >
                Clear all
              </button>
            )}

            {/* Close */}
            <button
              onClick={onClose}
              aria-label="Close cart"
              style={{
                width: "32px",
                height: "32px",

                borderRadius: "8px",

                border: `1px solid ${
                  dark
                    ? "#44403c"
                    : "#e7e5e4"
                }`,

                backgroundColor: dark
                  ? "#292524"
                  : "#f5f5f4",

                color: dark
                  ? "#a8a29e"
                  : "#78716c",

                fontSize: "18px",

                cursor: "pointer",

                display: "flex",
                alignItems: "center",
                justifyContent: "center",

                lineHeight: 1,
              }}
            >
              ×
            </button>

          </div>
        </div>

        {/* Body */}
        <div
          style={{
            flex: 1,

            overflowY: "auto",

            padding: "12px 20px",

            display: "flex",
            flexDirection: "column",

            gap: "2px",
          }}
        >

          {cartItems.length === 0 ? (

            /* Empty */
            <div
              style={{
                flex: 1,

                display: "flex",
                flexDirection: "column",

                alignItems: "center",
                justifyContent: "center",

                padding: "60px 20px",

                gap: "12px",

                textAlign: "center",
              }}
            >

              <span
                style={{
                  fontSize: "52px",
                }}
              >
                🛒
              </span>

              <p
                style={{
                  margin: 0,

                  fontSize: "16px",
                  fontWeight: 700,

                  color: dark
                    ? "#e7e5e4"
                    : "#1c1917",
                }}
              >
                Your cart is empty
              </p>

              <p
                style={{
                  margin: 0,

                  fontSize: "13px",

                  color: dark
                    ? "#a8a29e"
                    : "#78716c",
                }}
              >
                Add some sweets to get started!
              </p>

              <button
                onClick={onClose}
                style={{
                  marginTop: "8px",

                  padding: "10px 24px",

                  borderRadius: "10px",

                  border: "none",

                  backgroundColor:
                    "#c97c2e",

                  color: "#ffffff",

                  fontSize: "13px",
                  fontWeight: 700,

                  cursor: "pointer",
                }}
              >
                Browse Sweets
              </button>
            </div>

          ) : (

            cartItems.map((item) => (

              <div
                key={item.id}
                style={{
                  display: "flex",
                  alignItems: "center",

                  gap: "12px",

                  padding: "12px 0",

                  borderBottom: `1px solid ${
                    dark
                      ? "#292524"
                      : "#f5f5f4"
                  }`,
                }}
              >

                {/* Thumbnail */}
                <div
                  style={{
                    width: "48px",
                    height: "48px",

                    borderRadius: "10px",

                    backgroundColor: dark
                      ? "#292524"
                      : "#fdf0d8",

                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",

                    fontSize: "24px",

                    flexShrink: 0,
                  }}
                >
                  {getEmoji(
                    item.category ||
                    item.name
                  )}
                </div>

                {/* Info */}
                <div
                  style={{
                    flex: 1,
                    minWidth: 0,
                  }}
                >

                  <p
                    style={{
                      margin: "0 0 2px",

                      fontSize: "13px",
                      fontWeight: 700,

                      color: dark
                        ? "#e7e5e4"
                        : "#1c1917",

                      whiteSpace: "nowrap",

                      overflow: "hidden",

                      textOverflow:
                        "ellipsis",
                    }}
                  >
                    {item.name}
                  </p>

                  <p
                    style={{
                      margin: "0 0 6px",

                      fontSize: "11px",

                      color: dark
                        ? "#a8a29e"
                        : "#78716c",
                    }}
                  >
                    ₹{Number(item.price).toFixed(2)} each
                  </p>

                  <QtyControl
                    item={item}
                    dark={dark}
                    onIncrease={() =>
                      increaseQty(item.id)
                    }
                    onDecrease={() =>
                      decreaseQty(item.id)
                    }
                  />

                </div>

                {/* Right */}
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",

                    alignItems: "flex-end",

                    gap: "8px",

                    flexShrink: 0,
                  }}
                >

                  <span
                    style={{
                      fontSize: "14px",
                      fontWeight: 800,

                      color: "#c97c2e",
                    }}
                  >
                    ₹{(
                      item.cartQty *
                      Number(item.price)
                    ).toFixed(2)}
                  </span>

                  <button
                    onClick={() =>
                      removeFromCart(item.id)
                    }
                    title="Remove item"
                    style={{
                      width: "24px",
                      height: "24px",

                      borderRadius: "6px",

                      border:
                        "1px solid #fecaca",

                      backgroundColor:
                        "#fff1f2",

                      color: "#dc2626",

                      fontSize: "14px",

                      cursor: "pointer",

                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",

                      lineHeight: 1,
                    }}
                  >
                    ×
                  </button>

                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        {canCheckout && (
          <div
            style={{
              borderTop: `1px solid ${
                dark
                  ? "#292524"
                  : "#f5ebe0"
              }`,

              padding: "16px 20px",

              flexShrink: 0,

              backgroundColor: dark
                ? "#141110"
                : "#fffdf9",
            }}
          >

            {/* Subtotal */}
            <div
              style={{
                display: "flex",
                justifyContent:
                  "space-between",

                alignItems: "center",

                marginBottom: "14px",
              }}
            >

              <span
                style={{
                  fontSize: "13px",

                  color: dark
                    ? "#a8a29e"
                    : "#78716c",

                  fontWeight: 600,
                }}
              >
                Subtotal ({totalItems} items)
              </span>

              <span
                style={{
                  fontSize: "20px",
                  fontWeight: 900,

                  color: dark
                    ? "#e7e5e4"
                    : "#1c1917",
                }}
              >
                ₹{subtotal.toFixed(2)}
              </span>

            </div>

            {/* Checkout */}
            <button
              onClick={handleCheckout}
              style={{
                width: "100%",

                padding: "13px",

                borderRadius: "12px",

                border: "none",

                backgroundColor:
                  "#c97c2e",

                color: "#ffffff",

                fontSize: "14px",
                fontWeight: 800,

                cursor: "pointer",

                marginBottom: "8px",

                transition:
                  "background-color 0.15s",
              }}
              onMouseEnter={(e) =>
                e.currentTarget.style.backgroundColor =
                  "#a8621f"
              }
              onMouseLeave={(e) =>
                e.currentTarget.style.backgroundColor =
                  "#c97c2e"
              }
            >
              Proceed to Checkout →
            </button>

            {/* Continue */}
            <button
              onClick={onClose}
              style={{
                width: "100%",

                padding: "10px",

                borderRadius: "12px",

                border: `1.5px solid ${
                  dark
                    ? "#44403c"
                    : "#e7e5e4"
                }`,

                backgroundColor: dark
                  ? "#292524"
                  : "#ffffff",

                color: dark
                  ? "#d4ccc8"
                  : "#57534e",

                fontSize: "13px",
                fontWeight: 600,

                cursor: "pointer",
              }}
            >
              Continue Shopping
            </button>

            {/* Trust note */}
            <p
              style={{
                margin: "10px 0 0",

                textAlign: "center",

                fontSize: "11px",

                color: "#a8a29e",
              }}
            >
              🔒 Secure checkout · Stock reserved at purchase
            </p>

          </div>
        )}

      </aside>
    </>
  );
}