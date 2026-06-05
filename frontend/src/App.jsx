// src/App.jsx

import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";

import { AuthProvider } from "./context/AuthContext";
import { CartProvider } from "./context/CartContext";
import { ThemeProvider, useTheme } from "./context/ThemeContext";
import { ToastProvider } from "./context/ToastContext";

import Navbar from "./components/Navbar";
import Footer from "./components/Footer";

import ProtectedRoute from "./components/ProtectedRoute";
import AdminRoute from "./components/AdminRoute";
import ErrorBoundary from "./components/ui/ErrorBoundary";

import Login from "./pages/Login";
import Register from "./pages/Register";

import SweetsList from "./pages/SweetsList";
import AddSweet from "./pages/AddSweet";
import UpdateSweet from "./pages/UpdateSweet";
import AdminDashboard from "./pages/AdminDashboard";

import Cart from "./pages/Cart";
import OrderSuccess from "./pages/OrderSuccess";

// ─────────────────────────────────────────────
// App content INSIDE ThemeProvider
// ─────────────────────────────────────────────

function AppContent() {

  const { dark } = useTheme();

  return (
    <AuthProvider>

      <ToastProvider>

        <CartProvider>

          <ErrorBoundary>

            <Router>

              <div
                className="min-h-screen"
                style={{
                  backgroundColor:
                    dark
                      ? "#0c0a09"
                      : "#fafaf9",

                  minHeight: "100vh",

                  display: "flex",
                  flexDirection: "column",

                  transition:
                    "background-color 0.2s ease",
                }}
              >

                {/* Navbar */}
                <Navbar />

                {/* Main */}
                <main style={{ flex: 1 }}>

                  <Routes>

                    {/* Auth */}
                    <Route
                      path="/login"
                      element={<Login />}
                    />

                    <Route
                      path="/register"
                      element={<Register />}
                    />

                    {/* Sweets */}
                    <Route
                      path="/sweets"
                      element={
                          <SweetsList />
                      }
                    />

                    <Route
                      path="/sweets/add"
                      element={
                        <ProtectedRoute>
                          <AddSweet />
                        </ProtectedRoute>
                      }
                    />

                    <Route
                      path="/sweets/update/:id"
                      element={
                        <ProtectedRoute>
                          <UpdateSweet />
                        </ProtectedRoute>
                      }
                    />

                    {/* Cart */}
                    <Route
                      path="/cart"
                      element={
                        <ProtectedRoute>
                          <Cart />
                        </ProtectedRoute>
                      }
                    />

                    <Route
                      path="/order-success"
                      element={
                        <ProtectedRoute>
                          <OrderSuccess />
                        </ProtectedRoute>
                      }
                    />

                    {/* Admin */}
                    <Route
                      path="/admin"
                      element={
                        <AdminRoute>
                          <AdminDashboard />
                        </AdminRoute>
                      }
                    />

                    {/* Default */}
                    <Route
                      path="/"
                      element={
                        <Navigate
                          to="/sweets"
                          replace
                        />
                      }
                    />

                    {/* Catch all */}
                    <Route
                      path="*"
                      element={
                        <Navigate
                          to="/sweets"
                          replace
                        />
                      }
                    />

                  </Routes>

                </main>

                {/* Footer */}
                <Footer />

              </div>

            </Router>

          </ErrorBoundary>

        </CartProvider>

      </ToastProvider>

    </AuthProvider>
  );
}

// ─────────────────────────────────────────────
// Root App
// ─────────────────────────────────────────────

function App() {

  return (
    <ThemeProvider>

      <AppContent />

    </ThemeProvider>
  );
}

export default App;