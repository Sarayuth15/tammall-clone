"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { api } from "../../../lib/api";
import type { OrderResponseDto } from "../../../lib/types";
import { useAppSelector } from "../../../store/hooks";

export function OrdersClient() {
  const token = useAppSelector((s) => s.auth.token);
  const sp = useSearchParams();
  const created = sp.get("created");

  const [orders, setOrders] = useState<OrderResponseDto[]>([]);
  const [status, setStatus] = useState<"idle" | "loading" | "error">("idle");
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let ignore = false;
    async function load() {
      if (!token) return;
      setStatus("loading");
      setError(null);
      try {
        const page = await api.orders.mine(token, { page: 0, size: 20 });
        if (!ignore) setOrders(page.content);
      } catch (e) {
        if (!ignore) {
          setError(e instanceof Error ? e.message : "Failed to load orders");
          setStatus("error");
        }
      } finally {
        if (!ignore) setStatus("idle");
      }
    }
    load();
    return () => {
      ignore = true;
    };
  }, [token]);

  if (!token) {
    return (
      <div className="bg-zinc-50">
        <div className="mx-auto w-full max-w-6xl px-4 py-10">
          <h1 className="text-2xl font-semibold tracking-tight text-zinc-950">Orders</h1>
          <p className="mt-2 text-sm text-zinc-600">Sign in to view your orders.</p>
          <div className="mt-6">
            <Link
              href="/login"
              className="inline-flex h-11 items-center justify-center rounded-full bg-black px-6 text-sm font-semibold text-white hover:bg-zinc-900"
            >
              Sign in
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
            <h1 className="text-2xl font-semibold tracking-tight text-zinc-950">Your orders</h1>
            <p className="mt-1 text-sm text-zinc-600">Track status and order history.</p>
          </div>
          <Link href="/account" className="text-sm font-semibold text-zinc-900 hover:text-black">
            Back to account
          </Link>
        </div>

        {created ? (
          <div className="mt-4 rounded-2xl bg-emerald-50 p-3 text-sm text-emerald-800">
            Order created: <span className="font-semibold">{created}</span>
          </div>
        ) : null}
        {error ? <div className="mt-4 rounded-2xl bg-red-50 p-3 text-sm text-red-700">{error}</div> : null}

        <div className="mt-6 rounded-3xl border border-black/10 bg-white">
          <div className="divide-y divide-black/5">
            {status === "loading" ? (
              <div className="p-6 text-sm text-zinc-600">Loading…</div>
            ) : orders.length === 0 ? (
              <div className="p-6 text-sm text-zinc-600">
                No orders yet.{" "}
                <Link href="/products" className="font-semibold text-zinc-900 hover:text-black">
                  Start shopping
                </Link>
                .
              </div>
            ) : (
              orders.map((o) => (
                <div key={o.id} className="flex flex-col gap-1 p-6 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <div className="text-sm font-semibold text-zinc-900">{o.orderNumber}</div>
                    <div className="mt-1 text-xs text-zinc-500">
                      Status: <span className="font-semibold text-zinc-700">{o.status}</span>
                    </div>
                  </div>
                  <div className="text-sm font-semibold text-zinc-900">${o.totalAmount.toFixed(2)}</div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

