import Link from "next/link";
import { Search } from "lucide-react";
import { api } from "../../lib/api";
import type { CategoryDto } from "../../lib/types";
import { HeaderActions } from "./HeaderActions";
import { HeaderNavClient } from "./HeaderNavClient";

function TopBar() {
  return (
    <div className="border-b border-black/5 bg-zinc-950 text-white">
      <div className="mx-auto flex w-full max-w-6xl items-center justify-between gap-4 px-4 py-2 text-xs">
        <div className="flex items-center gap-2 text-white/90">
          <span className="font-semibold">TamMalls</span>
          {/* <span className="hidden text-white/40 sm:inline">•</span> */}
          {/* <span className="hidden text-white/70 sm:inline">Fast delivery</span> */}
          {/* <span className="hidden text-white/40 sm:inline">•</span> */}
          {/* <span className="hidden text-white/70 sm:inline">Secure checkout</span> */}
        </div>
        <div className="hidden items-center gap-4 text-white/70 sm:flex">
          <span>Support: +855 000 000</span>
        </div>
      </div>
    </div>
  );
}

export async function SiteHeader() {
  const categories = await api.categories.list({ activeOnly: true }).catch(() => []);

  return (
    <header className="sticky top-0 z-50 shadow-[0_1px_0_rgba(0,0,0,0.06)]">
      <TopBar />
      <div className="bg-white">
        <div className="mx-auto flex w-full max-w-6xl items-center gap-3 px-4 py-3">
          <Link href="/" className="flex items-center gap-2">
            <span className="inline-flex h-10 w-10 items-center justify-center rounded-2xl bg-black text-sm font-semibold text-white">
              TM
            </span>
            <div className="leading-tight">
              <div className="text-sm font-semibold tracking-tight text-zinc-950">TamMalls</div>
              <div className="text-[11px] text-zinc-500">Marketplace</div>
            </div>
          </Link>

          <form
            action="/products"
            className="hidden w-full max-w-2xl items-center gap-2 rounded-full border border-black/10 bg-zinc-50 px-4 py-2 focus-within:border-black/20 md:flex"
          >
            <Search className="h-4 w-4 text-zinc-500" />
            <input
              type="search"
              name="q"
              placeholder="Search products, brands, and more…"
              autoComplete="off"
              autoCorrect="off"
              autoCapitalize="none"
              spellCheck={false}
              className="w-full bg-transparent text-sm text-zinc-900 outline-none placeholder:text-zinc-500"
            />
            <button
              type="submit"
              className="inline-flex h-9 items-center justify-center rounded-full bg-black px-4 text-sm font-semibold text-white hover:bg-zinc-900"
            >
              Search
            </button>
          </form>

          <div className="flex-1" />

          {/* Mobile menu button (renders on mobile) + Desktop nav (renders inside client) */}
          <HeaderNavClient categories={categories as CategoryDto[]} />

          <div className="hidden md:block">
            <HeaderActions />
          </div>
        </div>

        {/* Mobile: show search full width */}
        <div className="mx-auto w-full max-w-6xl px-4 pb-3 md:hidden">
          <form
            action="/products"
            className="flex w-full items-center gap-2 rounded-full border border-black/10 bg-zinc-50 px-4 py-2 focus-within:border-black/20"
          >
            <Search className="h-4 w-4 text-zinc-500" />
            <input
              type="search"
              name="q"
              placeholder="Search products…"
              autoComplete="off"
              autoCorrect="off"
              autoCapitalize="none"
              spellCheck={false}
              className="w-full bg-transparent text-sm text-zinc-900 outline-none placeholder:text-zinc-500"
            />
            <button
              type="submit"
              className="inline-flex h-9 items-center justify-center rounded-full bg-black px-4 text-sm font-semibold text-white"
            >
              Go
            </button>
          </form>
          <div className="mt-3">
            <HeaderActions />
          </div>
        </div>
      </div>
    </header>
  );
}
