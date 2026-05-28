// src/pages/OrderSuccess.jsx

import { useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";

const OrderSuccess = () => {
  const navigate = useNavigate();
  const location = useLocation();

  // Data passed from Cart.jsx after successful purchase
  const { order, items = [], total = 0 } = location.state || {};

  // If someone visits this page directly (no state), redirect to sweets
  useEffect(() => {
    if (!location.state) {
      navigate("/sweets");
    }
  }, [location.state, navigate]);

  if (!location.state) return null;

  return (
    <div style={styles.page}>
      <div style={styles.card}>
        {/* Success Icon */}
        <div style={styles.iconWrap}>
          <span style={styles.checkIcon}>✓</span>
        </div>

        <h1 style={styles.heading}>Order Placed!</h1>
        <p style={styles.subheading}>
          Your sweets are being prepared with love 🍭
        </p>

        {/* Order ID if backend returns it */}
        {order?.id && (
          <div style={styles.orderIdBox}>
            Order #{order.id}
          </div>
        )}

        {/* Items Summary */}
        <div style={styles.itemsList}>
          <h3 style={styles.itemsHeading}>What you ordered</h3>
          {items.map((item) => (
            <div key={item.id} style={styles.itemRow}>
              <span style={styles.itemName}>
                {item.name} × {item.cartQty}
              </span>
              <span style={styles.itemAmt}>
                ₹{(item.cartQty * Number(item.price || 0)).toFixed(2)}
              </span>
            </div>
          ))}
        </div>

        {/* Grand Total */}
        <div style={styles.totalRow}>
          <span style={styles.totalLabel}>Total Paid</span>
          <span style={styles.totalValue}>₹{Number(total).toFixed(2)}</span>
        </div>

        {/* CTA Buttons */}
        <div style={styles.btnGroup}>
          <button
            onClick={() => navigate("/sweets")}
            style={styles.primaryBtn}
          >
            🍬 Shop More Sweets
          </button>
          <button
            onClick={() => navigate("/")}
            style={styles.secondaryBtn}
          >
            Go to Home
          </button>
        </div>
      </div>
    </div>
  );
};

const styles = {
  page: {
    minHeight: "calc(100vh - 64px)",
    backgroundColor: "#fdf6ec",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    padding: "32px 20px",
  },
  card: {
    backgroundColor: "#fff",
    borderRadius: "20px",
    border: "1px solid #f0e0c8",
    boxShadow: "0 12px 40px rgba(59,31,10,0.12)",
    padding: "48px 40px",
    width: "100%",
    maxWidth: "480px",
    textAlign: "center",
  },
  iconWrap: {
    width: "72px", height: "72px",
    borderRadius: "50%",
    backgroundColor: "#eafbe7",
    border: "3px solid #5a7a3a",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    margin: "0 auto 20px",
  },
  checkIcon: {
    fontSize: "2rem", color: "#5a7a3a", fontWeight: "900",
  },
  heading: {
    fontSize: "2rem", fontWeight: "900",
    color: "#3b1f0a", margin: "0 0 8px",
  },
  subheading: {
    color: "#8b6347", marginBottom: "24px", fontSize: "1rem",
  },
  orderIdBox: {
    display: "inline-block",
    backgroundColor: "#fdf0d8",
    border: "1px solid #e0c8a8",
    borderRadius: "8px",
    padding: "6px 16px",
    fontSize: "0.85rem",
    fontWeight: "700",
    color: "#5a3a1a",
    marginBottom: "24px",
  },
  itemsList: {
    backgroundColor: "#fffdf9",
    border: "1px solid #f0e0c8",
    borderRadius: "12px",
    padding: "16px 20px",
    marginBottom: "16px",
    textAlign: "left",
  },
  itemsHeading: {
    fontSize: "0.85rem", fontWeight: "700",
    color: "#5a3a1a", margin: "0 0 12px",
    textTransform: "uppercase", letterSpacing: "0.5px",
  },
  itemRow: {
    display: "flex",
    justifyContent: "space-between",
    padding: "5px 0",
    fontSize: "0.9rem",
    borderBottom: "1px solid #f5eadc",
  },
  itemName: { color: "#3b1f0a", fontWeight: "500" },
  itemAmt: { color: "#c97c2e", fontWeight: "700" },
  totalRow: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "14px 0",
    marginBottom: "24px",
  },
  totalLabel: {
    fontSize: "1rem", fontWeight: "700", color: "#3b1f0a",
  },
  totalValue: {
    fontSize: "1.6rem", fontWeight: "900", color: "#c97c2e",
  },
  btnGroup: {
    display: "flex", flexDirection: "column", gap: "10px",
  },
  primaryBtn: {
    padding: "14px",
    backgroundColor: "#c97c2e",
    color: "#fff", border: "none",
    borderRadius: "10px", fontSize: "1rem",
    fontWeight: "700", cursor: "pointer",
  },
  secondaryBtn: {
    padding: "12px",
    backgroundColor: "#fff",
    color: "#5a3a1a",
    border: "1.5px solid #e0c8a8",
    borderRadius: "10px", fontSize: "0.95rem",
    fontWeight: "600", cursor: "pointer",
  },
};

export default OrderSuccess;