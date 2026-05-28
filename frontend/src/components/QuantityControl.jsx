// src/components/QuantityControl.jsx

const QuantityControl = ({
  quantity,       // current qty value to display
  onIncrease,     // called when + is clicked
  onDecrease,     // called when - is clicked
  max,            // maximum allowed (stock limit)
  min = 0,        // minimum allowed (default 0)
  size = "md",    // "sm" | "md"
}) => {
  const isMaxed = quantity >= max;
  const isMin = quantity <= min;

  const s = size === "sm" ? smStyles : mdStyles;

  return (
    <div style={s.wrapper}>
      <button
        onClick={onDecrease}
        disabled={isMin}
        style={{ ...s.btn, opacity: isMin ? 0.35 : 1 }}
        title="Decrease"
      >
        −
      </button>

      <span style={s.count}>{quantity}</span>

      <button
        onClick={onIncrease}
        disabled={isMaxed}
        style={{ ...s.btn, opacity: isMaxed ? 0.35 : 1 }}
        title={isMaxed ? "Max stock reached" : "Increase"}
      >
        +
      </button>
    </div>
  );
};

const mdStyles = {
  wrapper: {
    display: "inline-flex",
    alignItems: "center",
    border: "1.5px solid #e0c8a8",
    borderRadius: "10px",
    overflow: "hidden",
    backgroundColor: "#fff",
  },
  btn: {
    width: "36px",
    height: "36px",
    border: "none",
    backgroundColor: "#fdf0d8",
    color: "#3b1f0a",
    fontSize: "1.1rem",
    fontWeight: "700",
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    transition: "background 0.15s",
  },
  count: {
    minWidth: "38px",
    textAlign: "center",
    fontWeight: "700",
    fontSize: "0.95rem",
    color: "#3b1f0a",
    padding: "0 4px",
  },
};

const smStyles = {
  wrapper: {
    display: "inline-flex",
    alignItems: "center",
    border: "1.5px solid #e0c8a8",
    borderRadius: "8px",
    overflow: "hidden",
    backgroundColor: "#fff",
  },
  btn: {
    width: "28px",
    height: "28px",
    border: "none",
    backgroundColor: "#fdf0d8",
    color: "#3b1f0a",
    fontSize: "0.95rem",
    fontWeight: "700",
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  count: {
    minWidth: "30px",
    textAlign: "center",
    fontWeight: "700",
    fontSize: "0.85rem",
    color: "#3b1f0a",
  },
};

export default QuantityControl;