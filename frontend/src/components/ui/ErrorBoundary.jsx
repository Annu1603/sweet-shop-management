// src/components/ui/ErrorBoundary.jsx
import { Component } from "react";

export default class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, info) {
    // Log to console in dev — swap for Sentry etc in production
    console.error("ErrorBoundary caught:", error, info);
  }

  handleReset = () => {
    this.setState({ hasError: false, error: null });
    // Navigate home
    window.location.href = "/sweets";
  };

  render() {
    if (!this.state.hasError) return this.props.children;

    return (
      <div style={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        padding: "40px 20px",
        textAlign: "center",
        backgroundColor: "#fafaf9",
      }}>
        <span style={{ fontSize: "56px", marginBottom: "20px" }}>💥</span>

        <h1 style={{
          fontSize: "24px",
          fontWeight: 900,
          color: "#1c1917",
          margin: "0 0 10px",
        }}>
          Something went wrong
        </h1>

        <p style={{
          fontSize: "14px",
          color: "#78716c",
          marginBottom: "8px",
          maxWidth: "400px",
          lineHeight: 1.6,
        }}>
          An unexpected error occurred in the app.
        </p>

        {/* Show error in dev only */}
        {import.meta.env.DEV && this.state.error && (
          <pre style={{
            margin: "16px 0",
            padding: "12px 16px",
            backgroundColor: "#fff1f2",
            border: "1px solid #fecaca",
            borderRadius: "8px",
            fontSize: "11px",
            color: "#dc2626",
            textAlign: "left",
            maxWidth: "500px",
            overflowX: "auto",
            whiteSpace: "pre-wrap",
          }}>
            {this.state.error.toString()}
          </pre>
        )}

        <button
          onClick={this.handleReset}
          style={{
            marginTop: "8px",
            padding: "11px 28px",
            borderRadius: "10px",
            border: "none",
            backgroundColor: "#c97c2e",
            color: "#ffffff",
            fontSize: "14px",
            fontWeight: 700,
            cursor: "pointer",
          }}
        >
          Back to Home
        </button>
      </div>
    );
  }
}