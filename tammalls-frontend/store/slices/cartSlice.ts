import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import type { CartResponseDto } from "../../lib/types";

export type CartState = {
  cart: CartResponseDto | null;
  status: "idle" | "loading" | "error";
  error: string | null;
};

const initialState: CartState = {
  cart: null,
  status: "idle",
  error: null,
};

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    setCartLoading: (state) => {
      state.status = "loading";
      state.error = null;
    },
    setCart: (state, action: PayloadAction<CartResponseDto | null>) => {
      state.cart = action.payload;
      state.status = "idle";
      state.error = null;
    },
    setCartError: (state, action: PayloadAction<string>) => {
      state.status = "error";
      state.error = action.payload;
    },
    clearCartLocal: (state) => {
      state.cart = null;
      state.status = "idle";
      state.error = null;
    },
  },
});

export const { setCartLoading, setCart, setCartError, clearCartLocal } = cartSlice.actions;
export default cartSlice.reducer;

