// src/context/ToastContext.jsx
import { createContext, useContext, useState, useCallback, useEffect } from "react";

const ToastContext = createContext();

// ─── Config ───────────────────────────────────────────────────────────────────
const ICONS = {
  success: "✓",
  error:   "✕",
  info:    "ℹ",
  warning: "⚠",
};

const STYLES = {
  success: {
    bar:  "bg-white dark:bg-stone-800 border border-stone-200 dark:border-stone-700",
    icon: "bg-green-100  dark:bg-green-900/40  text-green-600  dark:text-green-400",
    title:"text-stone-900 dark:text-white",
    msg:  "text-stone-500 dark:text-stone-400",
    progress: "bg-green-400",
  },
  error: {
    bar:  "bg-white dark:bg-stone-800 border border-stone-200 dark:border-stone-700",
    icon: "bg-red-100    dark:bg-red-900/40    text-red-600    dark:text-red-400",
    title:"text-stone-900 dark:text-white",
    msg:  "text-stone-500 dark:text-stone-400",
    progress: "bg-red-400",
  },
  info: {
    bar:  "bg-white dark:bg-stone-800 border border-stone-200 dark:border-stone-700",
    icon: "bg-blue-100   dark:bg-blue-900/40   text-blue-600   dark:text-blue-400",
    title:"text-stone-900 dark:text-white",
    msg:  "text-stone-500 dark:text-stone-400",
    progress: "bg-blue-400",
  },
  warning: {
    bar:  "bg-white dark:bg-stone-800 border border-stone-200 dark:border-stone-700",
    icon: "bg-amber-100  dark:bg-amber-900/40  text-amber-600  dark:text-amber-400",
    title:"text-stone-900 dark:text-white",
    msg:  "text-stone-500 dark:text-stone-400",
    progress: "bg-amber-400",
  },
};

const DEFAULT_DURATION = 3500; // ms

// ─── Single Toast item ────────────────────────────────────────────────────────
const ToastItem = ({ toast, onDismiss }) => {
  const [visible,  setVisible]  = useState(false); // controls enter animation
  const [leaving,  setLeaving]  = useState(false); // controls exit animation
  const s = STYLES[toast.type] || STYLES.info;
  const duration = toast.duration ?? DEFAULT_DURATION;

  // Enter
  useEffect(() => {
    const t = requestAnimationFrame(() => setVisible(true));
    return () => cancelAnimationFrame(t);
  }, []);

  // Auto-dismiss
  useEffect(() => {
    const t = setTimeout(handleDismiss, duration);
    return () => clearTimeout(t);
  }, [duration]);

  function handleDismiss() {
    // Play exit animation, then remove from DOM
    setLeaving(true);
    setTimeout(() => onDismiss(toast.id), 250);
  }

  return (
    <div
      role="alert"
      aria-live="assertive"
      onClick={handleDismiss}
      style={{ cursor: "pointer" }}
      className={`
        relative flex items-start gap-3
        w-80 max-w-[calc(100vw-2rem)]
        px-4 py-3.5 rounded-2xl
        shadow-lg
        select-none
        overflow-hidden
        transition-all duration-300 ease-out
        ${s.bar}
        ${visible && !leaving
          ? "opacity-100 translate-x-0"
          : "opacity-0 translate-x-8"
        }
      `}
    >
      {/* Icon circle */}
      <span className={`
        flex-shrink-0 mt-0.5
        w-6 h-6 rounded-full
        flex items-center justify-center
        text-xs font-black
        ${s.icon}
      `}>
        {ICONS[toast.type]}
      </span>

      {/* Text */}
      <div className="flex-1 min-w-0 pr-5">
        {toast.title && (
          <p className={`text-sm font-bold leading-tight ${s.title}`}>
            {toast.title}
          </p>
        )}
        <p className={`text-sm leading-snug ${toast.title ? "mt-0.5" : ""} ${s.msg}`}>
          {toast.message}
        </p>
      </div>

      {/* Close button */}
      <button
        onClick={(e) => { e.stopPropagation(); handleDismiss(); }}
        aria-label="Dismiss notification"
        className="
          absolute top-2.5 right-2.5
          w-5 h-5 rounded-md
          flex items-center justify-center
          text-stone-400 hover:text-stone-600 dark:hover:text-stone-200
          hover:bg-stone-100 dark:hover:bg-stone-700
          transition-colors duration-100
          text-base leading-none
        "
      >
        ×
      </button>

      {/* Progress bar — shrinks over `duration` ms */}
      <div
        className={`
          absolute bottom-0 left-0 h-[3px] rounded-full
          ${s.progress}
        `}
        style={{
          animation: `toastProgress ${duration}ms linear forwards`,
        }}
      />
    </div>
  );
};

// ─── Provider ─────────────────────────────────────────────────────────────────
export const ToastProvider = ({ children }) => {
  const [toasts, setToasts] = useState([]);

  const dismiss = useCallback((id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  // Core function — all helpers call this
  const addToast = useCallback(({ type = "info", title, message, duration }) => {
    const id = `${Date.now()}-${Math.random()}`;
    // Max 5 toasts visible at once — drop oldest if over limit
    setToasts((prev) => {
      const next = [...prev, { id, type, title, message, duration }];
      return next.length > 5 ? next.slice(next.length - 5) : next;
    });
    return id;
  }, []);

  // ── Convenience helpers — these are what your components call ──
  const success = useCallback(
    (message, title) => addToast({ type: "success", message, title }),
    [addToast]
  );
  const error = useCallback(
    (message, title) => addToast({ type: "error", message, title }),
    [addToast]
  );
  const info = useCallback(
    (message, title) => addToast({ type: "info", message, title }),
    [addToast]
  );
  const warning = useCallback(
    (message, title) => addToast({ type: "warning", message, title }),
    [addToast]
  );

  return (
    <ToastContext.Provider value={{ success, error, info, warning, dismiss }}>
      {children}

      {/* ── Toast portal — fixed bottom-right ── */}
      <div
        aria-label="Notifications"
        className="
          fixed bottom-6 right-6 z-[9999]
          flex flex-col-reverse gap-3
          pointer-events-none
        "
      >
        {toasts.map((t) => (
          <div key={t.id} className="pointer-events-auto">
            <ToastItem toast={t} onDismiss={dismiss} />
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
};

// ─── Hook ─────────────────────────────────────────────────────────────────────
export const useToast = () => {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error("useToast must be used inside <ToastProvider>");
  return ctx;
};