import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export type AuthState = {
  token: string | null;
  username: string | null;
  role: string | null;
};

const TOKEN_KEY = "tammalls.token";
const USERNAME_KEY = "tammalls.username";
const ROLE_KEY = "tammalls.role";

function safeGet(key: string) {
  if (typeof window === "undefined") return null;
  return window.localStorage.getItem(key);
}

const initialState: AuthState = {
  token: safeGet(TOKEN_KEY),
  username: safeGet(USERNAME_KEY),
  role: safeGet(ROLE_KEY),
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setAuth: (
      state,
      action: PayloadAction<{ token: string; username?: string | null; role?: string | null }>
    ) => {
      state.token = action.payload.token;
      state.username = action.payload.username ?? state.username ?? null;
      state.role = action.payload.role ?? state.role ?? null;

      if (typeof window !== "undefined") {
        window.localStorage.setItem(TOKEN_KEY, action.payload.token);
        if (action.payload.username !== undefined && action.payload.username !== null) {
          window.localStorage.setItem(USERNAME_KEY, action.payload.username);
        }
        if (action.payload.role !== undefined && action.payload.role !== null) {
          window.localStorage.setItem(ROLE_KEY, action.payload.role);
        }
      }
    },
    clearAuth: (state) => {
      state.token = null;
      state.username = null;
      state.role = null;
      if (typeof window !== "undefined") {
        window.localStorage.removeItem(TOKEN_KEY);
        window.localStorage.removeItem(USERNAME_KEY);
        window.localStorage.removeItem(ROLE_KEY);
      }
    },
  },
});

export const { setAuth, clearAuth } = authSlice.actions;
export default authSlice.reducer;

