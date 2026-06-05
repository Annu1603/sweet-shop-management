// src/pages/Cart.jsx

import { useState } from "react";
import { useNavigate } from "react-router-dom";

import { useCart } from "../context/CartContext";
import { useDark } from "../hooks/useDark";

import { purchaseSweets } from "../services/purchaseService";

import { getErrorMessage } from "../api/axios";

import QuantityControl from "../components/QuantityControl";

const getEmoji = (text = "") => {
  const value = text.toLowerCase();

  if (value.includes("chocolate")) return "🍫";
  if (value.includes("cake")) return "🍰";
  if (value.includes("cookie")) return "🍪";
  if (value.includes("ice")) return "🍦";
  if (value.includes("candy")) return "🍬";
  if (value.includes("bengali")) return "🌸";
  if (value.includes("premium")) return "👑";

  return "🍭";
};

const Cart = () => {

  const navigate = useNavigate();

  const dark = useDark();

  const {
    cartItems,
    increaseQty,
    decreaseQty,
    removeFromCart,
    clearCart,
    totalItems,
    totalPrice,
  } = useCart();

  const [placing, setPlacing] =
    useState(false);

  const [error, setError] =
    useState("");

  // Guard: no items
  const isEmpty =
    cartItems.length === 0;

  // Tax and delivery
  const TAX_RATE = 0.05;

  const DELIVERY =
    totalPrice > 500 ? 0 : 40;

  const tax =
    totalPrice * TAX_RATE;

  const grandTotal =
    totalPrice + tax + DELIVERY;

  const handlePlaceOrder =
    async () => {

      if (isEmpty) return;

      setPlacing(true);

      setError("");

      try {

        // Build payload
        const items =
          cartItems.map((item) => ({
            sweetId: item.id,
            quantity: item.cartQty,
          }));

        const result =
          await purchaseSweets(items);

        // Clear cart and redirect
        clearCart();

        navigate(
          "/order-success",
          {
            state: {
              order: result,
              items: cartItems,
              total: grandTotal,
            },
          }
        );

      } catch (err) {

        const msg =
          getErrorMessage(err);

        const isStockError =
          err.response?.status === 409 ||
          msg.toLowerCase().includes("stock") ||
          msg.toLowerCase().includes("quantity");

        setError(
          isStockError
            ? "Some items in your cart are out of stock. Please update quantities and try again."
            : msg
        );

      } finally {

        setPlacing(false);
      }
    };

  return (
    <div
      style={{
        ...styles.page,

        backgroundColor: dark
          ? "#0c0a09"
          : "#fafaf9",
      }}
    >

      {/* Page Title */}
      <div
        className="stack-mobile"
        style={{
          ...styles.pageHeader,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          gap: "12px",
        }}
      >

        <button
          onClick={() =>
            navigate("/sweets")
          }
          style={styles.backBtn}
        >
          ← Continue Shopping
        </button>

        <h1
          style={{
            ...styles.title,

            color: dark
              ? "#e7e5e4"
              : "#3b1f0a",
          }}
        >
          🛒 Your Cart
        </h1>

      </div>

      {isEmpty ? (

        /* Empty State */
        <div style={styles.emptyState}>

          <span
            style={{
              fontSize: "4rem",
            }}
          >
            🛒
          </span>

          <h2
            style={{
              ...styles.emptyTitle,

              color: dark
                ? "#e7e5e4"
                : "#3b1f0a",
            }}
          >
            Your cart is empty
          </h2>

          <p
            style={{
              ...styles.emptySubtitle,

              color: dark
                ? "#a8a29e"
                : "#8b6347",
            }}
          >
            Head back to the sweets list and add some treats!
          </p>

          <button
            onClick={() =>
              navigate("/sweets")
            }
            style={styles.shopBtn}
          >
            🍬 Browse Sweets
          </button>

        </div>

      ) : (

        /* Two-column layout */
        <div className="cart-layout">

          {/* LEFT: Cart Items */}
          <div
            style={{
              ...styles.itemsPanel,

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

            <div style={styles.panelHeader}>

              <h2
                style={{
                  ...styles.panelTitle,

                  color: dark
                    ? "#e7e5e4"
                    : "#3b1f0a",
                }}
              >
                Items ({totalItems})
              </h2>

              <button
                onClick={clearCart}
                style={styles.clearAllBtn}
              >
                Clear All
              </button>

            </div>

            {cartItems.map((item) => {

              const itemTotal =
                item.cartQty *
                Number(item.price || 0);

              const isLowStock =
                item.quantity < 5;

              return (
                <div
                  key={item.id}

                  style={{
                    ...styles.cartRow,

                    borderBottom: `1px solid ${
                      dark
                        ? "#292524"
                        : "#f5ebe0"
                    }`,
                  }}
                >

                  {/* Emoji */}
                  <div style={styles.rowEmoji}>
                    {getEmoji(
                      item.category ||
                      item.name
                    )}
                  </div>

                  {/* Info */}
                  <div style={styles.rowInfo}>

                    <span
                      style={{
                        ...styles.rowName,

                        color: dark
                          ? "#e7e5e4"
                          : "#3b1f0a",
                      }}
                    >
                      {item.name}
                    </span>

                    {item.category && (
                      <span style={styles.rowCategory}>
                        {item.category}
                      </span>
                    )}

                    <span
                      style={{
                        ...styles.rowUnitPrice,

                        color: dark
                          ? "#a8a29e"
                          : "#8b6347",
                      }}
                    >
                      ₹{Number(item.price).toFixed(2)} each
                    </span>

                    {isLowStock && (
                      <span style={styles.lowStockNote}>
                        ⚠️ Only {item.quantity} left
                      </span>
                    )}

                  </div>

                  {/* Qty + Price */}
                  <div style={styles.rowRight}>

                    <QuantityControl
                      quantity={item.cartQty}

                      onIncrease={() =>
                        increaseQty(item.id)
                      }

                      onDecrease={() =>
                        decreaseQty(item.id)
                      }

                      max={item.quantity}
                      min={1}

                      size="sm"
                    />

                    <span
                      style={{
                        ...styles.rowTotal,

                        color: dark
                          ? "#e7e5e4"
                          : "#3b1f0a",
                      }}
                    >
                      ₹{itemTotal.toFixed(2)}
                    </span>

                    <button
                      onClick={() =>
                        removeFromCart(item.id)
                      }

                      style={styles.removeBtn}

                      title="Remove item"
                    >
                      ✕
                    </button>

                  </div>
                </div>
              );
            })}
          </div>

          {/* RIGHT: Order Summary */}
          <div style={styles.summaryPanel}>

            <h2 style={styles.summaryTitle}>
              Order Summary
            </h2>

            {/* Stock warning */}
            {cartItems.some(
              (item) =>
                item.cartQty > item.quantity
            ) && (
              <div
                style={{
                  padding: "10px 14px",
                  borderRadius: "8px",
                  backgroundColor: "#fef3c7",
                  border: "1px solid #fcd34d",
                  marginBottom: "12px",
                  fontSize: "12px",
                  color: "#92400e",
                  fontWeight: 600,
                }}
              >
                ⚠️ Some items exceed available stock.
                Please reduce quantities before ordering.
              </div>
            )}

            {/* Error */}
            {error && (
              <div style={styles.errorBox}>
                {error}
              </div>
            )}

            {/* Place Order */}
            <button
              onClick={handlePlaceOrder}

              disabled={
                placing || isEmpty
              }

              style={{
                ...styles.placeOrderBtn,

                opacity: placing
                  ? 0.7
                  : 1,
              }}
            >

              {placing ? (

                <span>
                  ⏳ Placing Order...
                </span>

              ) : (

                <span>
                  ✅ Place Order · ₹{grandTotal.toFixed(2)}
                </span>
              )}
            </button>

          </div>
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
  },

  pageHeader: {
    marginBottom: "24px",
  },

  backBtn: {
  backgroundColor: "#ffffff",
  border: "1px solid #e7e5e4",
  borderRadius: "10px",
  padding: "10px 16px",
  cursor: "pointer",
  fontWeight: 600,
  color: "#3b1f0a",
},

  title: {
    margin: 0,
    fontSize: "2rem",
    fontWeight: 800,
  },

  emptyState: {
    textAlign: "center",
    padding: "80px 20px",
  },

  emptyTitle: {
    marginTop: "16px",
    marginBottom: "8px",
    fontSize: "1.8rem",
    fontWeight: 700,
  },

  emptySubtitle: {
    marginBottom: "24px",
  },

  shopBtn: {
    backgroundColor: "#c97c2e",
    color: "#ffffff",
    border: "none",
    borderRadius: "10px",
    padding: "12px 20px",
    cursor: "pointer",
    fontWeight: 700,
  },

  itemsPanel: {
    borderRadius: "16px",
    overflow: "hidden",
  },

  panelHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "20px",
  },

  panelTitle: {
    margin: 0,
    fontSize: "1.2rem",
    fontWeight: 700,
  },

  clearAllBtn: {
    background: "none",
    border: "none",
    color: "#dc2626",
    cursor: "pointer",
    fontWeight: 600,
  },

  cartRow: {
    display: "flex",
    gap: "16px",
    padding: "18px 20px",
    alignItems: "center",
  },

  rowEmoji: {
    width: "56px",
    height: "56px",
    borderRadius: "12px",
    backgroundColor: "#fdf0d8",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "1.8rem",
    flexShrink: 0,
  },

  rowInfo: {
    flex: 1,
    display: "flex",
    flexDirection: "column",
    gap: "4px",
  },

  rowName: {
    fontWeight: 700,
    fontSize: "1rem",
  },

  rowCategory: {
    color: "#c97c2e",
    fontSize: "13px",
    fontWeight: 600,
  },

  rowUnitPrice: {
    fontSize: "13px",
  },

  lowStockNote: {
    color: "#dc2626",
    fontSize: "12px",
    fontWeight: 600,
  },

  rowRight: {
    display: "flex",
    alignItems: "center",
    gap: "12px",
  },

  rowTotal: {
    minWidth: "90px",
    textAlign: "right",
    fontWeight: 700,
  },

  removeBtn: {
    background: "none",
    border: "none",
    color: "#dc2626",
    cursor: "pointer",
    fontSize: "16px",
  },

  summaryPanel: {
    backgroundColor: "#3b1f0a",
    color: "#ffffff",
    borderRadius: "16px",
    padding: "24px",
    position: "sticky",
    top: "90px",
  },

  summaryTitle: {
    marginTop: 0,
    marginBottom: "20px",
    fontSize: "1.2rem",
    fontWeight: 700,
  },

  errorBox: {
    backgroundColor: "#7f1d1d",
    color: "#ffffff",
    padding: "10px",
    borderRadius: "8px",
    marginBottom: "12px",
  },

  placeOrderBtn: {
    width: "100%",
    backgroundColor: "#c97c2e",
    color: "#ffffff",
    border: "none",
    borderRadius: "10px",
    padding: "14px",
    cursor: "pointer",
    fontWeight: 700,
    fontSize: "15px",
  },
};

export default Cart;