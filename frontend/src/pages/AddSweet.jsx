// src/pages/AddSweet.jsx

import { useState } from "react";
import { useNavigate } from "react-router-dom";

import { useAuth } from "../context/AuthContext";

import { addSweet } from "../services/sweetService";

import { getErrorMessage } from "../api/axios";
import { useDark } from "../hooks/useDark";

const CATEGORIES = [
  "Chocolate",
  "Candy",
  "Cake",
  "Cookie",
  "Lollipop",
  "Ice Cream",
  "Donut",
  "Cupcake",
  "Other",
];

const FieldError = ({ msg }) =>
  msg ? (
    <p
      style={{
        margin: "4px 0 0",
        fontSize: "12px",
        color: "#dc2626",
        fontWeight: 600,
      }}
    >
      ⚠ {msg}
    </p>
  ) : null;

const AddSweet = () => {

  const dark = useDark();

  const { user } = useAuth();

  const navigate = useNavigate();

  const [formData, setFormData] =
    useState({
      name: "",
      description: "",
      price: "",
      quantity: "",
      category: "",
    });

  const [error, setError] =
    useState("");

  const [loading, setLoading] =
    useState(false);

  const [fieldErrors, setFieldErrors] =
    useState({});

  // Block non-admins
  if (user?.role !== "admin") {

    return (
      <div style={styles.denied}>

        <span style={{ fontSize: "3rem" }}>
          🚫
        </span>

        <h2>Admin Access Only</h2>

        <p>
          You don't have permission to add sweets.
        </p>

        <button
          onClick={() => navigate("/sweets")}
          style={styles.backBtn}
        >
          ← Back to Sweets
        </button>

      </div>
    );
  }

  const handleChange = (e) => {

    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });

    setError("");

    setFieldErrors((prev) => ({
      ...prev,
      [e.target.name]: "",
    }));
  };

  // ─────────────────────────────────────────
  // Validation
  // ─────────────────────────────────────────

  const validate = () => {

    const errors = {};

    if (!formData.name?.trim()) {

      errors.name =
        "Sweet name is required";
    }

    if (
      !formData.price ||
      isNaN(formData.price) ||
      Number(formData.price) <= 0
    ) {

      errors.price =
        "Enter a valid price greater than 0";
    }

    if (
      formData.quantity !== undefined &&
      formData.quantity !== "" &&
      (
        isNaN(formData.quantity) ||
        Number(formData.quantity) < 0
      )
    ) {

      errors.quantity =
        "Quantity must be 0 or more";
    }

    return errors;
  };

  // ─────────────────────────────────────────
  // Submit
  // ─────────────────────────────────────────

  const handleSubmit = async (e) => {

    e.preventDefault();

    setError("");

    setFieldErrors({});

    // Validate first
    const errors = validate();

    if (
      Object.keys(errors).length > 0
    ) {

      setFieldErrors(errors);

      return;
    }

    setLoading(true);

    try {

      await addSweet({
        ...formData,

        price: formData.price
          ? Number(formData.price)
          : undefined,

        quantity: formData.quantity
          ? Number(formData.quantity)
          : undefined,
      });

      navigate("/sweets");

    } catch (err) {

      const msg =
        getErrorMessage(err);

      setError(msg);

    } finally {

      setLoading(false);
    }
  };

  return (
    <div
      style={{
        ...styles.page,

        backgroundColor: dark
          ? "#0c0a09"
          : "#fdf6ec",
      }}
    >

      <div
        style={{
          ...styles.card,

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

        {/* Header */}
        <div style={styles.cardHeader}>

          <button
            onClick={() => navigate("/sweets")}
            style={styles.backLink}
          >
            ← Back
          </button>

          <h2
            style={{
              ...styles.title,

              color: dark
                ? "#e7e5e4"
                : "#3b1f0a",
            }}
          >
            🍰 Add New Sweet
          </h2>

        </div>

        {error && (
          <div style={styles.error}>
            {error}
          </div>
        )}

        <form
          onSubmit={handleSubmit}
          style={styles.form}
        >

          {/* Name */}
          <div style={styles.field}>

            <label style={styles.label}>
              Sweet Name *
            </label>

            <input
              name="name"

              value={formData.name}

              onChange={handleChange}

              required

              placeholder="e.g. Dark Chocolate Truffle"

              style={{
                ...styles.input,

                backgroundColor: dark
                  ? "#141110"
                  : "#fffdf9",

                border: `1.5px solid ${
                  dark
                    ? "#44403c"
                    : "#e0c8a8"
                }`,

                color: dark
                  ? "#e7e5e4"
                  : "#3b1f0a",
              }}
            />

            <FieldError
              msg={fieldErrors.name}
            />

          </div>

          {/* Description */}
          <div style={styles.field}>

            <label style={styles.label}>
              Description
            </label>

            <textarea
              name="description"

              value={formData.description}

              onChange={handleChange}

              placeholder="Describe this sweet..."

              rows={3}

              style={{
                ...styles.input,

                resize: "vertical",

                backgroundColor: dark
                  ? "#141110"
                  : "#fffdf9",

                border: `1.5px solid ${
                  dark
                    ? "#44403c"
                    : "#e0c8a8"
                }`,

                color: dark
                  ? "#e7e5e4"
                  : "#3b1f0a",
              }}
            />
          </div>

          {/* Category */}
          <div style={styles.field}>

            <label style={styles.label}>
              Category
            </label>

            <select
              name="category"

              value={formData.category}

              onChange={handleChange}

              style={{
                ...styles.input,

                backgroundColor: dark
                  ? "#141110"
                  : "#fffdf9",

                border: `1.5px solid ${
                  dark
                    ? "#44403c"
                    : "#e0c8a8"
                }`,

                color: dark
                  ? "#e7e5e4"
                  : "#3b1f0a",
              }}
            >

              <option value="">
                Select category...
              </option>

              {CATEGORIES.map((cat) => (

                <option
                  key={cat}
                  value={cat}
                >
                  {cat}
                </option>

              ))}
            </select>
          </div>

          {/* Price + Quantity */}
          <div style={styles.row}>

            <div style={styles.field}>

              <label style={styles.label}>
                Price (₹)
              </label>

              <input
                name="price"

                value={formData.price}

                onChange={handleChange}

                placeholder="0.00"

                type="number"

                min="0"

                step="0.01"

                style={{
                  ...styles.input,

                  backgroundColor: dark
                    ? "#141110"
                    : "#fffdf9",

                  border: `1.5px solid ${
                    dark
                      ? "#44403c"
                      : "#e0c8a8"
                  }`,

                  color: dark
                    ? "#e7e5e4"
                    : "#3b1f0a",
                }}
              />

              <FieldError
                msg={fieldErrors.price}
              />

            </div>

            <div style={styles.field}>

              <label style={styles.label}>
                Quantity
              </label>

              <input
                name="quantity"

                value={formData.quantity}

                onChange={handleChange}

                placeholder="0"

                type="number"

                min="0"

                style={{
                  ...styles.input,

                  backgroundColor: dark
                    ? "#141110"
                    : "#fffdf9",

                  border: `1.5px solid ${
                    dark
                      ? "#44403c"
                      : "#e0c8a8"
                  }`,

                  color: dark
                    ? "#e7e5e4"
                    : "#3b1f0a",
                }}
              />

              <FieldError
                msg={fieldErrors.quantity}
              />

            </div>
          </div>

          {/* Actions */}
          <div style={styles.btnRow}>

            <button
              type="button"

              onClick={() => navigate("/sweets")}

              style={styles.cancelBtn}
            >
              Cancel
            </button>

            <button
              type="submit"

              disabled={loading}

              style={styles.submitBtn}
            >
              {loading
                ? "Adding..."
                : "🍬 Add Sweet"}
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
    padding: "32px 20px",
    display: "flex",
    justifyContent: "center",
    alignItems: "flex-start",
  },

  card: {
    borderRadius: "16px",
    boxShadow:
      "0 8px 32px rgba(59,31,10,0.1)",
    padding: "36px",
    width: "100%",
    maxWidth: "560px",
  },

  cardHeader: {
    marginBottom: "24px",
  },

  backLink: {
    background: "none",
    border: "none",
    color: "#8b6347",
    cursor: "pointer",
    fontSize: "0.9rem",
    padding: "0",
    marginBottom: "8px",
    display: "block",
  },

  title: {
    fontSize: "1.6rem",
    fontWeight: "800",
    margin: 0,
  },

  error: {
    backgroundColor: "#fde8e8",
    color: "#c0392b",
    padding: "10px 14px",
    borderRadius: "8px",
    marginBottom: "16px",
    fontSize: "0.88rem",
    border: "1px solid #f5c6c6",
  },

  form: {
    display: "flex",
    flexDirection: "column",
    gap: "18px",
  },

  field: {
    display: "flex",
    flexDirection: "column",
    gap: "6px",
  },

  row: {
    display: "grid",
    gridTemplateColumns:
      "1fr 1fr",
    gap: "16px",
  },

  label: {
    fontSize: "0.88rem",
    fontWeight: "600",
    color: "#5a3a1a",
  },

  input: {
    padding: "11px 14px",
    borderRadius: "8px",
    fontSize: "0.95rem",
    outline: "none",
    fontFamily: "inherit",
  },

  btnRow: {
    display: "flex",
    gap: "12px",
    marginTop: "8px",
  },

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

  denied: {
    textAlign: "center",
    padding: "80px 20px",
    color: "#3b1f0a",
  },

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

export default AddSweet;