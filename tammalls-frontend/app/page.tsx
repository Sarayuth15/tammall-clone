import Link from "next/link";
import { api } from "../lib/api";
import { ProductCard } from "../components/product/ProductCard";

export default async function Home() {
  // Server Component: fetch on the server for faster first paint/SEO
  const categoriesPromise = api.categories.list({ activeOnly: true }).catch(() => []);
  const productsPromise = api.products.list({ page: 0, size: 8, sortBy: "createdAt" }).catch(() => null);

  return (
    <div className="bg-zinc-100">
      <section className="bg-white">
        <div className="mx-auto w-full max-w-6xl px-4 py-10">
          <div className="grid gap-6 lg:grid-cols-12">
            <div className="lg:col-span-8">
              <div className="relative overflow-hidden rounded-[28px] border border-black/10 bg-gradient-to-br from-zinc-950 via-zinc-900 to-black px-8 py-10 text-white">
                <div className="absolute -right-24 -top-24 h-72 w-72 rounded-full bg-white/10 blur-2xl" />
                <div className="absolute -bottom-28 -left-28 h-72 w-72 rounded-full bg-white/10 blur-2xl" />

                <div className="relative">
                  <div className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1 text-xs font-semibold text-white/90">
                    Marketplace
                    <span className="h-1 w-1 rounded-full bg-white/40" />
                    New arrivals daily
                  </div>
                  <h1 className="mt-4 text-4xl font-semibold leading-tight tracking-tight md:text-5xl">
                    Everything you need,
                    <br className="hidden sm:block" /> in one place.
                  </h1>
                  <p className="mt-4 max-w-2xl text-sm leading-7 text-white/75 md:text-base">
                    Browse categories, search fast, add to cart, and checkout securely with your TamMalls API.
                  </p>
                  <div className="mt-7 flex flex-col gap-3 sm:flex-row">
                    <Link
                      href="/products"
                      className="inline-flex h-11 items-center justify-center rounded-full bg-white px-6 text-sm font-semibold text-zinc-950 hover:bg-zinc-100"
                    >
                      Shop now
                    </Link>
                    <Link
                      href="/categories"
                      className="inline-flex h-11 items-center justify-center rounded-full border border-white/20 bg-white/0 px-6 text-sm font-semibold text-white hover:bg-white/10"
                    >
                      Browse categories
                    </Link>
                  </div>
                </div>
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-2 lg:col-span-4 lg:grid-cols-1">
              <div className="rounded-[28px] border border-black/10 bg-white p-6">
                <div className="text-xs font-semibold text-zinc-500">Today’s deal</div>
                <div className="mt-2 text-lg font-semibold tracking-tight text-zinc-950">
                  Save more on top picks
                </div>
                <p className="mt-2 text-sm leading-6 text-zinc-600">Discover popular products and limited-time offers.</p>
                <Link
                  href="/products"
                  className="mt-5 inline-flex h-10 items-center justify-center rounded-full bg-zinc-900 px-5 text-sm font-semibold text-white hover:bg-black"
                >
                  Explore deals
                </Link>
              </div>
              <div className="rounded-[28px] border border-black/10 bg-white p-6">
                <div className="text-xs font-semibold text-zinc-500">Secure checkout</div>
                <div className="mt-2 text-lg font-semibold tracking-tight text-zinc-950">JWT protected</div>
                <p className="mt-2 text-sm leading-6 text-zinc-600">Sign in, manage cart, and place orders with confidence.</p>
                <Link
                  href="/login"
                  className="mt-5 inline-flex h-10 items-center justify-center rounded-full border border-black/10 bg-zinc-100 px-5 text-sm font-semibold text-zinc-900 hover:bg-zinc-200"
                >
                  Sign in
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto w-full max-w-6xl px-4 py-10">
        <div className="flex items-end justify-between gap-4">
          <div>
            <h2 className="text-lg font-semibold tracking-tight text-zinc-950">Shop by category</h2>
            <p className="mt-1 text-sm text-zinc-600">Explore what’s popular right now.</p>
          </div>
          <Link href="/categories" className="text-sm font-semibold text-zinc-900 hover:text-black">
            View all
          </Link>
        </div>

        <div className="mt-5 grid gap-3 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6">
          {(await categoriesPromise).slice(0, 6).map((c) => (
            <Link
              key={c.id}
              href={`/categories/${c.id}`}
              className="rounded-[22px] border border-black/10 bg-white px-4 py-4 text-sm font-semibold text-zinc-900 transition hover:-translate-y-0.5 hover:bg-zinc-50 hover:shadow-sm"
            >
              <div className="truncate">{c.name}</div>
              <div className="mt-1 truncate text-xs font-normal text-zinc-500">{c.description || "Browse products"}</div>
            </Link>
          ))}
        </div>
      </section>

      <section className="mx-auto w-full max-w-6xl px-4 pb-14">
        <div className="flex items-end justify-between gap-4">
          <div>
            <h2 className="text-lg font-semibold tracking-tight text-zinc-950">New arrivals</h2>
            <p className="mt-1 text-sm text-zinc-600">Freshly added products from sellers.</p>
          </div>
          <Link href="/products" className="text-sm font-semibold text-zinc-900 hover:text-black">
            Shop all
          </Link>
        </div>

        <div className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {(await productsPromise)?.content?.map((p) => <ProductCard key={p.id} product={p} />) || null}
        </div>
      </section>
    </div>
  );
}
