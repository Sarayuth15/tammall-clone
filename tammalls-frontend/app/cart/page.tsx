"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { api, ApiError } from "../../lib/api";
import { useAppDispatch, useAppSelector } from "../../store/hooks";
import { setCart, setCartError, setCartLoading } from "../../store/slices/cartSlice";

function money(n: number) {
  try {
    return new Intl.NumberFormat(undefined, { style: "currency", currency: "USD" }).format(n);
  } catch {
    return `$${n.toFixed(2)}`;
  }
}

export default function CartPage() {
  const token = useAppSelector((s) => s.auth.token);
  const cart = useAppSelector((s) => s.cart.cart);
  const status = useAppSelector((s) => s.cart.status);
  const error = useAppSelector((s) => s.cart.error);
  const dispatch = useAppDispatch();
  const [message, setMessage] = useState<string | null>(null);

  const totals = useMemo(() => {
    const items = cart?.items ?? [];
    const totalItems = items.reduce((acc, it) => acc + (it.quantity || 0), 0);
    const totalPrice = items.reduce((acc, it) => acc + (it.quantity || 0) * (it.price || 0), 0);
    return { totalItems, totalPrice };
  }, [cart]);

  useEffect(() => {
    let ignore = false;
    async function load() {
      setMessage(null);
      if (!token) return;
      dispatch(setCartLoading());
      try {
        const c = await api.cart.get(token);
        if (!ignore) dispatch(setCart(c));
      } catch (e) {
        if (!ignore) dispatch(setCartError(e instanceof Error ? e.message : "Failed to load cart"));
      }
    }
    load();
    return () => {
      ignore = true;
    };
  }, [dispatch, token]);

  async function changeQty(cartItemId: number, qty: number) {
    if (!token) return;
    setMessage(null);
    dispatch(setCartLoading());
    try {
      await api.cart.updateItemQuantity(token, cartItemId, qty);
      const c = await api.cart.get(token);
      dispatch(setCart(c));
    } catch (e) {
      dispatch(setCartError(e instanceof Error ? e.message : "Failed to update cart"));
    }
  }

  async function removeItem(cartItemId: number) {
    if (!token) return;
    setMessage(null);
    dispatch(setCartLoading());
    try {
      await api.cart.removeItem(token, cartItemId);
      const c = await api.cart.get(token);
      dispatch(setCart(c));
    } catch (e) {
      dispatch(setCartError(e instanceof Error ? e.message : "Failed to remove item"));
    }
  }

  async function clear() {
    if (!token) return;
    setMessage(null);
    dispatch(setCartLoading());
    try {
      await api.cart.clear(token);
      dispatch(setCart({ items: [] }));
      setMessage("Cart cleared.");
    } catch (e) {
      const msg = e instanceof ApiError ? e.message : e instanceof Error ? e.message : "Failed to clear cart";
      dispatch(setCartError(msg));
    }
  }

  if (!token) {
    return (
      <div className="bg-zinc-50">
        <div className="mx-auto w-full max-w-6xl px-4 py-10">
          <h1 className="text-2xl font-semibold tracking-tight text-zinc-950">Your cart</h1>
          <p className="mt-2 text-sm text-zinc-600">Sign in to view your cart.</p>
          <div className="mt-6 flex gap-3">
            <Link
              href="/login"
              className="inline-flex h-11 items-center justify-center rounded-full bg-black px-6 text-sm font-semibold text-white hover:bg-zinc-900"
            >
              Sign in
            </Link>
            <Link
              href="/products"
              className="inline-flex h-11 items-center justify-center rounded-full border border-black/10 bg-white px-6 text-sm font-semibold text-zinc-900 hover:bg-zinc-50"
            >
              Continue shopping
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-zinc-50">
      <div className="mx-auto w-full max-w-6xl px-4 py-10">
        <div className="flex items-end justify-between gap-4">
          <div>
            <h1 className="text-2xl font-semibold tracking-tight text-zinc-950">Your cart</h1>
            <p className="mt-1 text-sm text-zinc-600">Review items before checkout.</p>
          </div>
          <button
            type="button"
            onClick={clear}
            className="text-sm font-semibold text-zinc-700 hover:text-black"
          >
            Clear cart
          </button>
        </div>

        {message ? <div className="mt-4 text-sm text-zinc-600">{message}</div> : null}
        {error ? <div className="mt-4 text-sm text-red-600">{error}</div> : null}

        <div className="mt-6 grid gap-6 lg:grid-cols-3">
          <div className="lg:col-span-2">
            <div className="rounded-3xl border border-black/10 bg-white">
              <div className="divide-y divide-black/5">
                {(cart?.items ?? []).length === 0 ? (
                  <div className="p-6 text-sm text-zinc-600">
                    Your cart is empty.{" "}
                    <Link href="/products" className="font-semibold text-zinc-900 hover:text-black">
                      Continue shopping
                    </Link>
                    .
                  </div>
                ) : (
                  (cart?.items ?? []).map((it) => (
                    <div key={it.id} className="flex flex-col gap-4 p-6 sm:flex-row sm:items-center">
                      <div className="h-20 w-20 shrink-0 rounded-2xl bg-zinc-100" />
                      <div className="min-w-0 flex-1">
                        <div className="truncate text-sm font-semibold text-zinc-900">{it.productName || "Item"}</div>
                        <div className="mt-1 text-xs text-zinc-500">{it.price != null ? money(it.price) : ""}</div>
                      </div>
                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => changeQty(it.id, Math.max(1, (it.quantity || 1) - 1))}
                          className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-black/10 hover:bg-zinc-50"
                          disabled={status === "loading"}
                        >
                          −
                        </button>
                        <div className="min-w-10 text-center text-sm font-semibold">{it.quantity}</div>
                        <button
                          type="button"
                          onClick={() => changeQty(it.id, (it.quantity || 1) + 1)}
                          className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-black/10 hover:bg-zinc-50"
                          disabled={status === "loading"}
                        >
                          +
                        </button>
                        <button
                          type="button"
                          onClick={() => removeItem(it.id)}
                          className="ml-2 text-sm font-semibold text-zinc-700 hover:text-black"
                          disabled={status === "loading"}
                        >
                          Remove
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>

          <div>
            <div className="rounded-3xl border border-black/10 bg-white p-6">
              <div className="text-sm font-semibold text-zinc-900">Order summary</div>
              <div className="mt-4 space-y-3 text-sm">
                <div className="flex items-center justify-between text-zinc-600">
                  <span>Items</span>
                  <span className="font-semibold text-zinc-900">{totals.totalItems}</span>
                </div>
                <div className="flex items-center justify-between text-zinc-600">
                  <span>Subtotal</span>
                  <span className="font-semibold text-zinc-900">{money(totals.totalPrice)}</span>
                </div>
              </div>
              <Link
                href="/checkout"
                className="mt-6 inline-flex h-11 w-full items-center justify-center rounded-full bg-black px-6 text-sm font-semibold text-white hover:bg-zinc-900"
              >
                Checkout
              </Link>
              <Link
                href="/products"
                className="mt-3 inline-flex h-11 w-full items-center justify-center rounded-full border border-black/10 bg-white px-6 text-sm font-semibold text-zinc-900 hover:bg-zinc-50"
              >
                Continue shopping
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

