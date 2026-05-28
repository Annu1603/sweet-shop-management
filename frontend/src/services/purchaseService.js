// src/services/purchaseService.js

import API from "../api/axios";

/**
 * Purchase all items in the cart.
 * Sends an array of { sweetId, quantity } objects to the backend.
 * Adjust the endpoint and payload shape to match your backend exactly.
 */
export const purchaseSweets = async (items) => {
  // items = [{ sweetId: 1, quantity: 2 }, { sweetId: 3, quantity: 1 }]
  const response = await API.post("/purchases", { items });
  return response.data;
};

/**
 * Get purchase history for the current user.
 */
export const getPurchaseHistory = async () => {
  const response = await API.get("/purchases/history");
  return response.data;
};

/**
 * Purchase a single sweet (if your backend supports it).
 */
export const purchaseSingleSweet = async (sweetId, quantity) => {
  const response = await API.post("/purchases/buy", { sweetId, quantity });
  return response.data;
};