"use client";

import Link from "next/link";
import { ChevronDown, Menu, X } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import type { CategoryDto } from "../../lib/types";
import { cn } from "../../lib/cn";

function useLockBody(locked: boolean) {
  useEffect(() => {
    if (!locked) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [locked]);
}

export function HeaderNavClient({ categories }: { categories: CategoryDto[] }) {
  const [catOpen, setCatOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  useLockBody(mobileOpen);

  const topCats = useMemo(() => categories.slice(0, 12), [categories]);

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") {
        setCatOpen(false);
        setMobileOpen(false);
      }
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  return (
    <>
      {/* Desktop navbar */}
      <div className="hidden border-t border-black/5 bg-white md:block">
        <div className="mx-auto flex w-full max-w-6xl items-center gap-3 px-4 py-2">
          <div className="relative">
            {/* <button
              type="button"
              onClick={() => setCatOpen((v) => !v)}
              className={cn(
                "inline-flex h-9 items-center gap-2 rounded-full bg-zinc-900 px-4 text-sm font-semibold text-white hover:bg-black",
                catOpen && "bg-black"
              )}
            >
              Categories <ChevronDown className={cn("h-4 w-4 transition", catOpen && "rotate-180")} />
            </button> */}

            {catOpen ? (
              <>
                <button
                  aria-label="Close categories"
                  className="fixed inset-0 z-40 cursor-default"
                  onClick={() => setCatOpen(false)}
                />
                <div className="absolute left-0 z-50 mt-2 w-[720px] overflow-hidden rounded-3xl border border-black/10 bg-white shadow-[0_20px_60px_rgba(0,0,0,0.18)]">
                  <div className="grid grid-cols-3 gap-2 p-4">
                    {topCats.map((c) => (
                      <Link
                        key={c.id}
                        href={`/categories/${c.id}`}
                        onClick={() => setCatOpen(false)}
                        className="rounded-2xl bg-zinc-50 px-4 py-3 text-sm font-semibold text-zinc-900 hover:bg-zinc-100"
                      >
                        <div className="truncate">{c.name}</div>
                        <div className="mt-1 truncate text-xs font-normal text-zinc-500">
                          {c.description || "Browse products"}
                        </div>
                      </Link>
                    ))}
                  </div>
                  <div className="flex items-center justify-between border-t border-black/5 px-5 py-3">
                    <div className="text-xs text-zinc-500">Explore by category</div>
                    <Link
                      href="/categories"
                      onClick={() => setCatOpen(false)}
                      className="text-sm font-semibold text-zinc-900 hover:text-black"
                    >
                      View all
                    </Link>
                  </div>
                </div>
              </>
            ) : null}
          </div>

          <div className="flex items-center gap-5 px-2 text-sm font-semibold text-zinc-700">
            {/* <Link href="/products" className="hover:text-black">
              Shop
            </Link> */}
            {/* <Link href="/products?sort=new" className="hover:text-black">
              New arrivals
            </Link> */}
            {/* <Link href="/account/orders" className="hover:text-black">
              Orders
            </Link> */}
          </div>

          <div className="flex-1" />

          {/* <div className="text-xs font-semibold text-zinc-500">Free delivery on select items</div> */}
        </div>
      </div>

      {/* Mobile hamburger */}
      <button
        type="button"
        onClick={() => setMobileOpen(true)}
        className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-zinc-100 text-zinc-900 hover:bg-zinc-200 md:hidden"
        aria-label="Open menu"
      >
        <Menu className="h-5 w-5" />
      </button>

      {/* Mobile sheet */}
      {mobileOpen ? (
        <>
          <button
            aria-label="Close menu overlay"
            className="fixed inset-0 z-50 bg-black/40"
            onClick={() => setMobileOpen(false)}
          />
          <div className="fixed inset-y-0 left-0 z-50 w-[86%] max-w-sm overflow-y-auto bg-white shadow-[0_20px_60px_rgba(0,0,0,0.25)]">
            <div className="flex items-center justify-between border-b border-black/5 px-4 py-4">
              <div className="text-sm font-semibold">Menu</div>
              <button
                type="button"
                onClick={() => setMobileOpen(false)}
                className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-zinc-100 hover:bg-zinc-200"
                aria-label="Close menu"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="p-4">
              <div className="text-xs font-semibold text-zinc-500">Navigation</div>
              <div className="mt-3 grid gap-2">
                <Link
                  href="/products"
                  onClick={() => setMobileOpen(false)}
                  className="rounded-2xl bg-zinc-50 px-4 py-3 text-sm font-semibold text-zinc-900"
                >
                  Shop
                </Link>
                <Link
                  href="/categories"
                  onClick={() => setMobileOpen(false)}
                  className="rounded-2xl bg-zinc-50 px-4 py-3 text-sm font-semibold text-zinc-900"
                >
                  Categories
                </Link>
                <Link
                  href="/account/orders"
                  onClick={() => setMobileOpen(false)}
                  className="rounded-2xl bg-zinc-50 px-4 py-3 text-sm font-semibold text-zinc-900"
                >
                  Orders
                </Link>
              </div>

              <div className="mt-8 text-xs font-semibold text-zinc-500">Top categories</div>
              <div className="mt-3 grid gap-2">
                {topCats.map((c) => (
                  <Link
                    key={c.id}
                    href={`/categories/${c.id}`}
                    onClick={() => setMobileOpen(false)}
                    className="rounded-2xl border border-black/10 px-4 py-3 text-sm font-semibold text-zinc-900 hover:bg-zinc-50"
                  >
                    {c.name}
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </>
      ) : null}
    </>
  );
}

