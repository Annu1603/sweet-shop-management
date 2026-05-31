// src/components/Footer.jsx
import { Link } from "react-router-dom";
import { useDark } from "../hooks/useDark";

export default function Footer() {
  const dark = useDark();
  const year = new Date().getFullYear();

  const borderColor = dark ? "#292524" : "#f0e0c8";
  const bgColor     = dark ? "#0c0a09"  : "#ffffff";
  const textMuted   = dark ? "#78716c"  : "#a8a29e";
  const textMain    = dark ? "#a8a29e"  : "#57534e";
  const linkHover   = "#c97c2e";

  return (
    <footer style={{
      backgroundColor: bgColor,
      borderTop: `1px solid ${borderColor}`,
      marginTop: "auto",
    }}>
      <div style={{
        maxWidth: "1280px",
        margin: "0 auto",
        padding: "40px 20px 24px",
      }}>

        {/* ── Top grid ───────────────────────────────────────────── */}
        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
          gap: "32px",
          marginBottom: "32px",
        }}>

          {/* Brand column */}
          <div>
            <div style={{
              display: "flex",
              alignItems: "center",
              gap: "8px",
              marginBottom: "12px",
            }}>
              <span style={{ fontSize: "22px" }}>🍬</span>
              <span style={{
                fontSize: "18px",
                fontWeight: 900,
                color: dark ? "#e7e5e4" : "#1c1917",
              }}>
                Sweet<span style={{ color: "#c97c2e" }}>Shop</span>
              </span>
            </div>
            <p style={{
              margin: 0,
              fontSize: "13px",
              color: textMain,
              lineHeight: 1.7,
              maxWidth: "220px",
            }}>
              Handcrafted sweets made fresh daily. Traditional recipes,
              quality ingredients.
            </p>
          </div>

          {/* Quick links */}
          <div>
            <h4 style={{
              margin: "0 0 14px",
              fontSize: "11px",
              fontWeight: 700,
              color: textMuted,
              textTransform: "uppercase",
              letterSpacing: "0.8px",
            }}>
              Quick Links
            </h4>
            <ul style={{
              listStyle: "none",
              margin: 0,
              padding: 0,
              display: "flex",
              flexDirection: "column",
              gap: "10px",
            }}>
              {[
                { to: "/sweets",  label: "Browse Sweets" },
                { to: "/cart",    label: "My Cart"       },
                { to: "/admin",   label: "Admin Panel"   },
              ].map(({ to, label }) => (
                <li key={to}>
                  <Link
                    to={to}
                    style={{
                      fontSize: "13px",
                      color: textMain,
                      textDecoration: "none",
                      transition: "color 0.15s",
                    }}
                    onMouseEnter={e => e.currentTarget.style.color = linkHover}
                    onMouseLeave={e => e.currentTarget.style.color = textMain}
                  >
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Info column */}
          <div>
            <h4 style={{
              margin: "0 0 14px",
              fontSize: "11px",
              fontWeight: 700,
              color: textMuted,
              textTransform: "uppercase",
              letterSpacing: "0.8px",
            }}>
              Info
            </h4>
            <ul style={{
              listStyle: "none",
              margin: 0,
              padding: 0,
              display: "flex",
              flexDirection: "column",
              gap: "10px",
            }}>
              {[
                "📍 Fresh from our kitchen daily",
                "🚚 Free delivery over ₹500",
                "🔒 JWT secured checkout",
                "🌙 Dark mode supported",
              ].map((item) => (
                <li key={item} style={{
                  fontSize: "13px",
                  color: textMain,
                }}>
                  {item}
                </li>
              ))}
            </ul>
          </div>

        </div>

        {/* ── Bottom bar ─────────────────────────────────────────── */}
        <div style={{
          borderTop: `1px solid ${borderColor}`,
          paddingTop: "20px",
          display: "flex",
          flexWrap: "wrap",
          justifyContent: "space-between",
          alignItems: "center",
          gap: "8px",
        }}>
          <p style={{
            margin: 0,
            fontSize: "12px",
            color: textMuted,
          }}>
            © {year} SweetShop Management System. All rights reserved.
          </p>
          <p style={{
            margin: 0,
            fontSize: "12px",
            color: textMuted,
          }}>
            Built with React + Vite + Tailwind + Node.js
          </p>
        </div>

      </div>
    </footer>
  );
}