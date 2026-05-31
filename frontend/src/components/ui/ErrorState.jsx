// src/components/ui/ErrorState.jsx
import { useDark } from "../../hooks/useDark";

export default function ErrorState({
  title   = "Something went wrong",
  message = "An unexpected error occurred. Please try again.",
  onRetry,
  retryLabel = "Try Again",
  emoji  = "⚠️",
  fullPage = false,
}) {
  const dark = useDark();

  return (
    <div style={{
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      textAlign: "center",
      padding: fullPage ? "80px 20px" : "48px 20px",
      minHeight: fullPage ? "60vh" : "auto",
    }}>
      {/* Emoji icon */}
      <div style={{
        width: "72px",
        height: "72px",
        borderRadius: "50%",
        backgroundColor: dark ? "#292524" : "#fff1f2",
        border: `2px solid ${dark ? "#44403c" : "#fecaca"}`,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontSize: "32px",
        marginBottom: "20px",
      }}>
        {emoji}
      </div>

      {/* Title */}
      <h3 style={{
        margin: "0 0 8px",
        fontSize: "18px",
        fontWeight: 800,
        color: dark ? "#e7e5e4" : "#1c1917",
      }}>
        {title}
      </h3>

      {/* Message */}
      <p style={{
        margin: "0 0 24px",
        fontSize: "14px",
        color: dark ? "#a8a29e" : "#78716c",
        maxWidth: "360px",
        lineHeight: 1.6,
      }}>
        {message}
      </p>

      {/* Retry button */}
      {onRetry && (
        <button
          onClick={onRetry}
          style={{
            padding: "10px 24px",
            borderRadius: "10px",
            border: "none",
            backgroundColor: "#c97c2e",
            color: "#ffffff",
            fontSize: "13px",
            fontWeight: 700,
            cursor: "pointer",
            transition: "background-color 0.15s",
          }}
          onMouseEnter={e => e.currentTarget.style.backgroundColor = "#a8621f"}
          onMouseLeave={e => e.currentTarget.style.backgroundColor = "#c97c2e"}
        >
          {retryLabel}
        </button>
      )}
    </div>
  );
}