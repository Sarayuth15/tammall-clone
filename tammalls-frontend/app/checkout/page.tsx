"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { api, ApiError } from "../../lib/api";
import { useAppDispatch, useAppSelector } from "../../store/hooks";
import { setCart } from "../../store/slices/cartSlice";

export default function CheckoutPage() {
  const router = useRouter();
  const token = useAppSelector((s) => s.auth.token);
  const cart = useAppSelector((s) => s.cart.cart);
  const dispatch = useAppDispatch();

  const [shippingAddress, setShippingAddress] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [notes, setNotes] = useState("");
  const [status, setStatus] = useState<"idle" | "loading">("idle");
  const [error, setError] = useState<string | null>(null);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    if (!token) {
      setError("Please sign in to checkout.");
      return;
    }
    setStatus("loading");
    try {
      const order = await api.orders.create(token, { shippingAddress, phoneNumber, notes });
      dispatch(setCart({ items: [] }));
      router.push(`/account/orders?created=${encodeURIComponent(order.orderNumber)}`);
    } catch (err) {
      setError(err instanceof ApiError ? err.message : err instanceof Error ? err.message : "Checkout failed");
    } finally {
      setStatus("idle");
    }
  }

  return (
    <div className="bg-zinc-50">
      <div className="mx-auto w-full max-w-6xl px-4 py-10">
        <div className="grid gap-8 lg:grid-cols-3">
          <div className="lg:col-span-2">
            <div className="rounded-3xl border border-black/10 bg-white p-6">
              <h1 className="text-2xl font-semibold tracking-tight text-zinc-950">Checkout</h1>
              <p className="mt-2 text-sm text-zinc-600">Enter shipping details to place your order.</p>

              {error ? <div className="mt-4 rounded-2xl bg-red-50 p-3 text-sm text-red-700">{error}</div> : null}

              <form onSubmit={onSubmit} className="mt-6 space-y-4">
                <label className="block">
                  <div className="text-sm font-semibold text-zinc-900">Shipping address</div>
                  <textarea
                    value={shippingAddress}
                    onChange={(e) => setShippingAddress(e.target.value)}
                    spellCheck={false}
                    autoCorrect="off"
                    autoCapitalize="sentences"
                    className="mt-2 min-h-28 w-full resize-y rounded-2xl border border-black/10 px-4 py-3 text-sm text-zinc-900 outline-none placeholder:text-zinc-400 focus:border-black/30"
                    placeholder="Street, City, State, ZIP"
                    required
                  />
                </label>

                <label className="block">
                  <div className="text-sm font-semibold text-zinc-900">Phone number</div>
                  <input
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value)}
                    spellCheck={false}
                    autoCorrect="off"
                    autoCapitalize="none"
                    inputMode="tel"
                    className="mt-2 h-11 w-full rounded-2xl border border-black/10 px-4 text-sm text-zinc-900 outline-none placeholder:text-zinc-400 focus:border-black/30"
                    placeholder="+1 555 123 4567"
                    required
                  />
                </label>

                <label className="block">
                  <div className="text-sm font-semibold text-zinc-900">Notes (optional)</div>
                  <textarea
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    spellCheck={false}
                    autoCorrect="off"
                    autoCapitalize="sentences"
                    className="mt-2 min-h-20 w-full resize-y rounded-2xl border border-black/10 px-4 py-3 text-sm text-zinc-900 outline-none placeholder:text-zinc-400 focus:border-black/30"
                    placeholder="Delivery instructions, etc."
                  />
                </label>

                <button
                  type="submit"
                  disabled={status === "loading" || (cart?.items?.length ?? 0) === 0}
                  className="inline-flex h-11 w-full items-center justify-center rounded-full bg-black px-6 text-sm font-semibold text-white hover:bg-zinc-900 disabled:opacity-60"
                >
                  {status === "loading" ? "Placing order…" : "Place order"}
                </button>
              </form>
            </div>
          </div>

          <div>
            <div className="rounded-3xl border border-black/10 bg-white p-6">
              <div className="text-sm font-semibold text-zinc-900">Your items</div>
              <div className="mt-4 space-y-3">
                {(cart?.items ?? []).length === 0 ? (
                  <div className="text-sm text-zinc-600">Your cart is empty.</div>
                ) : (
                  (cart?.items ?? []).map((it) => (
                    <div key={it.id} className="flex items-center justify-between gap-3 text-sm">
                      <div className="min-w-0">
                        <div className="truncate font-semibold text-zinc-900">{it.productName || "Item"}</div>
                        <div className="text-xs text-zinc-500">Qty {it.quantity}</div>
                      </div>
                      <div className="shrink-0 font-semibold text-zinc-900">
                        {it.price != null ? `$${(it.price * it.quantity).toFixed(2)}` : ""}
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

