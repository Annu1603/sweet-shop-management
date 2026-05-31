// src/components/CategoryFilter.jsx
// src/components/CategoryFilter.jsx

import { useDark } from "../hooks/useDark";

const CATEGORIES = [
  { label: "All",       value: "",           emoji: "✨" },
  { label: "Indian",    value: "Indian",     emoji: "🪔" },
  { label: "Bengali",   value: "Bengali",    emoji: "🌸" },
  { label: "Premium",   value: "Premium",    emoji: "👑" },
  { label: "Chocolate", value: "Chocolate",  emoji: "🍫" },
  { label: "Candy",     value: "Candy",      emoji: "🍬" },
  { label: "Cake",      value: "Cake",       emoji: "🍰" },
  { label: "Cookie",    value: "Cookie",     emoji: "🍪" },
  { label: "Ice Cream", value: "Ice Cream",  emoji: "🍦" },
];

export default function CategoryFilter({
  selected,
  onSelect,
}) {

  const dark = useDark();

  return (
    <div
      style={{
        display: "flex",
        gap: "8px",

        overflowX: "auto",

        paddingBottom: "4px",

        msOverflowStyle: "none",
        scrollbarWidth: "none",
      }}
    >

      {CATEGORIES.map(
        ({ label, value, emoji }) => {

          const active =
            selected === value;

          return (
            <button
              key={value}

              onClick={() =>
                onSelect(value)
              }

              style={{
                display: "flex",
                alignItems: "center",

                gap: "6px",

                padding: "7px 14px",

                borderRadius: "999px",

                border: active
                  ? "1.5px solid #c97c2e"
                  : `1.5px solid ${
                      dark
                        ? "#44403c"
                        : "#e7e5e4"
                    }`,

                backgroundColor: active
                  ? "#c97c2e"
                  : dark
                  ? "#1c1917"
                  : "#ffffff",

                color: active
                  ? "#ffffff"
                  : dark
                  ? "#a8a29e"
                  : "#57534e",

                fontSize: "13px",

                fontWeight: 600,

                whiteSpace: "nowrap",

                flexShrink: 0,

                cursor: "pointer",

                transition:
                  "all 0.15s ease",

                boxShadow: active
                  ? "0 2px 8px rgba(201,124,46,0.3)"
                  : "none",
              }}

              onMouseEnter={(e) => {

                if (!active) {

                  e.currentTarget.style.borderColor =
                    "#c97c2e";

                  e.currentTarget.style.color =
                    "#c97c2e";
                }
              }}

              onMouseLeave={(e) => {

                if (!active) {

                  e.currentTarget.style.borderColor =
                    dark
                      ? "#44403c"
                      : "#e7e5e4";

                  e.currentTarget.style.color =
                    dark
                      ? "#a8a29e"
                      : "#57534e";
                }
              }}
            >

              <span
                style={{
                  fontSize: "14px",
                }}
              >
                {emoji}
              </span>

              <span>
                {label}
              </span>

            </button>
          );
        }
      )}
    </div>
  );
}