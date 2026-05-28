// src/components/SweetCard.jsx  ← REPLACE existing file

import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useCart } from "../context/CartContext";
import { deleteSweet } from "../services/sweetService";

const SweetCard = ({ sweet, onDelete }) => {
  const { user } = useAuth();
  const { addToCart, cartItems } = useCart();
  const navigate = useNavigate();
  const [deleting, setDeleting] = useState(false);
  const [addedFeedback, setAddedFeedback] = useState(false); // brief "Added!" flash

  const isAdmin = user?.role === "admin";

  // How many of this sweet are already in the cart
  const inCart = cartItems.find((item) => item.id === sweet.id)?.cartQty || 0;
  const isOutOfStock = !sweet.quantity || sweet.quantity <= 0;
  const isCartMaxed = inCart >= sweet.quantity;

  const handleAddToCart = () => {
    if (isOutOfStock || isCartMaxed) return;
    addToCart(sweet);
    setAddedFeedback(true);
    setTimeout(() => setAddedFeedback(false), 1200);
  };

  const handleDelete = async () => {
    if (!window.confirm(`Delete "${sweet.name}"?`)) return;
    setDeleting(true);
    try {
      await deleteSweet(sweet.id);
      onDelete(sweet.id);
    } catch {
      alert("Failed to delete sweet.");
    } finally {
      setDeleting(false);
    }
  };

  const getEmoji = (category = "") => {
    const map = {
      chocolate: "🍫", candy: "🍬", cake: "🍰",
      cookie: "🍪", lollipop: "🍭", ice: "🍦",
      donut: "🍩", cupcake: "🧁",
    };
    const key = category.toLowerCase();
    for (const [word, emoji] of Object.entries(map)) {
      if (key.includes(word)) return emoji;
    }
    return "🍬";
  };

  return (
    <div style={styles.card}>
      {/* Top image area */}
      <div style={styles.imageArea}>
        <span style={styles.emoji}>{getEmoji(sweet.category || sweet.name)}</span>
        {sweet.category && <span style={styles.badge}>{sweet.category}</span>}
        {isOutOfStock && <span style={styles.outBadge}>Out of Stock</span>}
      </div>

      {/* Info */}
      <div style={styles.body}>
        <h3 style={styles.name}>{sweet.name}</h3>
        {sweet.description && (
          <p style={styles.description}>{sweet.description}</p>
        )}

        <div style={styles.meta}>
          {sweet.price !== undefined && (
            <span style={styles.price}>₹{Number(sweet.price).toFixed(2)}</span>
          )}
          <span style={{
            ...styles.stock,
            color: isOutOfStock ? "#c0392b" : sweet.quantity < 5 ? "#e67e22" : "#5a7a3a",
            backgroundColor: isOutOfStock ? "#fde8e8" : sweet.quantity < 5 ? "#fef3e2" : "#eafbe7",
          }}>
            {isOutOfStock ? "Out of stock" : `${sweet.quantity} left`}
          </span>
        </div>

        {/* Cart indicator */}
        {inCart > 0 && (
          <p style={styles.inCartNote}>✓ {inCart} in your cart</p>
        )}
      </div>

      {/* Add to Cart button */}
      <div style={styles.cartAction}>
        <button
          onClick={handleAddToCart}
          disabled={isOutOfStock || isCartMaxed}
          style={{
            ...styles.addToCartBtn,
            backgroundColor: addedFeedback
              ? "#5a7a3a"
              : isOutOfStock || isCartMaxed
              ? "#e0d0b8"
              : "#c97c2e",
            cursor: isOutOfStock || isCartMaxed ? "not-allowed" : "pointer",
          }}
        >
          {addedFeedback
            ? "✓ Added!"
            : isOutOfStock
            ? "Unavailable"
            : isCartMaxed
            ? "Cart Full"
            : "🛒 Add to Cart"}
        </button>
      </div>

      {/* Admin Controls */}
      {isAdmin && (
        <div style={styles.actions}>
          <button onClick={() => navigate(`/sweets/update/${sweet.id}`)} style={styles.editBtn}>
            ✏️ Edit
          </button>
          <button onClick={handleDelete} disabled={deleting} style={styles.deleteBtn}>
            {deleting ? "Deleting..." : "🗑️ Delete"}
          </button>
        </div>
      )}
    </div>
  );
};

const styles = {
  card: {
    backgroundColor: "#fff",
    borderRadius: "16px",
    border: "1px solid #f0e0c8",
    boxShadow: "0 4px 16px rgba(59,31,10,0.08)",
    overflow: "hidden",
    display: "flex",
    flexDirection: "column",
  },
  imageArea: {
    backgroundColor: "#fdf0d8",
    padding: "28px 20px",
    textAlign: "center",
    position: "relative",
  },
  emoji: { fontSize: "3.2rem" },
  badge: {
    position: "absolute", top: "10px", right: "10px",
    backgroundColor: "#c97c2e", color: "#fff",
    fontSize: "0.7rem", fontWeight: "700",
    padding: "3px 8px", borderRadius: "20px",
    textTransform: "uppercase", letterSpacing: "0.5px",
  },
  outBadge: {
    position: "absolute", top: "10px", left: "10px",
    backgroundColor: "#c0392b", color: "#fff",
    fontSize: "0.68rem", fontWeight: "700",
    padding: "3px 8px", borderRadius: "20px",
  },
  body: { padding: "16px 18px", flexGrow: 1 },
  name: { fontSize: "1.05rem", fontWeight: "700", color: "#3b1f0a", margin: "0 0 5px" },
  description: { fontSize: "0.83rem", color: "#8b6347", margin: "0 0 10px", lineHeight: "1.4" },
  meta: { display: "flex", justifyContent: "space-between", alignItems: "center" },
  price: { fontSize: "1.1rem", fontWeight: "800", color: "#c97c2e" },
  stock: {
    fontSize: "0.75rem", fontWeight: "600",
    padding: "3px 8px", borderRadius: "12px",
  },
  inCartNote: {
    fontSize: "0.78rem", color: "#5a7a3a",
    margin: "8px 0 0", fontWeight: "600",
  },
  cartAction: { padding: "12px 18px", paddingTop: "0" },
  addToCartBtn: {
    width: "100%", padding: "10px",
    color: "#fff", border: "none",
    borderRadius: "8px", fontWeight: "700",
    fontSize: "0.9rem", transition: "background 0.2s",
  },
  actions: {
    display: "flex", gap: "8px",
    padding: "10px 18px",
    borderTop: "1px solid #f0e0c8",
    backgroundColor: "#fffdf9",
  },
  editBtn: {
    flex: 1, padding: "8px",
    backgroundColor: "#3b1f0a", color: "#f5e6c8",
    border: "none", borderRadius: "8px",
    cursor: "pointer", fontWeight: "600", fontSize: "0.83rem",
  },
  deleteBtn: {
    flex: 1, padding: "8px",
    backgroundColor: "#fde8e8", color: "#c0392b",
    border: "1px solid #f5c6c6", borderRadius: "8px",
    cursor: "pointer", fontWeight: "600", fontSize: "0.83rem",
  },
};

export default SweetCard;