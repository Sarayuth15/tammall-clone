import { Suspense } from "react";
import { OrdersClient } from "./OrdersClient";

export default function OrdersPage() {
  return (
    <Suspense
      fallback={
        <div className="bg-zinc-50">
          <div className="mx-auto w-full max-w-6xl px-4 py-10">
            <div className="rounded-3xl border border-black/10 bg-white p-6 text-sm text-zinc-600">Loading…</div>
          </div>
        </div>
      }
    >
      <OrdersClient />
    </Suspense>
  );
}

