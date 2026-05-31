// src/context/AuthContext.jsx
import {
  createContext, useContext,
  useState, useEffect,
  useCallback,
} from "react";

const AuthContext = createContext();

// ─── JWT helpers ──────────────────────────────────────────────────────────────

// Safely decode JWT payload without any external library
const decodeToken = (token) => {
  try {
    const payload = token.split(".")[1];
    // Pad base64 if needed
    const padded  = payload + "=".repeat((4 - payload.length % 4) % 4);
    return JSON.parse(atob(padded));
  } catch {
    return null;
  }
};

// Returns true if token is missing OR expired
const isTokenExpired = (token) => {
  if (!token) return true;
  const decoded = decodeToken(token);
  if (!decoded?.exp) return true;
  // exp is in seconds, Date.now() is in ms
  // Add 10s buffer so we don't use a token that expires mid-request
  return decoded.exp * 1000 < Date.now() + 10_000;
};

// Safely read from localStorage — returns null on any error
const safeRead = (key) => {
  try {
    const val = localStorage.getItem(key);
    return val ? JSON.parse(val) : null;
  } catch {
    return null;
  }
};

// Safely write to localStorage — silently fails if storage is full
const safeWrite = (key, value) => {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {
    // Storage quota exceeded — not fatal
  }
};

// Remove both auth keys atomically
const clearStorage = () => {
  try {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
  } catch {
    // ignore
  }
};

// ─── Provider ─────────────────────────────────────────────────────────────────
export const AuthProvider = ({ children }) => {

  const [user,    setUser]    = useState(null);
  const [token,   setToken]   = useState(null);
  const [loading, setLoading] = useState(true);

  // ── Hydrate from localStorage on first load ────────────────────────────────
  useEffect(() => {
    const storedToken = localStorage.getItem("token"); // raw string, not parsed
    const storedUser  = safeRead("user");

    if (storedToken && storedUser && !isTokenExpired(storedToken)) {
      // Token exists and is still valid — restore session
      setToken(storedToken);
      setUser(storedUser);
    } else if (storedToken || storedUser) {
      // Something was stored but is now invalid/expired — clean up
      clearStorage();
    }
    // Always resolve loading so routes can render
    setLoading(false);
  }, []);

  // ── Auto-logout when token expires ────────────────────────────────────────
  useEffect(() => {
    if (!token) return;

    const decoded = decodeToken(token);
    if (!decoded?.exp) return;

    const msUntilExpiry = decoded.exp * 1000 - Date.now();
    if (msUntilExpiry <= 0) {
      // Already expired — logout immediately
      logout();
      return;
    }

    // Schedule auto-logout at exact expiry time
    const timer = setTimeout(() => {
      logout();
    }, msUntilExpiry);

    return () => clearTimeout(timer);
  }, [token]);

  // ── Login ──────────────────────────────────────────────────────────────────
  const login = useCallback((userData, jwtToken) => {
    // Validate before storing
    if (!jwtToken || !userData) return;

    setToken(jwtToken);
    setUser(userData);

    // Store token as raw string, user as JSON
    try {
      localStorage.setItem("token", jwtToken);
    } catch {
      // ignore quota errors
    }
    safeWrite("user", userData);
  }, []);

  // ── Logout ─────────────────────────────────────────────────────────────────
  const logout = useCallback(() => {
    setToken(null);
    setUser(null);
    clearStorage();
  }, []);

  // ── Derived values ─────────────────────────────────────────────────────────
  const isAuthenticated = !!token && !isTokenExpired(token);
  const isAdmin         = user?.role === "admin";

  return (
    <AuthContext.Provider value={{
      user,
      token,
      loading,
      isAuthenticated,
      isAdmin,
      login,
      logout,
    }}>
      {children}
    </AuthContext.Provider>
  );
};

// ─── Hook ──────────────────────────────────────────────────────────────────────
export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside <AuthProvider>");
  return ctx;
};