// src/context/CartContext.jsx

import { createContext, useContext, useState, useEffect } from "react";

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  // Load cart from localStorage on first render
  const [cartItems, setCartItems] = useState(() => {
    try {
      const saved = localStorage.getItem("cart");
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  // Keep localStorage in sync whenever cart changes
  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(cartItems));
  }, [cartItems]);

  // Add item — if already in cart, increase quantity (up to stock limit)
  const addToCart = (sweet) => {
    setCartItems((prev) => {
      const existing = prev.find((item) => item.id === sweet.id);
      if (existing) {
        // Don't exceed available stock
        if (existing.cartQty >= sweet.quantity) return prev;
        return prev.map((item) =>
          item.id === sweet.id
            ? { ...item, cartQty: item.cartQty + 1 }
            : item
        );
      }
      // New item — add with qty 1
      return [...prev, { ...sweet, cartQty: 1 }];
    });
  };

  // Increase qty by 1 (capped at stock)
  const increaseQty = (id) => {
    setCartItems((prev) =>
      prev.map((item) =>
        item.id === id && item.cartQty < item.quantity
          ? { ...item, cartQty: item.cartQty + 1 }
          : item
      )
    );
  };

  // Decrease qty by 1 — remove item if qty hits 0
  const decreaseQty = (id) => {
    setCartItems((prev) =>
      prev
        .map((item) =>
          item.id === id ? { ...item, cartQty: item.cartQty - 1 } : item
        )
        .filter((item) => item.cartQty > 0)
    );
  };

  // Remove item entirely
  const removeFromCart = (id) => {
    setCartItems((prev) => prev.filter((item) => item.id !== id));
  };

  // Empty the cart (called after successful purchase)
  const clearCart = () => {
    setCartItems([]);
    localStorage.removeItem("cart");
  };

  // Derived values
  const totalItems = cartItems.reduce((sum, item) => sum + item.cartQty, 0);
  const totalPrice = cartItems.reduce(
    (sum, item) => sum + item.cartQty * Number(item.price || 0),
    0
  );

  return (
    <CartContext.Provider
      value={{
        cartItems,
        addToCart,
        increaseQty,
        decreaseQty,
        removeFromCart,
        clearCart,
        totalItems,
        totalPrice,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

// Custom hook — use this in any component
export const useCart = () => useContext(CartContext);