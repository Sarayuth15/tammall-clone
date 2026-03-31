"use client";

import { useState } from "react";
import { api, ApiError } from "../../lib/api";
import { useAppDispatch, useAppSelector } from "../../store/hooks";
import { setCart, setCartError, setCartLoading } from "../../store/slices/cartSlice";

export function AddToCartButton({ productId }: { productId: number }) {
  const token = useAppSelector((s) => s.auth.token);
  const dispatch = useAppDispatch();
  const [qty, setQty] = useState(1);
  const [status, setStatus] = useState<"idle" | "saving">("idle");
  const [message, setMessage] = useState<string | null>(null);

  async function refreshCart(t: string) {
    dispatch(setCartLoading());
    try {
      const cart = await api.cart.get(t);
      dispatch(setCart(cart));
    } catch (e) {
      dispatch(setCartError(e instanceof Error ? e.message : "Failed to refresh cart"));
    }
  }

  async function onAdd() {
    setMessage(null);
    if (!token) {
      setMessage("Please sign in to add items to your cart.");
      return;
    }
    setStatus("saving");
    try {
      await api.cart.add(token, { productId, quantity: qty });
      await refreshCart(token);
      setMessage("Added to cart.");
    } catch (e) {
      const msg = e instanceof ApiError ? e.message : e instanceof Error ? e.message : "Failed to add to cart";
      setMessage(msg);
    } finally {
      setStatus("idle");
    }
  }

  return (
    <div className="mt-5 flex flex-col gap-3 sm:flex-row sm:items-center">
      <div className="inline-flex items-center rounded-full border border-black/10 bg-white p-1">
        <button
          type="button"
          onClick={() => setQty((q) => Math.max(1, q - 1))}
          className="inline-flex h-9 w-9 items-center justify-center rounded-full text-sm font-semibold hover:bg-zinc-50"
        >
          −
        </button>
        <div className="min-w-10 text-center text-sm font-semibold">{qty}</div>
        <button
          type="button"
          onClick={() => setQty((q) => q + 1)}
          className="inline-flex h-9 w-9 items-center justify-center rounded-full text-sm font-semibold hover:bg-zinc-50"
        >
          +
        </button>
      </div>

      <button
        type="button"
        onClick={onAdd}
        disabled={status === "saving"}
        className="inline-flex h-11 items-center justify-center rounded-full bg-black px-6 text-sm font-semibold text-white hover:bg-zinc-900 disabled:opacity-60"
      >
        {status === "saving" ? "Adding…" : "Add to cart"}
      </button>

      {message ? <div className="text-sm text-zinc-600">{message}</div> : null}
    </div>
  );
}

