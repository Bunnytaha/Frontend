import { createSlice } from "@reduxjs/toolkit";
import Swal from "sweetalert2";

const loadCartFromLocalStorage = () => {
  const savedCart = localStorage.getItem('cartItems');
  return savedCart ? JSON.parse(savedCart) : [];
};

const initialState = {
  cartItems: loadCartFromLocalStorage(),
};

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    addToCart: (state, action) => {
      const existingItem = state.cartItems.find(
        (item) => item._id === action.payload._id
      );
      if (!existingItem) {
        state.cartItems.push({ ...action.payload, quantity: 1 });
        Swal.fire({
          position: "top-end",
          icon: "success",
          title: "Product Added to the Cart",
          showConfirmButton: false,
          timer: 1500,
        });
      } else {
        existingItem.quantity += 1;
        Swal.fire({
          position: "top-end",
          icon: "info",
          title: "Increased Quantity",
          text: "This product is already in the cart.",
          showConfirmButton: false,
          timer: 1200,
        });
      }

      // Save updated cart to localStorage
      localStorage.setItem('cartItems', JSON.stringify(state.cartItems));
    },

    removeFromCart: (state, action) => {
      state.cartItems = state.cartItems.filter(
        (item) => item._id !== action.payload._id
      );
      // Save updated cart to localStorage
      localStorage.setItem('cartItems', JSON.stringify(state.cartItems));
    },

    clearCart: (state) => {
      state.cartItems = [];
      // Save empty cart to localStorage
      localStorage.setItem('cartItems', JSON.stringify(state.cartItems));
    },

    incrementQty: (state, action) => {
      const item = state.cartItems.find((i) => i._id === action.payload);
      if (item) {
        item.quantity += 1;
        // Save updated cart to localStorage
        localStorage.setItem('cartItems', JSON.stringify(state.cartItems));
      }
    },

    decrementQty: (state, action) => {
      const item = state.cartItems.find((i) => i._id === action.payload);
      if (item && item.quantity > 1) {
        item.quantity -= 1;
        // Save updated cart to localStorage
        localStorage.setItem('cartItems', JSON.stringify(state.cartItems));
      } else {
        state.cartItems = state.cartItems.filter((i) => i._id !== action.payload);
        // Save updated cart to localStorage
        localStorage.setItem('cartItems', JSON.stringify(state.cartItems));
      }
    },
  },
});

export const {
  addToCart,
  removeFromCart,
  clearCart,
  incrementQty,
  decrementQty,
} = cartSlice.actions;
export default cartSlice.reducer;
