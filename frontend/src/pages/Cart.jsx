// src/pages/Cart.jsx

import { useState } from "react";
import { useNavigate } from "react-router-dom";

import { useCart } from "../context/CartContext";
import { useDark } from "../hooks/useDark";

import { purchaseSweets } from "../services/purchaseService";

import { getErrorMessage } from "../api/axios";

import QuantityControl from "../components/QuantityControl";

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

export default Cart;