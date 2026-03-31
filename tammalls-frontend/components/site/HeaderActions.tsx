"use client";

import Link from "next/link";
import { ShoppingBag, User } from "lucide-react";
import { useMemo } from "react";
import { useAppSelector } from "../../store/hooks";

export function HeaderActions() {
  const { token, username } = useAppSelector((s) => s.auth);
  const cartItems = useAppSelector((s) => s.cart.cart?.items ?? []);
  const cartCount = useMemo(
    () => cartItems.reduce((acc, it) => acc + (it.quantity || 0), 0),
    [cartItems]
  );

  return (
    <div className="flex items-center gap-2">
      <Link
        href="/cart"
        className="relative inline-flex h-10 items-center justify-center rounded-full bg-zinc-100 px-4 text-sm font-semibold text-zinc-900 hover:bg-zinc-200"
      >
        <ShoppingBag className="mr-2 h-4 w-4" />
        Cart
        {cartCount > 0 ? (
          <span className="ml-2 inline-flex h-5 min-w-5 items-center justify-center rounded-full bg-black px-1 text-xs text-white">
            {cartCount}
          </span>
        ) : null}
      </Link>

      <Link
        href={token ? "/account" : "/login"}
        className="inline-flex h-10 items-center justify-center rounded-full bg-zinc-100 px-4 text-sm font-semibold text-zinc-900 hover:bg-zinc-200"
      >
        <User className="mr-2 h-4 w-4" />
        {username || "Account"}
      </Link>
    </div>
  );
}

