// src/pages/UpdateSweet.jsx

import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { getSweetById, updateSweet } from "../services/sweetService";

const CATEGORIES = ["Chocolate", "Candy", "Cake", "Cookie", "Lollipop", "Ice Cream", "Donut", "Cupcake", "Other"];

const UpdateSweet = () => {
  const { id } = useParams(); // Get sweet ID from URL: /sweets/update/:id
  const { user } = useAuth();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: "",
    quantity: "",
    category: "",
  });
  const [fetchLoading, setFetchLoading] = useState(true);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  // Block non-admins
  if (user?.role !== "admin") {
    return (
      <div style={styles.denied}>
        <span style={{ fontSize: "3rem" }}>🚫</span>
        <h2>Admin Access Only</h2>
        <button onClick={() => navigate("/sweets")} style={styles.backBtn}>
          ← Back to Sweets
        </button>
      </div>
    );
  }

  // Fetch the existing sweet data and pre-fill form
  useEffect(() => {
    const fetchSweet = async () => {
      try {
        const data = await getSweetById(id);
        const sweet = data.sweet || data; // handle both {sweet: {...}} or plain object
        setFormData({
          name: sweet.name || "",
          description: sweet.description || "",
          price: sweet.price !== undefined ? String(sweet.price) : "",
          quantity: sweet.quantity !== undefined ? String(sweet.quantity) : "",
          category: sweet.category || "",
        });
      } catch (err) {
        setError("Failed to load sweet data.");
      } finally {
        setFetchLoading(false);
      }
    };
    fetchSweet();
  }, [id]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name.trim()) return setError("Sweet name is required.");

    setLoading(true);
    try {
      await updateSweet(id, {
        ...formData,
        price: formData.price ? Number(formData.price) : undefined,
        quantity: formData.quantity ? Number(formData.quantity) : undefined,
      });
      navigate("/sweets");
    } catch (err) {
      setError(err.response?.data?.message || "Failed to update sweet.");
    } finally {
      setLoading(false);
    }
  };

  if (fetchLoading) {
    return (
      <div style={{ textAlign: "center", padding: "80px", color: "#8b6347" }}>
        Loading sweet data...
      </div>
    );
  }

  return (
    <div style={styles.page}>
      <div style={styles.card}>
        <div style={styles.cardHeader}>
          <button onClick={() => navigate("/sweets")} style={styles.backLink}>
            ← Back
          </button>
          <h2 style={styles.title}>✏️ Update Sweet</h2>
          <p style={styles.hint}>Editing ID: #{id}</p>
        </div>

        {error && <div style={styles.error}>{error}</div>}

        <form onSubmit={handleSubmit} style={styles.form}>
          <div style={styles.field}>
            <label style={styles.label}>Sweet Name *</label>
            <input
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              style={styles.input}
            />
          </div>

          <div style={styles.field}>
            <label style={styles.label}>Description</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows={3}
              style={{ ...styles.input, resize: "vertical" }}
            />
          </div>

          <div style={styles.field}>
            <label style={styles.label}>Category</label>
            <select
              name="category"
              value={formData.category}
              onChange={handleChange}
              style={styles.input}
            >
              <option value="">Select category...</option>
              {CATEGORIES.map((cat) => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          </div>

          <div style={styles.row}>
            <div style={styles.field}>
              <label style={styles.label}>Price (₹)</label>
              <input
                name="price"
                value={formData.price}
                onChange={handleChange}
                type="number"
                min="0"
                step="0.01"
                style={styles.input}
              />
            </div>
            <div style={styles.field}>
              <label style={styles.label}>Quantity</label>
              <input
                name="quantity"
                value={formData.quantity}
                onChange={handleChange}
                type="number"
                min="0"
                style={styles.input}
              />
            </div>
          </div>

          <div style={styles.btnRow}>
            <button
              type="button"
              onClick={() => navigate("/sweets")}
              style={styles.cancelBtn}
            >
              Cancel
            </button>
            <button type="submit" disabled={loading} style={styles.submitBtn}>
              {loading ? "Saving..." : "💾 Save Changes"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

const styles = {
  page: {
    minHeight: "calc(100vh - 64px)",
    backgroundColor: "#fdf6ec",
    padding: "32px 20px",
    display: "flex",
    justifyContent: "center",
    alignItems: "flex-start",
  },
  card: {
    backgroundColor: "#fff",
    borderRadius: "16px",
    border: "1px solid #f0e0c8",
    boxShadow: "0 8px 32px rgba(59,31,10,0.1)",
    padding: "36px",
    width: "100%",
    maxWidth: "560px",
  },
  cardHeader: { marginBottom: "24px" },
  backLink: {
    background: "none",
    border: "none",
    color: "#8b6347",
    cursor: "pointer",
    fontSize: "0.9rem",
    padding: "0",
    marginBottom: "6px",
    display: "block",
  },
  title: { fontSize: "1.6rem", fontWeight: "800", color: "#3b1f0a", margin: "0 0 2px" },
  hint: { color: "#8b6347", fontSize: "0.82rem", margin: 0 },
  error: {
    backgroundColor: "#fde8e8",
    color: "#c0392b",
    padding: "10px 14px",
    borderRadius: "8px",
    marginBottom: "16px",
    fontSize: "0.88rem",
    border: "1px solid #f5c6c6",
  },
  form: { display: "flex", flexDirection: "column", gap: "18px" },
  field: { display: "flex", flexDirection: "column", gap: "6px" },
  row: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" },
  label: { fontSize: "0.88rem", fontWeight: "600", color: "#5a3a1a" },
  input: {
    padding: "11px 14px",
    borderRadius: "8px",
    border: "1.5px solid #e0c8a8",
    fontSize: "0.95rem",
    outline: "none",
    backgroundColor: "#fffdf9",
    color: "#3b1f0a",
    fontFamily: "inherit",
  },
  btnRow: { display: "flex", gap: "12px", marginTop: "8px" },
  cancelBtn: {
    flex: 1,
    padding: "12px",
    backgroundColor: "#fff",
    border: "1.5px solid #e0c8a8",
    borderRadius: "8px",
    cursor: "pointer",
    fontWeight: "600",
    color: "#5a3a1a",
  },
  submitBtn: {
    flex: 2,
    padding: "12px",
    backgroundColor: "#c97c2e",
    color: "#fff",
    border: "none",
    borderRadius: "8px",
    cursor: "pointer",
    fontWeight: "700",
    fontSize: "1rem",
  },
  denied: { textAlign: "center", padding: "80px 20px", color: "#3b1f0a" },
  backBtn: {
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

export default UpdateSweet;