// src/App.jsx  ← REPLACE with this

import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import { CartProvider } from "./context/CartContext";       // ← NEW

import Navbar from "./components/Navbar";
import ProtectedRoute from "./components/ProtectedRoute";

import Login from "./pages/Login";
import Register from "./pages/Register";
import SweetsList from "./pages/SweetsList";
import AddSweet from "./pages/AddSweet";
import UpdateSweet from "./pages/UpdateSweet";
import Cart from "./pages/Cart";                           // ← NEW
import OrderSuccess from "./pages/OrderSuccess";           // ← NEW

function App() {
  return (
    <AuthProvider>
      <CartProvider>                                       {/* ← NEW wrapper */}
        <Router>
          <Navbar />
          <Routes>
            {/* Auth */}
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />

            {/* Sweets CRUD */}
            <Route path="/sweets" element={<ProtectedRoute><SweetsList /></ProtectedRoute>} />
            <Route path="/sweets/add" element={<ProtectedRoute><AddSweet /></ProtectedRoute>} />
            <Route path="/sweets/update/:id" element={<ProtectedRoute><UpdateSweet /></ProtectedRoute>} />

            {/* Cart + Purchase */}
            <Route path="/cart" element={<ProtectedRoute><Cart /></ProtectedRoute>} />
            <Route path="/order-success" element={<ProtectedRoute><OrderSuccess /></ProtectedRoute>} />

            {/* Defaults */}
            <Route path="/" element={<Navigate to="/sweets" replace />} />
            <Route path="*" element={<Navigate to="/sweets" replace />} />
          </Routes>
        </Router>
      </CartProvider>
    </AuthProvider>
  );
}

export default App;