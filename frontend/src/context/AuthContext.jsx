// src/context/AuthContext.jsx

import { createContext, useContext, useState, useEffect } from "react";

// 1. Create the context
const AuthContext = createContext();

// 2. Create the Provider component
export const AuthProvider = ({ children }) => {
  // Try to load the user from localStorage on first load
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem("user");
    return saved ? JSON.parse(saved) : null;
  });

  const [token, setToken] = useState(() => {
    return localStorage.getItem("token") || null;
  });

  // Login: save token + user to state AND localStorage
  const login = (userData, jwtToken) => {
    setUser(userData);
    setToken(jwtToken);
    localStorage.setItem("token", jwtToken);
    localStorage.setItem("user", JSON.stringify(userData));
  };

  // Logout: clear everything
  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem("token");
    localStorage.removeItem("user");
  };

  const isAuthenticated = !!token; // true if token exists

  return (
    <AuthContext.Provider value={{ user, token, isAuthenticated, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

// 3. Custom hook — use this in any component instead of useContext(AuthContext)
export const useAuth = () => useContext(AuthContext);