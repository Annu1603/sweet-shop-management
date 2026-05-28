// src/services/sweetService.js

import API from "../api/axios";

// Get all sweets (optional search query)
export const getAllSweets = async (searchQuery = "") => {
  const endpoint = searchQuery
    ? `/sweets/search?q=${encodeURIComponent(searchQuery)}`
    : "/sweets";
  const response = await API.get(endpoint);
  return response.data;
};

// Get a single sweet by ID
export const getSweetById = async (id) => {
  const response = await API.get(`/sweets/${id}`);
  return response.data;
};

// Add a new sweet (admin only)
export const addSweet = async (sweetData) => {
  const response = await API.post("/sweets", sweetData);
  return response.data;
};

// Update a sweet (admin only)
export const updateSweet = async (id, sweetData) => {
  const response = await API.put(`/sweets/${id}`, sweetData);
  return response.data;
};

// Delete a sweet (admin only)
export const deleteSweet = async (id) => {
  const response = await API.delete(`/sweets/${id}`);
  return response.data;
};