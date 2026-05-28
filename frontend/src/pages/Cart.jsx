// src/pages/Cart.jsx

import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { purchaseSweets } from "../services/purchaseService";
import QuantityControl from "../components/QuantityControl";

const Cart = () => {
  const navigate = useNavigate();
  const {
    cartItems, increaseQty, decreaseQty,
    removeFromCart, clearCart, totalItems, totalPrice,
  } = useCart();

  const [placing, setPlacing] = useState(false);
  const [error, setError] = useState("");

  // Guard: no items
  const isEmpty = cartItems.length === 0;

  // Tax and delivery — adjust as needed
  const TAX_RATE = 0.05;
  const DELIVERY = totalPrice > 500 ? 0 : 40;
  const tax = totalPrice * TAX_RATE;
  const grandTotal = totalPrice + tax + DELIVERY;

  const handlePlaceOrder = async () => {
    if (isEmpty) return;
    setPlacing(true);
    setError("");

    try {
      // Build payload: array of { sweetId, quantity }
      const items = cartItems.map((item) => ({
        sweetId: item.id,
        quantity: item.cartQty,
      }));

      const result = await purchaseSweets(items);

      // Clear cart and go to success page
      clearCart();
      navigate("/order-success", {
        state: {
          order: result,
          items: cartItems,
          total: grandTotal,
        },
      });
    } catch (err) {
      setError(
        err.response?.data?.message ||
        "Purchase failed. Please check stock and try again."
      );
    } finally {
      setPlacing(false);
    }
  };

  return (
    <div style={styles.page}>
      {/* Page Title */}
      <div style={styles.pageHeader}>
        <button onClick={() => navigate("/sweets")} style={styles.backBtn}>
          ← Continue Shopping
        </button>
        <h1 style={styles.title}>🛒 Your Cart</h1>
      </div>

      {isEmpty ? (
        /* Empty State */
        <div style={styles.emptyState}>
          <span style={{ fontSize: "4rem" }}>🛒</span>
          <h2 style={styles.emptyTitle}>Your cart is empty</h2>
          <p style={styles.emptySubtitle}>
            Head back to the sweets list and add some treats!
          </p>
          <button
            onClick={() => navigate("/sweets")}
            style={styles.shopBtn}
          >
            🍬 Browse Sweets
          </button>
        </div>
      ) : (
        /* Two-column layout */
        <div style={styles.layout}>
          {/* LEFT: Cart Items */}
          <div style={styles.itemsPanel}>
            <div style={styles.panelHeader}>
              <h2 style={styles.panelTitle}>
                Items ({totalItems})
              </h2>
              <button onClick={clearCart} style={styles.clearAllBtn}>
                Clear All
              </button>
            </div>

            {cartItems.map((item) => {
              const itemTotal = item.cartQty * Number(item.price || 0);
              const isLowStock = item.quantity < 5;

              return (
                <div key={item.id} style={styles.cartRow}>
                  {/* Emoji */}
                  <div style={styles.rowEmoji}>
                    {getEmoji(item.category || item.name)}
                  </div>

                  {/* Info */}
                  <div style={styles.rowInfo}>
                    <span style={styles.rowName}>{item.name}</span>
                    {item.category && (
                      <span style={styles.rowCategory}>{item.category}</span>
                    )}
                    <span style={styles.rowUnitPrice}>
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
                      onIncrease={() => increaseQty(item.id)}
                      onDecrease={() => decreaseQty(item.id)}
                      max={item.quantity}
                      min={1}
                      size="sm"
                    />
                    <span style={styles.rowTotal}>
                      ₹{itemTotal.toFixed(2)}
                    </span>
                    <button
                      onClick={() => removeFromCart(item.id)}
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
            <h2 style={styles.summaryTitle}>Order Summary</h2>

            {/* Line items */}
            <div style={styles.summaryLines}>
              {cartItems.map((item) => (
                <div key={item.id} style={styles.summaryLine}>
                  <span style={styles.summaryLineLabel}>
                    {item.name} × {item.cartQty}
                  </span>
                  <span style={styles.summaryLineValue}>
                    ₹{(item.cartQty * Number(item.price || 0)).toFixed(2)}
                  </span>
                </div>
              ))}
            </div>

            {/* Divider */}
            <div style={styles.divider} />

            {/* Subtotal / Tax / Delivery */}
            <div style={styles.summaryCalc}>
              <div style={styles.calcRow}>
                <span>Subtotal</span>
                <span>₹{totalPrice.toFixed(2)}</span>
              </div>
              <div style={styles.calcRow}>
                <span>GST (5%)</span>
                <span>₹{tax.toFixed(2)}</span>
              </div>
              <div style={styles.calcRow}>
                <span>Delivery</span>
                <span style={{ color: DELIVERY === 0 ? "#5a7a3a" : "#3b1f0a" }}>
                  {DELIVERY === 0 ? "FREE" : `₹${DELIVERY.toFixed(2)}`}
                </span>
              </div>
              {DELIVERY > 0 && (
                <p style={styles.freeDeliveryHint}>
                  Add ₹{(500 - totalPrice).toFixed(2)} more for free delivery!
                </p>
              )}
            </div>

            <div style={styles.divider} />

            {/* Grand Total */}
            <div style={styles.grandTotalRow}>
              <span style={styles.grandTotalLabel}>Total</span>
              <span style={styles.grandTotalValue}>
                ₹{grandTotal.toFixed(2)}
              </span>
            </div>

            {/* Error */}
            {error && <div style={styles.errorBox}>{error}</div>}

            {/* Place Order Button */}
            <button
              onClick={handlePlaceOrder}
              disabled={placing || isEmpty}
              style={{
                ...styles.placeOrderBtn,
                opacity: placing ? 0.7 : 1,
              }}
            >
              {placing ? (
                <span>⏳ Placing Order...</span>
              ) : (
                <span>✅ Place Order · ₹{grandTotal.toFixed(2)}</span>
              )}
            </button>

            {/* Secure note */}
            <p style={styles.secureNote}>
              🔒 Secure checkout · Stock reserved at purchase
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

// Emoji helper (same as SweetCard)
const getEmoji = (str = "") => {
  const map = {
    chocolate: "🍫", candy: "🍬", cake: "🍰",
    cookie: "🍪", lollipop: "🍭", ice: "🍦",
    donut: "🍩", cupcake: "🧁",
  };
  const key = str.toLowerCase();
  for (const [word, emoji] of Object.entries(map)) {
    if (key.includes(word)) return emoji;
  }
  return "🍬";
};

const styles = {
  page: {
    maxWidth: "1100px",
    margin: "0 auto",
    padding: "32px 20px",
    minHeight: "calc(100vh - 64px)",
    backgroundColor: "#fdf6ec",
  },
  pageHeader: { marginBottom: "28px" },
  backBtn: {
    background: "none", border: "none",
    color: "#8b6347", cursor: "pointer",
    fontSize: "0.9rem", padding: "0",
    marginBottom: "8px", display: "block",
  },
  title: {
    fontSize: "2rem", fontWeight: "800",
    color: "#3b1f0a", margin: 0,
  },
  emptyState: {
    textAlign: "center", padding: "80px 20px",
  },
  emptyTitle: {
    fontSize: "1.5rem", fontWeight: "700",
    color: "#3b1f0a", margin: "16px 0 8px",
  },
  emptySubtitle: { color: "#8b6347", marginBottom: "24px" },
  shopBtn: {
    backgroundColor: "#c97c2e", color: "#fff",
    border: "none", padding: "13px 28px",
    borderRadius: "10px", fontSize: "1rem",
    fontWeight: "700", cursor: "pointer",
  },
  layout: {
    display: "grid",
    gridTemplateColumns: "1fr 360px",
    gap: "28px",
    alignItems: "flex-start",
  },
  itemsPanel: {
    backgroundColor: "#fff",
    borderRadius: "16px",
    border: "1px solid #f0e0c8",
    padding: "24px",
    boxShadow: "0 4px 16px rgba(59,31,10,0.07)",
  },
  panelHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "20px",
  },
  panelTitle: { fontSize: "1.1rem", fontWeight: "700", color: "#3b1f0a", margin: 0 },
  clearAllBtn: {
    background: "none", border: "none",
    color: "#c0392b", cursor: "pointer",
    fontSize: "0.85rem", fontWeight: "600",
  },
  cartRow: {
    display: "flex",
    alignItems: "center",
    gap: "14px",
    padding: "16px 0",
    borderBottom: "1px solid #f5eadc",
  },
  rowEmoji: { fontSize: "2rem", minWidth: "40px", textAlign: "center" },
  rowInfo: {
    display: "flex", flexDirection: "column",
    gap: "3px", flex: 1,
  },
  rowName: { fontWeight: "700", color: "#3b1f0a", fontSize: "0.95rem" },
  rowCategory: {
    fontSize: "0.75rem", color: "#c97c2e",
    fontWeight: "600", textTransform: "uppercase",
  },
  rowUnitPrice: { fontSize: "0.8rem", color: "#8b6347" },
  lowStockNote: {
    fontSize: "0.75rem", color: "#e67e22", fontWeight: "600",
  },
  rowRight: {
    display: "flex", flexDirection: "column",
    alignItems: "flex-end", gap: "6px",
  },
  rowTotal: {
    fontSize: "0.95rem", fontWeight: "800",
    color: "#3b1f0a",
  },
  removeBtn: {
    background: "none", border: "none",
    color: "#c0392b", cursor: "pointer",
    fontSize: "0.8rem", fontWeight: "700",
    padding: "2px 6px",
  },
  summaryPanel: {
    backgroundColor: "#3b1f0a",
    borderRadius: "16px",
    padding: "28px",
    color: "#f5e6c8",
    position: "sticky",
    top: "20px",
    boxShadow: "0 8px 32px rgba(59,31,10,0.2)",
  },
  summaryTitle: {
    fontSize: "1.15rem", fontWeight: "800",
    color: "#f5c842", margin: "0 0 20px",
  },
  summaryLines: {
    display: "flex", flexDirection: "column", gap: "8px",
    marginBottom: "16px",
  },
  summaryLine: {
    display: "flex", justifyContent: "space-between",
    fontSize: "0.85rem", color: "#d4b896",
  },
  summaryLineLabel: {
    flex: 1, marginRight: "8px",
    overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap",
  },
  summaryLineValue: { fontWeight: "600", whiteSpace: "nowrap" },
  divider: {
    borderTop: "1px solid rgba(245,230,200,0.15)",
    margin: "16px 0",
  },
  summaryCalc: { display: "flex", flexDirection: "column", gap: "10px" },
  calcRow: {
    display: "flex", justifyContent: "space-between",
    fontSize: "0.88rem", color: "#d4b896",
  },
  freeDeliveryHint: {
    fontSize: "0.75rem", color: "#f5c842",
    margin: "4px 0 0", textAlign: "right",
  },
  grandTotalRow: {
    display: "flex", justifyContent: "space-between",
    alignItems: "center", marginBottom: "20px",
  },
  grandTotalLabel: {
    fontSize: "1.05rem", fontWeight: "700", color: "#f5e6c8",
  },
  grandTotalValue: {
    fontSize: "1.5rem", fontWeight: "900", color: "#f5c842",
  },
  errorBox: {
    backgroundColor: "rgba(192,57,43,0.2)",
    border: "1px solid rgba(192,57,43,0.4)",
    color: "#ff9999",
    padding: "10px 14px",
    borderRadius: "8px",
    marginBottom: "14px",
    fontSize: "0.85rem",
  },
  placeOrderBtn: {
    width: "100%", padding: "15px",
    backgroundColor: "#c97c2e",
    color: "#fff", border: "none",
    borderRadius: "10px", fontSize: "1rem",
    fontWeight: "800", cursor: "pointer",
    marginBottom: "12px",
    letterSpacing: "0.3px",
  },
  secureNote: {
    textAlign: "center", fontSize: "0.75rem",
    color: "#8b6347", margin: 0,
  },
};

// Responsive: stack on mobile
const responsiveStyle = document.createElement("style");
responsiveStyle.textContent = `
  @media (max-width: 768px) {
    .cart-layout { grid-template-columns: 1fr !important; }
  }
`;
document.head.appendChild(responsiveStyle);

export default Cart;